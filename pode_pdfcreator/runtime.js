// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.PDFCreator = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.PDFCreator.prototype;
		
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
		this.doc = new pdf();
		this.filename ='';
		this.pdfAsDataURI ='';
		
		this.frame = document.createElement("iframe");
		this.frame.setAttribute("id","theFrame");
		this.frame.setAttribute("id","theFrame");
		
		{
			/* calculate displacement*/
			this.left = /*(this.browserName  == "webkit"? 0 :*/this.layer.layerToCanvas(this.x, this.y, true)-this.width*this.hotspotX/*)*/;
			this.top = /*(this.runtime.isWebKitMode ? 0 :*/this.layer.layerToCanvas(this.x, this.y, false)-this.height*this.hotspotY/*)*/;
			this.right = /*(this.runtime.isWebKitMode ? 0 :*/this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true)/*)*/;
			this.bottom = /*(this.runtime.isWebKitMode ? 0 :*/this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false)/*)*/;

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
		}
		
		jQuery(this.frame).attr('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;z-index:42;position:absolute;");

		jQuery('body').append(this.frame);
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
	acts.writeText = function (x,y,string,font)
	{
		this.doc.text(x, y, string);
		this.doc.setFont(font);
	};
	
	acts.pasteImage = function (x,y,obj)
	{
		var source_image = obj.animations[0].frames[obj.instances[0].cur_frame].texture_img;
		//when the image is loaded, we can encode en display it
		//source_image.onload = function(){	
			var quality = 100;
			var encoder = new JPEGEncoder(quality);
			
			var cvs = document.createElement('canvas');
			var ctx = cvs.getContext("2d");
		
			cvs.width = source_image.width;
			cvs.height = source_image.height;
			ctx.drawImage(source_image,0,0);
			var imagedata = ctx.getImageData(0, 0, cvs.width, cvs.height);

			//encode
			var encodedBytes = encoder.encodeToBytes(imagedata,quality/*, length*/);

			//display
			this.doc.addImage(encodedBytes,null,encoder.lengthOfJPEG,x,y,source_image.width,source_image.height);
		//}
	};

	acts.renderPDF = function ()
	{
			var tmpStr = "PDF"+new Date().getSeconds()+".pdf"
			this.filename = tmpStr;
			this.pdfAsDataURI = this.doc.output('datauri', {"fileName":this.fileName});
			//document.location = pdfAsDataURI;
			jQuery('#theFrame').attr('src',this.pdfAsDataURI);
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.pdfBase64String = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		 ret.set_string(this.pdfAsDataURI);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());