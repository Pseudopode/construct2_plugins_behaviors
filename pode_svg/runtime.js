// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SVGCanvas = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SVGCanvas.prototype;
		
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
		//this.mySVG = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.SVGstring = '';
		
		this.divSVG = document.createElement('div');
		this.divSVG.setAttribute("id","divSVG");
		this.divSVG.setAttribute("width",this.width);
		this.divSVG.setAttribute("height",this.height);
		var viewBox = "0 0 "+ this.width+ " " + this.height;
		this.divSVG.setAttribute("viewBox",viewBox);
		
		/*this.svgElem = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg' />";
		this.divSVG.innerHTML = this.svgElem;*/
		//this.divSVG.style.cssText="position:absolute;top:150px;left:30px;"+"width:300px;"+"height:200px;"+"background-color:#EEEEEE;";
		/*var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;*/
		/*this.divSVG.style.cssText="position:absolute;top:"+offx+"px;left:"+offy+"px;"+
								"width:"+this.width+"px;"+
								"height:"+this.height+"px;"+
								"background-color:#EEEEEE;";*/
		//this.divSVG.style.cssText="background-color:#EEEEEE;";
		
		if(this.properties[1] != ""){
			this.divSVG.innerHTML = this.properties[1];
		}
		
		jQuery("body").append(this.divSVG);
		
		//this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
		/*this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg'>" +
				//"<circle id='svgC' cx='100' cy='50' r='40' stroke='black' stroke-width='2' fill='red' />"+
				//"<circle id='svgC' cx='"+ this.hotspotX +"' cy='"+ this.hotspotY +"' r='40' stroke='black' stroke-width='2' fill='red' />"+
				"<circle id='svgC' r='40' stroke='black' stroke-width='2' fill='red' />"+
				//"<circle id='svgC' cx='"+ offx +"' cy='"+ offy +"' r='40' stroke='black' stroke-width='2' fill='red' />"+
			"</svg>";*/
			
		this.elem = this.divSVG; //faster than change that everywhere else
			
		this.runtime.redraw = true;
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
	
	/*instanceProto.importSVG = function (sourceSVG, targetCanvas) {
		// https://developer.mozilla.org/en/XMLSerializer
		//var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		//var ctx = targetCanvas.getContext('2d');
		var xmldom = document.implementation.createDocument(
			'http://www.w3.org/1999/xhtml',
			'html',
			null
		);

		xmldom.replaceChild(
			xmldom.importNode(sourceSVG, true),
			xmldom.documentElement
		);

		// this is just a JavaScript (HTML) image
		var img = new Image();
		// http://en.wikipedia.org/wiki/SVG#Native_support
		// https://developer.mozilla.org/en/DOM/window.btoa
		img.src = "data:image/svg+xml;base64," + btoa(xmldom);

		img.onload = function() {
			// after this, Canvas’ origin-clean is DIRTY
			targetCanvas.drawImage(img, 300, 300);
		}
}*/
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
		//		
		/*ctx.save();
	
		var svg_xml = (new XMLSerializer()).serializeToString(document.getElementById("mySVG"));

		// this is just a JavaScript (HTML) image
		var img = new Image();
		img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
 
		ctx.drawImage(img, this.hotspotX, this.hotspotY);
				
		ctx.restore();*/
		
		//this.runtime.redraw = true;

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
	/*cnds.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	/*acts.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	
	//acts.pasteAt = function (x, y, string)
	acts.pasteAt = function (string)
	{
		/*document.getElementById('svgC').setAttribute('cx',x);
		document.getElementById('svgC').setAttribute('cy',y);*/
		/*this.hotspotX = x;
		this.hotspotY = y;*/
		
		//var pastedString = "<cx='"+x+"' cy='"+y+"'"+string+"/>";
		var pastedString = string;
		this.SVGstring += pastedString;
		//jQuery(this.svgElem).append(circle);
		//this.svgElem.innerHTML = this.svgElem.innerHTML+circle;
		//this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg'>" +
		//jQuery(this.divSVG).append(circle);
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		
		//this.elem.setAttribute("style","filter:url(#desaturate) }");
		
		this.updatePosition();
		this.runtime.redraw = true;
	};
	
	acts.pasteURL = function (url, ID, width, height,x,y)
	{
		/*document.getElementById('svgC').setAttribute('cx',x);
		document.getElementById('svgC').setAttribute('cy',y);*/
		/*this.hotspotX = x;
		this.hotspotY = y;*/
		
		//var pastedString = "<cx='"+x+"' cy='"+y+"'"+string+"/>";
		var pastedString = "<image id='"+ID+"' width='"+width+"' height='"+height+"' xlink:href='"+url+"' x='"+x+"' y='"+y+"'/>";
		//var pastedString = "<image id='"+ID+"' width='"+width+"' height='"+height+"' href='"+url+"' x='"+x+"' y='"+y+"'/>";
		this.SVGstring += pastedString;
		//jQuery(this.svgElem).append(circle);
		//this.svgElem.innerHTML = this.svgElem.innerHTML+circle;
		//this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg'>" +
		//<image id="MyImage" width='672' height='359' xlink:href='http://static1.scirra.net/images/construct2-splash.jpg'/>
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		
		//this.elem.setAttribute("style","filter:url(#desaturate) }");
		
		this.updatePosition();
		this.runtime.redraw = true;
	};
	
	acts.drawCircle = function (x, y, radius, stroke_color, fill_color, line_width, ID)
	{
		/*var circle = "<svg xmlns='http://www.w3.org/2000/svg'>" +
				"<circle id='"+ID+"' cx='"+x+"' cy='"+y+"' r='"+radius+"' stroke='"+stroke_color+"' stroke-width='"+line_width+"' fill='"+fill_color+"' />"+
			"</svg>";*/
		var circle = "<circle id='"+ID+"' cx='"+x+"' cy='"+y+"' r='"+radius+"' stroke='"+stroke_color+"' stroke-width='"+line_width+"' fill='"+fill_color+"' />";
		this.SVGstring += circle;
		//jQuery(this.svgElem).append(circle);
		//this.svgElem.innerHTML = this.svgElem.innerHTML+circle;
		//this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg'>" +
		//jQuery(this.divSVG).append(circle);
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		this.updatePosition();
		this.runtime.redraw = true;
		
	};
	
	acts.drawRectangle = function (x, y, width, height, stroke_color, fill_color, line_width,rx ,ry, ID)
	{
		/*var circle = "<svg xmlns='http://www.w3.org/2000/svg'>" +
				"<circle id='"+ID+"' cx='"+x+"' cy='"+y+"' r='"+radius+"' stroke='"+stroke_color+"' stroke-width='"+line_width+"' fill='"+fill_color+"' />"+
			"</svg>";*/
		var rectangle = "<rect id='"+ID+"' x='"+x+"' y='"+y+"' rx='"+rx+"' ry='"+ry+"' width='"+width+"' height='"+height+"'stroke='"+stroke_color+"' stroke-width='"+line_width+"' fill='"+fill_color+"' />";
		this.SVGstring += rectangle;
		//jQuery(this.svgElem).append(circle);
		//this.svgElem.innerHTML = this.svgElem.innerHTML+circle;
		//this.divSVG.innerHTML = "<svg id='mySVG' xmlns='http://www.w3.org/2000/svg'>" +
		//jQuery(this.divSVG).append(circle);
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		this.updatePosition();
		this.runtime.redraw = true;
	};
	
	acts.changeAttribute = function(ID,attribute,value)
	{
		//document.getElementById(ID).setAttribute(attribute,value);
		var elementTested = document.getElementById(ID);
		if(elementTested.hasAttribute(attribute)){
			elementTested.setAttribute(attribute,value);
		}else{
			//elementTested.createAttribute(attribute);
			var newAttribute = document.createAttribute(attribute);
			newAttribute.value = value;
			elementTested.setAttribute(newAttribute);
		}
		
		
		var newInnerSVG = this.divSVG.innerHTML;
		newInnerSVG = newInnerSVG.substring("<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>".length,newInnerSVG.length-6);
		
		/*if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){ //chrome bugfix
			//this.SVGstring.replace('href','xlink:href');
			newInnerSVG.replace('href'/gi,'xlink:href'); //case insensitive, several times
		}*/
		this.SVGstring = newInnerSVG;
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		
		this.updatePosition();
		this.runtime.redraw = true;
	};
	
	acts.changeTextContent = function(ID, newText)
	{
		var elementTested = document.getElementById(ID);
		elementTested.textContent = newText;
	};
	
	acts.createSaturationEffect = function(intensity,ID)
	{
		var newSatEffect = "<defs><filter id='"+ID+"'><feColorMatrix type='saturate' values='"+intensity+"'/></filter></defs>";
		this.SVGstring += newSatEffect;
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
	};
	
	acts.createBlurEffect = function(intensity,ID)
	{
		var newBlurEffect = "<defs><filter id='"+ID+"'><feGaussianBlur stdDeviation='"+intensity+"'/></filter></defs>";
		this.SVGstring += newBlurEffect;
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
	};
	
	//acts.applySaturationEffect = function(effectID,targetID,x,y,width,height)
	//acts.applyEffect = function(effectID,targetID)
	acts.applyEffect = function(effectID,targetID,x,y,width,height)
	{
		var filterString = "url(#"+effectID+")";
		var filteredElement = document.getElementById(targetID);
		filteredElement.setAttribute("filter",filterString);
		
		/*this.divSVG = document.getElementById("divSVG");
		this.divSVG.replaceChild(this.divSVG.getElementById(targetID),filteredElement);*/

		var newInnerSVG = this.divSVG.innerHTML;
		newInnerSVG = newInnerSVG.substring("<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>".length,newInnerSVG.length-6);

		if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){ //chrome bugfix
			//this.SVGstring.replace('href','xlink:href');
			//newInnerSVG.replace('href'/gi,'xlink:href'); //case insensitive, several times
			var tmp = newInnerSVG.replace('href','xlink:href'); //case insensitive, several times
			newInnerSVG = tmp;
		}
		this.SVGstring = newInnerSVG;
		this.divSVG.innerHTML = "<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>"+this.SVGstring+"</svg>";
		/*var newInnerSVG = this.divSVG.innerHTML;
		newInnerSVG = newInnerSVG.substring("<svg id='svgElem' xmlns='http://www.w3.org/2000/svg'>".length,newInnerSVG.length-6);
		//newInnerSVG.replace('href','xlink:href');
		var tmp = newInnerSVG.replace( new RegExp("image","g"),"MEUH");
		alert(tmp);*/
		
		this.updatePosition();
		this.runtime.redraw = true;
	};
	
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	/*exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	// the example expression
	exps.myAttribute = function (ret,ID,attribute)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var attribute = document.getElementById(ID).getAttribute(attribute);
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
		ret.set_string(attribute);		// for ef_return_string
	};

	exps.base64String = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//var attribute = document.getElementById(ID).getAttribute(attribute);
		/*var tmpCvs = document.createElement('canvas');
		var tmpCtx = tmpCvs.getContext("2d");*/
		
		var tmpSVG = document.getElementById("svgElem");
		
		/*SVGToCanvas.convert(tmpSVG,tmpCtx);
		var tmpString = tmpCvs.toDataURL("image/png");*/
		var svg_xml = SVGToCanvas.xmlSerialize(tmpSVG);
		// ff fails here, http://en.wikipedia.org/wiki/SVG#Native_support
		var tmpString = SVGToCanvas.base64dataURLencode(svg_xml);
		ret.set_string(tmpString);		// for ef_return_string
	};
	
	
}());