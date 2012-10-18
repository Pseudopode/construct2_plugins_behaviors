// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.HTML_Div_Pode = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.HTML_Div_Pode.prototype;

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
		


		this.elem.innerHTML=this.properties[1];
		this.elem.style.cssText=this.properties[2];

		//		
		this.CSSstyle = this.properties[2];
		
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
			
		this.elem.setAttribute("id",this.properties[3]);
		
		this.angle2D = this.angle;
		/*this.angle3DX = 0;
		this.angle3DY = 0;
		this.angle3DZ = 0;
		if(this.properties[5] == 1){
			this.angle3DX = this.properties[8];
		}
		if(this.properties[6] == 1){
			this.angle3DY = this.properties[8];
		}
		if(this.properties[7] == 1){
			this.angle3DZ = this.properties[8];
		}*/
		
		this.rotation2D = "-webkit-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-moz-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-o-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);";
		/*this.perspectiveValue =  "-webkit-perspective:"+ this.properties[4]
										+";"+
									"-moz-perspective:"+ this.properties[4]
										+";"+
									"-o-perspective:"+ this.properties[4]
										+";";
		this.rotation3D = "-webkit-transform:rotate3d("+ this.properties[5] + "," + this.properties[6] + "," + this.properties[7] + "," + this.properties[8] + "deg);" +
														"-moz-transform:rotate3d("+ this.properties[5] + "," + this.properties[6] + "," + this.properties[7] + "," + this.properties[8] + "deg);" +
														"-o-transform:rotate3d("+ this.properties[5] + "," + this.properties[6] + "," + this.properties[7] + "," + this.properties[8] + "deg);" +
														"-ms-transform:rotate3d("+ this.properties[5] + "," + this.properties[6] + "," + this.properties[7] + "," + this.properties[8] + "deg);" +
														"transform:rotate3d("+ this.properties[5] + "," + this.properties[6] + "," + this.properties[7] + "," + this.properties[8] + "deg);";
		*/
		this.elem.style.cssText += ";"+/*this.CSSstyle +";"+*/ this.rotation2D/* + this.perspectiveValue + this.rotation3D*/;
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

	cnds.isFocused = function ()
	{
		if(this.elem == document.activeElement) return true;
		else return false;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetInnerHTML = function (text)
	{
		this.elem.innerHTML = text;
	};
	
	acts.rotate3d = function (x,y,z,deg)
	{
		//X
		var rotationTemp = "";
		if(x == 1){
			this.angle3DX = this.angle3DX+deg;
			rotationTemp = 	"-webkit-transform:rotateX("+this.angle3DX + "deg);" +
								"-moz-transform:rotateX("+this.angle3DX + "deg);" +
								"-o-transform:rotateX("+this.angle3DX + "deg);" +
								"-ms-transform:rotateX("+this.angle3DX + "deg);" +
								"transform:rotateX("+this.angle3DX + "deg);";
		}
		//Y
		if(y == 1){
			this.angle3DY = this.angle3DY+deg;
			rotationTemp = 	rotationTemp + "-webkit-transform:rotateY("+this.angle3DY + "deg);" +
								"-moz-transform:rotateY("+this.angle3DY + "deg);" +
								"-o-transform:rotateY("+this.angle3DY + "deg);" +
								"-ms-transform:rotateY("+this.angle3DY + "deg);" +
								"transform:rotateY("+this.angle3DY + "deg);";
		}
		//Z
		if(z == 1){
			this.angle3DZ = this.angle3DZ+deg;
			rotationTemp = 	rotationTemp + "-webkit-transform:rotateZ("+this.angle3DZ + "deg);" +
								"-moz-transform:rotateZ("+this.angle3DZ + "deg);" +
								"-o-transform:rotateZ("+this.angle3DZ + "deg);" +
								"-ms-transform:rotateZ("+this.angle3DZ + "deg);" +
								"transform:rotateZ("+this.angle3DZ + "deg);";
			
		}

		this.rotation3D = rotationTemp;
		this.elem.style.cssText= this.CSSstyle + this.rotation2D + this.perspectiveValue + this.rotation3D 	
									//force positionning to avoid flicker
									/*+"position: absolute;"
									+"left"+this.x+"px;"
									+"top"+this.y+"px;"
									+"-webkit-backface-visibility:visible;"
									+"-webkit-transform-style: flat;";*/
		this.updatePosition();
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
		
		//this.angle = this.angle+deg*180/3.1416;
		this.angle = this.angle2D+deg*180/3.1416;
	};
	

	
	acts.setPerspective = function (perspective)
	{
	
										//perspective
		this.perspectiveValue = "-webkit-perspective:" + perspective +";" +
														"-moz-perspective:" + perspective +";" +
														"-o-perspective:" + perspective +";" +
														"-ms-perspective:" + perspective +";" +
														"perspective:" + perspective +";"
		this.elem.style.cssText= this.CSSstyle + this.rotation2D + this.perspectiveValue + this.rotation3D;
	};
	
	acts.LoadDiv = function (url_,postdata_)
	{

		if(postdata_.length){
				// Make the request
				jQuery.ajax({
					context: this,
					dataType: "text",
					type: "POST",
					url: url_,
					data: postdata_,
					success: function(data) {
						this.elem.innerHTML=data;
						this.runtime.trigger(cr.plugins_.HTML_Div.prototype.cnds.OnComplete, this);
					},
					error: function() {
						this.runtime.trigger(cr.plugins_.HTML_Div.prototype.cnds.OnError, this);
					}
				});
			} else {
				// Make the request
				jQuery.ajax({
					context: this,
					dataType: "text",
					type: "GET",
					url: url_,
					success: function(data) {
						this.elem.innerHTML=data;
						this.runtime.trigger(cr.plugins_.HTML_Div.prototype.cnds.OnComplete, this);
					},
					error: function() {
						this.runtime.trigger(cr.plugins_.HTML_Div.prototype.cnds.OnError, this);
					}
				});

			};
	};

	acts.SetStyle = function (text)
	{
		this.CSSstyle = text;
		this.elem.style.cssText= this.CSSstyle + this.rotation2D + this.perspectiveValue + this.rotation3D;
	};

	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};

	acts.setFocus = function ()
	{
		this.elem.focus();
	};

	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.GetInnerHTML = function (ret)
	{
		ret.set_string(this.elem.innerHTML);
	};

	exps.GetStyle = function (ret)
	{
		ret.set_string(this.elem.style.cssText);
	};

}());