// base32k.js / https://github.com/simonratner/base32k
// Copyright (C) 2012 Simon Ratner, distributed under the MIT license.
(function(a){var b=function(a,b){return function(c){typeof c=="number"&&(c=[c]);var d=[];for(var e=0,f=c.length;e<f;e+=b)d.push(a.apply(null,c.slice(e,e+b)));return d.join("")}}(String.fromCharCode,2048),c=function(a){if(a>=13312&&a<=19893)return a-13312;if(a>=19968&&a<=40869)return a-13386;if(a>=57344&&a<=62627)return a-29860;throw"Invalid encoding U+"+("000"+a.toString(16).toUpperCase()).slice(-4)},d=function(a){return a<6582?13312+a:a<27484?19968+a-6582:57344+a-27484};a["base32k"]={encode:function(a){var c=a.length*32,e=[];for(var f,g,h,i=0;i<c;i+=15)g=i/32|0,h=i%32,h<=17?f=32767&a[g]>>>17-h:f=32767&a[g]<<h-17|32767&a[g+1]>>>49-h,e.push(d(f));return e.push(9231-(i-c)),b(e)},encodeBytes:function(a){var c=a.length*8,e=typeof a=="string"?function(b){return a.charCodeAt(b)}:function(b){return a[b]},f=[];for(var g,h,i,j=0;j<c;j+=15)h=j/8|0,i=j%8,g=e(h)<<7+i,i==0?g|=e(h+1)>>>1:g|=e(h+1)<<i-1|e(h+2)>>>9-i,f.push(d(g&32767));return f.push(9231-(j-c)),b(f)},decode:function(a){var b=a.charCodeAt(a.length-1)-9216;if(b<1||b>15)throw"Invalid encoding";var d=[];for(var e,f,g,h=0,i=a.length-1;h<i;h++)e=c(a.charCodeAt(h)),f=h*15/32|0,g=h*15%32,g<=17?d[f]|=e<<17-g:(d[f]|=e>>>g-17,d[f+1]|=e<<49-g);return g<=17?d[f]&=4294967295<<32-b-g:b>32-g?d[f+1]&=4294967295<<64-b-g:(d[f]&=4294967295<<32-b-g,d.length--),d},decodeBytes:function(a){var d=a.charCodeAt(a.length-1)-9216;if(d<1||d>15)throw"Invalid encoding";var e=[];for(var f,g,h,i=0,j=a.length-1;i<j;i++)f=c(a.charCodeAt(i)),g=i*15/8|0,h=i*15%8,e[g]|=255&f>>>7+h,h==0?e[g+1]|=255&f<<1:(e[g+1]|=255&f>>>h-1,e[g+2]|=255&f<<9-h);return e.length=((a.length-2)*15+d)/8,b(e)}}})(this);
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Base32kPack = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Base32kPack.prototype;
		
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
		this.Base32kPacked = "";
		this.Base32kUnpacked = "";
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
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.packBase32k = function (string)
	{
		this.Base32kPacked = base32k.encodeBytes(string);
	};
	Acts.prototype.unpackBase32k = function (string)
	{
		this.Base32kUnpacked = base32k.decodeBytes(string);
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
	Exps.prototype.Base32kPacked = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.Base32kPacked);				// return our value
	};
	Exps.prototype.Base32kUnpacked = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.Base32kUnpacked);				// return our value
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());