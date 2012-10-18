function GetPluginSettings()
{
	return {
		"name":			"AudioPlusBase64",
		"id":			"AudioPlus",
		"version":		"1.0",
		"description":	"Audio plugin for C2, dealing with base64 audio",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"Media",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddStringParam("Tag", "The audio tag of the file to detect finishing.");
AddCondition(0, cf_trigger, "On ended", "Audio", "On {0} ended", "Triggered when an audio file finishes playing.", "OnEnded");

//AddCondition(1, 0, "Preloads complete", "Audio", "All preloads complete", "True when all preloaded audio is ready to play.", "PreloadsComplete");

////ADDED BY JP
/*AddStringParam("Tag", "The audio tag of the file to detect time updating.");
AddCondition(2, cf_trigger, "On time update", "Audio", "On {0} time updating", "Triggered when an audio file updates.", "OnTimeUpdated");
*/////

//////////////////////////////////////////////////////////////
// Actions
/*AddAudioFileParam("Audio file", "Choose the audio file to play.");
AddComboParamOption("not looping");
AddComboParamOption("looping");
AddComboParam("Loop", "Whether or not to initially play the sound in a loop (repeating).", 0, 2);
AddStringParam("Tag (optional)", "A tag, which can be anything you like, to use to reference this sound in future.", "\"\"", 1);
AddAction(0, 0, "Play", "Audio", "Play <b>{0}</b> {1} (tag <i>{2}</i>)", "Play an audio file.", "Play");

AddStringParam("Tag", "The tag identifying the sound to loop.  Leave empty to affect the last played sound.");
AddComboParamOption("looping");
AddComboParamOption("not looping");
AddComboParam("State", "Choose whether to turn looping on or off.");
AddAction(1, 0, "Set looping", "Audio", "Set <i>{0}</i> {1}", "Enable or disable looping on a sound.", "SetLooping");

AddStringParam("Tag", "The tag identifying the sound to loop.  Leave empty to affect the last played sound.");
AddComboParamOption("muted");
AddComboParamOption("unmuted");
AddComboParam("State", "Choose whether to mute or unmute the sound.");
AddAction(2, 0, "Set muted", "Audio", "Set <i>{0}</i> {1}", "Mute (make silent) or unmute a sound.", "SetMuted");

AddStringParam("Tag", "The tag identifying the sound to loop.  Leave empty to affect the last played sound.");
AddNumberParam("dB", "The attenuation in decibels (dB).  0 is original volume, -10 dB is about half as loud, etc.", "-10");
AddAction(3, 0, "Set volume", "Audio", "Set <i>{0}</i> volume to <b>{1}</b> dB", "Set the volume (loudness) of a sound.", "SetVolume");

AddAudioFileParam("Audio file", "Choose the audio file to preload.  It will be downloaded from the server but not played.");
AddAction(4, 0, "Preload", "Audio", "Preload <b>{0}</b>", "Download an audio file from the server without playing it.  This ensures it will play immediately.", "Preload");

AddStringParam("Tag", "The tag identifying the sound to loop.  Leave empty to affect the last played sound.");
AddNumberParam("Playback rate", "The rate of playback.  1.0 is normal speed, 0.5 half speed, 2.0 double speed, etc.", "1.0");
AddAction(5, 0, "Set playback rate", "Audio", "Set <i>{0}</i> playback rate to <b>{1}</b>", "Set the speed at which a sound plays at.", "SetPlaybackRate");

AddStringParam("Tag", "The tag identifying the sound to stop.  Leave empty to affect the last played sound.");
AddAction(6, 0, "Stop", "Audio", "Stop <b>{0}</b>", "Stop a sound from playing.", "Stop");

AddComboParamOption("Sounds");
AddComboParamOption("Music");
AddComboParam("Folder", "Choose the folder which contains the audio file.");
AddStringParam("Audio file name", "A string with the name of the audio file to play, without the file extension.  For example, to play myfile.ogg, use only \"myfile\".");
AddComboParamOption("not looping");
AddComboParamOption("looping");
AddComboParam("Loop", "Whether or not to initially play the sound in a loop (repeating).", 0, 3);
AddStringParam("Tag (optional)", "A tag, which can be anything you like, to use to reference this sound in future.", "\"\"", 2);
AddAction(7, 0, "Play (by name)", "Audio", "Play <b>{1}</b> {2} from {0} (tag <i>{3}</i>)", "Play an audio file using a string for the filename.", "PlayByName");

AddComboParamOption("silent");
AddComboParamOption("not silent");
AddComboParamOption("toggle silent");
AddComboParam("Mode", "Set whether in silent mode or not.");
AddAction(8, 0, "Set silent", "Audio", "Set {0}", "Set silent mode.  In silent mode all current sounds are muted and no new sounds will play.", "SetSilent");

////ADDED BY JP
AddNumberParam("Cue Point", "Time for the cue point.");
AddAction(9, 0, "Add Time Cue Point", "Audio", "Add Timecue at <b>{0} seconds</b>", "Add a cue point at a given time, in seconds", "addCue");
////*/

//////////////////////////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel


////ADDED BY JP
/*AddExpression(0, ef_return_number, "Get current cue point", "Audio", "currentCuePoint", "Get the current cue number (0-based).");

AddExpression(1, ef_return_number, "Get current time in the audio file", "Audio", "currentTime", "Get the current time in the audio file (0-based).");
*/////
ACESDone();


// Property grid properties for this plugin
var property_list = [
	//new cr.Property(ept_combo,	"Timescale audio",	"Off",	"Choose whether the audio playback rate changes with the time scale.", "Off|On (sounds only)|On (sounds and music)")
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
	return new IDEInstance(instance, this);
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
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
