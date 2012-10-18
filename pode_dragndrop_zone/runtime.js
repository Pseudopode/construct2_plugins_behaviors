// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Pode_DragNDropZone = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Pode_DragNDropZone.prototype;
		
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
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		var widthfactor = this.width > 0 ? 1 : -1;
		var heightfactor = this.height > 0 ? 1 : -1;
		
		this.dNdZone = document.createElement("div");
		this.dNdZone.id = "dNdZone";
		//this.dNdZone.style = "width : " + this.width + "px; " + "height : " + this.height + "px";
		this.dNdZone.style.cssText = "width : " + this.width + "px; " + "height : " + this.height + "px";
			
		//alert(this.angle * widthfactor * heightfactor*180/3.1416);
		this.dNdZone.style.cssText+= 	
		//this.dNdZone.style +=
									//rotations
									"-webkit-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-moz-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-o-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-ms-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									"-transform:rotate("+ this.angle * widthfactor * heightfactor*180/3.1416
										+"deg);"+
									//background color
									"background-color:"+this.properties[0]+";"+
									this.properties[2]
										;
		
		document.body.appendChild(this.dNdZone);
		
		this.dNdZone.addEventListener("dragenter",(function (self) {
			return function(e) {
				e.stopPropagation();
				e.preventDefault();
				
				self.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnDragEntered, self);
			};
		})(this));
		
		this.dNdZone.addEventListener("dragover",(function (self) {
			return function(e) {
				e.stopPropagation();
				e.preventDefault();
				
				self.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnDragOver, self);
			};
		})(this));
				
		this.dNdZone.addEventListener("drop",(function (self) {
			return function(e) {
				e.stopPropagation();
				e.preventDefault();
							
				//only last file considered
				//last_Filetype = e.dataTransfer.files[e.dataTransfer.files.length-1].type;
				//
								
				var dt = e.dataTransfer;
				var files = dt.files;
				
				if(files.length>0)
					cr.plugins_.Pode_DragNDropZone.prototype.acts.handleFiles(files,self);
				
				self.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnDrop, self);					
				
				self.runtime.redraw = true;					
			};
		})(this));
		
		this.updatePosition();
		this.runtime.tickMe(this);
		
		this.base64string = "";
		this.reader = 0;
		this.textstring = "Unsupported file format";
		
		
		this.imgDnD = new Image();
		
		/*var self = this;		
		/*this.imgDnD.onload = function(){
			if (window["DnDImgLoaded"]) // in case C2 engine not started yet
				window["DnDImgLoaded"]();
		};
				
		window["DnDImgLoaded"] = function () {
			self.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnImageLoaded, self);
		};*/
		
		if(this.properties[1] == 0){
			this.allowedImage = true;
			this.allowedText = false;
		}
		if(this.properties[1] == 1){
			this.allowedImage = false;
			this.allowedText = true;
		}

		this.last_Filetype = 0;
		
		this.allowedImage;
		this.allowedText;
		
		if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}
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
			jQuery(this.dNdZone).hide();
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
			
		jQuery(this.dNdZone).show();
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.dNdZone).offset({left: offx, top: offy});
		
		jQuery(this.dNdZone).width(Math.round(right - left));
		jQuery(this.dNdZone).height(Math.round(bottom - top));
	};
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.OnDragEntered = function ()
	{
		return true;
	};
	Cnds.prototype.OnDragOver = function ()
	{
		return true;
	};	
	Cnds.prototype.OnDrop = function ()
	{
		return true;
	};	
	Cnds.prototype.OnImageLoaded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnTextLoaded = function ()
	{
		return true;
	};		
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};
		
	Acts.prototype.setVisible = function (vis)
	{
		if (this.runtime.isDomFree)
			return;
		
		this.visible = (vis !== 0);
	};
		
	Acts.prototype.handleFiles = function (f,thisPlugin)
	{
		var o=[];
		
		var tmpCvs = document.createElement("canvas");
		var tmpCtx = tmpCvs.getContext("2d");
		
		for(var i =0;i<f.length;i++)
		{	
			thisPlugin.reader = new FileReader();

			thisPlugin.last_Filetype = f[i].type;

			String.prototype.endsWith = function(str)
			{return (this.match(str+"$")==str)}
			
			if(f[i].type=="" && ( f[i].name.endsWith("tmx")/* || f[i].name.endsWith("log")*/) ){
				thisPlugin.textstring = "";
				thisPlugin.reader.onload = function(theFile) {
						return function(e) {
							var str = e.target.result;
							var res = atob(str.substring('data:;base64,'.length));									
							thisPlugin.textstring = res;
							thisPlugin.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnTextLoaded, thisPlugin);
						};
					}(f[i]);
					thisPlugin.reader.readAsDataURL(f[i]);	
			}else{
				thisPlugin.textstring = "Unsupported file format";
			}
			
			//if(thisPlugin.allowedImage == true && (f[i].type.indexOf("image") == 0)&& !(f[i].type.indexOf("image/svg") == 0)){
			if(thisPlugin.allowedImage == true && (	f[i].name.endsWith("png") 
													|| f[i].name.endsWith("jpg") 
													|| f[i].name.endsWith("jpeg") 
													|| f[i].name.endsWith("bmp") 
													|| f[i].name.endsWith("gif")
													|| f[i].name.endsWith("xbm") 
												) ){
				thisPlugin.textstring = "";
				thisPlugin.reader.onload = function(theFile) {
					return function(e) {
						thisPlugin.imgDnD.src = e.target.result;
						//dNdbase64string = imgDnD.src;
						thisPlugin.base64string = e.target.result;
						thisPlugin.textstring = "";
						thisPlugin.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnImageLoaded, thisPlugin);
					};
				}(f[i]);
				thisPlugin.reader.readAsDataURL(f[i]);	
			}
			//if(thisPlugin.allowedText == true && ( (f[i].type.indexOf("text") == 0) || (f[i].type.indexOf("image/svg") == 0))){
			if(thisPlugin.allowedText == true && (	f[i].name.endsWith("txt") 
												//|| f[i].name.endsWith("log") 
												|| f[i].name.endsWith("xml") 
												|| f[i].name.endsWith("svg") 												
												//|| f[i].name.endsWith("tmx") 	
												|| f[i].name.endsWith("html") 	
												|| f[i].name.endsWith("htm") 	
												) ){
				thisPlugin.textstring = "";
				thisPlugin.reader.onload = function(theFile) {
					return function(e) {
						//imgDnD.src = e.target.result;
						//dNdtextstring = e.target.result;
						//thisPlugin.fakeImgDnD.src = "done";
						var str = e.target.result;
						var res = "Unsupported file format";
						if(str.indexOf("html") == 10)
							res = atob(str.substring('data:text/html;base64,'.length));
						if(str.indexOf("xml") == 10)
							res = atob(str.substring('data:text/xml;base64,'.length));							
						if(str.indexOf("plain") == 10)
							res = atob(str.substring('data:text/plain;base64,'.length));														
						if(str.indexOf("image/svg+xml") == 5)
							res = atob(str.substring('data:image/svg+xml;base64,'.length));									
						thisPlugin.textstring = res;
						thisPlugin.runtime.trigger(cr.plugins_.Pode_DragNDropZone.prototype.cnds.OnTextLoaded, thisPlugin);
					};
				}(f[i]);
				thisPlugin.reader.readAsDataURL(f[i]);	
			}			
		}
	}
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.base64ImageString = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//this.base64string = dNdbase64string;
		ret.set_string(this.base64string);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.last_Filetype = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//this.last_Filetype = last_Filetype;
		ret.set_string(this.last_Filetype);				// return our value
	};
	Exps.prototype.textstring = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//this.textstring = dNdtextstring;
		ret.set_string(this.textstring);				// return our value
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());