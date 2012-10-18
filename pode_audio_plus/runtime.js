// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.AudioPlus = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.AudioPlus.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	var audRuntime = null;
	var audInst = null;
	var audTag = "";
	var appPath = "";			// for PhoneGap only
	
	var API_HTML5 = 0;
	var API_WEBAUDIO = 1;
	var API_PHONEGAP = 2;
	var API_APPMOBI = 3;
	var api = API_HTML5;
	var context = null;
	var audioBuffers = [];		// cache of buffers
	var audioInstances = [];	// cache of instances
	var lastAudio = null;
	var useOgg = false;			// determined at create time
	var timescale_mode = 0;
	var silent = false;
	
	var C2AudioBuffer = function (src_, is_music)
	{
		this.src = src_;
		this.myapi = api;
		this.is_music = is_music;
		this.added_end_listener = false;
		
		// If using the Web Audio API, still play music as HTML5 audio since it streams.
		// Otherwise AJAXing the music will not play it until it is completely downloaded.
		if (api === API_WEBAUDIO && is_music)
			this.myapi = API_HTML5;
		
		// may be null until Web Audio API ajax completes
		this.bufferObject = null;
		var request;
		
		switch (this.myapi) {
		case API_HTML5:
			this.bufferObject = new Audio();
			this.bufferObject.autoplay = false;	// this is only a source buffer, not an instance
			this.bufferObject.preload = "auto";
			this.bufferObject.src = src_;
			break;
			
		case API_WEBAUDIO:
			request = new XMLHttpRequest();
			request.open("GET", src_, true);
			request.responseType = "arraybuffer";
			
			request.onload = (function (self) { return function () {
				context["decodeAudioData"](request.response, function (buffer) {
						self.bufferObject = buffer;
						
						if (!cr.is_undefined(self.playTagWhenReady))
						{
							var a = new C2AudioInstance(self, self.playTagWhenReady);
							a.play(self.loopWhenReady);
							audioInstances.push(a);
						}
					});
			}; })(this);
			
			request.send();
			break;
			
		case API_PHONEGAP:
			// Just refer to src instead
			this.bufferObject = true;
			break;
			
		case API_APPMOBI:
			// Just refer to src instead
			this.bufferObject = true;
			break;
		}
		
	};
	
	C2AudioBuffer.prototype.isLoaded = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			// Only indicates can play through to end, assume this is good enough to assume preloaded
			return this.bufferObject["readyState"] === 4;	// HAVE_ENOUGH_DATA
			
		case API_WEBAUDIO:
			return !!this.bufferObject;			// null until AJAX request completes
			
		case API_PHONEGAP:
			// Does not support preloading
			return true;
			
		case API_APPMOBI:
			// Does not support preloading
			return true;
		}
		
		// Should not reach here
		return false;
	};
	
	var C2AudioInstance = function (buffer_, tag_)
	{
		this.tag = tag_;
		this.fresh = true;
		this.stopped = true;
		this.src = buffer_.src;
		this.buffer = buffer_;
		this.myapi = buffer_.myapi;
		this.is_music = buffer_.is_music;
		this.playbackRate = 1;
		this.pgended = true;			// for PhoneGap only: ended flag
		this.resume_me = false;			// make sure resumes when leaving suspend
		this.looping = false;
		
		// Web Audio API only
		this.volume = 1;
		this.mutevol = 1;
		this.startTime = audRuntime.kahanTime.sum;
		
		this.instanceObject = null;
		var add_end_listener = false;
		
		switch (this.myapi) {
		case API_HTML5:
			// For music recycle the buffer audio object
			if (this.is_music)
			{
				this.instanceObject = buffer_.bufferObject;
				add_end_listener = !buffer_.added_end_listener;
				buffer_.added_end_listener = true;
			}
			else
			{
				// Just make a new audio object
				this.instanceObject = new Audio();
				this.instanceObject.autoplay = false;
				this.instanceObject.src = buffer_.bufferObject.src;
				add_end_listener = true;
			}
			
			if (add_end_listener)
			{
				this.instanceObject.addEventListener('ended', (function (self) {
					return function () {
						audTag = self.tag;
						self.stopped = true;
						audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
					};
				})(this));
				this.instanceObject.addEventListener('timeupdate', (function (self) {
					return function () {
						audTag = self.tag;
						audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnTimeUpdated, audInst);
					};
				})(this));
				
			}
			
			break;
		case API_WEBAUDIO:
			// If the buffer is ready, make a new sound instance
			if (buffer_.bufferObject)
			{
				this.instanceObject = context["createBufferSource"]();
				this.instanceObject["buffer"] = buffer_.bufferObject;
				this.instanceObject["connect"](context["destination"]);
			}
			break;
		case API_PHONEGAP:
			
			// Create new Media object.  Include full path to the media file.		
			this.instanceObject = new window["Media"](appPath + this.src, null, null, (function (self) {
				return function (status) {
					if (status === window["Media"]["MEDIA_STOPPED"])
					{
						self.pgended = true;
						self.stopped = true;
						audTag = self.tag;
						audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
					}
				};
			})(this));
			
			break;
			
		case API_APPMOBI:
			// Ridiculously simple API, only uses src
			this.instanceObject = true;
			break;
		}
	};
	
	C2AudioInstance.prototype.hasEnded = function ()
	{
		// Only HTML5 audio has an actual ended property, rest have to go by duration.
		switch (this.myapi) {
		case API_HTML5:
			return this.instanceObject.ended;
		case API_WEBAUDIO:
		
			// looping - won't end
			if (!this.fresh && !this.stopped && this.instanceObject["loop"])
				return false;
				
			return (audRuntime.kahanTime.sum - this.startTime) > this.buffer.bufferObject["duration"];
			
		case API_PHONEGAP:
			return this.pgended;
			
		case API_APPMOBI:
			true;	// recycling an AppMobi sound does not matter because it will just do another throwaway playSound
		}
		
		// should not reach here
		return true;
	};
	
	C2AudioInstance.prototype.canBeRecycled = function ()
	{
		if (this.fresh || this.stopped)
			return true;		// not yet used or is not playing
			
		return this.hasEnded();
	};
	
	C2AudioInstance.prototype.play = function (looping)
	{
		var instobj = this.instanceObject;
		this.looping = looping;
		
		switch (this.myapi) {
		case API_HTML5:
			
			// restore defaults
			
			if (instobj.playbackRate !== 1.0)
				instobj.playbackRate = 1.0;
				
			if (instobj.volume !== 1.0)
				instobj.volume = 1.0;
				
			if (instobj.loop !== looping)
				instobj.loop = looping;
				
			if (instobj.muted)
				instobj.muted = false;
			
			// sound was stopped: make sure it's wound back
			if (!this.fresh && this.stopped && instobj.currentTime !== 0)
			{
				// no idea why this sometimes throws
				try {
					instobj.currentTime = 0;
				}
				catch (err)
				{
					log("Exception rewinding audio: " + err);
				}
			}
			
			this.instanceObject.play();
				
			break;
		case API_WEBAUDIO:
			this.muted = false;
			this.volume = 1;
			this.mutevol = 1;
			
			// buffer sources are one-shot - make a new object second time around
			if (!this.fresh)
			{
				this.instanceObject = context["createBufferSource"]();
				this.instanceObject["buffer"] = this.buffer.bufferObject;
				this.instanceObject["connect"](context["destination"]);
			}
			
			this.instanceObject.loop = looping;
			this.instanceObject["noteOn"](0);
			break;
		case API_PHONEGAP:

			if (!this.fresh && this.stopped)
				instobj["seekTo"](0);
				
			instobj["play"]();
			this.pgended = false;
			
			break;
			
		case API_APPMOBI:
		
			// only supports one shot throwaway sounds
			if (audRuntime.isDirectCanvas)
				AppMobi["context"]["playSound"](this.src);
			else
				AppMobi["player"]["playSound"](this.src);
				
			break;
		}
		
		this.playbackRate = 1;
		
		this.startTime = audRuntime.kahanTime.sum;
		this.fresh = false;
		this.stopped = false;
	};
	
	C2AudioInstance.prototype.stop = function ()
	{
		switch (this.myapi) {
		case API_HTML5:
			if (!this.instanceObject.paused)
				this.instanceObject.pause();
			break;
		case API_WEBAUDIO:
			this.instanceObject["noteOff"](0);
			break;
		case API_PHONEGAP:
			this.instanceObject["stop"](); 
			break;
		case API_APPMOBI:
			// not supported
			break;
		}
		
		this.stopped = true;
	};
	
	C2AudioInstance.prototype.setVolume = function (v)
	{
		switch (this.myapi) {
		case API_HTML5:
			// ff 3.6 doesn't seem to have this property
			if (this.instanceObject.volume && this.instanceObject.volume !== v)
				this.instanceObject.volume = v;
			break;
		case API_WEBAUDIO:
			this.volume = v;
			this.instanceObject["gain"]["value"] = v * this.mutevol;
			break;
		case API_PHONEGAP:
			// not supported
			break;
		case API_APPMOBI:
			// not supported
			break;
		}
	};
	
	C2AudioInstance.prototype.setMuted = function (m)
	{
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.muted !== !!m)
				this.instanceObject.muted = !!m;
			break;
		case API_WEBAUDIO:
			this.mutevol = (m ? 0 : 1);
			this.instanceObject["gain"]["value"] = this.volume * this.mutevol;
			break;
		case API_PHONEGAP:
			// not supported
			break;
		case API_APPMOBI:
			// not supported
			break;
		}
	};
	
	C2AudioInstance.prototype.setLooping = function (l)
	{
		this.looping = l;
		
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.loop !== !!l)
				this.instanceObject.loop = !!l;
			break;
		case API_WEBAUDIO:
			if (this.instanceObject.loop !== !!l)
				this.instanceObject.loop = !!l;
			break;
		case API_PHONEGAP:
			// not supported
			break;
		case API_APPMOBI:
			// not supported
			break;
		}
	};
	
	C2AudioInstance.prototype.setPlaybackRate = function (r)
	{
		this.playbackRate = r;
		
		this.updatePlaybackRate();
	};
	
	C2AudioInstance.prototype.updatePlaybackRate = function ()
	{
		var r = this.playbackRate;
		
		if ((timescale_mode === 1 && !this.is_music) || timescale_mode === 2)
			r *= audRuntime.timescale;
			
		switch (this.myapi) {
		case API_HTML5:
			if (this.instanceObject.playbackRate !== r)
				this.instanceObject.playbackRate = r;
			break;
		case API_WEBAUDIO:
			if (this.instanceObject["playbackRate"]["value"] !== r)
				this.instanceObject["playbackRate"]["value"] = r;
			break;
		case API_PHONEGAP:
			// not supported
			break;
		case API_APPMOBI:
			// not supported
			break;
		}
	};
	
	C2AudioInstance.prototype.setSuspended = function (s)
	{
		switch (this.myapi) {
		case API_HTML5:
			if (s)
			{
				// Pause if playing
				if (!this.fresh && !this.stopped)
				{
					this.instanceObject["pause"]();
					this.resume_me = true;
				}
				else
					this.resume_me = false;
			}
			else
			{
				if (this.resume_me)
					this.instanceObject["play"]();
			}
			
			break;
		case API_WEBAUDIO:
		
			if (s)
			{
				// note off if playing
				if (!this.fresh && !this.stopped)
				{
					this.instanceObject["noteOff"](0);
					this.resume_me = true;
				}
				else
					this.resume_me = false;
			}
			else
			{
				// Can't easily resume from last location... so just play again
				if (this.resume_me)
				{
					this.instanceObject = context["createBufferSource"]();
					this.instanceObject["buffer"] = this.buffer.bufferObject;
					this.instanceObject["connect"](context["destination"]);
					this.instanceObject.loop = this.looping;
					this.instanceObject["noteOn"](0);
				}					
			}
			
			break;
		case API_PHONEGAP:
		
			if (s)
			{
				// Pause if playing
				if (!this.fresh && !this.stopped)
				{
					this.instanceObject["pause"]();
					this.resume_me = true;
				}
				else
					this.resume_me = false;
			}
			else
			{
				if (this.resume_me)
					this.instanceObject["play"]();
			}
			
			break;
			
		case API_APPMOBI:
			// not supported
			break;
		}
	};
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		audRuntime = this.runtime;
		audInst = this;
		
		// Use APIs in order:
		// Always use Web Audio API if supported
		// Then PhoneGap Media if Web Audio API not supported and in PhoneGap
		// Then AppMobi player if Web Audio API not supported and in AppMobi
		// Then leave default (HTML5)
		
		context = null;

		if (typeof AudioContext !== "undefined")
		{
			api = API_WEBAUDIO;
			context = new AudioContext();
		}
		else if (typeof webkitAudioContext !== "undefined")
		{
			api = API_WEBAUDIO;
			context = new webkitAudioContext();
		}
			
		if (api !== API_WEBAUDIO)
		{
			if (this.runtime.isPhoneGap)
				api = API_PHONEGAP;
			else if (this.runtime.isAppMobi)
				api = API_APPMOBI;
			// else leave as HTML5
		}
		
		// PhoneGap needs to know where to find files
		if (api === API_PHONEGAP)
		{
			appPath = location.href;
			
			var i = appPath.lastIndexOf("/");
			
			if (i > -1)
				appPath = appPath.substr(0, i + 1);
				
			appPath = appPath.replace("file://", "");
		}
		
		// Determine whether to use OGG
		if (this.runtime.isDirectCanvas)
			useOgg = this.runtime.isAndroid;		// AAC on iOS, OGG on Android
		else
			useOgg = !!(new Audio().canPlayType('audio/ogg; codecs="vorbis"'));
		
		switch (api) {
		case API_HTML5:
			log("Using HTML5 Audio API");
			break;
		case API_WEBAUDIO:
			log("Using Web Audio API");
			break;
		case API_PHONEGAP:
			log("Using PhoneGap Audio API");
			break;
		case API_APPMOBI:
			log("Using AppMobi Player API");
			break;
		default:
			assert2("Unknown audio API");
		}
		
		// Tick to fire 'on ended' for Web Audio API/PhoneGap, and keep timescale up to date
		this.runtime.tickMe(this);
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function ()
	{
		timescale_mode = this.properties[0];	// 0 = off, 1 = sounds only, 2 = all
		
		this.runtime.addSuspendCallback(function(s)
		{
			audInst.onSuspend(s);
		});
		
		////ADDED BY JP
		this.currCue = 0;
		this.cues = [];
		this.numberOfCues = 0;
		this.currentTime = 0;
		this.startTime = 0;
		this.isPlaying = false;
		////
	};
	
	instanceProto.onSuspend = function (s)
	{
		var i, len;
		for (i = 0, len = audioInstances.length; i < len; i++)
			audioInstances[i].setSuspended(s);
	};
	
	instanceProto.tick = function ()
	{
		// Check for audio instances which have finished and trigger OnEnded as appropriate
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			
			// HTML5 audio can fire events automatically, only necessary for Web Audio API/PhoneGap
			// Not supported on AppMobi, can't get sound duration
			if (a.myapi !== API_HTML5 && a.myapi !== API_APPMOBI)
			{
				if (!a.fresh && !a.stopped && a.hasEnded())
				{
					a.stopped = true;
					audTag = a.tag;
					audRuntime.trigger(cr.plugins_.Audio.prototype.cnds.OnEnded, audInst);
				}
				
			}
			
			// Update time scales
			if (timescale_mode !== 0)
				a.updatePlaybackRate();
		}
		
		this.currentTime = this.getNowTime() - this.startTime;
	};
	
	instanceProto.getNowTime = function()
	{
		return (Date.now() - this.runtime.start_time) / 1000.0;
	};
	
	// find an existing audio buffer for the given source, else create a new one and return that
	instanceProto.getAudioBuffer = function (src_, is_music)
	{
		var i, len, a;
		
		// Try to find existing buffer with same source
		for (i = 0, len = audioBuffers.length; i < len; i++)
		{
			a = audioBuffers[i];
			
			if (a.src === src_)
				return a;
		}
		
		// Couldn't find it - add a new one and return it.
		a = new C2AudioBuffer(src_, is_music);
		audioBuffers.push(a);
		return a;
	};
	
	instanceProto.getAudioInstance = function (src_, tag, is_music, looping)
	{
		var i, len, a;
		
		// Try to find existing recyclable instance from the same source
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			
			if (a.src === src_ && a.canBeRecycled())
			{
				a.tag = tag;
				return a;
			}
		}
		
		// Otherwise create a new instance
		var b = this.getAudioBuffer(src_, is_music);
		
		// Not yet ready
		if (!b.bufferObject)
		{
			// Play once received
			if (tag !== "<preload>")
			{
				b.playTagWhenReady = tag;
				b.loopWhenReady = looping;
			}
				
			return null;
		}
			
		a = new C2AudioInstance(b, tag);
		audioInstances.push(a);
		return a;
	};
	
	var taggedAudio = [];
	
	instanceProto.getAudioByTag = function (tag)
	{
		taggedAudio.length = 0;
		
		// Empty tag: return last audio, if playing
		if (!tag.length)
		{
			if (!lastAudio || lastAudio.hasEnded())
				return;
			else
			{
				taggedAudio.length = 1;
				taggedAudio[0] = lastAudio;
				return;
			}
		}
		
		var i, len, a;
		for (i = 0, len = audioInstances.length; i < len; i++)
		{
			a = audioInstances[i];
			
			if (tag.toLowerCase() === a.tag.toLowerCase())
				taggedAudio.push(a);
		}
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	cnds.OnEnded = function (t)
	{
		return audTag.toLowerCase() === t.toLowerCase();
	};
	
	cnds.OnTimeUpdated = function (t)
	{
		return audTag.toLowerCase() === t.toLowerCase();
	};
	
	cnds.PreloadsComplete = function ()
	{
		var i, len;
		for (i = 0, len = audioBuffers.length; i < len; i++)
		{
			if (!audioBuffers[i].isLoaded())
				return false;
		}
		
		return true;
	};

	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.Play = function (file, looping, tag)
	{
		if (silent)
			return;
			
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0);
		
		if (!lastAudio)
			return;
		
		lastAudio.play(looping!==0);
		
		this.currentTime = this.getNowTime();
		
		////ADDED BY JP
		this.isPlaying = true;
		this.startTime = this.getNowTime();
		////
	};
	
	acts.PlayByName = function (folder, filename, looping, tag)
	{
		if (silent)
			return;
			
		var is_music = (folder === 1);
		var src = this.runtime.files_subfolder + filename.toLowerCase() + (useOgg ? ".ogg" : ".m4a");
		lastAudio = this.getAudioInstance(src, tag, is_music, looping!==0);
		
		if (!lastAudio)
			return;
		
		lastAudio.play(looping!==0);
	};
	
	acts.SetLooping = function (tag, looping)
	{
		this.getAudioByTag(tag);
		
		// 0 = enable looping, 1 = disable looping
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setLooping(looping === 0);
	};
	
	acts.SetMuted = function (tag, muted)
	{
		this.getAudioByTag(tag);
		
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setMuted(muted === 0);
	};
	
	acts.SetVolume = function (tag, vol)
	{
		this.getAudioByTag(tag);
		
		// Convert dB to linear scale
		var v = Math.pow(10, vol / 20);
		if (v < 0)
			v = 0;
		if (v > 1)
			v = 1;
		
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setVolume(v);
	};
	
	acts.Preload = function (file)
	{
		if (silent)
			return;
			
		var is_music = file[1];
		var src = this.runtime.files_subfolder + file[0] + (useOgg ? ".ogg" : ".m4a");
		
		// Using AppMobi - redirect to loadSound
		if (api === API_APPMOBI)
		{
			AppMobi["player"]["loadSound"](src);
			return;
		}
		else if (api === API_PHONEGAP)
		{
			// can't preload with PhoneGap's Media API
			return;
		}
		
		// Otherwise just request the object without doing anything to it - will be added to the caches
		this.getAudioInstance(src, "<preload>", is_music, false);
	};
	
	acts.SetPlaybackRate = function (tag, rate)
	{
		this.getAudioByTag(tag);
		
		// Only support forwards playback
		if (rate < 0.0)
			rate = 0;
			
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].setPlaybackRate(rate);
	};
	
	acts.Stop = function (tag)
	{
		this.getAudioByTag(tag);
		
		var i, len;
		for (i = 0, len = taggedAudio.length; i < len; i++)
			taggedAudio[i].stop();
			
		////ADDED BY JP
		this.isPlaying = false;
		////			
	};
	
	acts.SetSilent = function (s)
	{
		var i, len;
		
		if (s === 2)					// toggling
			s = (silent ? 1 : 0);		// choose opposite state
		
		if (s === 0 && !silent)			// setting silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setMuted(true);
			
			silent = true;
		}
		else if (s === 1 && silent)		// setting not silent
		{
			for (i = 0, len = audioInstances.length; i < len; i++)
				audioInstances[i].setMuted(false);
			
			silent = false;
		}
	};

	////ADDED BY JP
	acts.addCue = function (timecue)
	{
		this.cues[this.numberOfCues] = timecue;
		this.numberOfCues++;
	};
	////
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.currentCuePoint = function (ret)
	{
		ret.set_int(this.currCue);
	};
	
	exps.currentTime = function (ret)
	{
		ret.set_float(this.currentTime);
	};
	
}());