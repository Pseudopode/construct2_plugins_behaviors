// Scripts in this file are included in both the IDE and runtime, so you only
// need to write scripts common to both once.


/**
 * flood fill algorithm 
 * image_data is an array with pixel information as provided in canvas_context.data
 * (x, y) is starting point and color is the color used to replace old color
 */
function flood_fill(image_data, canvas_width, canvas_height, x, y, _color) {
	if (x<0 || x>canvas_width){		return;}
	if (y<0 || y>canvas_height){	return;}
		
	//convert color
	var color = $('<div></div>').css('background-color', _color).css('background-color').slice(4,-1).split(",");
    var components = 4; //rgba

    // unpack values
    var  fillColorR = color[0];
    var  fillColorG = color[1];
    var  fillColorB = color[2];

    // get start point
    var pixel_pos = (y*canvas_width + x) * components;
    var startR = image_data[pixel_pos];
    var startG = image_data[pixel_pos + 1];
    var startB = image_data[pixel_pos + 2];
    
    if(fillColorR==startR && fillColorG==startG && fillColorB==startB)
        return;  //prevent inf loop.

    function matchStartColor(pixel_pos) {
      return startR == image_data[pixel_pos] && 
             startG == image_data[pixel_pos+1] &&
             startB == image_data[pixel_pos+2];
    }

    function colorPixel(pixel_pos) {
      image_data[pixel_pos] = fillColorR;
      image_data[pixel_pos+1] = fillColorG;
      image_data[pixel_pos+2] = fillColorB;
      image_data[pixel_pos+3] = 255;
    }

    var pixelStack = [[x, y]];

    while(pixelStack.length)
    {
      var newPos, x, y, pixel_pos, reachLeft, reachRight;
      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];
      
      pixel_pos = (y*canvas_width + x) * components;
      while(y-- >= 0 && matchStartColor(pixel_pos))
      {
        pixel_pos -= canvas_width * components;
      }
      pixel_pos += canvas_width * components;
      ++y;

      var sides = [];
      sides[-1] = false;
      sides[1] = false;

      function trace(dir) {
          if(matchStartColor(pixel_pos + dir*components)) {
            if(!sides[dir]) {
              pixelStack.push([x + dir, y]);
              sides[dir]= true;
            }
          }
          else if(sides[dir]) {
            sides[dir]= false;
          }
      }

      while(y++ < canvas_height-1 && matchStartColor(pixel_pos)) {
        colorPixel(pixel_pos);

        // left side
        if(x > 0) {
            trace(-1);
        }

        // right side
        if(x < canvas_width-1) { 
            trace(1);
        }
        pixel_pos += canvas_width * components;

      }
    }
}


// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.c2canvas = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.c2canvas.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
		// Create the texture
		this.texture_img = new Image();
		this.texture_img.src = this.texture_file;
		this.texture_img.cr_filesize = this.texture_filesize;
		
		// Tell runtime to wait for this to load
		this.runtime.wait_for_textures.push(this.texture_img);
		
		//this.pattern = null;
		this.webGL_texture = null;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];

	instanceProto.effectToCompositeOp = function(effect)
	{
		// (none) = source-over
		if (effect <= 0 || effect >= 11)
			return "source-over";
			
		// (none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	
	instanceProto.updateBlend = function(effect)
	{
		var gl = this.runtime.gl;
		
		if (!gl)
			return;
			
		// default alpha blend
		this.srcBlend = gl.ONE;
		this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		
		switch (effect) {
		case 1:		// lighter (additive)
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.SRC_ALPHA;
			break;
		}	
	};

	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.compositeOp = this.effectToCompositeOp(this.properties[1]);
		this.updateBlend(this.properties[1]);
		this.canvas = document.createElement('canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.drawImage(this.type.texture_img,0,0,this.width,this.height);
		
		//temporary canvas for layer pasting
		this.tCanvas = document.createElement('canvas');
		this.tCtx = this.tCanvas.getContext('2d');		
		
		this.rcTex = new cr.rect(0, 0, 0, 0);
		if (this.runtime.gl && !this.type.webGL_texture)
			this.type.webGL_texture = this.runtime.glwrap.loadTexture(this.type.texture_img, true, this.runtime.linearSampling);
	};
	
	//helper function
	instanceProto.draw_instances = function (instances, ctx)
	{
		for(var x in instances)
		{
			if(instances[x].visible==false && this.runtime.testOverlap(this, instances[x])== false)
				continue;
			
			ctx.save();
			ctx.scale(this.canvas.width/this.width, this.canvas.height/this.height);
			ctx.rotate(-this.angle);
			ctx.translate(-this.bquad.tlx, -this.bquad.tly);
            ctx.globalCompositeOperation = instances[x].compositeOp;//rojo
			instances[x].draw(ctx);
			ctx.restore();
		}
	};
	
	instanceProto.draw = function(ctx)
	{	
		ctx.save();
		
		ctx.globalAlpha = this.opacity;
		ctx.globalCompositeOperation = this.compositeOp;
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
				
		ctx.drawImage(this.canvas,
						  0 - (this.hotspotX * this.width),
						  0 - (this.hotspotY * this.height),
						  this.width,
						  this.height);
		
		ctx.restore();
	};

	instanceProto.drawGL = function(glw)
	{
		glw.setBlend(this.srcBlend, this.destBlend);
		var tex=glw.loadTexture(this.canvas, false, this.runtime.linearSampling);
		glw.setTexture(tex);
		glw.setOpacity(this.opacity);

		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			
			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		glw.deleteTexture(tex);
	};




	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	// Conditions
	function Cnds() {};
	// For the collision memory in 'On collision'.
	// TODO: optimise... this is O(n^2), use some kind of set
	function collmemory_add(collmemory, a, b)
	{
		collmemory.push([a, b]);
	};
	
	function collmemory_remove(collmemory, a, b)
	{
		// Find any item that matches [a, b]
		var i, j = 0, len, entry;
		for (i = 0, len = collmemory.length; i < len; i++)
		{
			entry = collmemory[i];
			
			// This pair doesn't match
			if (!((entry[0] === a && entry[1] === b) || (entry[0] === b && entry[1] === a)))
			{
				// OK to keep
				collmemory[j] = collmemory[i];
				j++;
			}
		}
		
		collmemory.length = j;
	};
	
	function collmemory_removeInstance(collmemory, inst)
	{
		// Find any item that contains inst and remove it
		var i, j = 0, len, entry;
		for (i = 0, len = collmemory.length; i < len; i++)
		{
			entry = collmemory[i];
			
			// Not referenced in either in this entry
			if (entry[0] !== inst && entry[1] !== inst)
			{
				// OK to keep
				collmemory[j] = collmemory[i];
				j++;
			}
		}
		
		collmemory.length = j;
	};
	
	function collmemory_has(collmemory, a, b)
	{
		// Find any item that matches [a, b]
		var i, len, entry;
		for (i = 0, len = collmemory.length; i < len; i++)
		{
			// Matches a and b?
			entry = collmemory[i];
			
			if ((entry[0] === a && entry[1] === b) || (entry[0] === b && entry[1] === a))
				return true;
		}
		
		return false;
	};
	Cnds.prototype.OnCollision = function (rtype)
	{	
		if (!rtype)
			return false;
			
		var runtime = this.runtime;
			
		// Static condition: perform picking manually.
		// Get the current condition.  This is like the 'is overlapping' condition
		// but with a built in 'trigger once' for the l instances.
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		
		// Create the collision memory, which remembers pairs of collisions that
		// are already overlapping
		if (!cnd.extra.collmemory)
		{
			cnd.extra.collmemory = [];
			
			// Since this is one-time initialisation, also add a destroy callback
			// to remove any instance references from memory
			runtime.addDestroyCallback((function (collmemory) {
				return function(inst) {
					collmemory_removeInstance(collmemory, inst);
				};
			})(cnd.extra.collmemory));
		}
		
		// Get the currently active SOLs for both objects involved in the overlap test
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances = rsol.getObjects();
		
		// Iterate each combination of instances
		var l, lenl, linst, r, lenr, rinst;
		var curlsol, currsol;
		
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		
		for (l = 0, lenl = linstances.length; l < lenl; l++)
		{
			linst = linstances[l];
			
			for (r = 0, lenr = rinstances.length; r < lenr; r++)
			{
				rinst = rinstances[r];
				
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					// Collision memory has this pair: ignore it.  Only fire if no pair in memory.
					if (!collmemory_has(cnd.extra.collmemory, linst, rinst))
					{
						collmemory_add(cnd.extra.collmemory, linst, rinst);
						
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						
						// If ltype === rtype, it's the same object (e.g. Sprite collides with Sprite)
						// In which case, pick both instances
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
						}
						else
						{
							// Pick each instance in its respective SOL
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
						}
						
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					// Pair not overlapping: ensure any record removed so next overlap triggers event
					collmemory_remove(cnd.extra.collmemory, linst, rinst);
				}
			}
		}
		
		// We've aleady run the event by now.
		return false;
	};
	
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
			
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		
		if (rsol.select_all)
			rinstances = rsol.type.instances;
		else if (orblock)
			rinstances = rsol.else_instances;
		else
			rinstances = rsol.instances;
		
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			
			// objects overlap: true for this instance, ensure both are picked
			// (if ltype and rtype are same, e.g. "Sprite overlaps Sprite", don't pick the other instance,
			// it will be picked when it gets iterated to itself)
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				
				// Inverted condition: just bail out now, don't pick right hand instance -
				// also note we still return true since the condition invert flag makes that false
				if (inverted)
					break;
					
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		
		return ret;
	};
	
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			
			if (sol.select_all)
			{
				// All selected: filter down to just those in topick
				sol.select_all = false;
				sol.instances.length = topick.length;
			
				for (i = 0, len = topick.length; i < len; i++)
				{
					sol.instances[i] = topick[i];
				}
				
				// In OR blocks, else_instances must also be filled with objects not in topick
				if (orblock)
				{
					sol.else_instances.length = 0;
					
					for (i = 0, len = rpicktype.instances.length; i < len; i++)
					{
						inst = rpicktype.instances[i];
						
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				var initsize = sol.instances.length;
				sol.instances.length = initsize + topick.length;
			
				for (i = 0, len = topick.length; i < len; i++)
				{
					sol.instances[initsize + i] = topick[i];
					
					if (orblock)
						cr.arrayFindRemove(sol.else_instances, topick[i]);
				}
			}
		}
		
		rtopick.clear();
		needscollisionfinish = false;
	};
	
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	pluginProto.cnds = new Cnds();
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetEffect = function (effect)
	{	
		this.compositeOp = this.effectToCompositeOp(effect);
		this.runtime.redraw = true;
	};
	
	acts.DrawPoint = function (x,y, color)
	{	
		var ctx=this.ctx;
		ctx.fillStyle = color;
		ctx.fillRect(x,y,1,1);
		this.runtime.redraw = true;
	};
	
	acts.ResizeCanvas = function (width, height)
	{
		this.canvas.width=width;
		this.canvas.height=height;
		this.runtime.redraw = true;
	};
	
	acts.PasteObject = function (object)
	{
		var ctx=this.ctx;
		this.update_bbox();
		
		var sol = object.getCurrentSol();
		var instances;
		if (sol.select_all)
			instances = sol.type.instances;
		else
			instances = sol.instances;
		
		this.draw_instances(instances, ctx);
		//jQuery("body").append(this.canvas);
		
		this.runtime.redraw = true;
	};
	
	acts.PasteLayer = function (layer)
	{
		if (!layer || !layer.visible)
			return false;
    
		var ctx=this.ctx;
		this.update_bbox();
    
		//resize the temporary canvas to fit the size of the object
		this.tCanvas.width=this.canvas.width;
		this.tCanvas.height=this.canvas.height;
 
 		var t=this.tCtx;
    
		//clear the temporary canvas
		t.clearRect(0,0,this.tCanvas.width, this.tCanvas.height);
	
		this.draw_instances(layer.instances, t);
		
		//paste the temporary canvas into the real one
		ctx.drawImage(this.tCanvas,0,0,this.width,this.height);
			
		this.runtime.redraw = true;
	};
	
	acts.DrawBox = function (x, y, width, height, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x,y,width,height);
		this.runtime.redraw = true;
	};
	
	acts.DrawLine = function (x1, y1, x2, y2, color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.beginPath();  
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2, y2); 
		ctx.stroke();
		this.runtime.redraw = true;
	};
	
	acts.ClearCanvas = function ()
	{
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		this.runtime.redraw = true;
	};
	
	acts.FillColor = function (color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
		this.runtime.redraw = true;
	};
	
	acts.fillGradient = function (gradient_style, color1, color2)
	{
		var ctx = this.ctx;
		var w =this.canvas.width;
		var h=this.canvas.height;
		var gradient;
		
		switch(gradient_style)
		{
		case 0: //horizontal
			gradient = ctx.createLinearGradient(0,0,w,0);
			break;
		case 1: //vertical
			gradient = ctx.createLinearGradient(0,0,0,h);
			break;
		case 2: //diagonal_down_right
			gradient = ctx.createLinearGradient(0,0,w,h);
			break;
		case 3: //diagonal_down_left
			gradient = ctx.createLinearGradient(w,0,0,h);
			break;
		case 4: //radial
			gradient = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2, Math.sqrt(w^2+h^2)/2);
			break;
		}
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);
		this.ctx.fillStyle = gradient;
		
		this.ctx.fillRect(0, 0, w, h);
		this.runtime.redraw = true;
	};
	
	acts.beginPath = function ()
	{
		this.ctx.beginPath();
	};
	
	acts.drawPath = function (color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.stroke();
		this.runtime.redraw = true;
	};
	
	acts.setLineSettings = function (line_cap, line_joint)
	{
		var ctx = this.ctx;
		ctx.lineCap = ["butt","round","square"][line_cap];
		ctx.lineJoin = ["round","bevel","milet"][line_joint];
	};
	
	acts.fillPath = function (color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.runtime.redraw = true;
	};
	
	acts.moveTo = function (x, y)
	{
		this.ctx.moveTo(x, y);
	};
	
	acts.lineTo = function (x, y)
	{
		this.ctx.lineTo(x, y);
	};
	
	acts.arc = function (x, y, radius, start_angle, end_angle, arc_direction)
	{
		this.ctx.arc(x, y, radius, cr.to_radians(start_angle), cr.to_radians(end_angle), arc_direction==1);
	};
	
	acts.drawCircle = function (x, y, radius, color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, cr.to_radians(360), true);  
		ctx.stroke();
		this.runtime.redraw = true;
	};
	
	acts.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y)
	{
		this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	};
	
	acts.quadraticCurveTo = function (cpx, cpy, x, y)
	{
		this.ctx.quadraticCurveTo(cpx, cpy, x, y);
	};
	
	acts.rectPath = function (x, y, width, height)
	{
		this.ctx.rect(x,y,width,height);
	};
	
	acts.FloodFill= function (x,y,color)
	{
		var ctx = this.ctx;
		var I = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		
		//flood_fill(I.data, this.canvas.width, this.canvas.height, x, y, [255, 0, 0]);
		//instanceProto.flood_fill(I.data, this.canvas.width, this.canvas.height, x, y, color);
		flood_fill(I.data, this.canvas.width, this.canvas.height, x, y, color);
		ctx.putImageData(I,0,0);
		
		this.runtime.redraw = true;
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	exps.rgbaAt = function (ret, x, y)
	{
/*var cvsTmp = document.createElement("canvas");
var ctxTmp = cvsTmp.getContext("2d");
var imgTmp = document.createElement("image");
imgTmp.onload = function(){
	jQuery("body").append(imgTmp);
}
imgTmp.src = this.canvas.toDataURL();*/
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_string("rgba(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3]/255 + ")");
	};
	
	exps.imageUrl = function (ret)
	{
		ret.set_string(this.canvas.toDataURL());
	};
    
    exps.AsJSON = function(ret)
    {
        ret.set_string( JSON.stringify({
			"c2array": true,
			"size": [1, 1, this.canvas.width * this.canvas.height * 4],
			"data": [[this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data]]
		}));
    };

}());