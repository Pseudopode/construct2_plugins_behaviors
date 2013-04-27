// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Pode_Geolocation = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Pode_Geolocation.prototype;
		
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

		this.pos = {};
		this.err = {};
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
			
  instanceProto.initiate_geolocation = function() {    
            this.pos=null;
            var self = this;
            navigator.geolocation.getCurrentPosition(
				function (_position){ 
                    self.pos=_position;
					self.runtime.trigger(cr.plugins_.Pode_Geolocation.prototype.cnds.isRequest, self);	
                },
				function(_err){
					self.err=_err;
					self.runtime.trigger(cr.plugins_.Pode_Geolocation.prototype.cnds.onErr, self);			
				}
			);  
      }

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.isRequest = function ()
	{
		return true;
	};
		Cnds.prototype.onErr = function ()
	{
		return true;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.Request = function ()
	{
		this.initiate_geolocation();
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	/*Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};*/
	// ... other expressions here ...
	Exps.prototype.latitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	
		if (this.pos.coords.latitude != null)
		{
			ret.set_float(this.pos.coords.latitude);				// return our value
		}
		else {
			ret.set_string("unavailable");
		}
			
	};
	Exps.prototype.longitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	
				// return our value
		if (this.pos.coords.longitude != null)
		{
			ret.set_float(this.pos.coords.longitude);				// return our value
		}
		else {
			ret.set_string("unavailable");
		}
		
		
	};
	Exps.prototype.altitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
					// return our value
		if (this.pos.coords.altitude != null)
		{
			ret.set_float(this.pos.coords.altitude);				// return our value
		}
		else {
			ret.set_string("unavailable");
		}
		
	};
	Exps.prototype.error = function (ret)
	{
	        
		if(this.err != null){	
			switch(this.err.code)  
            {  
                case this.err.PERMISSION_DENIED: ret.set_string("user did not share geolocation data");  
                break;  
                case this.err.POSITION_UNAVAILABLE: ret.set_string("could not detect current position");  
                break;  
                case this.err.TIMEOUT: ret.set_string("retrieving position timed out");  
                break;  
                default: ret.set_string("unknown error");  
                break;  
            }  
		}
		else {
			ret.set_string("unavailable");
		}
	};
	Exps.prototype.accuracy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
	
		if (this.pos.coords.accuracy != null)
		{
			ret.set_float(this.pos.coords.accuracy);				// return our value
		}
		else {
			ret.set_string("unavailable");
		}
	};
	Exps.prototype.altitudeAccuracy = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
		if (this.pos.coords.altitudeAccuracy != null)
		{	
			ret.set_float(this.pos.coords.altitudeAccuracy);	
		}			// return our value
		else {
			ret.set_string("unavailable");
		}

		
	};
	Exps.prototype.heading = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
		if (this.pos.coords.heading != null)
		{	
			ret.set_float(this.pos.coords.heading);	
		}			// return our value
		else {
			ret.set_string("unavailable");
		}

		
	};
	Exps.prototype.speed = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
		if (this.pos.coords.speed != null)
		{		
			ret.set_float(this.pos.coords.speed);
		}			// return our value
		else {
			ret.set_string("unavailable");
		}

		
	};
	Exps.prototype.timestamp = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{	
		if (this.pos.timestamp != null)
		{		
			ret.set_float(this.pos.timestamp);		
		}			// return our value
		else {
			ret.set_string("unavailable");
		}
		
	};
	pluginProto.exps = new Exps();

}());