function GetPluginSettings()
{
	return {
		"name":			"Drag'n'Drop Zone",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Pode_DragNDropZone",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Add a drag'n'drop landing zone inside your webapp",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	true,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
						| pf_size_aces			// compare/set/get width, height...
						| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
						| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
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
AddCondition(0, cf_trigger, "On drag entered", "DragNDrop", "On drag entered", "Triggered when something is dragged on it", "OnDragEntered");
AddCondition(1, cf_trigger, "On drag over", "DragNDrop", "On drag over", "Triggered when you are over the drag'n'drop zone", "OnDragOver");
AddCondition(2, cf_trigger, "On drop", "DragNDrop", "On drop", "Triggered when you drop something over the drag'n'drop zone", "OnDrop");

AddCondition(3, cf_trigger, "On Image Loaded", "Image", "On Image Loaded", "Triggered when the image you dropped on the zone is loaded", "OnImageLoaded");
AddCondition(4, cf_trigger, "On Text Loaded", "Text", "On Text Loaded", "Triggered when the text you dropped on the zone is loaded", "OnTextLoaded");

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
AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the button.");
AddAction(0, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the drag'n'drop zone.", "setVisible");

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
AddExpression(0, ef_return_string, "Image as Base64 string", "Image", "base64ImageString", "Return the image as a Base64 string");
AddExpression(1, ef_return_string, "Last filetype", "DragNDrop", "last_Filetype", "Return the filetype of the last dropped file");
AddExpression(2, ef_return_string, "File content as text string", "Text", "textstring", "Return the content of the last dropped file as text");

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
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property.")
	new cr.Property(ept_color, 	"Color",		cr.RGB(210, 210, 210),		"Background color of the drag'n'drop zone"),
	new cr.Property(ept_combo, 	"File type",		"Image","Choose allowed filetype","Image|Text"),
	new cr.Property(ept_text, 	"CSS style",		"","CSS styling for the drag and drop zone"),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the text box is visible on startup.", "Invisible|Visible"),
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
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);

	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, this.properties["Color"]);
	renderer.Outline(quad, cr.RGB(0, 0, 0));

	cr.quad.prototype.offset.call(quad, 4, 2);
	var rc = new cr.rect();
	//cr.quad.prototype.bounding_box.call(quad, rc);

	this.font.DrawText("DragNDrop Zone",
							rc,
							cr.RGB(0, 0, 0),
							ha_left);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}