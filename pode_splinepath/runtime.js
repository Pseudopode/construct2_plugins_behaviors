// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
//           vvvvvvvvvv
cr.behaviors.pode_splinepath = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	// *** CHANGE THE BEHAVIOR ID HERE *** - must match the "id" property in edittime.js
	//                               vvvvvvvvvv
	var behaviorProto = cr.behaviors.pode_splinepath.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		//this.myProperty = this.properties[0];
		this.activated = this.properties[0];
		this.reverse = this.properties[1];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		// this.myValue = 0;
		//this.points = [(0,0),(100,100)];
		this.points = [];
		//
		//this.SplineObj = {};
		//this.splineObj = acts.buildSequence(this.points);
		this.points_ = acts.buildSequence(this.points);
		this.currX = -1;
		this.currY = -1;
		this.done = false;
		this.time = 0;
		
		this.tmpPoints = [];//for reverse
		//
	};

	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
		/*var css = jQuery.fx.end.getPos(jQuery.fx.pos);
		for (var i in css) {
				jQuery.fx.elem.style[i] = css[i];
		}*/
		//acts.buildSequence.getPos(dt);
		//this.splineObj.getPos(dt);
		//var points_ = acts.buildSequence(this.points);
		//var points_;
		if(this.done == false){
			this.points_ = acts.buildSequence(this.points);
			//this.tmpPoints = this.points;
			this.done = true;
		}else{
			if(this.activated == true){
				if(dt>0){
					this.time+=dt*0.1;
					this.points_.getPos(this.time);
					
					this.inst.x = behinstProto.currX;
					this.inst.y = behinstProto.currY;
					this.inst.set_bbox_changed();
				}
			}
		}
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	// the example condition
	/*cnds.IsMoving = function ()
	{
		// ... see other behaviors for example implementations ...
		return false;
	};*/

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	// the example action
	/*acts.Stop = function ()
	{
		// ... see other behaviors for example implementations ...
		this.activated = false;
	};
	
	acts.Start = function ()
	{
		// ... see other behaviors for example implementations ...
		this.activated = true;
	};*/

	
	acts.setActivated = function (s)
	{
		this.activated = s;
		//this.splineObj = acts.buildSequence(this.points);
		if(this.reverse == false){
			//behinstProto.splineObj = acts.buildSequence(this.points);
			this.points_ = acts.buildSequence(this.points);
		}else{
			//we repeat the array, in one direction and then in the other
			//this.tmpPoints = {};
			for(var i = 0; i < this.points.length;i++){
				this.tmpPoints.push(this.points[i]);
			}
			var j = this.points.length;
			for(var i = this.points.length -1 ; i >= 0;i--){
				this.tmpPoints.push(this.points[i]);
				j++;
			}
			this.points = null;
			this.points = this.tmpPoints;
			//behinstProto.splineObj = acts.buildSequence(this.points);
			this.points_ = acts.buildSequence(this.points);
		}
		//alert(points_.getPos(0.02).style);
		/*alert(behinstProto.currX);
		alert(behinstProto.currY);*/
		//behinstProto.done = true;
		/*var points_ = buildSequence(this.points);
		alert(points_.getPos(15));*/
	};  

	acts.AddPointOnPath = function (_x,_y)
	{
		this.points.push([_x,_y]);
	};  
	
	//helpers
	// Catmull-Rom interpolation between p0 and p1 for previous point p_1 and later point p2
	// http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull.E2.80.93Rom_spline
	//var interpolate = function (t, p_1, p0, p1, p2) {
	acts.interpolate = function (t, p_1, p0, p1, p2) {
			return Math.floor((t * ((2 - t) * t - 1) * p_1 +
					(t * t * (3 * t - 5) + 2) * p0 +
					t * ((4 - 3 * t) * t + 1) * p1 +
					(t - 1) * t * t * p2
					) / 2);
	};

	// Extend this p1,p2 sequence linearly to a new p3
	//var generateExtension = function (p1, p2) {
	acts.generateExtension = function (p1, p2) {
			return [
					p2[0] + (p2[0] - p1[0]),
					p2[1] + (p2[1] - p1[1])
					];

	};
	
	// Return an animation object based on a sequence of points
	// pointList must be an array of [x,y] pairs
	//$.crSpline.buildSequence = function(pointList) {
	//function buildSequence(pointList) {
	acts.buildSequence = function(pointList) {
		var res = {};
		var seq = [];
		var numSegments;

		if (pointList.length < 2) {
			//throw "crSpline.buildSequence requires at least two points";
			//throw "SplinePath requires at least two points";
			return;
		}

		// Generate the first p_1 so the caller doesn't need to provide it
		//seq.push(generateExtension(pointList[1], pointList[0]));
		seq.push(acts.generateExtension(pointList[1], pointList[0]));

		// Throw provided points on the list
		for (var i = 0; i < pointList.length; i++) {
				seq.push(pointList[i]);
		}

		// Generate the last p2 so the caller doesn't need to provide it
		//seq.push(generateExtension(seq[seq.length-2], seq[seq.length-1]));
		seq.push(acts.generateExtension(seq[seq.length-2], seq[seq.length-1]));

		numSegments = seq.length - 3;

		res.getPos = function (t) {
				// XXX For now, assume all segments take equal time
				var segNum = Math.floor(t * numSegments);
				if (segNum === numSegments) {
						return {
								left: seq[seq.length-2][0],
								top: seq[seq.length-2][1]
								};
				}
				var microT = (t - segNum/numSegments) * numSegments;
				//var microT = dt;
				behinstProto.currX = acts.interpolate(microT,
										seq[segNum][0],
										seq[segNum+1][0],
										seq[segNum+2][0],
										seq[segNum+3][0]);
				behinstProto.currY = acts.interpolate(microT,
										seq[segNum][1],
										seq[segNum+1][1],
										seq[segNum+2][1],
										seq[segNum+3][1]);
				var result = {
						left: behinstProto.currX + "px",
						top: behinstProto.currY + "px"
						};
				/*var result = {
						left: acts.interpolate(microT,
										seq[segNum][0],
										seq[segNum+1][0],
										seq[segNum+2][0],
										seq[segNum+3][0]) + "px",
						top: acts.interpolate(microT,
										seq[segNum][1],
										seq[segNum+1][1],
										seq[segNum+2][1],
										seq[segNum+3][1]) + "px"
						};*/
				return result;
		};
		return res;
	};
	
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	// the example expression
	/*exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
}());