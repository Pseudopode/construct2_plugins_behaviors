// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.extractImage = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.extractImage.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.myProperty = this.properties[0];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
		this.base64ImageString ='';
		this.canvasSprite = document.createElement("canvas");
				
		this.ctxSprite = this.canvasSprite.getContext("2d");
		this.dataURL = '';
		
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	//I use that all the image. Technique available online from various
	//places, like http://stackoverflow.com/a/934925
	//(http://stackoverflow.com/questions/934012/get-image-data-in-javascript)
	/*behinstProto.getBase64Image = function(img) {
    // Create an empty canvas element
		//var canvas = document.createElement("canvas");
		//canvas.width = img.width;
		//canvas.height = img.height;

		// Copy the image contents to the canvas
		

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to
		// guess the original format, but be aware the using "image/jpg"
		// will re-encode the image.
		//var dataURL = canvas.toDataURL("image/png");

		//return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}*/
	
	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	// the example condition
	cnds.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	// the example action
	acts.Stop = function ()
	{
		// ... see other behaviors for example implementations ...
	};

	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	exps.currentImage = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		this.canvasSprite.width = this.inst.cur_animation.frames[this.inst.cur_frame].texture_img.width;
		this.canvasSprite.height = this.inst.cur_animation.frames[this.inst.cur_frame].texture_img.height;
		//this.ctxSprite.drawImage(this.inst.cur_animation.frames[this.inst.cur_frame].texture_img.src, 0, 0);
		this.ctxSprite.drawImage(this.inst.cur_animation.frames[this.inst.cur_frame].texture_img, 0, 0);
		this.dataURL = this.canvasSprite.toDataURL("image/png");
		this.dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
		//this.cur_animation.frames[this.cur_frame]
		//var tmp = this.inst.cur_animation.frames[this.inst.cur_frame].texture_img.src;
		ret.set_string(this.dataURL);
	};
	
}());