// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.HTML_iFrame_Pode = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var manuallyChanged = false;
	/////////////////////////////////////
	var pluginProto = cr.plugins_.HTML_iFrame_Pode.prototype;

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
		this.elem = document.createElement("iframe");

		this.elem.src=this.properties[1];

		this.elem.id=this.uid;
		
		//		
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
			
		this.elem.setAttribute("id",this.properties[3]);
		this.elem.style.cssText = this.properties[2];
		this.elem.style.cssText= this.elem.style.cssText +"-webkit-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-moz-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-o-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-ms-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);";
		//rounding position & width to avoid jitter
		this.elem.width = Math.round(this.elem.width);
		this.elem.height = Math.round(this.elem.height);
		this.elem.x = Math.round(this.elem.x);
		this.elem.y = Math.round(this.elem.y);
		//
		jQuery(this.elem).appendTo("body");

		if (this.properties[0] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
		
		if(this.properties[4] == 0)
			this.elem.scrolling = "auto";
		if(this.properties[4] == 1)
			this.elem.scrolling = "yes";
		if(this.properties[4] == 2)
			this.elem.scrolling = "no";		

		var onchangetrigger = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.HTML_iFrame.prototype.cnds.OnTextChanged, self);
			};
		})(this);


		this.elem.onclick = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.HTML_iFrame.prototype.cnds.OnClicked, self);
			};
		})(this);

		this.elem.ondblclick = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.HTML_iFrame.prototype.cnds.OnDoubleClicked, self);
			};
		})(this);

		/*this.elem.onload = (function (self) {
		//this.elem.onready = (function (self) {
			return function() {
				//alert(manuallyChanged);
				//if(manuallyChanged == true)
					self.runtime.trigger(cr.plugins_.HTML_iFrame_Pode.prototype.cnds.OnLoaded, self);
				//alert("It's loaded!");
			};
		})(this);*/
		/**/

		this.updatePosition();

		this.runtime.tickMe(this);
		
		this.currentURL = this.properties[1];
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
		//rounding position & width to avoid jitter
		this.elem.width = Math.round(this.elem.width);
		this.elem.height = Math.round(this.elem.height);
		this.elem.x = Math.round(this.elem.x);
		this.elem.y = Math.round(this.elem.y);
		//
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

	cnds.CompareURL = function (text, case_)
	{
			//return this.elem.value === text;
			return this.currentURL === text;
	};

	cnds.CompareinnerHTML = function (text, case_)
	{
			return this.elem.document.body.innerHTML === text;
	};

	cnds.OnClicked = function ()
	{
		return true;
	};

	cnds.OnDoubleClicked = function ()
	{
		return true;
	};

	cnds.OnLoaded = function ()
	{
		return true;
	};
	
	cnds.isFocused = function ()
	{
		if(this.elem == document.activeElement) return true;
		else return false;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetURL = function (text)
	{
		manuallyChanged = true;
		this.elem.src = text;
		
		this.currentURL = text;
		
		this.elem.onload = (function (self) {
		//this.elem.onready = (function (self) {
			return function() {
				//alert(manuallyChanged);
				//if(manuallyChanged == true)
					self.runtime.trigger(cr.plugins_.HTML_iFrame_Pode.prototype.cnds.OnLoaded, self);
				//alert("It's loaded!");
			};
		})(this);
	};

	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};

	acts.SetStyle = function (text)
	{
		this.elem.style.cssText = text;
	};

	acts.GoForward = function ()
	{
		manuallyChanged = true;
		this.elem.contentWindow.history.forward();
	};

	acts.GoBackward = function ()
	{
		manuallyChanged = true;
		this.elem.contentWindow.history.back();
	};

	acts.Refresh = function ()
	{
		manuallyChanged = true;
		this.elem.src=this.elem.src+" ";
	};

	acts.setFocus = function ()
	{
		manuallyChanged = true;
		this.elem.focus();
	};
	


	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.innerHTML = function (ret)
	{
		ret.set_string(jQuery(this.elem).contents().find("*").html());
		//ret.set_string(this.elem.document.body.innerHTML);
	};

	exps.CurrentURL = function (ret)
	{
		//ret.set_string(this.elem.contentWindow.location.href);
		ret.set_string(this.currentURL);
	};

	exps.GetStyle = function (ret)
	{
		ret.set_string(this.elem.style.cssText);
	};	

}());