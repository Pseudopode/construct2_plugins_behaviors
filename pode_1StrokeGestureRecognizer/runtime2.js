// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.OneStrokeGestureRecognizer = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.OneStrokeGestureRecognizer.prototype;
		
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
		this._points = new Array();
		this._r = new DollarRecognizer();
		this.numberOfCurrentPoints = 0;
		this.usingProtractor = false;
		this.result = 0;

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
	
	acts.AddPoint = function (x,y)
	{	
		this._points[this.numberOfCurrentPoints] = new Point(x, y);
		this.numberOfCurrentPoints++;
	};
	
	acts.round = function(n, d) // round 'n' to 'd' decimals
	{
		d = Math.pow(10, d);
		return Math.round(n * d) / d
	}

	acts.ClearPoints = function(){
		this._points.length = 0;
		this.numberOfCurrentPoints = 0;
	}
	
	acts.useGoldenSectionSearch = function(){
		this.usingProtractor = false;
	}
	
	acts.useProtractor = function(){
		this.usingProtractor = true;
	}
	
	acts.AddExisting = function (type)
	{
		if (this._points.length >= 10){
			/*var templates = document.getElementById('templates');
			var name = templates[templates.selectedIndex].value;*/
			var num = this._r.AddTemplate(type, this._points);
			//drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
		}else{
			alert("Too few points made. Please try again.");
		}
	}

	acts.AddCustom = function (type)
	{
		if (this._points.length >= 10 && type.length > 0){
			/*var templates = document.getElementById('templates');
			var name = templates[templates.selectedIndex].value;*/
			var num = this._r.AddTemplate(type, this._points);
			//drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
		}else{
			alert("Too few points made or name too short. Please try again.");
		}
	}
	
	acts.deleteAll = function (type)
	{
		var num = this._r.DeleteUserTemplates(); // deletes any user-defined templates
		alert("All user-defined templates have been deleted. Only the 1 predefined unistroke gesture remains for each of the " + num + " gesture types.");
	}
	
	acts.RecognizeGesture = function ()
	{	
		if (this._points.length >= 10)
		{
			//var result = _r.Recognize(this._points, document.getElementById('useProtractor').checked);
			//var result = this._r.Recognize(this._points, this.usingProtractor);
			this.result = this._r.Recognize(this._points, this.usingProtractor);
			alert("Result: " + this.result.Name + " (" + acts.round(this.result.Score,2) + ").");
		}else // fewer than 10 points were inputted
		{
			alert("Too few points made. Please try again.");
		}
	};

	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());