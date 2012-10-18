// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.imageEffects = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.imageEffects.prototype;
		
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
		this.cvs = document.createElement("canvas");
		this.ctx = this.cvs.getContext('2d');
		//jQuery('body').append(this.cvs);
		this.tmpImg = new Image();
		
		/*this.runtime.wait_for_textures.push(this.inst.type.animations[0].frames[0].texture_img);*/
		//this.inst.type.plugin.__proto__.acts.SetVisible(false);
		//this.inst.type.plugin.__proto__.acts.SetVisible(true);
		//this.base64String = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
		
		//this.base64String = "data:image/gif;base64,";
		this.base64String = "";

		
		this.savedImage = ''; //representing the initial image, saved before any effect has been applied
		
		this.lastEffect = '';
		//////
		// SEPIA EFFECT
		/////
		// set of sepia colors
		this.sepiaR = [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];
		this.sepiaG = [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255];
		this.sepiaB = [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199];

		// noise value
		this.sepiaNoise = 20;
		
		//////
		// BLUR EFFECT
		/////
		this.blurAmount = 3;
		
		//////
		// COLOR TINT EFFECT
		/////
		this.Rcorrection = 0.3;
		this.Gcorrection = 0.3;
		this.Bcorrection = 0.3;
		
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	// the example condition
	cnds.OnEffectDone = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};

	cnds.OnCurrentSaved = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};
	
	/*cnds.OnTextWritten = function (foo)
	{
		//alert(foo);
		//this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src = this.base64string;
		return true;
	};*/
	
	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	// the example action
	acts.writeText = function (color,font,baseline,X,Y,str)
	{

		this.fillStyle    = color;
		this.font         = font;
		this.textBaseline = baseline;
		this.textX = X;
		this.textY = Y;
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		
		var fillStyle    = this.fillStyle;
		var font         = this.font;
		var textBaseline = this.textBaseline;
		var textX = this.textX;
		var textY = this.textY;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			ctx.fillStyle    = fillStyle;
			ctx.font         = font;
			ctx.textBaseline = textBaseline;
			ctx.fillText  (str, textX, textY);
					
			base64str = cvs.toDataURL("image/png");
					
			img.onload = (function(self) {
				return function() {
					inst.set_bbox_changed();
					cr.runtime.redraw = true;
				};
			})(this);
			
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};

	acts.grayscale = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			var grayscale;
			for (var i=0; i < data.length; i+=4) {
				//var grayscale = (data[i]*0.33 + data[i+1]*0.33 + data[i+2]*0.33);
				//here's a better grayscale approximation :
				grayscale = (data[i] * 0.21) + (data[i+1] * 0.71) + (data[i+2] * 0.07);
				data[i]   = grayscale; // red
				data[i+1] = grayscale; // green
				data[i+2] = grayscale; // blue
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	acts.simpleblur = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var iBlurRate = vars.blurAmount;
			var iW = img.width;
			var iMW;
			var iSumOpacity,iSumRed,iSumGreen,iSumBlue,iCnt,aCloseData;
			for (var br = 0; br < iBlurRate; br += 1) {
				for (var i = 0, n = data.length; i < n; i += 4) {
		 
					iMW = 4 * iW;
					iSumOpacity = iSumRed = iSumGreen = iSumBlue = 0;
					iCnt = 0;
		 
					// data of close pixels (from all 8 surrounding pixels)
					aCloseData = [
						i - iMW - 4, i - iMW, i - iMW + 4, // top pixels
						i - 4, i + 4, // middle pixels
						i + iMW - 4, i + iMW, i + iMW + 4 // bottom pixels
					];
		 
					// calculating Sum value of all close pixels
					for (var e = 0; e < aCloseData.length; e += 1) {
						if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
							iSumOpacity += data[aCloseData[e]];
							iSumRed += data[aCloseData[e] + 1];
							iSumGreen += data[aCloseData[e] + 2];
							iSumBlue += data[aCloseData[e] + 3];
							iCnt += 1;
						}
					}
		 
					// apply average values
					data[i] = (iSumOpacity / iCnt);
					data[i+1] = (iSumRed / iCnt);
					data[i+2] = (iSumGreen / iCnt);
					data[i+3] = (iSumBlue / iCnt);
				}
			}
			
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	acts.recolor = function (Rcorrection,Gcorrection,Bcorrection)
	{
		this.Rcorrection = Rcorrection;
		this.Gcorrection = Gcorrection;
		this.Bcorrection = Bcorrection;
		
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			
			for (var i=0; i < data.length; i+=4) {
				data[i]   = data[i] * vars.Rcorrection; // red
				data[i+1] = data[i+1] * vars.Gcorrection; // green
				data[i+2] = data[i+2] * vars.Bcorrection; // blue
			}
			
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};

	acts.sepia = function ()
	{
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;

		this.cvs.width=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.width;
		this.cvs.height=this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.height;		

		var ctx = this.ctx;
		var inst = this.inst;
		var cvs = this.cvs;
		var tmpImg = this.tmpImg;
		var base64str = this.base64string;
		var vars = this.inst.behavior_insts[0];
		
		this.tmpImg.onload = function(){
			ctx.drawImage(tmpImg, 0, 0,tmpImg.width,tmpImg.height);
			
			var imageData = ctx.getImageData(0,0,cvs.width,cvs.height);
			var data = imageData.data; //speed up the var access
			
			for (var i=0; i < data.length; i+=4) {

				// change image colors
				data[i] = vars.sepiaR[data[i]];
				data[i+1] = vars.sepiaG[data[i+1]];
				data[i+2] = vars.sepiaB[data[i+2]];

				// apply noise
				if (vars.noise > 0) {
					vars.noise = Math.round(vars.noise - Math.random() * vars.noise);

					for(var j=0; j<3; j++){
						var iPN = vars.noise + data[i+j];
						data[i+j] = (iPN > 255) ? 255 : iPN;
					}
				}
			}
			//write back the pixels
			ctx.putImageData(imageData, 0, 0);
			
			base64str = cvs.toDataURL("image/png");

			img.onload = (function(self) {
				return function() {
					//inst.visible = true;
					inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnEffectDone, inst);
					cr.runtime.redraw = true;
				};
			})(this);
			
			//inst.visible = false;
			img.src = base64str;
		};

		this.tmpImg.src = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;	
	};
	
	acts.reset = function ()
	{		
		this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src = this.savedImage;
		this.inst.set_bbox_changed();
		this.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnEffectDone, this.inst);
		cr.runtime.redraw = true;
	};
	
	acts.saveCurrentImage = function ()
	{
		var inst = this.inst;
		this.savedImage.onload = (function(self) {
				return function() {
					//inst.visible = true;
					//inst.set_bbox_changed();
					//cr.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnComplete, self);
					//inst.type.plugin.runtime.__proto__.draw(inst.type.plugin.runtime.ctx);
					inst.runtime.trigger(cr.behaviors.imageEffects.prototype.cnds.OnCurrentSaved, inst);
					//cr.runtime.redraw = true;
				};
			})(this);	
	
		this.savedImage = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img.src;
	};
	
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	exps.savedImageAsBase64String = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(this.savedImage);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
}());