//from https://gist.github.com/253174
/**
* Detect if the browser can play MP3 audio using native HTML5 Audio.
* Invokes the callack function with first parameter is the boolean success
* value; if that value is false, a second error parameter is passed. This error
* is either HTMLMediaError or some other DOMException or Error object.
* Note the callback is likely to be invoked asynchronously!
* @param {function(boolean, Object|undefined)} callback
*/
function canPlayAudioMP3(callback){
	try {
		var audio = new Audio();
		//Shortcut which doesn't work in Chrome (always returns ""); pass through
		// if "maybe" to do asynchronous check by loading MP3 data: URI
		if(audio.canPlayType('audio/mpeg') == "probably")
			callback(true);

		//If this event fires, then MP3s can be played
		audio.addEventListener('canplaythrough', function(e){
			callback(true);
		}, false);

		//If this is fired, then client can't play MP3s
		audio.addEventListener('error', function(e){
			callback(false, this.error)
		}, false);

		//Smallest base64-encoded MP3 I could come up with (<0.000001 seconds long)
		audio.src = "data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
		audio.load();
	}
	catch(e){
		callback(false, e);
	}
}

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.AudioBase64 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.AudioBase64.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.oggString ='';
		this.mp3String ='';
		this.wavString ='';
		
		//this.audioElement = document.createElement("<audio>");
		this.audioElement = new Audio();
		this.audioElement.id = this.properties[0];
		//this.audioElement.setAttribute("src", "AudioBase64Plugin");
		/*this.oggNode = "<source src='file.ogg' />";
		this.mp3Node = "<source src='file.mp3' />";
		this.wavNode = "<source src='file.wav' />";*/
		this.oggNode = "";
		this.mp3Node = "";
		this.wavNode = "";
		
		/*jQuery('<source>').attr('id', 'mp3Source').appendTo(this.audioElement);  
		jQuery('<source>').attr('id', 'oggSource').appendTo(this.audioElement);  
		jQuery('<source>').attr('id', 'wavSource').appendTo(this.audioElement);  */
		
		
		jQuery('body').append(this.audioElement);
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	// the example condition
	cnds.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.enterMP3AudioString = function (audioString)
	{
		this.mp3String = audioString;

		//this.mp3Node.innerHTML = "<source id='mp3Source' src='"+this.mp3String+"'/>";
		this.audioElement.innerHTML = "";
		this.mp3Node.innerHTML = "<source src='"+this.mp3String+"'/>";
		//this.audioElement.appendChild(this.mp3Node);
		//jQuery(this.audioElement).append(this.mp3Node);
		//jQuery(this.mp3Node).appendTo(this.audioElement);
		//jQuery("#mp3Source").attr('src', this.mp3String);
		jQuery('<source>').attr('src', this.mp3String).appendTo(this.audioElement);  
	};
	
	acts.enterOGGAudioString = function (audioString)
	{
		this.oggString = audioString;
		
		//this.oggNode.innerHTML = "<source id='oggSource' src='"+this.oggString+"'/>";
		this.audioElement.innerHTML = "";
		this.oggNode.innerHTML = "<source src='"+this.oggString+"'/>";
		//this.audioElement.appendChild(this.oggNode);
		//jQuery(this.audioElement).append(this.oggNode);
		//jQuery(this.oggNode).appendTo(this.audioElement);
		//jQuery("#oggSource").attr('src', this.oggString);
		jQuery('<source>').attr('src', this.oggString).appendTo(this.audioElement);  
	};
	
	acts.enterWAVAudioString = function (audioString)
	{
		this.wavString = audioString;

		//this.wavNode.innerHTML = "<source id='wavSource' src='"+this.wavString+"'/>";
		this.audioElement.innerHTML = "";
		this.wavNode.innerHTML = "<source src='"+this.wavString+"'/>";
		//this.audioElement.appendChild(this.wavNode);	
		//jQuery(this.audioElement).append(this.wavNode);		
		//jQuery(this.wavNode).appendTo(this.audioElement);
		//jQuery("#wavSource").attr('src', this.wavString);
		jQuery('<source>').attr('src', this.wavString).appendTo(this.audioElement);  
		
	};
	
	acts.playAudio = function(){
		this.audioElement.play();
	};
	
	acts.preloadAudio = function(){
		this.audioElement.load();
	};
	
	acts.stopAudio = function(){
		this.audioElement.stop();
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());