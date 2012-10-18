// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SVGImage = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SVGImage.prototype;
		
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
		this.HTMLString = '';
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.svgURL = '';
		/*this.svgElement = document.createElement('object');
		this.svgElement.setAttribute('type','image/svg+xml');
		this.svgElement.setAttribute('id',this.properties[0]);*/
		/*this.svgElement = document.createElement('embed');
		this.svgElement.setAttribute('id',this.properties[0]);*/
		/*this.svgElement = document.createElement('iframe');
		this.svgElement.setAttribute('id',this.properties[0]);*/
		//<object type="image/svg+xml" name="omap" data="canvas_norelief.svg" width="350" height="176"></object>
		//<object height="100" width="300" data="circle1.svg" type="image/svg+xml">
		//<embed src="circle1.svg" type="image/svg+xml" />
		//this.svgDiv= document.createElement('div');
		//this.svgDiv.setAttribute('id',this.properties[0]+'div');
		//jQuery(this.svgDiv).append(this.svgElement);
		jQuery('body').append(this.svgElement);
		//jQuery('body').append(this.svgDiv);
		
		this.dataToDisplay ='';
		this.imgDataToDisplay = new Image();
		this.imgDataToDisplay.src = '';
		
		this.imgDataToDisplay.onload = (function (self) {
		//this.elem.onready = (function (self) {
			return function() {
				//alert(manuallyChanged);
				//if(manuallyChanged == true)
					self.runtime.trigger(cr.plugins_.SVGImage.prototype.cnds.OnLoaded, self);
				//alert("It's loaded!");
			};
		})(this);
		
		// Create a new canvas
		//this.canvasHTML = document.createElement('canvas');
		//canvasHTML.width = canvasHTML.height = 100;
		//document.body.appendChild(canvasHTML);
		//this.ctxHTML = this.canvasHTML.getContext('2d');
		
		//this.done = false;
		this.loaded = false;
		
		this.elem = this.imgDataToDisplay; //faster than change everywhere else
		
		this.updatePosition();
		this.runtime.tickMe(this);
	};
	
	instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}

		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;

		jQuery(this.elem).show();

		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	if(this.loaded == true){
		ctx.save();
		// Set global alpha if opacity not 100%
		if (this.opacity !== 1.0)
			ctx.globalAlpha = this.opacity;
			
		// Set composite operation if an effect set
		if (this.compositeOp !== "source-over")
			ctx.globalCompositeOperation = this.compositeOp;
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		if (this.angle === 0 && this.width >= 0 && this.height >= 0)
		{
			//ctx.drawImage(img,
			//			  myx - (this.hotspotX * this.width),
			//			  myy - (this.hotspotY * this.height),
			//			  this.width,
			//			  this.height);
			//if(this.done == true){
			ctx.drawImage(this.imgDataToDisplay,
			//ctx.drawImage(this.canvasHTML.toDataURL(),
						  //myx - (this.hotspotX * this.width),
						  0,
						  //myy - (this.hotspotY * this.height)/*,
						  0/*,
						  this.width,
						  this.height*/);
			//			  }
			ctx.restore();
		}
		else
		{
			// Note: don't pixel round rotated objects, otherwise they don't rotate smoothly.
			
			// Angle applied; we need to transform the canvas.  Save state.
			ctx.save();
			
			var widthfactor = this.width > 0 ? 1 : -1;
			var heightfactor = this.height > 0 ? 1 : -1;
			
			// Translate to object's position, then rotate by its angle.
			ctx.translate(myx, myy);
			ctx.scale(widthfactor, heightfactor);
			ctx.rotate(this.angle * widthfactor * heightfactor);
			
			// Draw the object; canvas origin is at hot spot.
			  ctx.drawImage(this.imgDataToDisplay,
			  //ctx.drawImage(this.canvasHTML.toDataURL(),
						  //0 - (this.hotspotX * Math.abs(this.width)),
						  0,
						  //0 - (this.hotspotY * Math.abs(this.height)),
						  0/*,
						  Math.abs(this.width),
						  Math.abs(this.height)*/);
			
			// Restore previous state.
			ctx.restore();
		}
		
		// Restore composite operation if an effect was set
		if (this.compositeOp !== "source-over")
			ctx.globalCompositeOperation = "source-over";
			
		// Restore global alpha if opacity was not 100%
		if (this.opacity !== 1.0)
			ctx.globalAlpha = 1.0;
		//this.updatePosition();*/
		/*	ctx.save();
		ctx.drawImage(this.imgDataToDisplay);
		ctx.restore();
		/*ctx.drawImage(this.imgDataToDisplay, this.x, this.y, this.width,
						  this.height);*/
						  }
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
	
	cnds.OnLoaded = function ()
	{
		// return true if number is positive
		this.runtime.redraw = true;
		this.updatePosition();
		return true;
	};
	
	/*cnds.OnClicked = function ()
	{
		return true;
	};*/
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.loadSVGImage = function (svgURL)
	{
		// alert the message
		//alert(myparam);
				
		//this.svgElement.setAttribute('data',svgURL);		
		//this.svgElement.setAttribute('src',svgURL);
		//this.HTMLString = svgURL;
		
		//var svg_xml = (new XMLSerializer()).serializeToString(document.getElementById(this.properties[0]).contentDocument);
		//var svgdoc = this.svgElement.contentDocument; // reference to the SVG document
		//var svgelem = svgdoc.documentElement; // reference to the SVG element

		/*var obj = document.getElementById(this.properties[0]).getSVGDocument();
		var svg_xml = (new XMLSerializer()).serializeToString(obj);*/
		//var svg_xml = (new XMLSerializer()).serializeToString(this.svgElement);
		//var tmpt = document.getElementById(this.properties[0]).body.innerHTML;
		/*var srcFrame = document.getElementById(this.properties[0]);
		var txt = '';
		 if (srcFrame.contentDocument){
			var fileLines=srcFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML.split("\n");
			srcContent=fileLines[1];
			//txt = srcFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML;
		}else if (srcFrame.contentWindow){
			var fileLines=srcFrame.contentWindow.document.body.innerText.split("\n");
			srcContent=fileLines[1];
			//txt = srcFrame.contentWindow.document.body.innerText;
		}*/
		
		//var tmpt = txt;
		//var svg_xml = (new XMLSerializer()).serializeToString(tmpt);
		//var svg_xml = (new XMLSerializer()).serializeToString(svgdoc);

		// this is just a JavaScript (HTML) image
		//var imgTmp = new Image();
		//imgDataToDisplay.src = 
 
		//ctx.drawImage(img, this.hotspotX, this.hotspotY);
		
		//this.dataToDisplay = "data:image/svg+xml;base64," + btoa(svg_xml);
		//this.imgDataToDisplay.src = this.dataToDisplay;
		/*this.imgDataToDisplay.onload = function (){
			//alert('meuh!');
			//this.ctxHTML.drawImage(this.imgDataToDisplay);
			var m = 0;
			var y = m;
			y++;
			m = y;
		}*/
		
		this.imgDataToDisplay.src = svgURL;
		this.svgURL = svgURL;
		/*var svg_xml = (new XMLSerializer()).serializeToString(this.imgDataToDisplay.src);
		var tmpData = "data:image/svg+xml;base64," + btoa(svg_xml);
		this.imgDataToDisplay.src = tmpData;*/
		
		/*while(this.imgDataToDisplay.complete != true){
		};*/
		
		// Tell runtime to wait for this to load
		//this.runtime.wait_for_textures.push(this.imgDataToDisplay);
		//this.ctxHTML.drawImage(this.imgDataToDisplay.toDataURL());

		//this.done = true;
		
		this.runtime.redraw = true;
		this.updatePosition();
		//this.runtime.tickMe(this);

		/*jQuery(this.imgDataToDisplay).load(function() {
			//console.log("IMAGE LOADED");
			this.runtime.trigger(cr.plugins_.SVGImage.prototype.instanceProto.draw, this );
		})*/

	};
	
	acts.drawSVG = function ()
	{
		//this.done = true;
	};
	
	instanceProto.tick = function ()
	{
		/*if(this.done == true && this.loaded == true)
			if(this.imgDataToDisplay.complete == true){
				this.loaded = false;
				this.runtime.redraw = true;
			}*/
			if(this.imgDataToDisplay.complete == true && this.imgDataToDisplay.src == this.svgURL){
				this.loaded = true;
				this.runtime.redraw = true;
			}

		this.updatePosition();
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