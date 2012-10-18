// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.Recolor = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.Recolor.prototype;
		
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
		this.rgbks = [];
		this.imgBase = new Image();
        //this.imgBase.src = this.object.animations[0].frames[0].texture_img.src;
		this.imgBase.onload = (function (self) {
			return function(info) {
				self.generateRGBKs(info.target);
				//self.runtime.trigger(cr.plugins_.GLFXC2.prototype.cnds.onEffectApplied, self);
			};
		})(this);
		this.imgBase.src = this.inst.type.animations[0].frames[0].texture_img.src;
		
		this.imgTinted = new Image();
        //this.imgBase.src = this.object.animations[0].frames[0].texture_img.src;
		this.imgTinted.onload = (function (self) {
			return function(info) {
				//self.generateRGBKs(info.target);
				self.pasteBack(info);
				self.runtime.trigger(cr.behaviors.Recolor.prototype.cnds.onTinted, self);
			};
		})(this);

		this.imgString = '';
		
		//acts.generateRGBKs(this.object.animations[0].frames[0].texture_img.src);
		//acts.generateRGBKs(this.imgBase);
	};

	behinstProto.pasteBack = function(info){
		//this.object.animations[0].frames[0].texture_img.src = this.imgTmp.src;
		//var tmp1 = this.inst.cur_animation.texture_img;
		//var tmp = this.inst.cur_animation.frames[0];
		//var tmp2 = tmp.texture_img;
		this.inst.cur_animation.frames[0].texture_img.src = this.imgString;
		/*this.img.src = info.target.src;
		this.base64texture = this.img.src;*/
		//this.object.type.texture_img.src = myparam;
		/*this.ctx.drawImage(this.object.animations[0].frames[0].texture_img);*/
		this.runtime.redraw = true;
	};
	
	//acts.generateTintImage = function( img, rgbks, red, green, blue ) {
	behinstProto.generateTintImage = function(red, green, blue ) {
        var buff = document.createElement( "canvas" );
        /*buff.width  = img.width;
        buff.height = img.height;*/
		buff.width  = this.imgBase.width;
        buff.height = this.imgBase.height;

        var ctx_  = buff.getContext("2d");

        ctx_.globalAlpha = 1;
        ctx_.globalCompositeOperation = 'copy';
        ctx_.drawImage( this.rgbks[3], 0, 0 );

        ctx_.globalCompositeOperation = 'lighter';
        if ( red > 0 ) {
            ctx_.globalAlpha = red   / 255.0;
            ctx_.drawImage( this.rgbks[0], 0, 0 );
        }
        if ( green > 0 ) {
            ctx_.globalAlpha = green / 255.0;
            ctx_.drawImage( this.rgbks[1], 0, 0 );
        }
        if ( blue > 0 ) {
            ctx_.globalAlpha = blue  / 255.0;
            ctx_.drawImage( this.rgbks[2], 0, 0 );
        }

        //return buff;
		return buff.toDataURL();
    }
	
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	behinstProto.generateRGBKs = function ( img ) {
        var w = img.width;
        var h = img.height;
        //var rgbks = [];

        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        var ctx_ = canvas.getContext("2d");
        ctx_.drawImage( img, 0, 0 );

        var pixels = ctx_.getImageData( 0, 0, w, h ).data;

        // 4 is used to ask for 3 images: red, green, blue and
        // black in that order.
        for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
            var canvas = document.createElement("canvas");
            canvas.width  = w;
            canvas.height = h;

            var ctx2 = canvas.getContext('2d');
            ctx2.drawImage( img, 0, 0 );
            var to = ctx2.getImageData( 0, 0, w, h );
            var toData = to.data;

            for (
                    var i = 0, len = pixels.length;
                    i < len;
                    i += 4
            ) {
                toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                toData[i+3] =                pixels[i+3]    ;
            }

            ctx2.putImageData( to, 0, 0 );

            // image is _slightly_ faster then canvas for this, so convert
            var imgComp = new Image();
            imgComp.src = canvas.toDataURL();

            this.rgbks.push( imgComp );
        }

        //return rgbks;
    }
	
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

	cnds.onTinted = function(){
		return true;
	}
	
	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	// the example action
	acts.Stop = function ()
	{
		// ... see other behaviors for example implementations ...
	};
	
	
	
	acts.colorize = function(red,green,blue){
		//var imgString = behinstProto.generateTintImage(red,green,blue);
		/*var img = new Image();
		img.onload = function() {
			var tintImg = behinstProto.generateTintImage(rgbks, 200, 50, 100 );

			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect( 0, 0, 100, 100 );

			ctx.drawImage( tintImg, 50, 50 );
		}
		img.src = '';*/
		
		this.imgString = this.generateTintImage(red,green,blue);
		/*this.inst.type.animations[0].frames[0].texture_img.src = imgString;
		//this.inst.type.animations[0].frames[0].texture_img.src = img;
		var imgTmp = new Image();
		imgTmp.onload = function(){
			alert('meuh');
		};
		imgTmp.src = imgString;*/
		//jQuery('body').append("<img src='"+this.imgString+"'></img>");
		//jQuery('body').append(imgTmp);*/
		//this.pasteBack();
		this.imgTinted.src = this.imgString;
		this.runtime.redraw = true;
	};
	
	/*acts.pasteBack = function(){
		//this.object.animations[0].frames[0].texture_img.src = this.imgTmp.src;
		//this.inst.type.animations[0].frames[0].texture_img.src = this.imgString;
		this.inst.cur_animation[0].frames[0].texture_img.src = this.imgTinted.src;
		//this.object.type.texture_img.src = myparam;
		this.runtime.redraw = true;
	};*/
	acts.reset = function(){
		//this.object.animations[0].frames[0].texture_img.src = this.imgTmp.src;
		//this.inst.type.animations[0].frames[0].texture_img.src = this.imgString;
		this.inst.cur_animation[0].frames[0].texture_img.src = this.imgBase.src;
		//this.object.type.texture_img.src = myparam;
		this.runtime.redraw = true;
	};
	
	acts.freeMemory = function(){
		//this.object.animations[0].frames[0].texture_img.src = this.imgTmp.src;
		//this.inst.type.animations[0].frames[0].texture_img.src = this.imgString;
		this.inst.cur_animation[0].frames[0].texture_img.src = this.imgBase.src;
		//this.object.type.texture_img.src = myparam;
		this.runtime.redraw = true;
	};
	
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
}());