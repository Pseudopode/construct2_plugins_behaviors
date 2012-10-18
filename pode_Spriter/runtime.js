// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SpriterImport = function(runtime)
{
	this.runtime = runtime;
};
var scmlFileContent ='';
(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SpriterImport.prototype;
		
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
		/*this.scmlFileURL ='';
		this.scmlFileContent ='';
		//this.runtime = pluginProto.runtime;
		this.xmlDoc ='';*/
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		//this.xmlDoc ='';
		this.scmlFileURL ='';
		this.scmlFileContent ='';
		//this.runtime = pluginProto.runtime;
		this.xmlDoc ='';
		this.charName='';
		this.animations = {};
		this.animsNumber = 0; //this.anims.length, in fact
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
	
	cnds.OnComplete = function (tag)
	{
		/*this.scmlFileContent = this.curTag.toLowerCase();
		//return tag.toLowerCase() === this.curTag.toLowerCase();
		acts.xmlizeFile();*/
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	/*// the example action
	acts.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	
	acts.fetchFile = function (url_)
	{
		this.scmlFileURL =url_;
		
		// from the Ajax plugin 
		// Create a context object with the tag name and a reference back to this
		var context_obj = { tag: "Spriter", inst: this };
		// Make the request
		jQuery.ajax({
			context: context_obj,
			dataType: "text",
			url: url_,
			success: function(data) {
				/*this.inst.lastData = data;
				this.inst.curTag = this.tag;*/
				//this.inst.scmlFileContent = data;
				data = data.replace(/(\r\n|\n|\r)/gm,""); //replace all line breaks, greedy (g), and over many lines (m)
				/*data = data.replace(/\t{1,}/g,""); //remove tabs
				//data = data.replace(/\s{2,}/g, ''); //remove duplicates spaces
				data = data.replace(/\\s+/g, ''); //remove duplicates spaces //http://stackoverflow.com/a/3958979*/
				
				scmlFileContent = data;
				//this.runtime.trigger(cr.plugins_.SpriterImport.prototype.cnds.OnComplete, this.inst);
				//return tag.toLowerCase() === this.curTag.toLowerCase();
				//acts.xmlizeFile(this.inst.lastData.toLowerCase());
				// xmlizeFile(this.inst.lastData.toLowerCase(),this);
			},
			error: function() {
				//this.inst.curTag = this.tag;
				//this.inst.scmlFileContent = data;
				scmlFileContent = data;
				//this.inst.runtime.trigger(cr.plugins_.AJAX.prototype.cnds.OnError, this.inst);
			}
		});
		//this.scmFileContent = loadXMLDoc(this.scmlFileURL);
	};
	
	//acts.xmlizeFile = function (str)
	/*instanceProto.*/
	//var xmlizeFile = function (str,plugin)
	acts.parseSCML = function (str)
	{
		//this.scmlFileContent = str;
		//plugin.inst.scmlFileContent = str;
		/* from the XML plugin) */
		var xml, tmp;
		//added
		//xml = this.scmlFileContent;
		//this.xmlDoc = this.scmlFileContent;
		//this.xmlDoc = this.scmlFileContent;
		this.xmlDoc = scmlFileContent;
		//
		try {
			//if (this.runtime.isIE)
			if (cr.runtime.isIE)
			{
				var versions = ["MSXML2.DOMDocument.6.0",
						"MSXML2.DOMDocument.3.0",
						"MSXML2.DOMDocument"];

				for (var i = 0; i < 3; i++){
					try {
						//xml = new ActiveXObject(versions[i]);
						this.xmlDoc = new ActiveXObject(versions[i]);
						
						//if (xml)
						if (this.xmlDoc)
							break;
					} catch (ex){
						//xml = null;
						this.xmlDoc = null;
					}
				}
				
				//if (xml)
				if (this.xmlDoc)
				{
					//xml.async = "false";
					this.xmlDoc.async = "false";
					//xml.loadXML(str);
					this.xmlDoc.loadXML(str);
				}
			}
			else {
				tmp = new DOMParser();
				//xml = tmp.parseFromString(str, "text/xml");
				this.xmlDoc = tmp.parseFromString(str, "text/xml");
			}
		} catch(e) {
			//xml = null;
			this.xmlDoc = null;
		}
		
		//if (xml)
		if (this.xmlDoc)
		{
			//this.xmlDoc = xml;
			
			//if (this.runtime.isIE)
			if (cr.runtime.isIE)
				this.xmlDoc.setProperty("SelectionLanguage","XPath");
		}
		
		//this.charName = this.xmlDoc.childNodes[0].childNodes[0].nodeName.;
		/*for(var i = 0; i < this.xmlDoc.childNodes[0].childNodes.length;i++){
			if(this.xmlDoc.childNodes[0].childNodes[i].nodeName == "char"){
				this.charName = this.xmlDoc.childNodes[0].childNodes[i].textContent;
			}
		}*/
		//this.charName = this.xmlDoc.childNodes[0].childNodes[0].textContent;
		this.charName = this.xmlDoc.getElementsByTagName("name")[0].textContent;
		//this.animNumber = this.xmlDoc.getElementById("name");
		this.animations = [];
		var anims = this.xmlDoc.getElementsByTagName("anim");
		this.animsNumber = anims.length;
		anims = anims[0]; // necessary, to get the number of anim just below right
		
		function Animation() {
			this.name = '';
			this.numberOfFrames = 0;
			this.frames = [];
		}
		
		function Frame(){
			this.name = '';
			this.duration = 0;
		}
		
		//here, we parse the header (i.e. the number of anims, and their frames and names
		for(var i = 0; i < this.animsNumber; i++){
			this.animations[i] = new Animation();
			
			//bring back name of the animation
			var childNodes = anims.childNodes;
			var animName = '';
			for(var i = 0; i < childNodes.length;i++){
				if(childNodes[i].nodeName == "name"){
					animName = childNodes[i].textContent;
					break;
				}
			}
			
			this.animations[i].name = animName; // CA FOIRE ICI !
			this.animations[i].numberOfFrames = jQuery(anims).getElementsByTagName("frame").length;
			for(var j = 0; j < anims[i].numberOfFrames; j++){
				this.animations[i].frames[j] = new Frame();
				this.animations[i].frames[j].name = '';
				this.animations[i].frames[j].duration = '';
			}
		}
	};
	
	acts.importFile = function(url_)
	{	
		acts.fetchFile(url_);	
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.SCMLContent = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_string(this.xmlDoc);	
		/*alert(this.xmlDoc.length); // display 1 =OK 
				alert(this.xmlDoc.childNodes.length); // display 189 = NOT OK
				alert(this.xmlDoc.childNodes); // display object node list --> je pense que c est correct
				alert(this.xmlDoc.childNodes[0]); // display object text --> cela doit correspondre a <aCounty>*/
		/*		alert(this.xmlDoc.childNodes[0].innerHTML); // display nothing (viewbox with nothing inside)
				alert(this.xmlDoc.childNodes[0].nodeValue.length); // display 9 = ?
				alert(this.xmlDoc.childNodes[0].length);*/
		//ret.set_any(this.xmlDoc);	
		//ret.set_any(this.scmlFileContent);	
		ret.set_any(scmlFileContent);	
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	exps.characterName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.charName);	
	};
	exps.animsNumber = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.animsNumber);	
	};
	
	
}());