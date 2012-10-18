// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.UITemplates = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.UITemplates.prototype;
		
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
		this.objectList = new Array();
		this.numberOfObjects = 0;
		
		this.numberOfColumns = this.properties[1];
		this.numberOfRows = this.properties[2];
		this.leftBorder = this.properties[5];
		this.topBorder = this.properties[6];
		this.rightBorder = this.properties[7];
		this.bottomBorder = this.properties[8];
		
		this.fillColor = this.properties[3];
		this.outline = this.properties[4];
		/*this.outlineColor = this.properties[2];
		this.size = this.properties[3];
		this.visible = (this.properties[4] === 0);	// 0=visible, 1=invisible*/
		
		this.runtime.redraw = true;
		this.updatePosition();
		this.runtime.tickMe(this);
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
		/*ctx.save();
		
		//if (this.opacity !== 1.0)
		//	ctx.globalAlpha = this.opacity;
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}*/
	
		/*var drawX = -(this.hotspotX * this.width/2);
		var drawY = -(this.hotspotY * this.height/2);*/
		var drawX = this.x;
		var drawY = this.y;
			
		/*ctx.translate(myx, myy);
		ctx.rotate(this.angle);
		ctx.translate(drawX, drawY);*/
				
		ctx.fillStyle = this.fillColor;
		ctx.lineWidth = this.size;
		
		
		ctx.fillRect(drawX, drawY, this.width, this.height);
		
		if (this.outline)
			{
				ctx.strokeStyle = this.outlineColor;
				ctx.strokeRect(drawX, drawY, this.width, this.height);
			}
			
		/*ctx.restore();*/
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
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
	
	acts.setCols = function (nbCols)
	{
		this.numberOfColumns = nbCols;
	};
	
	acts.setRows = function (nbRows)
	{
		this.numberOfRows = nbRows;
	};
	
	acts.setLeftBorder = function (leftInnerBorder)
	{
		this.leftBorder = leftInnerBorder;
	};
	
	acts.setTopBorder = function (topInnerBorder)
	{
		this.topBorder = topInnerBorder;
	};
	
	acts.setRightBorder = function (rightInnerBorder)
	{
		this.rightBorder = rightInnerBorder;
	};

	acts.setBottomBorder = function (bottomInnerBorder)
	{
		this.bottomBorder = bottomInnerBorder;
	};
	
	//add object to template
	acts.addObject = function (object)
	{
		// alert the message
		//this.objectList[this.numberOfObjects] = object.getCurrentSol()/*.instances[0].uid*/;
		//this.objectList[this.numberOfObjects] = object.getCurrentSol().type.instances[this.numberOfObjects];
		//var tmpObject = object.getCurrentSol();
		//var currentUID = object.getCurrentSol().instances[0].uid; //get UID of current pasted object
		//this.objectList[this.numberOfObjects] = object.getCurrentSol().type.instances[currentUID]; //store the object
		//this.objectList[this.numberOfObjects] = object.getCurrentSol().instances[this.numberOfObjects];
		this.objectList[this.numberOfObjects] = object.getCurrentSol().instances[0];
		//this.objectList[this.numberOfObjects] = object.uid;
		this.numberOfObjects++;
	};
	
	acts.refresh = function(){
		/*var startX = 0;	//where to start calculation for the contained widgets
		var startY = 0;*/
		
		//var numberOfWidgetsPerHorizLine = Math.floor(this.width/(this.numberOfObjects*this.objectList[0].instances[0].width)); //only objects of the same type
		//var numberOfWidgetsPerHorizLine = Math.floor(this.width/this.numberOfColumns); //only objects of the same type/same width
		//var numberOfWidgetsPerVertLine = Math.floor(this.width/this.numberOfRows); //only objects of the same type/same height
		
		/*var horizSpacePerWidget = this.width/(this.objectList[0].width); //how much space between widgets horizontally ?
		var vertSpacePerWidget = this.height/(this.objectList[0].height); //how much space between widgets vertically ?*/
		var horizSpacePerWidget = (this.width - this.leftBorder - this.rightBorder - 2*this.objectList[0].hotspotX*this.objectList[0].width)/(this.numberOfColumns-1); //how much space between widgets horizontally ? and "+1" for intervals"
		var vertSpacePerWidget = (this.height - this.topBorder - this.bottomBorder - 2*this.objectList[0].hotspotY*this.objectList[0].height)/(this.numberOfRows-1); //how much space between widgets vertically ? and "+1" for intervals"
		
		/*startX = this.x+this.width/2;
		startY = this.y+this.height/2;*/
		
		var startX = this.leftBorder/*+horizSpacePerWidget*/+this.objectList[0].hotspotX*this.objectList[0].width;
		var startY = this.topBorder/*+vertSpacePerWidget*/+this.objectList[0].hotspotY*this.objectList[0].height;
		var newX = startX;
		var newY = startY;
		for(var j = 0; j < this.numberOfRows; j++){
			for(var i = 0; i < this.numberOfColumns; i++){
				if(j*this.numberOfColumns+i > this.numberOfObjects -1) break; //avoid getting over our number of objects
				var tmpObject = this.objectList[j*this.numberOfColumns+i];
				/*tmpObject.instances[0].x = newX;
				tmpObject.instances[0].y = newY;*/
				/*tmpObject.x = newX - this.x; //-this.x because of offset
				tmpObject.y = newY - this.y;*/
				//var left = this.layer.layerToCanvas(newX, newY, true);
				//var top = this.layer.layerToCanvas(newX, newY, false);
				
				/*// Is entirely offscreen or invisible: hide
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
					
				jQuery(this.elem).show();*/
				
				//var offx = left + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().left);
				//var offy = top + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().top);
				/*jQuery(this.elem).offset({left: offx, top: offy});
				jQuery(this.elem).width(right - left);
				jQuery(this.elem).height(bottom - top);*/
				tmpObject.x = this.x+newX/*-this.leftBorder*//* + tmpObject.hotspotX*tmpObject.width*/; //-this.x because of offset //in fact no offset, because of the "+1" for intervals
				tmpObject.y = this.y+newY/*-this.topBorder*//* + tmpObject.hotspotY*tmpObject.height*/;
				/*this.objectList[i].instances[0].x = newX;
				this.objectList[i].instances[0].y = newY;*/
				newX += horizSpacePerWidget;
			}
			newX = startX;
			newY += vertSpacePerWidget;
		}
		
		this.runtime.redraw = true;
		this.updatePosition();
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
	exps.leftInnerBorder = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.leftBorder);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	exps.topInnerBorder = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.topBorder);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	exps.rightInnerBorder = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.rightBorder);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	exps.bottomInnerBorder = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.bottomBorder);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	exps.numberOfColumns = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.numberOfColumns);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	exps.numberOfRows = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.numberOfRows);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
}());