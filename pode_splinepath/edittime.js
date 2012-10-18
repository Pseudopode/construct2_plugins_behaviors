function GetBehaviorSettings()
{
	return {
		"name":			"SplinePath",			// as appears in 'add behavior' dialog, can be changed as long as "id" stays the same
		"id":			"pode_splinepath",			// this is used to identify this behavior and is saved to the project; never change it
		"version":		"1.1",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Move Sprite along a spline path",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"Movements",				// Prefer to re-use existing categories, but you can set anything here
		"flags":		0						// uncomment lines to enable flags...
					//	| bf_onlyone			// can only be added once to an object, e.g. solid
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
//AddCondition(0, cf_none, "Is moving", "My category", "{my} is moving", "Description for my condition!", "IsMoving");

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
/*AddAction(0, af_none, "Stop", "My category", "Stop {my}", "Description for my action!", "Stop");
AddAction(3, af_none, "Start", "My category", "Start {my}", "Description for my action!", "Start");*/

/*AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Activated", "Enable the behavior.");
AddAction(1, af_none, "Set activated", "", "Set {my} activated to <i>{0}</i>", "Enable the object's SplinePath behavior.", "setActivated");*/
AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("State", "Choose whether to enable or disable the behavior.");
AddAction(1, af_none, "Set enabled", "", "Set {my} {0}", "Enable or disable the drag and drop behavior.", "setActivated");
		  
AddNumberParam("X", "The X co-ordinate in the layout of a point along the spline path.");
AddNumberParam("Y", "The Y co-ordinate in the layout of a point along the spline path");
AddAction(2, af_none, "Add point on path", "Position", 
          "Add a point at(<i>{0}</i>, <i>{1}</i>) on the spline path", 
          "Add a point on the spline path to go through.", 
          "AddPointOnPath");

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
AddExpression(1, ef_return_number, "Get current activated state", "CurrentState", "Activated", 
              "The current activated state of behavior.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)

var property_list = [
	//new cr.Property(ept_integer, 	"My property",		77,		"An example property."),
	//new cr.Property(ept_combo, "Activated", "No", "Enable if you wish this to begin at the start of the layout.", "No|Yes"),                
	//new cr.Property(ept_combo, 	"Reverse",		"No",		"At the end of path, go in reverse.","No|Yes")
	//new cr.Property(ept_combo, "Reverse",	"No",		"At the end of path, go in reverse.", "No|Yes")
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