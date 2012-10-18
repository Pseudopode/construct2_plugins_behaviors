// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.LocalFile = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.LocalFile.prototype;
		
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

	};
	
	var instanceProto = pluginProto.Instance.prototype;

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
		
		var offx = left + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().left);
		var offy = top + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().top);
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.filename = "";
		this.hiddeniFrame = document.createElement("frame");
		jQuery(this.hiddeniFrame).hide();
		jQuery('body').append(this.hiddeniFrame);
			
		this.content = ""
		this.fileLines = '';
					
		this.runtime.redraw = true;
		this.updatePosition();
		this.runtime.tickMe(this);
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
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};

	acts.splitLines = function ()
	{
		
	};
	
	acts.loadFile = function (filename)
	{
		// alert the message
		this.filename = filename;
		this.hiddeniFrame.src = this.filename;
		//acts.splitLines();
		if (this.hiddeniFrame.contentDocument){
			//srcContent=srcFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML;
			//this.fileLines=this.hiddeniFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML.split("\n");
			var tmpContent = this.hiddeniFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML;
			this.content = tmpContent.substring("<pre>".length,tmpContent.length-6);
			//srcContent=fileLines[1];
		}
		else if (this.hiddeniFrame.contentWindow){
			//srcContent=srcFrame.contentWindow.document.body.innerHTML;
			//var fileLines=srcFrame.contentWindow.document.body.innerHTML.split("\n")
			//this.fileLines=this.hiddeniFrame.contentWindow.document.body.innerText.split("\n");
			var tmpContent = this.hiddeniFrame.contentWindow.document.body.innerText;
			this.content = tmpContent.substring("<pre>".length,tmpContent.length-6);

			//srcContent=fileLines[1];

		}
		this.updatePosition();
		this.runtime.redraw = true;
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
	
	exps.textContent = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.content);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	

}());