# Place Linked Bitmap

This plugin keeps track of placed images and allows to update them later. Works in teams via Dropbox and other cloud storage. 

### Project Folder

A project folder is the first common folder of your image resources and sketch files. Only if the file you are using is placed inside this folder or inside a subfolder will the plugin be able to place the images correctly and find them later. Placing an image outside the project may work but updating it on another machine will **not** work. 

This plugin uses relative paths to link each image and reconstructs their complete path when executed. This allows for greater flexibility when working in teams. Files can be placed on a Dropbox and multiple persons can work on the same file, even on different machines.

##### Setting a project folder

The plugin asks to select a project folder whenever no existing linked image is found. When placing the first image, it will ask to select a project folder. Whenever the project folder is moved to another location, it will ask again. Be careful not to select a folder that would cut off images that were placed previously. 

### Warning

Moving linked images inside the project folder is not supported.      

##### Place Bitmap as New Layer...

Use this command to select an image and place it in your Sketch file as an image layer. If this is the first updateable image in your file, you will be prompted to select a project folder. (Be careful about the dialogue title)

##### Place Bitmap as fill Layer...

Identical to "...as New Layer" with the exception a layer has to be selected when this function is used. An image fill then gets applied to the selected layer. 

##### Update all Bitmaps

Looks for changes in all linked files and updates them. 


##### Change folder

Should you move your project folder, use this function to select a new root folder. Otherwise the plugin will not be able to locate the previously placed images.


##### Who?

I’m Frank Kolodziej, a Wichita, KS-based freelance designer & developer. I am [available for hire](http://kolo.io/). I’m [@frankko](https://twitter.com/frankko) on Twitter.

##### Other Plugins

- [★ Utility Belt](https://github.com/frankko/UtilityBelt): An always-expanding collection of simple, focused plugins for Sketch.
- [Artboard Tools](https://github.com/frankko/Artboard-Tools): Plugins for arranging artboards and navigating between artboards.
