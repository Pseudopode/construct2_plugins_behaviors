function GetPluginSettings()
{
	return {
		"name":			"MicrophoneJSSWF",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"MicrophoneJSSWF",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Acces microphone in JS via a Flash fallback",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"Media",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0		//,				// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces,		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
		"dependency":'AS3micRec.swf'
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
AddCondition(0, cf_trigger, "On WAV Encoded", "Events", "WAV file is available", "WAV file is encoded and available", "OnWAVEncoded");
AddCondition(1, cf_trigger, "On OGG Encoded", "Events", "OGG file is available", "OGG file is encoded and available", "OnOGGEncoded");
AddCondition(2, cf_trigger, "On MP3 Encoded", "Events", "MP3 file is available", "MP3 file is encoded and available", "OnMP3Encoded");

//
AddCondition(3, cf_fake_trigger, "On OGG Progress", "Events", "On OGG encoding progression", "On OGG encoding progression", "OnOGGProgress");
AddCondition(4, cf_fake_trigger, "On MP3 Progress", "Events", "On MP3 encoding progression", "On MP3 encoding progression", "OnMP3Progress");

AddCondition(5, cf_trigger, "On Microphone Access Allowed", "Events", "On Microphone Access Allowed", "On Microphone Access Allowed", "OnMicAccessAllowed");
AddCondition(6, cf_trigger, "On Microphone Access Unallowed", "Events", "On Microphone Access Unallowed", "On Microphone Access Unallowed", "OnMicAccessUnallowed");
AddCondition(7, cf_trigger, "No Microphone on system", "Events", "No Microphone on system", "No Microphone on system", "OnMicAbsent");

AddCondition(8, cf_trigger, "Starting to record", "Events", "Starting to record", "Starting to record", "OnRecordingStarting");
AddCondition(9, cf_trigger, "Stopping the record", "Events", "Stopping the record", "Stopping the record", "OnRecordingStop");




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
//AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Init Microphone", "Microphone", "Init Microphone", "Init the microphone", "initMicro");

AddAction(1, af_none, "Start Recording", "Microphone", "Start Microphone recording", "Start Microphone recording", "startRecord");
AddAction(2, af_none, "Stop Recording", "Microphone", "Stop Microphone recording", "Stop Microphone recording", "stopRecord");

AddAction(3, af_none, "Encode to OGG", "File Format", "Encode the recording as OGG", "Encode the recording as OGG", "startOGGEncoding");

AddAction(4, af_none, "Encode to MP3", "File Format", "Encode the recording as MP3", "Encode the recording as MP3", "startMP3Encoding");

AddNumberParam("Color", "The new font color, in the form rgb(r, g, b).", "rgb(0, 0, 0)");
AddAction(5, af_none, "Change Microphone panel color", "Microphone", "Change the flash microphone panel background color", "Change the flash microphone panel background color", "changeColor");

AddAction(6, af_none, "Hide Microphone panel", "Microphone", "Hide the flash microphone panel", "Hide the flash microphone panel", "hidePanel");

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
AddExpression(0, ef_return_string, "Audio WAV file as base64 string", "Audio Strings", "wavBase64string", "Return the WAV file as base64 string");
AddExpression(1, ef_return_string, "Audio MP3 file as base64 string", "Audio Strings", "mp3Base64string", "Return the MP3 file as base64 string");
AddExpression(2, ef_return_string, "Audio OGG file as base64 string", "Audio Strings", "oggBase64string", "Return the OGG file as base64 string");

AddExpression(3, ef_return_number, "OGG encoding progress", "Encoding Progress", "oggEncodingProgress", "Return the pourcentage of progress of OGG encoding");
AddExpression(4, ef_return_number, "MP3 encoding progress", "Encoding Progress", "mp3EncodingProgress", "Return the pourcentage of progress of MP3 encoding");

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
	new cr.Property(ept_integer, 	"X",		0,		"X position of the Microphone panel"),
	new cr.Property(ept_integer, 	"Y",		0,		"Y position of the Microphone panel"),
	new cr.Property(ept_color,		"Background color R",	cr.RGB(0, 0, 0),	"Background color of the Microphone panel")	
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
	var quad = this.instance.GetBoundingQuad();
	//renderer.Fill(quad, cr.RGB(200, 200, 200));
	renderer.Outline(quad, cr.RGB(100, 100, 100));
	renderer.Fill(quad, cr.RGB(175, 175, 175));

	cr.quad.prototype.offset.call(quad, 4, 2);
	var rc = new cr.rect();
	cr.quad.prototype.bounding_box.call(quad, rc);

	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
	
	this.font.DrawText("Microphone panel",
							rc,
							cr.RGB(128, 128, 128),
							ha_left);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}