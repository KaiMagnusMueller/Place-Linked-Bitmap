var PlaceLinkedBitmap = {
  "addFillToShapeLayer": function(context,layer,url) {
    var doc = context.document;

    var filePath = url.toString();
    filePath = filePath.replace("file:///","/");
    filePath = this.util.decodeString(filePath);

    var imageData = [[NSImage alloc] initWithContentsOfFile:filePath];
    if (MSApplicationMetadata.metadata().appVersion < 47) {
  		var newImage = [[MSImageData alloc] initWithImage:imageData convertColorSpace:false]];
  	} else {
      var newImage = [[MSImageData alloc] initWithImage:imageData]];
  	}

    var fill = layer.style().fills().firstObject();
    [fill setImage:newImage];
    [fill setFillType:4];
    [fill setPatternFillType:1];
    return layer;
  },
  "findAllTaggedLayers": function(context,layers) {
    var command = context.command;
    var foundLayers = [];

    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      if ([command valueForKey:"originalURL" onLayer:layer]) {
        foundLayers.push(layer);
      }
    }
    return foundLayers;
  },
  //Reconstruct selected folder
  "findSelectedFolder": function(context,layers,tmpDocDir) {
    var command = context.command;
    var docDir = tmpDocDir.toString();
    var foundLayers = [];

    //Search for Layers with path information
    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      if ([command valueForKey:"originalURL" onLayer:layer]) {
        foundLayers.push(layer);
        log("Previously placed image found. Updating common folder...")
        break
      }
    }
    log("foundlayers: " + foundLayers)

    //Ask to set project folder if no pictures have been found
    if(foundLayers.length = 0) {
      var returnSavedFolder = PlaceLinkedBitmap.folderPanel(docDir,"Set search folder","Select Folder","AAAAAAA");
      log(returnSavedFolder)
      returnSavedFolder = returnSavedFolder.toString()
      log("No placed image found. Folder set by user")
      return returnSavedFolder
    }

    //If pictures have been found reconstruct url from embedded key
    var savedSelectedFolder = [command valueForKey:"selectedURL" onLayer:foundLayers[0]];
    //---------------------
    var docDirParts = docDir.split("/")
    // log(" ")
    // log("-----------findSelectedFolder")
    // log("docDir      :" + docDir)
    // log("-----------------------------------")

    //If pictures have been found, construct path from embedded path and current Sketch document path
    for (var i = 0; i < docDirParts.length; i++) {
      // log(newSelectedDirParts[i])
      // log(newFileDirParts[i])
      if (docDirParts[i] == savedSelectedFolder){
        var newSavedFolder = []
        for (var j = 0; j <= i; j++){
          newSavedFolder.push(docDirParts[j])
        }
        var returnSavedFolder = newSavedFolder.join("/")+ "/"
        log("Saved Folder updated:" + returnSavedFolder)

        return returnSavedFolder
      }
    }
  },
  "findBitmapTaggedLayers": function(context,layers) {
    var command = context.command;
    var foundLayers = [];

    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      if ([command valueForKey:"originalURL" onLayer:layer] && ([layer className] == "MSBitmapLayer")) {
        foundLayers.push(layer);
      }
    }
    return foundLayers;
  },
  "findFillTaggedLayers": function(context,layers) {
    var command = context.command;
    var foundLayers = [];

    for (var i = 0; i < [layers count]; i++) {
      var layer = layers[i];
      if ([command valueForKey:"originalURL" onLayer:layer] && ([layer className] == "MSShapeGroup")) {
        foundLayers.push(layer);
      }
    }
    return foundLayers;
  },
  "getFilenameFromLocalURL": function(tmpFilePath) {
    filePath = tmpFilePath.toString();
    filePath = filePath.replace("file:///","");
    var filename = filePath.split('/').pop();

    return filename;
  },
  "getDirFromLocalURL": function(tmpFilePath,addProtocol) {
    filePath = tmpFilePath.toString();
    filePath = filePath.replace("file:///","");
    var filePathParts = filePath.split('/');
    // log("filePathParts:" + filePathParts)
    filePathParts.pop();

    var newFilePath = '/' + filePathParts.join('/') + '/';

    if (addProtocol) {
      newFilePath = 'file://' + newFilePath;
    }

    return newFilePath;
  },
  //Gets the actual selected folder from the submitted string
  "getOnlySelectedFolder": function(tmpSelectedFolder) {
    //Slice last empty index (from last "/") and pop the selected folder
    log(tmpSelectedFolder)
    var onlySelectedFolder = tmpSelectedFolder.split("/").slice(0,-1).pop()
    return onlySelectedFolder;
  },
  //Unused
  "getRelativeDir": function(fileURL,tmpDocDir) {
    var fileName = this.getFilenameFromLocalURL(fileURL,false).toString();
    var fileDir = this.getDirFromLocalURL(fileURL,true).toString();
    var docDir = tmpDocDir.toString();

    var newPath = fileDir;

    // log("---------RelativeDir");
    // log("fileName    " + fileName);
    // log("selectedDir " + selectedFolderURL);
    // log("fileDir     " + fileDir);
    // log("docDir      " + docDir);
    // log("'newPath = fileDir'");
    // log("newPath.indexOf(docDir) " + newPath.indexOf(docDir));
    // log("---------End");

    if (newPath.indexOf(docDir) != -1) {
      newPath = newPath.replace(docDir,'./');
    }

    var newURL = newPath + fileName;
    return newURL;
  },

  //Get the relative dir of the picture up to the chosen project folder
  "getCommonDir": function(fileURL,tmpDocDir, tmpProjectFolder) {

    var fileName = this.getFilenameFromLocalURL(fileURL,false).toString();
    var fileDir = this.getDirFromLocalURL(fileURL,true).toString();
    var docDir = tmpDocDir.toString();
    var projectFolder = tmpProjectFolder.toString()

    // var newPath = fileDir;

    var newSelectedDirParts = selectedFolderURL.split("/")
    var newFileDirParts = fileDir.split("/")

    var nearestCommonDirTowardsFile = []

    // log(" ");
    // log(" ");
    // log("---------RelativeDir");
    // log("fileName    " + fileName);
    // log("selectedDir " + selectedFolderURL);
    // log("fileDir     " + fileDir);
    // log("docDir      " + docDir);
    // log("newSelectedDirParts " + newSelectedDirParts[newSelectedDirParts.length-2]);
    // log("newFileDirParts     " + newFileDirParts);
    // log("---------End");

    var lastFolderOfSelectedPath = newSelectedDirParts[newSelectedDirParts.length - 2]
    var commonFolders = false//common folders have to be at least one or higher
    for (var i = 0; i < newFileDirParts.length; i++) {
      if (newFileDirParts[i] == lastFolderOfSelectedPath){
        commonFolders = true
      }
    }

    if (commonFolders) {
      log("commonFolders: "+ commonFolders)
    } else {
      log("commonFolders: "+ commonFolders)
      PlaceLinkedBitmap.util.displayAlert("Place Linked Bitmap…","Image is outside of your project. Place it im a folder below or change your project directory");
      return
    }

    if(newSelectedDirParts.length <= newFileDirParts.length) {
      //count from right to left? (less iterations)
      //Cont the file dir, project folder is guaranteed to be smaller, therefore its always != when only the image path is left
      for (var i = 0; i < newFileDirParts.length; i++) {
        log(newSelectedDirParts[i])
        log(newFileDirParts[i])
        if (newSelectedDirParts[i] != newFileDirParts[i]){
          nearestCommonDirTowardsFile.push(newFileDirParts[i])
        }
      }
      var newNearestTowardsFile = "/" +nearestCommonDirTowardsFile.join("/") +fileName
      log("newNearestTowardsFile:" + newNearestTowardsFile)

      return newNearestTowardsFile

    } else {
      PlaceLinkedBitmap.util.displayAlert("String Alert!",
      "Selected path is behind bitmap path. Choose a common path to proceed.");
      return null
    }
  },
  //Unused
  "expandRelativePath": function(tmpFileURL,tmpDocDir) {
    var docDir = tmpDocDir.toString();
    var fileURL = tmpFileURL.toString();

    if (fileURL.indexOf('./') != -1) {
       fileURL = fileURL.replace('./',selectedFolderURL);
    }

    return fileURL;
  },
  //Combines the embedded relative path of the image with the current local
  //path where Sketch is running
  //tmpFilePath: taggedFileURL (short path)
  //tmpSketchPath: full path to sketch file
  //tmpProjectFolder: project folder
  "expandCommonRelativePath": function(tmpFilePath,tmpSketchPath,tmpProjectFolder) {
    var filePath = tmpFilePath.toString();
    var sketchPath = tmpSketchPath.toString();
    var projectFolder = tmpProjectFolder.toString();

    var sketchPathParts = sketchPath.split("/")
    log(" ")
    log("-----------expandCommonRelativePath")
    log("filePath   :" + filePath)
    log("sketchPath :" + sketchPath)
    log("projectFolder:" + projectFolder)

    log("-----------------------------------")

    for (var i = 0; i < sketchPathParts.length; i++) {
      // log(newSelectedDirParts[i])
      // log(newFileDirParts[i])
      if (sketchPathParts[i] == projectFolder){
        var newFileURL = []
        for (var j = 0; j <= i; j++){
          newFileURL.push(sketchPathParts[j])
        }
        var returnNewFileURL = newFileURL.join("/") +filePath
        // log("returnNewFileURL:" + returnNewFileURL)

        return returnNewFileURL
      }
    }
  },
  "makeBitmapLayer": function(container,name,url) {
    var layer = [MSBitmapLayer bitmapLayerWithImageFromPath:url];

    if (layer == nil) {
    } else {
      [container addLayers:[layer]];
      layer.name = name;
    }

    return layer;
  },
  "makeLayerName": function(filePath,docPath) {
    var filename = this.getFilenameFromLocalURL(filePath);
    return PLB_layer_prefix + this.util.decodeString(filename);
  },
  "openPanel": function(filePath,message,prompt,title) {
    var openPanel = [NSOpenPanel openPanel];
    [openPanel setMessage:message];
    [openPanel setPrompt:prompt];
    [openPanel setTitle:title];
    [openPanel setCanCreateDirectories:false];
    [openPanel setCanChooseFiles:true];
    [openPanel setCanChooseDirectories:false];
    [openPanel setAllowsMultipleSelection:false];
    [openPanel setShowsHiddenFiles:false];
    [openPanel setExtensionHidden:false];
    [openPanel setDirectoryURL:[NSURL fileURLWithPath:filePath]]];
    [[NSApplication sharedApplication] activateIgnoringOtherApps:true];
    var openPanelButtonPressed = [openPanel runModal];
    if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
      selectedFile = [openPanel URL];
      return selectedFile;
    } else {
      return false;
    }
  },
  "openPanelMultiple": function(filePath,message,prompt,title) {
    var openPanel = [NSOpenPanel openPanel];
    [openPanel setMessage:message];
    [openPanel setPrompt:prompt];
    [openPanel setTitle:title];
    [openPanel setCanCreateDirectories:false];
    [openPanel setCanChooseFiles:true];
    [openPanel setCanChooseDirectories:false];
    [openPanel setAllowsMultipleSelection:true];
    [openPanel setShowsHiddenFiles:false];
    [openPanel setExtensionHidden:false];
    [openPanel setDirectoryURL:[NSURL fileURLWithPath:filePath]]];
    [[NSApplication sharedApplication] activateIgnoringOtherApps:true];
    var openPanelButtonPressed = [openPanel runModal];
    if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
      selectedFile = [openPanel URLs];
      return selectedFile;
    } else {
      return false;
    }
  },
  //Folder picker for the project
  "folderPanel": function(filePath,message,prompt,title) {
    var openPanel = [NSOpenPanel openPanel];
    [openPanel setMessage:message];
    [openPanel setPrompt:prompt];
    [openPanel setTitle:title];
    [openPanel setCanCreateDirectories:false];
    [openPanel setCanChooseFiles:false];
    [openPanel setCanChooseDirectories:true];
    [openPanel setAllowsMultipleSelection:false];
    [openPanel setShowsHiddenFiles:false];
    [openPanel setExtensionHidden:false];
    [openPanel setDirectoryURL:[NSURL fileURLWithPath:filePath]]];
    [[NSApplication sharedApplication] activateIgnoringOtherApps:true];
    var openPanelButtonPressed = [openPanel runModal];
    if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
      selectedFile = [openPanel URL];
      return selectedFile;
    } else {
      return false;
    }
  },
  "updateBitmapLayer": function(context,layer,url) {
    var doc = context.document;
    var imageCollection = [[[doc documentData] assets] imageCollection];

    var filePath = url.toString();
    filePath = filePath.replace("file:///","/");
    filePath = this.util.decodeString(filePath);

    var newImage = [[NSImage alloc] initWithContentsOfFile:filePath];
    var replaceAction = [[doc actionsController] actionForID:"MSReplaceImageAction"];
    [replaceAction applyImage:newImage tolayer:layer];
  },
  "updateShapeLayer": function(context,layer,url) {
    var doc = context.document;
    var imageCollection = [[[doc documentData] assets] imageCollection];

    var filePath = url.toString();
    filePath = filePath.replace("file:///","/");
    filePath = this.util.decodeString(filePath);

    var imageData = [[NSImage alloc] initWithContentsOfFile:filePath];
    if (MSApplicationMetadata.metadata().appVersion < 47) {
  		var newImage = [[MSImageData alloc] initWithImage:imageData convertColorSpace:false]];
  	} else {
      var newImage = [[MSImageData alloc] initWithImage:imageData]];
  	}

    var fill = layer.style().fills().firstObject();
    [fill setImage:newImage];
    [fill setFillType:4];
    [fill setPatternFillType:1];
  },
  "updateImgPath": function (context, layer, _relativePath, _sketchPath, _newPath, _imgFilePath) {

    var relativePath = _relativePath.toString()
    var sketchPath = _sketchPath.toString()
    var newPath = _newPath.toString()
    var imgFilePath = _imgFilePath.toString()

    sketchPath = sketchPath.split("/")
    newPath = newPath.split("/")
    sketchPath.pop()
    newPath.pop()
    imgFilePath = imgFilePath.split("/")

    // log("currentLayer → " + layer);
    // log("relativePath → " + relativePath);
    // log("sketchPath   → " + sketchPath);
    log("newPath      → " + newPath)
    log("imgFilePath  → " + imgFilePath)

    var newRelativePath = []

    for (var i = 0; i < imgFilePath.length; i++) {
      if (imgFilePath[i] != newPath[i]) {
        newRelativePath.push(imgFilePath[i])
      }
    }
    newRelativePath = "/" + newRelativePath.join("/")
    log("--------------------------------")
    log(newRelativePath)
    return newRelativePath

  },
  "writeUserDefaults": function(tmpKeyValue, tmpKey) {
    //imgFy_projectPath
    var keyValue = tmpKeyValue
    key = tmpKey.toString()
    var settings = [NSUserDefaults standardUserDefaults]
    [settings setObject: keyValue forKey: key]
  },

  "readUserDefaults": function(tmpKey) {
    key = tmpKey.toString()
    var settings = [NSUserDefaults standardUserDefaults]
    var keyValue = [settings valueForKey: key]
    return keyValue
  },
  "util": {
    "encodeString": function(tempString) {
      var inputNSString = [[NSString alloc] initWithString:tempString];
      var encodedNSString = [inputNSString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
      return encodedNSString.toString();
    },
    "decodeString": function(tempString) {
      var inputNSString = [[NSString alloc] initWithString:tempString];
      var decodedNSString = [inputNSString stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
      return decodedNSString.toString();
    },
    "displayAlert": function(title,text) {
      var app = [NSApplication sharedApplication];
      [app displayDialog:text withTitle:title];
    },
    "displayPrompt": function(doc,text,initialValue) {
      var capturedInput = [doc askForUserInput:text initialValue:initialValue];
      return capturedInput;
    },
    "displayMessage": function(doc,text) {
      [doc showMessage:text];
    },
    "dumpObj": function(obj) {
      log("#####################################################################################")
      log("## Dumping object " + obj )
      log("## obj class is: " + [obj className])
      log("#####################################################################################")

      log("obj.properties:")
      log([obj class].mocha().properties())
      log("obj.propertiesWithAncestors:")
      log([obj class].mocha().propertiesWithAncestors())

      log("obj.classMethods:")
      log([obj class].mocha().classMethods())
      log("obj.classMethodsWithAncestors:")
      log([obj class].mocha().classMethodsWithAncestors())

      log("obj.instanceMethods:")
      log([obj class].mocha().instanceMethods())
      log("obj.instanceMethodsWithAncestors:")
      log([obj class].mocha().instanceMethodsWithAncestors())

      log("obj.protocols:")
      log([obj class].mocha().protocols())
      log("obj.protocolsWithAncestors:")
      log([obj class].mocha().protocolsWithAncestors())

      log("obj.treeAsDictionary():")
      log(obj.treeAsDictionary())
    },
    "reloadInspector": function(doc) {
      [doc reloadInspector];
    },
    "sendAction": function(context,commandToPerform) {
      var doc = context.document;
      try {
        [NSApp sendAction:commandToPerform to:nil from:doc];
      } catch(e) {
        log(e);
      }
    }
  }
};
