// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.HTML_Slider = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.HTML_Slider.prototype;
		
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
		//this.HTMLString = '';
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		//this.svgURL = '';
		//<input type="range" min="1" max="9" step="1" name="rating" />
		this.value = this.properties[0];
		this.currentvalue = this.properties[0];
		this.min = this.properties[1];
		this.max = this.properties[2];
		this.step = this.properties[3];
		this.sliderElement = document.createElement('input');
		this.sliderElement.setAttribute('type','range');
		this.sliderElement.setAttribute('min',this.min);
		this.sliderElement.setAttribute('max',this.max);
		this.sliderElement.setAttribute('step',this.step);
		this.sliderElement.disabled = (this.properties[5] === 0);
		if (this.properties[4] === 0)
		{
			jQuery(this.sliderElement).hide();
			this.visible = false;
		}
		//this.sliderElement.setAttribute('id',this.properties[0]);
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
		jQuery('body').append(this.sliderElement);
		//jQuery('body').append(this.svgDiv);
		
		/*this.dataToDisplay ='';
		this.imgDataToDisplay = new Image();
		this.imgDataToDisplay.src = '';
		
		this.imgDataToDisplay.onload = (function (self) {*/
		this.sliderElement.onchange = (function (self) {
			return function() {
				//alert(manuallyChanged);
				//if(manuallyChanged == true)
					this.runtime.trigger(cr.plugins_.HTML_Slider.prototype.cnds.OnChange, self);
				//alert("It's loaded!");
			};
		})(this);
		
		// Create a new canvas
		//this.canvasHTML = document.createElement('canvas');
		//canvasHTML.width = canvasHTML.height = 100;
		//document.body.appendChild(canvasHTML);
		//this.ctxHTML = this.canvasHTML.getContext('2d');
		
		//this.done = false;
		//this.loaded = false;
		
		//this.elem = this.imgDataToDisplay; //faster than change everywhere else
		
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
	
	cnds.OnChange = function ()
	{
		// return true if number is positive
		this.currentvalue = this.sliderElement.ranglevalue;
		this.runtime.redraw = true;
		this.updatePosition();
	};
	
	/*cnds.OnClicked = function ()
	{
		return true;
	};*/
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.CurrentSliderValue = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.currentvalue);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());