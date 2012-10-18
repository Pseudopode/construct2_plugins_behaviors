// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Pode_Colors = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Pode_Colors.prototype;
		
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
		//gamma constant
		this.gamma = 2.2;
		
		this.XYZ2RGBmatrix = [ 	[ 0.0328, -0.01566, -0.005071 ],
								[ -0.00997, 0.01911, 0.0002849], 
								[ 0.0005827, -0.002081, 0.011 ]];
		
		this.X = 0.0;
		this.Y = 0.0;
		this.Z = 0.0;
		this.R = 0.0;
		this.G = 0.0;
		this.B = 0.0;
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
	Acts.prototype.xytoXYZ = function (x,y,_Y)
	{
		var Y = 0.0;
		if(_Y == 0) Y = 19.1; 
		if(_Y == 1) Y = 59.1;
	
		x = parseFloat(x);
		y = parseFloat(y);
		var XYZ = [];
		XYZ[0] = XYZ[1] = XYZ[2] = 0;
		XYZ[0] = x * (Y / y);
		XYZ[1] = Y;
		XYZ[2] = (1 - x - y) * (Y / y);
		this.X = XYZ[0];
		this.Y = XYZ[1];
		this.Z = XYZ[2];
	};
	
	//from http://neril1.free.fr/Applet%20De%20Farnsworth/index.html
	Acts.prototype.XYZtoRGB = function (X,Y,Z)
	{
		X = parseFloat(X);
		Y = parseFloat(Y);
		Z = parseFloat(Z);
		var m = this.XYZ2RGBmatrix;

		//use RGB directly to avoid creating new var
		this.R = m[0][0] * X + m[0][1] * Y + m[0][2] * Z;
		this.G = m[1][0] * X + m[1][1] * Y + m[1][2] * Z;
		this.B = m[2][0] * X + m[2][1] * Y + m[2][2] * Z;

		var RGB = new Array(3);
		RGB[0] = 255 * Math.pow(this.R, 1 / this.gamma);
		RGB[1] = 255 * Math.pow(this.G, 1 / this.gamma);
		RGB[2] = 255 * Math.pow(this.B, 1 / this.gamma);
		
		this.R = RGB[0];
		this.G = RGB[1];
		this.B = RGB[2];
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.X = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.X);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.Y = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.Y);				// return our value
	};
	Exps.prototype.Z = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_float(this.Z);				// return our value
	};
	Exps.prototype.R = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.R);				// return our value
	};
	Exps.prototype.G = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.G);				// return our value
	};
	Exps.prototype.B = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(this.B);				// return our value
	};	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());