// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Pode_Pin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.Pode_Pin.prototype;
		
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
		this.pinObject = null;
		this.pinAngle = 0;
		this.pinDist = 0;
		this.myStartAngle = 0;
		this.theirStartAngle = 0;
		this.lastKnownAngle = 0;
		
		//
		this.angleOnly = false;
		this.distanceOnly = false;
		this.pinDistX = 0;
		this.pinDistY = 0;
		//
		
		// Need to know if pinned object gets destroyed
		this.myDestroyCallback = (function (self) {
											return function(inst) {
												self.onInstanceDestroyed(inst);
											};
										})(this);
										
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.onInstanceDestroyed = function (inst)
	{
		// Pinned object being destroyed
		if (this.pinObject == inst)
			this.pinObject = null;
	};
	
	behinstProto.onDestroy = function()
	{
		this.pinObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.tick = function ()
	{
		// do work in tick2 instead, after events to get latest object position
	};

	behinstProto.tick2 = function ()
	{
		if (!this.pinObject)
			return;
			
		// Instance angle has changed by events/something else
		if (this.lastKnownAngle !== this.inst.angle)
			this.myStartAngle = cr.clamp_angle(this.myStartAngle + (this.inst.angle - this.lastKnownAngle));
		
		var newx;
		var newy;
		var newangle;
		if(this.angleOnly == true && this.distanceOnly == false){ // ANGLE ONLY
			newx = this.inst.x; //keep x
			newy = this.inst.y; //keep y
			newangle = this.pinObject.angle; //other inst angle
		}
		if(this.angleOnly == false && this.distanceOnly == true){ //DISTANCE ONLY
			newx = this.pinObject.x - this.pinDistX; //other inst x - dist
			newy = this.pinObject.y - this.pinDistY;//other inst y - dist
			newangle = this.inst.angle; //keep angle
		}
		if(this.angleOnly == false && this.distanceOnly == false){//NORMAL BEHAVIOR (i.e. ANGLE & DISTANCE)
			newx = this.pinObject.x + Math.cos(this.pinObject.angle + this.pinAngle) * this.pinDist;
			newy = this.pinObject.y + Math.sin(this.pinObject.angle + this.pinAngle) * this.pinDist;
			newangle = cr.clamp_angle(this.myStartAngle + (this.pinObject.angle - this.theirStartAngle));
		}
		this.lastKnownAngle = newangle;
		
		if (this.inst.x !== newx || this.inst.y !== newy || this.inst.angle !== newangle)
		{
			this.inst.x = newx;
			this.inst.y = newy;
			this.inst.angle = newangle;
			this.inst.set_bbox_changed();
		}
	};

	//////////////////////////////////////
	// Conditions
	behaviorProto.cnds = {};
	var cnds = behaviorProto.cnds;

	cnds.IsPinned = function ()
	{
		return !!this.pinObject;
	};

	//////////////////////////////////////
	// Actions
	behaviorProto.acts = {};
	var acts = behaviorProto.acts;

	acts.Pin = function (obj)
	{
		if (!obj)
			return;
			
		var otherinst = obj.getFirstPicked();
		
		if (!otherinst)
			return;
			
		this.pinObject = otherinst;
		
		if(this.distanceOnly == true){
			this.pinAngle = this.angle;
			this.pinDist = cr.distanceTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y);
			this.pinDistX = Math.abs(otherinst.x-this.inst.x);
			this.pinDistY = Math.abs(otherinst.y-this.inst.y);
		}
		if(this.angleOnly == true){
			this.pinAngle = cr.angleTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y) - otherinst.angle;
			this.pinDist = 0;
		}
		if(this.distanceOnly == false && this.angleOnly == false){
			this.pinAngle = cr.angleTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y) - otherinst.angle;
			this.pinDist = cr.distanceTo(otherinst.x, otherinst.y, this.inst.x, this.inst.y);$
		}
		this.myStartAngle = this.inst.angle;
		this.lastKnownAngle = this.inst.angle;
		this.theirStartAngle = otherinst.angle;
	};
	
	acts.Unpin = function ()
	{
		this.pinObject = null;
	};

	acts.pinByAngleOnly = function (en)
	{
		if(en == true){
			this.angleOnly = true;
			this.distanceOnly = false;
		}else{
			this.angleOnly = false;
			this.distanceOnly = false;
		}
	};
		
	acts.pinByDistanceOnly = function (en)
	{
		if(en == true){
			this.angleOnly = false;
			this.distanceOnly = true;
		}else{
			this.angleOnly = false;
			this.distanceOnly = false;
		}
	};
		
	//////////////////////////////////////
	// Expressions
	behaviorProto.exps = {};
	var exps = behaviorProto.exps;

	exps.pinnedToUID = function (ret)
	{
		ret.set_int(this.pinObject.uid);
	};
	
}());