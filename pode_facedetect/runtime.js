// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

////

//var faceDetected = false;
//var noFaceDetected = false;

var triggerFaceDetected = function(){
	cr.runtime.prototype.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected, cr);
};

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.Pode_FaceDetect = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.Pode_FaceDetect.prototype;
		
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
		this.done = false; //to avoid ticking all the time when no detection has been started
		this.detectionDone = false;
		this.faceDetected = false;
		this.noFaceDetected = false;
				
		this.facePosX = -1;
		this.facePosY = -1;
		this.faceWidth = -1;
		this.faceHeight = -1;
		this.faceConfidence = -1;
		
		/*this.originalImgWidth = this;
		this.originalImgHeight = this;*/
		
		//base64 string of the last detected face
		this.faceCrop = '';
		this.leftCrop = 15;
		this.upCrop = 15;
		this.widthCrop = 15;
		this.heightCrop = 15;
		
		this.htmlID = this.inst.uid;
		
		
		this.runtime.tickMe(this);
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
		//if(faceDetected == true && this.done == false && detectionDone == true){
		if(this.faceDetected == true && this.done == false && this.detectionDone == true){
			this.runtime.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected, this.inst);
			//triggerFaceDetected();
			this.done = true;
			this.runtime.untickMe(this);
		}
		//if(noFaceDetected == true && this.done == false && detectionDone == true){
		if(this.noFaceDetected == true && this.done == false && this.detectionDone == true){
			this.runtime.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onNoFaceDetected, this.inst);
			//triggerFaceDetected();
			this.done = true;
			this.runtime.untickMe(this);
		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};
	/*Cnds.prototype.onFaceDetected = function ()
	{
		// ... see other behaviors for example implementations ...
		return true;
	};*/
	
	// ... other conditions here ...
	
	behaviorProto.cnds = new Cnds();

	//tmp old way
	var cnds = behaviorProto.cnds;
	cnds.onDetectionFinished = function ()
	{
		// ... see other behaviors for example implementations ...
		//cr.runtime.prototype.untickMe(this);
		//cr;
		//this.runtime.untickMe(this);
		//detectionDone = true;
		this.detectionDone = true;
		return true;
	};
	
	cnds.onFaceDetected = function ()
	{
		// ... see other behaviors for example implementations ...
		//cr.runtime.prototype.untickMe(this);
		//cr;
		//faceDetected = true;
		//this.runtime.untickMe(this);
		return true;
	};
	
	cnds.onNoFaceDetected = function ()
	{
		// ... see other behaviors for example implementations ...
		//cr.runtime.prototype.untickMe(this);
		//cr;
		//noFaceDetected = true;
		//this.runtime.untickMe(this);
		return true;
	};
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	/*Acts.prototype.Stop = function ()
	{
		// ... see other behaviors for example implementations ...
	};*/
	
//from https://gist.github.com/702799
function CroppedImage(image,sx,sy,sw,sh){
	this.image = image;
	this.sx = sx;
	this.sy = sy;
	this.sw = sw;
	this.sh = sh;
}

CroppedImage.prototype.draw = function(context,x,y){
	context.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, x, y, this.sw, this.sh)
}
				
	Acts.prototype.detectFace = function (left,up/*,width,height*/)
	{
		this.leftCrop = left;
		this.upCrop = up;
		/*this.widthCrop = width;
		this.heightCrop = height;*/
	
		this.facePosX = -1;
		this.facePosY = -1;
		this.faceWidth = -1;
		this.faceHeight = -1;
		this.faceConfidence = -1;
		this.faceCrop = '';
		this.runtime.tickMe(this);
		this.done = false;
		
		//detectionDone = false;
		this.detectionDone = false;
		this.faceDetected = false;
		this.noFaceDetected = false;
		// ... see other behaviors for example implementations ...
		var img = this.inst.type.animations[0].frames[this.inst.cur_frame].texture_img;
		//jQuery("body").append(img);
		var myImg = document.createElement("img");
		myImg.id = "myImg"+this.htmlID;
		myImg.style.top = "-1000px";
		myImg.style.left = "-1000px";
		myImg.style.position = "absolute";
		jQuery("body").append(myImg);
		
		//temp, to hold the vars
		var coords_ = this;
		
		myImg.onload = function(){
			/*var coords = jQuery('#myImg').faceDetection();
			alert(coords);*/
			//var coords = jQuery('#myImg').faceDetection({
			var tmpId = "#"+myImg.id;
			var coords = jQuery(tmpId)["faceDetection"]({
				/*complete:function(img, coords) {
					//$this.text('Done!');
					//alert("Done!"+this.behavior);
					//this.behavior.Pode_FaceDetect.prototype.cnds.__proto__.onFaceDetected();
					//cr.runtime.prototype.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected, cr);
					//cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected();
					faceDetected = true;
					//cr.runtime.prototype.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected, cr);*
					//triggerFaceDetected();
				},*/
				complete:/*cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected*/function(img, coords) {},
				error:/*function(img, code, message) {
					alert('Error: '+message);
					//$this.text('error!');
				}*/
				/*cr.behaviors.Pode_FaceDetect.prototype.cnds.onNoFaceDetected*/function(img, code, message) {},
				cr:cr
			});
			/*for (var i = 0; i < coords.length; i++) {
				$('<div>', {
					'class':'face',
					'css': {
						'position':	'absolute',
						'left':		coords[i].positionX +5+'px',
						'top':		coords[i].positionY +5+'px',
						'width': 	coords[i].width		+'px',
						'height': 	coords[i].height	+'px'
					}
				})
				.appendTo('#content');
			}*/
			/*this.facePosX = coords[0].positionX;
			this.facePosY = coords[0].positionY;
			this.faceWidth = coords[0].width;
			this.faceHeight = coords[0].height;*/
			if(coords.length == 0){
				//cr.runtime.prototype.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onNoFaceDetected, cr);
				coords_.noFaceDetected = true;
				coords_.faceDetected = false;
				//detectionDone = true;
				coords_.detectionDone = true;
				//blank 1x1 white gif image
				coords_.faceCrop = 'data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
				//jQuery("body").remove(myImg);
			}else{
				//cr.runtime.prototype.trigger(cr.behaviors.Pode_FaceDetect.prototype.cnds.onFaceDetected, cr);
				coords_.faceDetected = true;
				coords_.noFaceDetected = false;
				//detectionDone = true;
				coords_.detectionDone = true;
				coords_.facePosX = coords[0].x;
				coords_.facePosY = coords[0].y;
				coords_.faceWidth = coords[0].width;
				coords_.faceHeight = coords[0].height;
				coords_.faceConfidence = coords[0].confidence;
				
				//crop image, add margins
				var canvasCrop = document.createElement("canvas");
				canvasCrop.width = coords_.faceWidth+coords_.leftCrop*2;
				canvasCrop.height = coords_.faceHeight+coords_.upCrop*2;
				/*canvasCrop.width = coords_.widthCrop;
				canvasCrop.height = coords_.heightCrop;*/
				var cropCtx = canvasCrop.getContext("2d");
				/*cropCtx.drawImage(myImg, coords_.facePosX, coords_.facePosY, coords_.faceWidth+coords_.left*2, coords_.faceHeight+coords_.top*2, 0, 0, coords_.width, coords_.height);*/
				
				/*cropCtx.drawImage(myImg, coords_.facePosX, coords_.facePosY, coords_.faceWidth+coords_.leftCrop*2, coords_.faceHeight+coords_.topCrop*2, 0+coords_.leftCrop, 0+coords_.upCrop, coords_.widthCrop, coords_.heightCrop);*/

				var sprite1 = new CroppedImage(myImg,  coords_.facePosX-coords_.leftCrop, coords_.facePosY-coords_.upCrop, coords_.faceWidth+coords_.leftCrop*2, coords_.faceHeight+coords_.upCrop*2);
				sprite1.draw(cropCtx, 0, 0);
				/*cropCtx.drawImage(myImg, coords_.facePosX-coords_.leftCrop, coords_.facePosY-coords_.upCrop, coords_.faceWidth+coords_.leftCrop*2, coords_.faceHeight+coords_.topCrop*2, 0, 0, coords_.faceWidth, coords_.faceHeight);*/
				
				coords_.faceCrop = canvasCrop.toDataURL("image/png");
				//jQuery("body").append(canvasCrop);
				//jQuery("body").remove(myImg);
			}
		}
		
		myImg.src = img.src
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	Exps.prototype.faceX = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.facePosX);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.faceY = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.facePosY);				// return our value
	};
	Exps.prototype.faceHeight = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.faceHeight);				// return our value
	};
	Exps.prototype.faceWidth = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.faceWidth);				// return our value
	};
	Exps.prototype.faceConfidence = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.faceConfidence);				// return our value
	};
	// ... other expressions here ...
	Exps.prototype.faceCrop = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.faceCrop);				// return our value
	};
	
	behaviorProto.exps = new Exps();
	
}());