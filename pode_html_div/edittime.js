function GetPluginSettings()
{
	return {
		"name":			"HTML_Div_Pode",
		"id":			"HTML_Div_Pode",
		"version":		"1.5",
		"description":	"Gives you a full featured HTML Div to play with! Display text, widgets or even video in your games and apps!",
		"author":		"Jesse Johnston, mod. JP Deblonde",
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

AddStringParam("Text", "The text to compare the Div's innerHTML to.");
AddCondition(0, cf_none, "Compare innerHTML", "HTML Div", "innerHTML is <i>{0}</i>", "Compare the innerHTML currently displayed in the Div.", "CompareinnerHTML");

AddStringParam("Text", "The text to compare the Div's CSS style to.");
AddCondition(1, cf_none, "Compare CSS Style", "HTML Div", "CSS Style is <i>{0}</i>", "Compare the CSS style currently displayed in the Div.", "CompareStyle");

AddCondition(2,	cf_trigger, "On completed", "HTML Div", "On load completed", "Triggered when content loading completes successfully.", "OnComplete");

AddCondition(3,	cf_trigger, "On error", "HTML Div", "On load error", "Triggered when an content loading fails.", "OnError");

AddCondition(4, 0, "Is focussed", "HTML Div", "div has focus", "True if the div has focus.", "isFocused");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("HTML", "The HTML / content to set in the Div.");
AddAction(0, af_none, "Set innerHTML", "HTML Div", "Set innerHTML to {0}", "Set the div's content (HTML Allowed).", "SetInnerHTML");

AddStringParam("CSS Styling", "The CSS style to apply to this div (eg. font-size:10px;font-family:arial; ) .");
AddAction(1, af_none, "Set CSS Styling", "HTML Div", "Set div CSS Style to {0}", "Set the div's CSS Style.", "SetStyle");

AddStringParam("URL", "The URL to load into this div");
AddStringParam("POST Data (Optional)", "The post data to pass to the URL (eg. name=fred&&id=5 )");
AddAction(2, af_none, "Load Content", "HTML Div", "Load content from page <b>{0}</b>", "Load content into the div from another page.", "LoadDiv");

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the text box.");
AddAction(3, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the text box.", "SetVisible");

AddAction(4, af_none, "Set focus", "HTML Div", "Set focus on div", "Set focus on div.", "setFocus");

//
/*AddNumberParam("perspective", "value of the perspective ('0' to disable)", "0");
AddAction(4, af_none, "Set Perspective", "Appearance", "Set New Perspective Value :({0})", "3D Perspective value", "setPerspective");

AddNumberParam("x", "rotation on the x axis (0 or 1)", "0");
AddNumberParam("y", "rotation on the y axis (0 or 1)", "0");
AddNumberParam("z", "rotation on the Z axis (0 or 1)", "0");
AddNumberParam("deg", "number of degrees of rotation", "30");
AddAction(5, af_none, "Rotate 3d", "Appearance", "Rotate the item on the ({0},{1},{2}) axis, of {3}deg", "3D rotation of the item", "rotate3d");

AddNumberParam("deg", "number of degrees of 2D rotation)", "0");
AddAction(6, af_none, "Rotate 2d", "Appearance", "Rotate the item of {3}deg", "2D rotation of the item", "rotate2d");
*/
////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_string, "Get innerHTML", "HTML Div", "GetInnerHTML", "Get the div's html.");
AddExpression(1, ef_return_string, "Get CSS style", "HTML Div", "GetStyle", "Get the div's css style.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,		"Initial visibility",	"Visible",	"Choose whether the Div is visible on startup.", "Invisible|Visible"),
	new cr.Property(ept_text,		"innerHTML",					"",			"The innerHTML of this Div"),
	new cr.Property(ept_text,		"Style",					"",			"The CSS style of this Div"),
	//
	new cr.Property(ept_text,		"HTML tag id", "my_div", "tag id for the div")/*,
	new cr.Property(ept_integer,	"CSS 3D perspective", "1000", "3D depth of the scene (0 to disable)" ),
	//new cr.Property(ept_integer,	"CSS 3D perspective origin", "50% 50%", "origin of the 3D persepective"),
	new cr.Property(ept_combo,	"CSS 3D rotation on X", "0", "Choose wether you rotate on X axis or not.", "0|1" ),
	new cr.Property(ept_combo,	"CSS 3D rotation on Y", "0", "Choose wether you rotate on X axis or not.", "0|1" ),
	new cr.Property(ept_combo,	"CSS 3D rotation on Z", "0", "Choose wether you rotate on X axis or not.", "0|1" ),
	new cr.Property(ept_integer,	"CSS 3D rotation in degrees", "0", "degrees of rotation in 3D")*/
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
	//renderer.Fill(quad, cr.RGB(200, 200, 200));
	renderer.Outline(quad, cr.RGB(100, 100, 100));
	renderer.Fill(quad, cr.RGB(128, 128, 128));

	cr.quad.prototype.offset.call(quad, 4, 2);
	var rc = new cr.rect();
	cr.quad.prototype.bounding_box.call(quad, rc);

	if (this.properties["innerHTML"].length)
	{
		this.font.DrawText(this.properties["innerHTML"],
							rc,
							cr.RGB(128, 128, 128),
							ha_left);
	}
	else
	{
		this.font.DrawText("Empty Div",
							rc,
							cr.RGB(128, 128, 128),
							ha_left);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}