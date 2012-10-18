// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.HTMLDisplayString = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.HTMLDisplayString.prototype;
		
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
		this.HTMLString = this.properties[0]
		this.dataToDisplay ='';
		this.imgDataToDisplay = new Image();
		
		// Create a new canvas
		this.canvasHTML = document.createElement('canvas');
		//canvasHTML.width = canvasHTML.height = 100;
		//document.body.appendChild(canvasHTML);
		this.ctxHTML = this.canvasHTML.getContext('2d');
		
		//FIRST DISPLAY !
		this.dataToDisplay = "data:image/svg+xml," +
			//"<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
			"<svg xmlns='http://www.w3.org/2000/svg' width='"+this.width+"' height='"+this.height+"'>" +
				"<foreignObject width='100%' height='100%'>" +
				"<div xmlns='http://www.w3.org/1999/xhtml'>" +
					this.HTMLString +
				"</div>" +
			"</foreignObject>" +
		"</svg>";
		this.imgDataToDisplay.src = this.dataToDisplay;
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
			ctx.save();
		// Set global alpha if opacity not 100%
		if (this.opacity !== 1.0)
			ctx.globalAlpha = this.opacity;
			
		// Set composite operation if an effect set
		if (this.compositeOp !== "source-over")
			ctx.globalCompositeOperation = this.compositeOp;
	
		/*	this.dataToDisplay = "data:image/svg+xml," +
			"<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
				"<foreignObject width='100%' height='100%'>" +
				"<div xmlns='http://www.w3.org/1999/xhtml'>" +
					this.HTMLString +
				"</div>" +
				"</foreignObject>" +
			"</svg>";*/
		//var img = new Image();
		//img.src = data;
		//img.src = this.dataToDisplay;
		//this.imgDataToDisplay.src = this.dataToDisplay;
		
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
			//			  myy - (this.hotspotY * this.height)/*,
			//			  this.width,
			//			  this.height*/);
			ctx.drawImage(this.imgDataToDisplay,
			//ctx.drawImage(this.ctxHTML,
						  myx - (this.hotspotX * this.width),
						  myy - (this.hotspotY * this.height)/*,
						  this.width,
						  this.height*/);
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
			/*ctx.drawImage(img,
						  0 - (this.hotspotX * Math.abs(this.width)),
						  0 - (this.hotspotY * Math.abs(this.height)),
						  Math.abs(this.width),
						  Math.abs(this.height));*/
			  ctx.drawImage(this.imgDataToDisplay,
			  //ctx.drawImage(this.ctxHTML,
						  0 - (this.hotspotX * Math.abs(this.width)),
						  0 - (this.hotspotY * Math.abs(this.height)),
						  Math.abs(this.width),
						  Math.abs(this.height));
			
			// Restore previous state.
			ctx.restore();
		}
		
		// Restore composite operation if an effect was set
		if (this.compositeOp !== "source-over")
			ctx.globalCompositeOperation = "source-over";
			
		// Restore global alpha if opacity was not 100%
		if (this.opacity !== 1.0)
			ctx.globalAlpha = 1.0;
			
		/*img.onload = function() { ctx.drawImage(img, this.x, this.y); }*/
		//this.updatePosition();
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
	acts.DisplayHTMLString = function (myparam)
	{
		// alert the message
		//alert(myparam);
		this.HTMLString = myparam;
		
		this.dataToDisplay = "data:image/svg+xml," +
			//"<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
			"<svg xmlns='http://www.w3.org/2000/svg' width='"+this.width+"' height='"+this.height+"'>" +
				"<foreignObject width='100%' height='100%'>" +
				"<div xmlns='http://www.w3.org/1999/xhtml'>" +
					this.HTMLString +
				"</div>" +
			"</foreignObject>" +
		"</svg>";
		this.imgDataToDisplay.src = this.dataToDisplay;
		//this.ctxHTML.drawImage(this.imgDataToDisplay.toDataURL());
		
		this.runtime.redraw = true;
		this.updatePosition();
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.base64Image = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		 ret.set_string(this.imgDataToDisplay.src);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());