// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.Flip = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.Flip.prototype;
		
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
		
		// Tell runtime to wait on this texture
		this.runtime.wait_for_textures.push(this.inst.type.animations[0].frames[0].texture_img);
		this.runtime.wait_for_textures.push(this.inst.type.animations[0].frames[1].texture_img);
		
		this.browserName = ""; 

		this.ua = navigator.userAgent.toLowerCase(); 
			if ( this.ua.indexOf( "webkit" ) != -1 ) { 
			this.browserName = "webkit"; 
		}
		
			/* calculate displacement*/
			this.left = /*(this.browserName  == "webkit"? 0 :*/this.inst.layer.layerToCanvas(this.inst.x, this.inst.y, true)-this.inst.width*this.inst.hotspotX/*)*/;
			this.top = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x, this.inst.y, false)-this.inst.height*this.inst.hotspotY/*)*/;
			this.right = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x + this.inst.width, this.inst.y + this.inst.height, true)/*)*/;
			this.bottom = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x + this.inst.width, this.inst.y + this.inst.height, false)/*)*/;

			/*// Is entirely offscreen or invisible: hide
			if (!this.inst.visible || !this.inst.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
			{
				jQuery(this.elem).hide();
				return;
			}*/

			// Truncate to canvas size
			if (this.left < 1)
				this.left = 1;
			if (this.top < 1)
				this.top = 1;
			if (this.right >= this.runtime.width)
				this.right = this.runtime.width - 1;
			if (this.bottom >= this.runtime.height)
				this.bottom = this.runtime.height - 1;

			/*if(this.browserName  == "webkit"){
				//var tmp =jQuery(this.runtime.canvas).offset().left;
				this.offx = this.left + jQuery(this.runtime.canvas).offset().left;
				this.offy = this.top + jQuery(this.runtime.canvas).offset().top;
			}else{*/
				this.offx = this.left + (jQuery(this.runtime.canvas).offset().left);
				this.offy = this.top + (jQuery(this.runtime.canvas).offset().top);
			/*}*/
			
		//to help avoid div position recalculation all the time
		this.startingX = this.inst.x;
		this.startingY = this.inst.y;
			
		this.flippingStyle = ".panel {"+
								//"background: white;"+
								"-webkit-perspective: 800px;"+
								"-moz-perspective: 800px;"+
							"}"+
							".panel .front {"+
								"width:"+ this.inst.type.animations[0].frames[0].texture_img.width+"px;"+
								"height:"+ this.inst.type.animations[0].frames[0].texture_img.height+"px;	"+
								"position: absolute;"+
								"z-index: 900;"+
								"width: inherit;"+
								"height: inherit;"+
								//"background: red;"+
								"-webkit-transform: rotateY(0deg);"+
								"-webkit-transform-style: preserve-3d;"+
								"-webkit-backface-visibility: hidden;"+
								"-moz-transform: rotateY(0deg);"+
								"-moz-transform-style: preserve-3d;"+
								"-moz-backface-visibility: hidden;"+
								"-o-transition: all 1s ;"+// /*ease-in-out;"+
								"-ms-transition: all 1s;"+// /*ease-in-out;"+
								"-moz-transition: all 1s;"+// /*ease-in-out;"+
								"-webkit-transition: all 1s;"+// /*ease-in-out;"+
								"transition: all 1s;"+// /*ease-in-out;"+
							"}"+
							".panel.flip .front {"+
								"z-index: 900;"+
								"-webkit-transform: rotateY(180deg);"+
								"-moz-transform: rotateY(180deg);"+
							"}"+
							".panel .back {"+
								"width:"+ this.inst.type.animations[0].frames[1].texture_img.width+"px;"+
								"height:"+ this.inst.type.animations[0].frames[1].texture_img.height+"px;	"+
								"position: absolute;"+
								"z-index: 800;"+
								"width: inherit;"+
								"height: inherit;"+
								//"background: red;	"+
								"-webkit-transform: rotateY(-180deg);"+
								"-webkit-transform-style: preserve-3d;"+
								"-webkit-backface-visibility: hidden;"+
								"-moz-transform: rotateY(-180deg);"+
								"-moz-transform-style: preserve-3d;"+
								"-moz-backface-visibility: hidden;"+
								"-o-transition: all 1s;"+// /*ease-in-out;"+
								"-ms-transition: all 1s;"+// /*ease-in-out;"+
								"-moz-transition: all 1s;"+// /*ease-in-out;"+
								"-webkit-transition: all 1s;"+// /*ease-in-out;"+
								"transition: all 1s;"+// /*ease-in-out;"+
							"}"+
							".panel.flip .back {"+
								"z-index: 1000;"+
								"-webkit-transform: rotateY(0deg);"+
								"-moz-transform: rotateY(0deg);"+
							"}"
							;
		
		this.cardStyle = document.createElement("style");
		this.cardStyle.innerHTML = this.flippingStyle;
	
	
		this.panel = document.createElement("div");
		jQuery(this.panel).attr('class','hover panel');
		jQuery(this.panel).attr('id','flippy');
			
		this.front = document.createElement("div");
		jQuery(this.front).attr('class','front');
		jQuery(this.front).attr('id','front');
		//jQuery(this.front).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;position:absolute;");
		//jQuery(this.front).attr('src','data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
		//this.front.innerHTML = 1;
		
		this.back = document.createElement("div");
		jQuery(this.back).attr('class','back');
		jQuery(this.back).attr('id','back');
		//jQuery(this.back).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;position:absolute;");
		//jQuery(this.back).attr('src','data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
		//this.back.innerHTML = 2;
		
		jQuery(this.front).appendTo(this.panel);
		jQuery(this.back).appendTo(this.panel);
		jQuery(this.panel).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;z-index: 400px;position:absolute;");
		jQuery(this.panel).appendTo('body');
		
		//ADD IMAGES TO CARD
		//FRONT CARD
		this.frontCard = document.createElement("img");
		this.frontCard.id = "frontcard";	
		this.frontCard.src = this.inst.type.animations[0].frames[0].texture_img.src;	
		//this.frontCard.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";	
		//jQuery(this.frontCard).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;");
		this.frontCard.width = this.inst.width;	
		this.frontCard.height = this.inst.height;
		this.frontCard.onload = (function (self) {
			return function(info) {
				cr.runtime.redraw = true;
			};
		})(this);
		jQuery(this.frontCard).appendTo(this.front);
		//BACK CARD
		this.backCard = document.createElement("img");
		this.backCard.id = "backcard";	
		this.backCard.src = this.inst.type.animations[0].frames[1].texture_img.src;	
		//this.backCard.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
		//jQuery(this.backCard).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;");		
		this.backCard.width = this.inst.width;	
		this.backCard.height = this.inst.height;	
		this.backCard.onload = (function (self) {
			return function(info) {
				cr.runtime.redraw = true;
			};
		})(this);
		jQuery(this.backCard).appendTo(this.back);
		
		jQuery(this.cardStyle).appendTo('head');

		var thisInst=this;
		var element = document.getElementById("flippy");
		element.addEventListener("webkitTransitionEnd", function handler(evt){
													//alert(foo);
													if(thisInst.flipped == false){
														thisInst.inst.visible = true;
														jQuery(thisInst.backCard).hide();
														jQuery(thisInst.frontCard).hide();
													}
													thisInst.runtime.redraw = true;
												},
		false);
		element.addEventListener("transitionend", function handler(evt){
													//alert(foo);
													if(thisInst.flipped == false){
														thisInst.inst.visible = true;
														jQuery(thisInst.backCard).hide();
														jQuery(thisInst.frontCard).hide();
													}
													thisInst.runtime.redraw = true;
												},
		false);
		this.flipped = false;
		
		jQuery(this.backCard).hide();
		jQuery(this.frontCard).hide();
			
	};

	behinstProto.tick = function ()
	{
		// var dt = this.runtime.getDt(this.inst);
		
		//called every tick for you to update this.inst as necessary
		//dt is the amount of time passed since the last tick, in case it's a movement
		
		if( (this.startingX != this.inst.x) || (this.startingY != this.inst.y)){
			/* calculate displacement*/
			this.left = /*(this.browserName  == "webkit"? 0 :*/this.inst.layer.layerToCanvas(this.inst.x, this.inst.y, true)-this.inst.width*this.inst.hotspotX/*)*/;
			this.top = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x, this.inst.y, false)-this.inst.height*this.inst.hotspotY/*)*/;
			this.right = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x + this.inst.width, this.inst.y + this.inst.height, true)/*)*/;
			this.bottom = /*(this.runtime.isWebKitMode ? 0 :*/this.inst.layer.layerToCanvas(this.inst.x + this.inst.width, this.inst.y + this.inst.height, false)/*)*/;

			/*// Is entirely offscreen or invisible: hide
			if (!this.inst.visible || !this.inst.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
			{
				jQuery(this.elem).hide();
				return;
			}*/

			//Truncate to canvas size
			if (this.left < 1)
				this.left = 1;
			if (this.top < 1)
				this.top = 1;
			if (this.right >= this.runtime.width)
				this.right = this.runtime.width - 1;
			if (this.bottom >= this.runtime.height)
				this.bottom = this.runtime.height - 1;

			/*if(this.browserName  == "webkit"){
				//var tmp =jQuery(this.runtime.canvas).offset().left;
				this.offx = this.left + jQuery(this.runtime.canvas).offset().left;
				this.offy = this.top + jQuery(this.runtime.canvas).offset().top;
			}else{*/
				this.offx = this.left + (jQuery(this.runtime.canvas).offset().left);
				this.offy = this.top + (jQuery(this.runtime.canvas).offset().top);
			/*}*/
		}
		/*jQuery(this.back).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;");
		jQuery(this.front).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;");*/
		jQuery(this.panel).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;z-index: 400px;position:absolute;");
	};

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
	acts.flip = function (side)
	{
		this.inst.visible = false;
		//alert(this.inst.x);
		//avoid unecessary recalculation
		
		
		//the sprite may have moved since the last flip		
		/*jQuery(this.back).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;position:absolute;");
		jQuery(this.front).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;position:absolute;");*/
		jQuery(this.frontCard).show();
		jQuery(this.backCard).show();
		
		
		this.runtime.redraw = true;

		jQuery('.hover').toggleClass('flip');

		if(this.flipped == false) this.flipped = true;
		else this.flipped = false;
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