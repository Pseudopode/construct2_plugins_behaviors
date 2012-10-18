function GetBehaviorSettings()
{
	return {
		"name":			"Image Effects & Text On Sprite",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"TextOnSprite",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"2.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Allow to write Text on Sprites and apply Effects on Images",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0	/*,					// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
		//"dependency" : "domvas.js" //from https://github.com/Phrogz/context-blender
		"dependency" : "delaunay.js" */
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>, and {my} for the current behavior icon & name
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
//AddCondition(0, cf_fake_trigger, "OnTextWritten", "Image", "Text is written on Image", "Text is written on Image", "OnTextWritten");
AddCondition(0, cf_trigger, "Effect applied", "Effects", "Effect has been applied", "Effect has been applied", "OnEffectDone");

AddCondition(1, cf_trigger, "Current Image saved", "Effects", "Current Image has been saved", "Current Image has been saved", "OnCurrentSaved");

AddCondition(2, cf_trigger, "Image RGBA splitted", "Effects", "Image has been RGBA splitted", "Image has been RGBA splitted", "OnRGBASplitted");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddAction(0, af_none, "Stop", "My category", "Stop {my}", "Description for my action!", "Stop");
AddStringParam("Color", "Color of the text",'"#000"');
AddStringParam("Font", "Font size and type",'"30px sans-serif"');
AddStringParam("Baseline", "Text baseline",'"top"');
AddNumberParam("X", "X position","0");
AddNumberParam("Y", "Y position","0");
AddStringParam("Text", "Text to write on the Sprite");
AddAction(0, af_none, "Write Text on Sprite", "Text", "Write {5} on Sprite (color: {0}, font: {1}, baseline:{2}, position:({3},{4}) )", "Embed text string on Sprite", "writeText");

AddAction(1, af_none, "Grayscale", "Effects", "Apply Grayscale effect", "Apply Grayscale effect on Sprite", "grayscale");

AddNumberParam("Blur", "Blur amount", "3");
AddAction(2, af_none, "Simple Blur", "Effects", "Apply Simple Blur effect (amount : {0})", "Apply Simple Blur effect on Sprite", "simpleblur");

AddNumberParam("R", "R correction", "0.3");
AddNumberParam("G", "G correction", "0.3");
AddNumberParam("B", "B correction", "0.3");
/*AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");*/
/*AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect transparency", "Don't color transparent pixels.");*/
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");
AddAction(3, af_none, "Color tint", "Effects", "Apply Color tint effect - correction R,G,B : ({0},{1},{2})", "Apply Color tint effect on Sprite", "recolor");

AddAction(4, af_none, "Reset", "Effects", "Reset all effects", "Reset all applied effects on Sprite", "reset");

AddAction(5, af_none, "Save Current Image", "Effects", "Save Current image", "SaveCurrent image (takes a bit of memory, but needed if reset)", "saveCurrentImage");

AddNumberParam("Noise", "Noise amount", "20");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");
AddAction(6, af_none, "Sepia", "Effects", "Apply Sepia effect", "Apply Sepia effect on Sprite", "sepia");

AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");
AddAction(7, af_none, "Invert", "Effects", "Apply invert (negative) effect, respect white color : {0}", "Apply invert (negative) effect on Sprite", "negative");

AddNumberParam("Noise", "Noise amount", "55");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");
AddAction(8, af_none, "Noise", "Effects", "Apply noise effect, between (- {0} , {0})", "Apply noise effect on Sprite", "noise");

AddAction(9, af_none, "RGB2BGR", "Effects", "Swap color channels, RGB to BGR", "Swap color channels, RGB to BGR", "rgb2bgr");

AddAction(10, af_none, "Left rotate color channels", "Effects", "Rotate colors channels on the left", "Rotate colors channels on the left", "rotateColLeft");

AddAction(11, af_none, "Right rotate color channels", "Effects", "Rotate colors channels on the right", "Rotate colors channels on the right", "rotateColRight");

AddNumberParam("Strength", "Strength of the embossing", "0.5");
AddAction(12, af_none, "Emboss", "Effects", "Emboss the image with strength : {0}", "Emboss the image", "emboss");

/*AddNumberParam("Size", "Size of the effect", "32");
AddNumberParam("x", "X position of the center of the distortion", "32");
AddNumberParam("y", "Y position of the center of the distortion", "32");
AddAction(13, af_none, "Flower", "Effects", "Flower distort the image with size : {0} at ({1},{2})", "Flower distort the image", "flower");*/

AddNumberParam("Strength", "Strength of the sharpening", "0.5");
AddAction(14, af_none, "Sharpen", "Effects", "Sharpen the image with strength : {0}", "Sharpen the image", "sharpen");

AddAction(15, af_none, "Edges", "Effects", "Show the edges of the image", "Sharpen the image", "edges");

AddNumberParam("Old R", "Old R value", "147");
AddNumberParam("Old G", "Old G value", "147");
AddNumberParam("Old B", "Old B value", "147");
AddNumberParam("New R", "New R value", "32");
AddNumberParam("New G", "New G value", "32");
AddNumberParam("New B", "New B value", "32");
AddNumberParam("Tolerance", "Range of tolerance around value", "5");
/*AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect white color", "Don't color white pixels.");*/
/*AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Respect transparency", "Don't color transparent pixels.");*/
//AddComboParam("Respect white color", "Don't color white pixels.");
AddAction(16, af_none, "Change RGB color", "Effects", "Change RGB color from ({0},{1},{2}) to ({3},{4},{5}) with tolerance {6}", "Change RGB value to another RGB value, with tolerance", "changeRGB");

//AddNumberParam("Blocksize", "Blocksize of square pixelation, in pixels", "5");
AddStringParam("Shape", "Shape of the effect ('square','circle',or 'diamond'","\"square\"");
AddNumberParam("Resolution", "Resolution", "32");
AddNumberParam("Size", "Size", "16");
AddNumberParam("Offset", "Offset", "8");
AddNumberParam("Alpha", "Alpha", "0.6");
AddAction(17, af_none, "Pixelate", "Effects", "Pixelate the image, with effect,resolution,size,offset,alpha ({0},{1},{2},{3},{4})", "Pixelate the image", "pixelate");

/*AddStringParam("HTML string", "HTML string to add", "\"<b>Hello</b><i> world <h2>!</h2></i>\"");
AddAction(18, af_none, "HTML String", "Effects", "Add the HTML string to the image : {0}", "Add HTML string", "htmlString");*/
//AddAction(18, af_none, "Sobel", "Effects", "Show the sobel edges of the image", "Sobel on the image", "sobel");

AddNumberParam("R", "R Color value", "255");
AddNumberParam("G", "G Color value", "105");
AddNumberParam("B", "B Color value", "0");
AddStringParam("Mode", "Mode for blending the color", "\"Multiply\"");
/*AddComboParam("Mode", "Mode for blending the color", "\"src-over\"|\"screen\"|\"multiply\"|\"difference\"|\"exclusion\"|\"src-in\"|\"add\"|\"lighten\"|\"darken\"|\"overlay\"|\"hardlight\"|\"colordodge\"|\"colorburn\"");*/
AddAction(18, af_none, "Blend RGB color", "Effects", "Blend RGB color ({0},{1},{2}) with {3} effect", "Blend RGB color ({0},{1},{2}) with {3} effect", "blendColor");

AddObjectParam("Sprite", "Sprite to blend.");
//AddStringParam("Mode", "Mode for blending the sprite from", "\"Multiply\"");
AddComboParamOption("src-over");
AddComboParamOption("screen");
AddComboParamOption("multiply");
AddComboParamOption("difference");
AddComboParamOption("exclusion");
AddComboParamOption("src-in");
AddComboParamOption("add");
AddComboParamOption("lighten");
AddComboParamOption("darken");
AddComboParamOption("overlay");
AddComboParamOption("hardlight");
AddComboParamOption("colordodge");
AddComboParamOption("colorburn");
AddComboParam("Mode", "Mode for blending the color");
AddNumberParam("Dest X", "X position on the destination", "15");
AddNumberParam("Dest Y", "Y position on the destination", "15");
AddNumberParam("Source X", "X position on the source", "18");
AddNumberParam("Source Y", "Y position on the source", "18");
AddNumberParam("Width", "Width of the blending", "50");
AddNumberParam("Height", "Height of the blending", "50");
AddAction(19, af_none, "Blend Sprite", "Effects", "Blend Sprite onto image with {1} effect", "Blend Sprite onto image with {1} effect", "blendSprite");

AddStringParam("Base64 String", "Base 64 string to blend.");
//AddStringParam("Mode", "Mode for blending the base64 string from", "\"Multiply\"");
AddComboParamOption("src-over");
AddComboParamOption("screen");
AddComboParamOption("multiply");
AddComboParamOption("difference");
AddComboParamOption("exclusion");
AddComboParamOption("src-in");
AddComboParamOption("add");
AddComboParamOption("lighten");
AddComboParamOption("darken");
AddComboParamOption("overlay");
AddComboParamOption("hardlight");
AddComboParamOption("colordodge");
AddComboParamOption("colorburn");
AddComboParam("Mode", "Mode for blending the color");
AddAction(20, af_none, "Blend Base64String", "Effects", "Blend base64 string onto image with {1} effect", "Blend base64 string onto image with {1} effect", "blendBase64");

AddNumberParam("R", "R Color value", "128");
AddNumberParam("G", "G Color value", "128");
AddNumberParam("B", "B Color value", "128");
AddAction(21, af_none, "Whitening", "Effects", "Set all pixels of the image above ({0},{1},{2}, included) to white", "Set all pixels of the image above ({0},{1},{2}, included) to white", "whiten");

AddNumberParam("R", "R Color value", "128");
AddNumberParam("G", "G Color value", "128");
AddNumberParam("B", "B Color value", "128");
AddAction(22, af_none, "Darkening", "Effects", "Set all pixels of the image under ({0},{1},{2}, included) to black", "Set all pixels of the image under ({0},{1},{2}, included) to black", "darken");

AddNumberParam("X1", "First point new X", "0");
AddNumberParam("Y1", "First point new Y", "0");
AddNumberParam("X2", "Second point (clockwise) new X", "50");
AddNumberParam("Y2", "Second point (clockwise) new Y", "10");
AddNumberParam("X3", "Third point (clockwise) new X", "50");
AddNumberParam("Y3", "Third point (clockwise) new Y", "20");
AddNumberParam("X4", "Fourth point (clockwise) new X", "0");
AddNumberParam("Y4", "Fourth point (clockwise) new Y", "50");
AddAction(23, af_none, "Perspective", "Effects", "Remap image via perspective transform to ({0},{1}),({1},{2}),({3},{4}),({5},{6})", "Remap image via perspective transform to ({0},{1}),({1},{2}),({3},{4}),({5},{6})", "perspective");

AddComboParamOption("R");
AddComboParamOption("G");
AddComboParamOption("B");
AddComboParamOption("Alpha");
AddComboParam("Channel", "Channel to keep");
AddAction(24, af_none, "Keep RGBA channel", "Effects", "Keep {0} RGBA channel", "Keep {0} RGBA channel", "keepRGBA");

AddNumberParam("Size of block", "Size of block for the DCT", "8");
AddAction(25, af_none, "Forward DCT", "Effects", "Do a forward Discrete Cosine Transform (blocksize : {0})", "Do a forward Discrete Cosine Transform", "forwardDCT");

AddNumberParam("Size of block", "Size of block for the DCT", "8");
AddNumberParam("Number Of Coefficients", "Number Of coefficients to keep (between 1 and 8 included", "8");
AddAction(26, af_none, "Inverse DCT", "Effects", "Do an inverse Discrete Cosine Transform, keeping {1} x {1} coefficients (blocksize : {0})", "Do a inverse Discrete Cosine Transform", "inverseDCT");

/*AddStringParam("URL", "Address of the image to Cross-site load");
AddAction(25, af_none, "Cross-site image loading", "Effects", "Cross-site image loading", "Cross-site image loading", "crossLoad");*/
AddNumberParam("X", "Top left X coordinate ", "0");
AddNumberParam("Y", "Top left Y coordinate ", "0");
AddNumberParam("Width", "Width of the rectangle", "50");
AddNumberParam("Height", "Height of the rectangle", "10");
AddStringParam("Color", "Color of the rectangle","\"rgba(128,128,128,0.5)\"");
AddAction(27, af_none, "Draw Rectangle", "Effects", "Draw rectangle from ({0},{1}) with size ({2},{3}) and color {4}", "Draw colored rectangle on image", "drawRectangle");


/*AddStringParam("New Points", "List of new coordinates","\"0,0;50,0;25,25\"");
AddStringParam("Old Points", "List of old coordinates","\"0,0;50,0;25,100\"");*/
AddAction(28, af_none, "Warp points", "Warping", "Warp points", "Warp points", "warpPoints");

AddAction(29, af_none, "Triangulate points", "Warping", "Triangulate point list", "Triangulate point list", "triangulatePointList");

AddNumberParam("Old X", "Old X coordinate ", "0");
AddNumberParam("Old Y", "Old Y coordinate ", "0");
AddNumberParam("New X", "New X coordinate ", "0");
AddNumberParam("New Y", "New Y coordinate ", "0");
AddAction(30, af_none, "Move point", "Warping", "Move point from ({0},{1}) to ({2},{3})", "Move point", "movePoint");

AddStringParam("RGB", "RGB color for the lines of the old strip","\"rgb(255,0,0)\"");
AddStringParam("RGB", "RGB color for the lines of the new strip","\"rgb(0,0,255)\"");
AddAction(31, af_none, "Draw triangulated strip", "Warping", "Draw old triangulated strip in ({0}) and new in ({1})", "Draw triangulated strip", "drawTriangleStrip");

AddNumberParam("X", "X coordinate of the point added", "0");
AddNumberParam("Y", "Y coordinate of the point added", "0");
AddAction(32, af_none, "Add point", "Warping", "Add point ({0},{1}) to the warping point list", "Add warping point", "addWarpPoint");

AddObjectParam("Sprite", "Sprite to paste.");
AddNumberParam("X", "X coordinate of the pasting", "0");
AddNumberParam("Y", "Y coordinate of the pasting", "0");
AddNumberParam("Width", "Width of the pasting", "0");
AddNumberParam("Height", "Height of the pasting", "0");
AddAction(33, af_none, "Paste Sprite", "Effects", "Paste Sprite ({0}) at coordinate ({1},{2}) and size ({3},{4}) onto the image", "Paste Sprite", "pasteSprite");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
//AddExpression(0, ef_return_string, "Image as base64 string", "Image", "base64string", "Return image as base64 string.");
AddExpression(0, ef_return_string, "Saved Image as Base 64 string", "Image", "savedImageAsBase64String", "Return the saved image as a base64 string");
AddExpression(1, ef_return_string, "Current Image as Base 64 string", "Image", "currentImage", "Return the current image as a base64 string");

AddNumberParam("x", "x position on Sprite", "0");
AddNumberParam("y", "y position on Sprite", "0");
AddExpression(2, ef_return_string, "get rgba at", "Image", "rgbaAt", "Rerturn the rgba color at a given position on the Sprite.");
////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of the behavior in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// any other properties here, e.g...
	// this.myValue = 0;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
