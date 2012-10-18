// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.WebFont = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.WebFont.prototype;
		
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
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		/*if(typeof cr_is_preview != undefined){
			alert(this.properties[4]);
			}*/
		var nameOfCSSFile  = this.properties[4];
		//this.returnValue= "";
		//<link rel="stylesheet" type="text/css" href="style.css" />
		/*var myWebFontTag=document.createElement('link');
		myWebFontTag.setAttribute("type","text/css");
		myWebFontTag.setAttribute("rel", "stylesheet");
		myWebFontTag.setAttribute("href", "nameOfCSSFile");*/
		var linkTag = "<link rel='stylesheet' type='text/css' href='"+nameOfCSSFile+"' />";
		jQuery('head').append(linkTag);
		
		/*if (typeof myWebFontTag != "undefined")
		document.getElementsByTagName("head")[0].appendChild(myWebFontTag);*/
		//jQuery(this.elem).appendTo("head");

	
		var myDiv = document.createElement(this.properties[5]);
		myDiv.setAttribute("id",this.properties[6]);
		this.elem = myDiv
		//this.elem.type = "button";		
		jQuery(this.elem).appendTo("body");
		//this.elem.value = this.properties[0];
		this.elem.innerHTML = this.properties[0];
		this.elem.title = this.properties[1];
		this.elem.disabled = (this.properties[3] === 0);
		
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
		
		this.elem.onclick = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.Button.prototype.cnds.OnClicked, self);
			};
		})(this);
			
		this.updatePosition();
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
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
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	cnds.OnClicked = function ()
	{
		return true;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetText = function (text)
	{
		//this.elem.value = text;
		this.elem.innerHTML = text;
	};
	
	acts.SetTooltip = function (text)
	{
		this.elem.title = text;
	};
	
	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};
	
	acts.SetEnabled = function (en)
	{
		this.elem.disabled = (en === 0);
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

}());