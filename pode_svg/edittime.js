function GetPluginSettings()
{
	return {
		"name":			"SVG Canvas",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"SVGCanvas",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.11",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Canvas to load SVG graphics",
		"author":		"JPDeblonde",
		"help url":		"",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0,						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
		"dependency" : "svg_todataurl.js"
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
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example				
/*AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");*/

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
/*AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");*/

/*AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");*/
AddStringParam("String", "SVG string to paste", "");
//AddAction(1, 0, "Paste SVG at", "Graphic", "Paste SVG string at ({0},{1})", "Paste the SVG string at a given position.", "pasteAt");
AddAction(1, 0, "Paste SVG", "Graphic", "Paste SVG string", "Paste the SVG string", "pasteAt");

AddNumberParam("x", "x center on the SVG canvas", "0");
AddNumberParam("y", "y center on the SVG canvas", "0");
AddNumberParam("radius", "Radius of circle.", "0");
AddStringParam("stroke_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddStringParam("fill_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddStringParam("ID", "ID of the circle", "myCircle");
AddAction(2, 0, "Draw Circle", "SVG Canvas", "Draw circle with ID {6} from center ({0},{1}), with radius {2}, stroke color {3}, fill color {4} and line width {5}", "Draw a circle.", "drawCircle");

AddNumberParam("x", "x upper left corner on the SVG canvas", "0");
AddNumberParam("y", "y upper left corner on the SVG canvas", "0");
AddNumberParam("width", "width of the rectangle.", "0");
AddNumberParam("height", "height of the rectangle.", "0");
AddStringParam("stroke_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddStringParam("fill_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddNumberParam("rx", "width of the rounded corner", "0");
AddNumberParam("ry", "height of the rounded corner", "0");
AddStringParam("ID", "ID of the rectangle", "myCircle");
AddAction(4, 0, "Draw Rectangle", "SVG Canvas", "Draw rectangle with ID {9} from ({0},{1}), with width {2} and height {3}, stroke color {4}, fill color {5} and line width {6}, and rounded corners of size ({7},{8})", "Draw a rectangle.", "drawRectangle");

AddStringParam("URL or base64", "URL, or base64 string, of image to paste", "");
AddStringParam("ID", "ID of the image", "myImage");
AddNumberParam("width", "width of the image.", "0");
AddNumberParam("height", "height of the image.", "0");
AddNumberParam("x", "x upper left corner on the SVG canvas", "0");
AddNumberParam("y", "y upper left corner on the SVG canvas", "0");
//AddAction(1, 0, "Paste SVG at", "Graphic", "Paste SVG string at ({0},{1})", "Paste the SVG string at a given position.", "pasteAt");
AddAction(5, 0, "Paste Image", "Graphic", "Paste Image at URL : {0}, with ID {1}, at ({4},{5}) and dimensions ({2},{3})", "Paste the Image from URL or base64 string", "pasteURL");

/*AddNumberParam("x", "x center on the SVG canvas", "0");
AddNumberParam("y", "y center on the SVG canvas", "0");
AddNumberParam("radius", "Radius of circle.", "0");
AddStringParam("stroke_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddStringParam("fill_color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddStringParam("ID", "ID of the circle", "myCircle");
AddAction(2, 0, "Draw Circle", "SVG Canvas", "Draw circle with ID {6} from center ({0},{1}), with radius {2}, stroke color {3}, fill color {4} and line width {5}", "Draw a circle.", "drawCircle");
*/
AddStringParam("ID", "ID of the element", "my_id");
AddStringParam("attribute", "Attribute to change", "");
AddStringParam("New value", "New value for the attribute", "");
AddAction(3, 0, "Change value of attribute", "SVG Canvas", "Change attribute {1} with new value '{2}' of item with ID '{0}'", "Change an attribute's value with a new one", "changeAttribute");

AddNumberParam("Saturation", "Intensity of saturation (between 0 and 1)", "0.5");
AddStringParam("ID", "ID of the element", "my_id");
AddAction(6, 0, "Create saturate effect", "Effects", "Create a saturation effect of intensity {0} and ID {1}", "Create a saturation effect", "createSaturationEffect");

AddNumberParam("Blur", "Intensity of blur", "2");
AddStringParam("ID", "ID of the element", "my_id");
AddAction(8, 0, "Create blur effect", "Effects", "Create a blur effect of intensity {0} and ID {1}", "Create a blur effect", "createBlurEffect");

AddStringParam("effect ID", "ID of the saturation effect", "");
AddStringParam("target ID", "ID of the element which get the effect", "");
AddNumberParam("x", "x upper left corner of the effect", "0");
AddNumberParam("y", "y upper left corner of the effect", "0");
AddNumberParam("width", "width of the effect", "50");
AddNumberParam("height", "height of the effect", "50");
//AddAction(7, 0, "Apply saturation effect", "Effects", "Apply saturation effect {0} on target {1}, at coordinates ({2},{3}), size ({4},{5})", "Apply saturation effect on target", "applySaturationEffect");
AddAction(7, 0, "Apply effect", "Effects", "Apply effect {0} on target {1}", "Apply effect on target", "applyEffect");

AddStringParam("Element ID", "ID of the element to change text", "\"my_TextElement\"");
AddStringParam("String", "New Text Content", "");
AddAction(9, 0, "Change text content", "SVG Canvas", "Change text content of the text element with ID <b>{0}</b> with new text <b>{1}</b>", "Change the text content", "changeTextContent");

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
//AddExpression(0, ef_return_number, "Leet expression", "My category", "MyExpression", "Return the number 1337.");
AddStringParam("ID", "ID of the item", "");
AddStringParam("attribute", "attribute to retrieve", "");
AddExpression(0, ef_return_string, "Return value of an attribute", "SVG Canvas", "myAttribute", "Return value of an attribute");

AddExpression(1, ef_return_string, "Return base64 string of the image", "SVG Canvas", "base64String", "Return base64 string of the image");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
		new cr.Property(ept_combo,	"Hotspot",		"Top-left",	"Choose the location of the hot spot in the object.", "Top-left|Center"),
		new cr.Property(ept_text,	"SVG content",	"<svg xmlns=\"http://www.w3.org/2000/svg\"><circle id=\"recircle\" cx=\"30\" cy=\"30\" r=\"30\" fill=\"red\" /></svg>",	"Text string of the SVG.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
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
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	if (property_name === "Hotspot")
	{
		if (this.properties["Hotspot"] === "Top-left")
			this.instance.SetHotspot(new cr.vector2(0, 0));
		else
			this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	}
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

IDEInstance.prototype.OnCreate = function()
{
	if (this.properties["Hotspot"] === "Top-left")
		this.instance.SetHotspot(new cr.vector2(0, 0));
	else
		this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(128, 128, 128));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
	this.font.DrawText("SVG Canvas",
						quad,
						cr.RGB(0, 0, 0),
						ha_center);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}