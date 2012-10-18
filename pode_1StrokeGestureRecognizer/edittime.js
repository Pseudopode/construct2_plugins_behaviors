function GetPluginSettings()
{
	return {
		"name":			"OneStrokeGestureRecognizer",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"OneStrokeGestureRecognizer",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"1$ javascript One Stroke Gesture Recognizer",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0		/*,				// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
		"dependency": "dollar.js"*/
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

AddNumberParam("x", "x position for the point", "0");
AddNumberParam("y", "y position for the point", "0");
AddAction(1, 0, "Add Point to recognizer", "General", "Add Point ({0},{1}) to recognizer", "Add a point to list of points for the recognizer", "AddPoint");

AddAction(2, 0, "Clear Points list", "General", "Clear Points list", "Clear the list of points, to start a new recogniton", "ClearPoints");

AddAction(3, 0, "Recognize Gesture", "General", "Recognize Gesture", "Recognize the Gesture made as a list of points", "RecognizeGesture");

AddAction(4, 0, "Use Golden Section Search", "Settings", "Use Golden Section Search", "Use Golden Section Search (original algorithm)", "useGoldenSectionSearch");
AddAction(5, 0, "Use Protractor", "Settings", "Use Protractor", "Use Protractor (faster algorithm)", "useProtractor");

AddStringParam("type", "Existing Stroke type", "\"triangle\"");
AddAction(6, 0, "Add stroke example to existing type", "Gestures", "Add stroke to existing type {0}", "Add last unistroke as example of existing type {0}", "AddExisting");

AddStringParam("type", "Custom Stroke type", "\"Add custom type name here\"");
AddAction(7, 0, "Add stroke example to custom type }", "Gestures", "Add stroke to custom type {0}", "Add last unistroke as example of custom type {0}", "AddCustom");

AddAction(8, 0, "Delete all-user defined samples", "General", "Delete all-user defined samples", "Delete all-user defined samples", "deleteAll");
AddAction(10, 0, "Delete all defined gestures", "General", "Delete all defined gestures", "Delete all defined gestures", "deleteEverything");

AddStringParam("type", "Type of gesture to delete", "\"Add type name to delete here\"");
AddAction(11, 0, "Delete gesture of type", "Gestures", "Delete gesture of type {0}", "Delete gesture of type {0}", "deleteGestureOfType");

AddStringParam("points", "List of x,y points, separated by the \"|\" character", "X1,Y1|X2,Y2|...|Xn,Yn");
AddStringParam("type", "Custom Stroke type", "\"Add custom type name here\"");
AddAction(9, 0, "Add a list of points as new gesture of type", "General", "Add list of points {0} as gesture of type {1}", "Add list of points {0} as gesture of type {1}", "addPointList");

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
AddExpression(0, ef_return_string, "Get category", "Gesture", "result", "Get the category of the recognized gesture");
AddExpression(1, ef_return_number, "Get score", "Gesture", "score", "Get the score of the recognized gesture");
AddExpression(2, ef_return_string, "Get error message", "Gesture", "errormessage", "Get the error message (if there is any)");
AddExpression(3, ef_return_number, "Get centroid(X)", "Gesture", "centroidX", "Get X coordinate of the centroid of the gesture");
AddExpression(4, ef_return_number, "Get centroid(Y)", "Gesture", "centroidY", "Get Y coordinate of the centroid of the gesture");
AddExpression(5, ef_return_number, "Get Bounding Box X", "Gesture", "boundingboxX", "Get X upper left coordinate of the bounding box of the gesture");
AddExpression(6, ef_return_number, "Get Bounding Box Y", "Gesture", "boundingboxY", "Get Y upper left coordinate of the bounding box of the gesture");
AddExpression(7, ef_return_number, "Get Bounding Box Width", "Gesture", "boundingboxWidth", "Get width of the bounding box of the gesture");
AddExpression(8, ef_return_number, "Get Bounding Box Height", "Gesture", "boundingboxHeight", "Get height of the bounding box of the gesture");
AddExpression(9, ef_return_number, "Get Angle", "Gesture", "angleGesture", "Get the angle of the gesture");

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
	/*new cr.Property(ept_text, 	"result",		"nothing",		"Category of the result"),
	new cr.Property(ept_integer, 	"score",		0,		"Confidence value for the result")*/
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
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}