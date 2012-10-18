// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Text_Highlighter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Text_Highlighter.prototype;

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

		this.divloaded=0;

	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	
		this.elem = document.createElement("div");
		
		//this.text = '';
		this.text = this.properties[1];
		this.wordArray = this.text.split(" ");
		this.originalWordArray = this.wordArray.slice(0); // real clone
		this.CSSstyleHead = this.properties[2] +";";
		this.CSSstyleText = this.properties[3] +";";
		this.CSSstyleHighlight = this.properties[4] +";";
		this.currentHighlightedWord = 0;
	
		//fill the array
		//1st : the Head letter
		this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";'>" +this.wordArray[0]+" </span>";
		this.elem.innerHTML += this.wordArray[0];
		//2nd : the rest of the text
		for(var i = 1; i < this.wordArray.length; i++){
			this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.wordArray[i]+" </span>";
			this.elem.innerHTML += this.wordArray[i];
		}
		
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
			
		this.elem.setAttribute("id",this.properties[5]);
		
		this.angle2D = this.angle;
		
		this.rotation2D = "-webkit-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-moz-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-o-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);";
										
		this.elem.style.cssText= this.rotation2D + this.CSSstyleHead + this.CSSstyleText;		

		//rounding position & width to avoid jitter
		jQuery(this.elem).width = Math.round(jQuery(this.elem).width);
		jQuery(this.elem).height = Math.round(jQuery(this.elem).height);
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		//
		jQuery(this.elem).appendTo("body");

		if (this.properties[0] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}



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
		//jQuery(this.elem).width = Math.round(jQuery(this.elem).width);
		//jQuery(this.elem).height = Math.round(this.elem.height);
		//this.elem.x = Math.round(this.elem.x);
		//this.elem.y = Math.round(this.elem.y);
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

	cnds.CompareinnerHTML = function (text, case_)
	{
			return this.elem.innerHTML === text;
	};

	cnds.CompareStyle = function (text, case_)
	{
			return this.elem.style.cssText === text;
	};

	cnds.OnComplete = function (hmm)
	{
		return true;
	};

	cnds.OnError = function ()
	{
		return true;
	};

	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetText = function (text)
	{
		this.elem.innerHTML = '';
		this.elem.style = '';
	
		this.text = text;
		this.wordArray = this.text.split(" ");
		this.originalWordArray = this.wordArray.slice(0); //real clone
		
		//fill the array
		//1st : the Head letter
		this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + "'>" +this.originalWordArray[0]+" </span>";
		//2nd : the rest of the text
		for(var i = 1; i < this.wordArray.length; i++){
			this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + "'>" +this.originalWordArray[i]+" </span>";
			this.elem.innerHTML += this.wordArray[i];
		}
	};
	
	acts.rotate2d = function (deg)
	{
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
		this.rotation2D = "-webkit-transform:rotate("+ deg * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-moz-transform:rotate("+ deg * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-o-transform:rotate("+ deg * widthfactor * heightfactor*180/3.1416
										+"deg);";
		this.elem.style.cssText= this.CSSstyle + this.rotation2D + this.perspectiveValue + this.rotation3D;
		
		this.angle = this.angle2D+deg*180/3.1416;
	};
	
	acts.SetStyleHead = function (text)
	{
		this.CSSstyleHead = text +";";
		this.elem.style.cssText= this.rotation2D + this.CSSstyleHead + this.CSSstyleText;
		
		
		//rebuild the style if it's a new one
		this.wordArray = this.originalWordArray.slice(0); //real clone
		//fill the array
		//1st : the Head letter
		this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";'>" +this.originalWordArray[0]+" </span>";
		//2nd : the rest of the text
		for(var i = 1; i < this.wordArray.length; i++){
			this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.originalWordArray[i]+" </span>";
			this.elem.innerHTML += this.wordArray[i];
		}
	};

	acts.SetStyleText = function (text)
	{
		this.CSSstyleText = text +";";
		this.elem.style.cssText= this.rotation2D + this.CSSstyleHead + this.CSSstyleText;
		
		//rebuild the style if it's a new one
		this.wordArray = this.originalWordArray.slice(0); //real clone
		//fill the array
		//1st : the Head letter
		this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";'>" +this.originalWordArray[0]+" </span>";
		//2nd : the rest of the text
		for(var i = 1; i < this.wordArray.length; i++){
			this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.originalWordArray[i]+" </span>";
			this.elem.innerHTML += this.wordArray[i];
		}
	};
	
	acts.SetStyleHighlight = function (text)
	{
		this.CSSstyleHighlight = text +";";
	};
	
	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};

	acts.highlightNextword = function ()
	{
		this.elem.innerHTML = '';
		this.wordArray = this.originalWordArray.slice(0); //real clone
		//highlight first letter
		if(this.currentHighlightedWord == 0){
			this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";" + this.CSSstyleHighlight + ";'>" +this.originalWordArray[0]+" </span>";
			this.elem.innerHTML += this.wordArray[0];
			//2nd : the rest of the text
			for(var i = 1; i < this.wordArray.length; i++){
				this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.originalWordArray[i]+" </span>";
				this.elem.innerHTML += this.wordArray[i];
			}
		}else{
			this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";'>" +this.originalWordArray[0]+" </span>";
			this.elem.innerHTML += this.wordArray[0];
			for(var i = 1; i < this.wordArray.length; i++){
				if(this.currentHighlightedWord == i){
						this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";" + this.CSSstyleHighlight + ";'>" +this.originalWordArray[i]+" </span>";
					}else{
						this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.originalWordArray[i]+" </span>";
					}
				this.elem.innerHTML += this.wordArray[i];
			}
		}
	
		this.currentHighlightedWord++;	
	};

	acts.resetHighlighting = function ()
	{
		this.elem.innerHTML = '';
		this.wordArray = this.originalWordArray.slice(0); //real clone
		this.currentHighlightedWord = 0;	
		this.wordArray[0] = "<span id='normal-text' style='"+ this.CSSstyleHead + ";'>" +this.wordArray[0]+" </span>";
		this.elem.innerHTML += this.wordArray[0];
		//2nd : the rest of the text
		for(var i = 1; i < this.wordArray.length; i++){
			this.wordArray[i] = "<span id='normal-text' style='"+ this.CSSstyleText + ";'>" +this.wordArray[i]+" </span>";
			this.elem.innerHTML += this.wordArray[i];
		}
	};	
			
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.GetText = function (ret)
	{
		ret.set_string(this.text);
	};

	exps.GetHeadLetterStyle = function (ret)
	{
		ret.set_string(this.CSSstyleHead);
	};

	exps.GetWholeTextStyle = function (ret)
	{
		ret.set_string(this.CSSstyleText);
	};
	exps.GetHighlightStyle = function (ret)
	{
		ret.set_string(this.CSSstyleHighlight);
	};	
}());