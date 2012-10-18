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
		this.latitude  = 0.0;
		this.longitude = 0.0;
		this.altitude  = 0.0;
		var thisPlugin = this;
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
	function Cnds() {};

	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
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
	function myPosition(position) {
		thisPlugin.latitude = position.coords.latitude;
		thisPlugin.longitude = position.coords.longitude;
		thisPlugin.altitude = position.coords.altitude;
	}
	// ... other expressions here ...
	Exps.prototype.latitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var startPos;
		navigator.geolocation.getCurrentPosition(function(position) {
			startPos = position;
		}
		
		this.latitude = startPos.coords.latitude;
		
		ret.set_float(this.latitude);				// return our value
	};
	Exps.prototype.longitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var startPos;
		navigator.geolocation.getCurrentPosition(function(position) {
			startPos = position;
		}

		this.longitude = startPos.coords.longitude;		
		
		ret.set_float(this.longitude);				// return our value
	};
	Exps.prototype.altitude = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var startPos;
		navigator.geolocation.getCurrentPosition(function(position) {
			startPos = position;
		}

		this.altitude = startPos.coords.altitude;				
		
		ret.set_float(this.altitude);				// return our value
	};
	
	pluginProto.exps = new Exps();

}());