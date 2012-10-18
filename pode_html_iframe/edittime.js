function GetPluginSettings()
{
	return {
		"name":			"HTML_iFrame_Pode",
		"id":			"HTML_iFrame_Pode",
		"version":		"1.42",
		"description":	"Allows you to display web pages in your game or app via the HTML iFrame",
		"author":		"Jesse Johnston, JP Deblonde",
		"help url":		"http://www.metaformed.com",
		"category":		"Web",
		"type":			"world",			// appears in layout
		"rotatable":	true,
		"flags":		pf_position_aces | pf_size_aces | pf_angle_aces
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

AddStringParam("URL", "The url to compare the iFrame's url to.");
AddCondition(0, cf_none, "Compare url", "HTML iFrame", "Url is {0}", "Compare the url currently displayed in iFrame.", "CompareURL");

AddStringParam("Text", "The text to compare the iFrame's innerHTML to. (You can only get the contents of files on the same server)");
AddCondition(1, cf_none, "Compare innerHTML", "HTML iFrame", "innerHTML is <i>{0}</i>", "Compare the innerHTML currently displayed in the Div.", "CompareinnerHTML");


AddStringParam("Text", "The text to compare the iFrame's CSS style to.");
AddCondition(2, cf_none, "Compare CSS Style", "HTML iFrame", "CSS Style is <i>{0}</i>", "Compare the CSS style currently displayed in the Div.", "CompareStyle");

AddCondition(3, cf_trigger, "On clicked", "HTML iFrame", "On clicked", "Triggered when the text box is clicked.", "OnClicked");
AddCondition(4, cf_trigger, "On double-clicked", "HTML iFrame", "On double-clicked", "Triggered when the text box is double-clicked.", "OnDoubleClicked");
AddCondition(5, cf_trigger, "On loaded", "HTML iFrame", "On loaded", "Triggered when frame has finished to load.", "OnLoaded");

AddCondition(6, 0, "Is focussed", "HTML iFrame", "iframe has focus", "True if the iframe has focus.", "isFocused");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("URL", "The url to set in the iFrame.");
AddAction(0, af_none, "Set URL", "HTML iFrame", "Set URL to {0}", "Set the url of the iFrame.", "SetURL");

AddStringParam("CSS Styling", "The CSS style to apply to this iFrame (eg. font-size:10px;font-family:arial; ) .");
AddAction(1, af_none, "Set CSS Styling", "HTML iFrame", "Set iFrame CSS Style to {0}", "Set the iFrame's CSS Style.", "SetStyle");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the text box.");
AddAction(3, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the text box.", "SetVisible");

AddAction(4, af_none, "Back", "HTML iFrame", "History: Backward", "Move the iFrame back one in history.", "GoBackward");
AddAction(5, af_none, "Forward", "HTML iFrame", "History: Forward", "Move the iFrame forward one in history.", "GoForward");
AddAction(6, af_none, "Refresh", "HTML iFrame", "Refresh iFrame", "Refresh the iFrame.", "Refresh");

AddAction(7, af_none, "Set focus", "HTML iFrame", "Set focus on iFrame", "Set focus on iFrame.", "setFocus");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get innerHTML", "HTML iFrame", "innerHTML", "Get the iframe's innerHTML.");
AddExpression(1, ef_return_string, "Get URL", "HTML iFrame", "CurrentURL", "Get the iframe's current URL.");
AddExpression(2, ef_return_string, "Get CSS style", "HTML iFrame", "GetStyle", "Get the iFrame's css style.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the text box is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_text,	"URL",					"",			"The url of this iFrame"),
	new cr.Property(ept_text,	"Style",					"",			"The CSS style of this iFrame"),
	new cr.Property(ept_text,	"HTML tag id", "my_iframe", "tag id for the iframe"),
	new cr.Property(ept_combo,	"Scrolling",		"Auto",	"Allow (yes) or prevent (no) scrolling inside the iframe","Auto|Yes|No")
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
	this.instance.SetSize(new cr.vector2(150, 22));
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
	renderer.Fill(quad, this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));

	cr.quad.prototype.offset.call(quad, 4, 2);
	var rc = new cr.rect();
	cr.quad.prototype.bounding_box.call(quad, rc);

	if (this.properties["URL"].length)
	{
		this.font.DrawText(this.properties["URL"],
							rc,
							cr.RGB(0, 0, 0),
							ha_left);
	}
	else
	{
		this.font.DrawText(this.properties["Placeholder"],
							rc,
							cr.RGB(128, 128, 128),
							ha_left);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}