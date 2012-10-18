function GetPluginSettings()
{
	return {
		"name":			"IndexPageStyling",
		"id":			"IndexPageStyling",
		"version":		"1.0",
		"description":	"Customize index.html from the Construct 2 editor",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"Form controls",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
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
				
//AddCondition(0, cf_trigger, "On clicked", "WebFont", "On clicked", "Triggered when the webfont is clicked.", "OnClicked");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/*AddStringParam("Text", "The text to set in the button.");
AddAction(0, af_none, "Set text", "Button", "Set text to {0}", "Set the button's text.", "SetText");

AddStringParam("Tooltip", "The tooltip to set on the button.");
AddAction(1, af_none, "Set tooltip", "Button", "Set tooltip to {0}", "Set the button's tooltip.", "SetTooltip");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the button.");
AddAction(2, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the button.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the button.");
AddAction(3, af_none, "Set enabled", "Button", "Set <b>{0}</b>", "Disable or enable the button.", "SetEnabled");*/

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_color,	"Background Color",					cr.RGB(255, 255, 255),		"The background color of the page in which the game runs."),
	new cr.Property(ept_text,	"Background Image",				"",			"The image used as background image"),
	/*new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the text box is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				"Yes",		"Choose whether the text box is enabled or disabled on startup.", "No|Yes"),*/
	/*new cr.Property(ept_color,		"Color",	cr.RGB(0, 0, 0),	"Color of the text."),*/
	new cr.Property(ept_text,	"Border width in pixels", "1", "The width of the border around the game's Canvas"),
	new cr.Property(ept_combo,	"Border style", "solid", "The style of the border around the game's Canvas","Left|Center|Right"),
	new cr.Property(ept_text,	"Border color", cr.RGB(0, 0, 0), "The color of the border around the game's Canvas")
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
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(72, 24));
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	/*renderer.Fill(quad, cr.RGB(224, 224, 224));*/
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	/*
	renderer.Line(new cr.vector2(quad.tlx + 1, quad.tly + 1), new cr.vector2(quad.trx - 1, quad.try_ + 1), cr.RGB(255, 255, 255));
	renderer.Line(new cr.vector2(quad.tlx + 1, quad.tly + 1), new cr.vector2(quad.blx + 1, quad.bly - 1), cr.RGB(255, 255, 255));
	renderer.Line(new cr.vector2(quad.blx + 1, quad.bly - 1), new cr.vector2(quad.brx - 1, quad.bry - 1), cr.RGB(128, 128, 128));
	renderer.Line(new cr.vector2(quad.brx - 1, quad.bry - 1), new cr.vector2(quad.trx - 1, quad.try_ + 1), cr.RGB(128, 128, 128));
	*/
	
	cr.quad.prototype.offset.call(quad, 0, 2);
	var rc = new cr.rect();
	cr.quad.prototype.bounding_box.call(quad, rc);

	this.font.DrawText(this.properties["Text"],
						rc,
						cr.RGB(0, 0, 0),
						ha_center);
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}