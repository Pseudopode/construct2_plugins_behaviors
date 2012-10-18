// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Browser = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Browser.prototype;
		
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
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		// register for online/offline events
		window.addEventListener("online", (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOnline, self);
			};
		})(this));
		
		window.addEventListener("offline", (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnOffline, self);
			};
		})(this));
		
		// register for update ready event
		if (typeof window.applicationCache !== "undefined")
		{
			window.applicationCache.addEventListener('updateready', (function (self) {
				return function() {
					self.runtime.trigger(cr.plugins_.Browser.prototype.cnds.OnUpdateReady, self);
				};
			})(this));
		}
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.CookiesEnabled = function()
	{
		return navigator.cookieEnabled;
	};
	
	cnds.IsOnline = function()
	{
		return navigator.onLine;
	};
	
	cnds.HasJava = function()
	{
		return navigator.javaEnabled();
	};
	
	cnds.OnOnline = function()
	{
		return true;
	};
	
	cnds.OnOffline = function()
	{
		return true;
	};
	
	cnds.IsDownloadingUpdate = function ()
	{
		if (typeof window.applicationCache === "undefined")
			return false;
		else
			return window.applicationCache.status === window.applicationCache.DOWNLOADING;
	};
	
	cnds.OnUpdateReady = function ()
	{
		return true;
	};

	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.Alert = function (msg)
	{
		alert(msg.toString());
	};
	
	acts.Close = function ()
	{
		window.close();
	};
	
	acts.Focus = function ()
	{
		window.focus();
	};
	
	acts.Blur = function ()
	{
		window.blur();
	};
	
	acts.GoBack = function ()
	{
		window.back();
	};
	
	acts.GoForward = function ()
	{
		window.forward();
	};
	
	acts.GoHome = function ()
	{
		window.home();
	};
	
	acts.GoToURL = function (url)
	{
		window.location = url;
	};
	
	acts.GoToURLWindow = function (url, tag)
	{
		window.open(url, tag);
	};
	
	acts.Reload = function ()
	{
		window.location.reload();
	};

	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.URL = function (ret)
	{
		ret.set_string(window.location.toString());
	};
	
	exps.Protocol = function (ret)
	{
		ret.set_string(window.location.protocol);
	};
	
	exps.Domain = function (ret)
	{
		ret.set_string(window.location.hostname);
	};
	
	exps.PathName = function (ret)
	{
		ret.set_string(window.location.pathname);
	};
	
	exps.Hash = function (ret)
	{
		ret.set_string(window.location.hash);
	};
	
	exps.Referrer = function (ret)
	{
		ret.set_string(document.referrer);
	};
	
	exps.Title = function (ret)
	{
		ret.set_string(document.title);
	};
	
	exps.Name = function (ret)
	{
		ret.set_string(navigator.appName);
	};
	
	exps.Version = function (ret)
	{
		ret.set_string(navigator.appVersion);
	};
	
	exps.Language = function (ret)
	{
		// Not in IE
		if (navigator.language)
			ret.set_string(navigator.language);
		else
			ret.set_string("");
	};
	
	exps.Platform = function (ret)
	{
		ret.set_string(navigator.platform);
	};
	
	exps.Product = function (ret)
	{
		// Not in IE
		if (navigator.product)
			ret.set_string(navigator.product);
		else
			ret.set_string("");
	};
	
	exps.Vendor = function (ret)
	{
		// Not in IE
		if (navigator.vendor)
			ret.set_string(navigator.vendor);
		else
			ret.set_string("");
	};
	
	exps.UserAgent = function (ret)
	{
		ret.set_string(navigator.userAgent);
	};
	
	exps.QueryString = function (ret)
	{
		ret.set_string(window.location.search);
	};
	
	exps.QueryParam = function (ret, paramname)
	{
		var match = RegExp('[?&]' + paramname + '=([^&]*)').exec(window.location.search);
 
		if (match)
			ret.set_string(decodeURIComponent(match[1].replace(/\+/g, ' ')));
		else
			ret.set_string("");
	};
	
}());