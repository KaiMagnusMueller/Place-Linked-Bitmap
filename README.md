# Place Linked Bitmap
## A Plugin for Sketch 3.4+

### What is this?

This plugin allows you to take a bitmap file (JPG, PNG, PSD, etc) and place it inside Sketch. “But Sketch can already do that” you might be thinking. It can, but what the plugin adds is the ability to easily update the placed bitmap _after it’s been placed, without having to re-place it_.

Place a PSD file on an artboard, handle your business in Sketch, then maybe switch to Photoshop to tweak the PSD, then return to Sketch, run the “Update All Bitmaps…” command, and your placed PSD has the changes you just made.

### But wait, there’s more…

If you don’t use Photoshop (or Pixelmator, or Acorn, or etc), I envy you. But you still might want to give this a try, and here’s why:

As of Sketch 3.4, an artboard can’t be turned into a symbol. You can, of course, export an artboard as a bitmap. See where I’m going with this? Export the artboard and place the bitmap of the artboard in your .sketch file. Then, after you edit and re-export the original artboard, “Update All Bitmaps…”

**Extra Credit:** Have you heard of [SketchTool](http://www.sketchapp.com/tool/), Bohemian Coding’s command line utility for exporting assets from Sketch? A shell script can be made to automate the exporting of artboards using SketchTool. If your artboard exporting is automated, you’ll just need to periodically “Update All Bitmaps…”

### So How Does This Work?

Either open an existing .sketch file or create a new one (be sure to save the new document somewhere first). To place a bitmap, you have two options:

1. **Place Bitmap as New Layer…** will create a new bitmap layer with the contents of the bitmap file
2. **Place Bitmap as Layer Fill…** will place the contents of the bitmap file as an image fill on a selected shape layer *[great for avatars and hero images that mimic CSS background-fills]*

When one of your bitmap files has been updated, run the **“Update All Bitmaps…”** command.

### For Best Results

If you roll solo, like I do, you don’t have too much to worry about. But if you’re part of a team, with lots of people touching the .sketch files, I have two recommendations:

1. keep your placed assets in the same directory as your .sketch file, or in a subdirectory of the directory in which your .sketch file lives. 
2. or, if your team works off a file server, keep your placed assets on that server. *[Because, theoretically, the paths to the files will be the same for every person who uses that server.]*


### About the Mac App Store version of Sketch…

Mac App Store (MAS) apps are bound by something called “sandboxing”. By default, for your security, an application can only access files within its own application bundle. But since that’s not a practical place for you to store your design files, during the “Update All Bitmaps…” command, Sketch will ask you to authorize the folder(s) where your bitmaps are stored. You should only have to do this once per folder.

### Frequently Asked Questions

1. **Can I place Photoshop files?** Yes! That’s actually why I created the plug-in.
2. **What about vector files?** Sort of. You can do it, but they’ll be rendered as bitmaps, meaning the image can’t be scaled up.
3. **Okay, what about... a .sketch file?** That would be interesting, but no, that won’t work.
4. **If I move a bitmap file to a different folder, can I still update it in Sketch?** Not at the moment, no. I’m looking into it.
5. **If I move a placed bitmap from one artboard to another, will it still update?** Yes.
6. **What about from one document to another?** Maybe. If both .sketch files are in the same folder, definitely. If they’re not... 
7. **If I copy a placed bitmap from one artboard and paste it into another artboard, will it still update?** Yes, they both will update.
5. **If the size of my bitmap changes, will the size of the placed bitmap change, too?** No, and for now, that’s on purpose. There is no great way to deal with this issue. But I’m still thinking about it. Suggestions are welcome.
6. **Is there any way to have the plugin automatically update a bitmap after it’s changed, like Adobe’s apps can?** At the moment, Sketch plugins can only run when you tell them to. I’ve heard Bohemian Coding might be looking into other events to trigger plugins, but until then, the answer is no, unfortunately.
7. **I already have a bunch of placed bitmaps in my .sketch file. Will the plugin update them for me?** That would be great, but no. *Bitmaps have to be placed by the plugin*, so that the plugin can store location of the bitmap file.

### Roadmap

- make further optimizations for MAS users
- a way to “relink” and/or “replace” a bitmap
- a way to “unlink” a bitmap

### Version History

- **0.9** Public beta

* * * 

### Who?

I’m Frank Kolodziej, a New York City-based freelance designer & developer. I am [available for hire](http://kolo.io/).