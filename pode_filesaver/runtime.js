//Minified BlobBuilder.js - sept 2011
/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */
var BlobBuilder=BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||(function(j){"use strict";var c=function(v){return Object.prototype.toString.call(v).match(/^\[object\s(.*)\]$/)[1]},u=function(){this.data=[]},t=function(x,v,w){this.data=x;this.size=x.length;this.type=v;this.encoding=w},k=u.prototype,s=t.prototype,n=j.FileReaderSync,a=function(v){this.code=this[this.name=v]},l=("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),r=l.length,o=j.URL||j.webkitURL||j,p=o.createObjectURL,b=o.revokeObjectURL,e=o,i=j.btoa,f=j.atob,m=false,h=function(v){m=!v},d=j.ArrayBuffer,g=j.Uint8Array;u.fake=s.fake=true;while(r--){a.prototype[l[r]]=r+1}try{if(g){h.apply(0,new g(1))}}catch(q){}if(!o.createObjectURL){e=j.URL={}}e.createObjectURL=function(w){var x=w.type,v;if(x===null){x="application/octet-stream"}if(w instanceof t){v="data:"+x;if(w.encoding==="base64"){return v+";base64,"+w.data}else{if(w.encoding==="URI"){return v+","+decodeURIComponent(w.data)}}if(i){return v+";base64,"+i(w.data)}else{return v+","+encodeURIComponent(w.data)}}else{if(real_create_object_url){return real_create_object_url.call(o,w)}}};e.revokeObjectURL=function(v){if(v.substring(0,5)!=="data:"&&real_revoke_object_url){real_revoke_object_url.call(o,v)}};k.append=function(z){var B=this.data;if(g&&z instanceof d){if(m){B.push(String.fromCharCode.apply(String,new g(z)))}else{var A="",w=new g(z),x=0,y=w.length;for(;x<y;x++){A+=String.fromCharCode(w[x])}}}else{if(c(z)==="Blob"||c(z)==="File"){if(n){var v=new n;B.push(v.readAsBinaryString(z))}else{throw new a("NOT_READABLE_ERR")}}else{if(z instanceof t){if(z.encoding==="base64"&&f){B.push(f(z.data))}else{if(z.encoding==="URI"){B.push(decodeURIComponent(z.data))}else{if(z.encoding==="raw"){B.push(z.data)}}}}else{if(typeof z!=="string"){z+=""}B.push(unescape(encodeURIComponent(z)))}}}};k.getBlob=function(v){if(!arguments.length){v=null}return new t(this.data.join(""),v,"raw")};k.toString=function(){return"[object BlobBuilder]"};s.slice=function(y,v,x){var w=arguments.length;if(w<3){x=null}return new t(this.data.slice(y,w>1?v:this.data.length),x,this.encoding)};s.toString=function(){return"[object Blob]"};return u}(self));

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.FileSaver = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.FileSaver.prototype;
		
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
		this.bb = new BlobBuilder;
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
	/*acts.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};*/
	acts.appendText = function (content)
	{
		// alert the message
		//alert(myparam);
		this.bb.append(content);
	};
	
	acts.saveText = function (filename)
	{
		// alert the message
		//alert(myparam);
		//this.bb.append(content);
		saveAs(this.bb.getBlob("text/plain;charset=utf-8"), filename);
	};
	
	acts.clearFile = function(){
		this.bb = '';
		this.bb = new BlobBuilder;
	};
	
	acts.appendHTML = function(content)
	{
		//var string = (new XMLSerializer).serializeToString(content);
		this.bb.append(content);
		//this.bb.append(string);
	};
	
	acts.saveHTML = function (filename)
	{
		// alert the message
		//alert(myparam);
		//this.bb.append(content);
		var blob = this.bb.getBlob("application/xhtml+xml;charset=" + document.characterSet);
		saveAs(blob, filename);
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