// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.BrowserInfos = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.BrowserInfos.prototype;
		
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

				
	function testCSS(prop)  {
		return prop in document.documentElement.style;
	}
			
	function testMobileSafari() {
		return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
	}
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
		
			//from http://stackoverflow.com/a/9851769
			this.isOpera = !!(window.opera && window.opera.version);  // Opera 8.0+
			this.isFirefox = testCSS('MozBoxSizing');                 // FF 0.8+
			this.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
				// At least Safari 3+: "[object HTMLElementConstructor]"
			this.isChrome = !this.isSafari && testCSS('WebkitTransform');  // Chrome 1+
			this.isIE = /*@cc_on!@*/false || testCSS('msTransform');  // At least IE6
			
			this.isMobileSafari = testMobileSafari();
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
	Exps.prototype.isOpera = function (ret)	
	{
		ret.set_string(this.isOpera);
	};
	Exps.prototype.isFirefox = function (ret)	
	{
		ret.set_string(this.isFirefox);
	};
	Exps.prototype.isSafari = function (ret)	
	{
		ret.set_string(this.isSafari);
	};
	Exps.prototype.isChrome = function (ret)	
	{
		ret.set_string(this.isChrome);
	};
	Exps.prototype.isIE = function (ret)	
	{
		ret.set_string(this.isIE);
	};
	Exps.prototype.isMobileSafari = function (ret)	
	{
		ret.set_string(this.isMobileSafari);
	};
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());