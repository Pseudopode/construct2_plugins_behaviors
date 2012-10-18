/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
var micRec = /*function()*/{

	noMicOnSystem : false,
	micAccessAllowed : false,
	micAccessUnallowed : true,
	recording : false,
	stoppedAfterRecording : false,
	
	/*noMicOnSystem.onchange = noMicHandler(x),
	micAccessAllowed.onchange = micAccessAllowedHandler(x),
	micAcessUnallowed.onchange = micAccessUnallowedHandler(x),*/
	

	// Outside the loop
	noMicHandler : function(x){
		return function(){
			//PassFileName(x);  
		};
	},
	micAccessAllowedHandler : function(x){
		return function(){
			//PassFileName(x);  
		};
	},
	micAccessUnallowedHandler : function(x){
		return function(){
			//PassFileName(x);  
		};
	},
	
	


	debugparam :'',
	debuginfo :'',

	wavBase64string : '',
	mp3Base64string : '',
	oggBase64string : '',
	
	oggEncodingProgress : 0,
	mp3EncodingProgress : 0,
	
	//checked each tick to trigger the callbacks
	wavAvailable : false,
	mp3Available : false,
	oggAvailable : false,
	
	debug : function(param,str){
		//alert(param + ";" + str);
		var tmp = document.getElementById("debug-zone");
		tmp.innerHTML = tmp.innerHTML + "<br>" + str;
		this.debugparam = param;
		this.debuginfo = str;
	},
	
	wavFromAS3 : function(param,str){
		this.debugparam = param;
		this.debuginfo = '';
		this.wavBase64string = str;
		
		//wavAvailable = true;
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnWAVEncoded,null);
		this.wavAvailable = true;
	},
	
	mp3FromAS3 : function(param,str){
		this.debugparam = param;
		this.debuginfo = '';
		this.mp3Base64string = str;
		
		//mp3Available = true;
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMP3Encoded,null);
		this.mp3Available = true;
	},
	oggFromAS3 : function(param,str){
		this.debugparam = param;
		this.debuginfo = '';
		this.oggBase64string = str;
		
		//oggAvailable = true;
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnOGGEncoded,null);
		this.oggAvailable = true;
	},
	
	oggProgressFromAS3 : function(param,str){
		this.debugparam = param;
		this.debuginfo = '';
		this.oggEncodingProgress = str;
		
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnOGGProgress,null);
	},
	
	mp3ProgressFromAS3 : function(param,str){
		this.debugparam = param;
		this.debuginfo = '';
		this.mp3EncodingProgress = str;
		
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMP3Progress,null);
	},
	
	/*baseDisplay : function(param,str){
		//var divAudioMP2 = document.getElementById("b64-mp3");//param + ";" + str;
		//audioMP3 = document.createElement("audio");
		audioMP3.setAttribute('src',str);
		audioMP3.load();
		//audio.play();
		document.getElementById("mp3").style.display = "block";	
	},
	
	wavDisplay : function(param,str){
		//var divAudio = document.getElementById("b64-wav");//param + ";" + str;
		//audioWAV = document.createElement("audio");
		audioWAV.setAttribute('src',str);
		audioWAV.load();
		//audio.play();
		document.getElementById("wav").style.visibility = 'visible';
	},
	
	oggDisplay : function(param,str){
		//var divAudio = document.getElementById("b64-wav");//param + ";" + str;
		//audioWAV = document.createElement("audio");
		audioOGG.setAttribute('src',str);
		audioOGG.load();
		//audio.play();
		document.getElementById("wav").style.visibility = 'visible';	
	}*/
	noMicInstalled : function(param,str){
		this.noMicOnSystem = true;
		cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAbsent, 0);
	},
	
	securityMicAllowed : function(param,str){
		this.micAccessAllowed = true;
		this.micAccessUnallowed = false;
		//cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, this);
		//cr.runtime.prototype.triggerOnSheet(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, null,0);
		cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, 0);
	},
	
	securityMicNotAllowed : function(param,str){
		this.micAccessAllowed = false;
		this.micAccessUnallowed = true;
		//cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, this);
		//cr.runtime.prototype.triggerOnSheet(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, null,0);
		cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, 0);
	},
	
	startingRecording : function(param,str){
		this.recording = true;
		this.stoppedAfterRecording = false;
	},
	
	stopRecording : function(param,str){
		this.recording = false;
		this.stoppedAfterRecording = true;
	},
	
	muted : function(){
		this.micAccessAllowed = false;
		this.micAccessUnallowed = true;
		//alert("muted");
	},
	unmuted : function(){
		//alert("unmuted");
		this.micAccessAllowed = true;
		this.micAccessUnallowed = false;
		//cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, this);
	}
};


// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.MicrophoneJSSWF = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.MicrophoneJSSWF.prototype;
		
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
		
		//this.swfReacting = false;
		
		this.oggFileAvailableTriggered = false;
		this.mp3FileAvailableTriggered = false;
		this.wavFileAvailableTriggered = false;
		this.initDone = false;
		this.once = false; //save ressources
		
		//this.runtime.tickMe(this);
		//this.swfObjectElement = document.createElement("div");
		this.swfElem = document.createElement("div");
		/*this.swfElem.innerHTML = "<div id='flashContent'><object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='216' height='138' id='AS3micRec' align='middle'> <param name='movie' value='AS3micRec.swf' /> <param name='quality' value='high' /> <param name='bgcolor' value='"+this.properties[2]+"' /> <param name='play' value='true' /> <param name='loop' value='true' /> <param name='wmode' value='window' /> <param name='scale' value='exactfit' /> <param name='menu' value='true' /> <param name='devicefont' value='false' /> <param name='salign' value='' /> <param name='allowScriptAccess' value='always' /> <object id='innerMicRecDiv' type='application/x-shockwave-flash' data='AS3micRec.swf' width='216' heigh138'> <param name='movie' value='AS3micRec.swf' /> <param name='quality' value='high' /> <param name='bgcolor' value='"+this.properties[2]+"' /> <param name='play' value='true' /> <param name='loop' value='true' /> <param name='wmode' value='window' /> <param name='scale' value='exactfit' /> <param name='menu' value='true' /> <param name='devicefont' value='false' /> <param name='salign' value='' /> <param name='allowScriptAccess' value='always' /> </object> </object>"*/
		this.swfElem.innerHTML = "<div id='flashContent' style='z-index:601;width:216px;height:138px;background-color:"+this.properties[2]+";position:absolute;left:"+this.properties[0]+"px;right:"+this.properties[1]+"px;'><object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' id='AS3micRec' style='z-index:602;width:216px;height:138px;background-color:"+this.properties[2]+";position:absolute;left:"+/*this.properties[0]*/0+"px;right:"+/*this.properties[1]*/0+"px;' align='middle'> <param name='movie' value='AS3micRec.swf' /> <param name='quality' value='high' /> <param name='play' value='true' /> <param name='loop' value='true' /> <param name='wmode' value='window' /> <param name='scale' value='exactfit' /> <param name='menu' value='true' /> <param name='devicefont' value='false' /> <param name='salign' value='' /> <param name='allowScriptAccess' value='always' /> <object id='innerMicRecDiv' style='z-index:603;width:216px;height:138px;background-color:"+this.properties[2]+";position:absolute;left:"+/*this.properties[0]*/0+"px;right:"+/*this.properties[1]*/0+"px;' type='application/x-shockwave-flash' data='AS3micRec.swf' > <param name='movie' value='AS3micRec.swf' /> <param name='quality' value='high' />  <param name='play' value='true' /> <param name='loop' value='true' /> <param name='wmode' value='window' /> <param name='scale' value='exactfit' /> <param name='menu' value='true' /> <param name='devicefont' value='false' /> <param name='salign' value='' /> <param name='allowScriptAccess' value='always' /> </object> </object>"
		//this.swfObjectElement.innerHTML = this.swfObjectElement;
		
		//this.swfString
		//jQuery('#flashContent').style.display = "none";
		//this.swfElem.style.display = "none";
		/*this.swfElem.style.width = "1";
		this.swfElem.style.height = "1";*/
		jQuery('body').append(this.swfElem);
		
		var globalDiv = document.getElementById("flashContent");
		/*globalDiv.style.left = '"'+this.properties[0]+'"';
		globalDiv.style.top = '"'+this.properties[1]+'"';*/
		globalDiv.style.left = this.x+'px';
		globalDiv.style.top = this.y+'px';
		globalDiv.style.width = '1px';
		globalDiv.style.height = '1px';
		var AS3micRecDiv = document.getElementById("AS3micRec");
		/*AS3micRecDiv.style.left = '"'+this.properties[0]+'"';
		AS3micRecDiv.style.top = '"'+this.properties[1]+'"';*/
		AS3micRecDiv.style.left = /*this.x+*/'0px';
		AS3micRecDiv.style.top = /*this.y+*/'0px';		
		AS3micRecDiv.style.width = '1px';
		AS3micRecDiv.style.height = '1px';
		var innerMicRecDiv = document.getElementById("innerMicRecDiv");
		/*innerMicRecDiv.style.left = '"'+this.properties[0]+'"';
		innerMicRecDiv.style.top = '"'+this.properties[1]+'"';*/
		innerMicRecDiv.style.left = /*this.x+*/'0px';
		innerMicRecDiv.style.top = /*this.y+*/'0px';		
		innerMicRecDiv.style.width = '1px';
		innerMicRecDiv.style.height ='1px';
				
		//this.swfElem.style.backgroundColor = this.properties[2];
		//jQuery('#innerMicRecDiv').css('visibility', 'hidden');
		
		//jQuery('#flashContent').style = "visibility:hidden;";
		//jQuery('#flashContent').hide();
		
		/*micRec.micAccessAllowed.onchange = (function(){
			if(micRec.micAccessAllowed == true)
				cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, this);
			else
				cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, this);
		});
		
		micRec.micAccessUnallowed.onchange = (function(){
			if(micRec.micAccessUnallowed == false)
				cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, this);
			else
				cr.runtime.prototype.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, this);
		});*/
		
		this.runtime.tickMe(this);
		
		//position iframe
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height){
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1) left = 1;
		if (top < 1) top = 1;
		if (right >= this.runtime.width) right = this.runtime.width - 1;
		if (bottom >= this.runtime.height) bottom = this.runtime.height - 1;
			
		//jQuery(this.elem).show();
		
		var offx = left + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().left);
		var offy = top + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().top);
		//jQuery(this.elem).offset({left: offx, top: offy});
		globalDiv.style.left = /*this.x+*/offx-216/2+'px';
		globalDiv.style.top = /*this.y+*/offy-138/2+'px';
		AS3micRecDiv.style.left = 0+'px';
		AS3micRecDiv.style.top = 0+'px';	
		innerMicRecDiv.style.left = 0+'px';
		innerMicRecDiv.style.top = 0+'px';	
		/*jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);*/
		
		var debug = document.createElement("div");
		debug.id = "debug-zone";
		jQuery("body").append(debug);
		
		//this.updatePosition();
	};
	
	instanceProto.tick = function ()
	{
		if(this.initDone == true & this.once == false){
			if(micRec.micAccessAllowed == true && micRec.micAccessUnallowed == false ){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessAllowed, this);
				this.once = true; //don't pass here anymore
			}
			if(micRec.micAccessAllowed == false && micRec.micAccessUnallowed == true ){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAccessUnallowed, this);
				//this.once = true; //don't pass here anymore
			}
				
			if(micRec.noMicOnSystem == true){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMicAbsent, this);
				this.once = true; //don't pass here anymore
			}
				
			
		}
		
		/*if(micRec.recording == true){
			this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnRecordingStarting, this);
		}*/
		if(this.initDone == true & this.once == true & micRec.recording == false 
			& micRec.stoppedAfterRecording == true & this.oggFileAvailableTriggered == false){
			
			if(micRec.oggAvailable == true){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnOGGEncoded, this);
				this.oggFileAvailableTriggered = true;
			}
		}
		if(this.initDone == true & this.once == true & micRec.recording == false 
			& micRec.stoppedAfterRecording == true & this.mp3FileAvailableTriggered == false){
			
			if(micRec.mp3Available == true){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnMP3Encoded, this);
				this.mp3FileAvailableTriggered = true;
			}
		}
		if(this.initDone == true & this.once == true & micRec.recording == false 
			& micRec.stoppedAfterRecording == true & this.wavFileAvailableTriggered == false){
			
			if(micRec.wavAvailable == true){
				this.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnWAVEncoded, this);
				this.wavFileAvailableTriggered = true;
			}
		}
	};
	
	/*instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
			
		jQuery(this.elem).show();
		
		var offx = left + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().left);
		var offy = top + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().top);
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};*/
	
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
	cnds.OnWAVEncoded = function ()
	{
		return true;
	};
	cnds.OnOGGEncoded = function ()
	{
		return true;
	};
	cnds.OnMP3Encoded = function ()
	{
		return true;
	};
	
	cnds.OnOGGProgress = function ()
	{
		return true;
	};
	cnds.OnMP3Progress = function ()
	{
		return true;
	};
	cnds.OnMicAbsent = function ()
	{
		return true;
	};
	cnds.OnMicAccessAllowed = function ()
	{
		return true;
	};
	cnds.OnMicAccessUnallowed = function ()
	{
		return true;
	};
	cnds.OnRecordingStarting = function ()
	{
		return true;
	};
	cnds.OnRecordingStop = function ()
	{
		return true;
	};
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.initMicro = function ()
	{
		var globalDiv = document.getElementById("flashContent");
		/*globalDiv.style.left = '"'+this.properties[0]+'"';
		globalDiv.style.top = '"'+this.properties[1]+'"';*/
		/*globalDiv.style.left = this.x+'px';
		globalDiv.style.top = this.y+'px';*/
		globalDiv.style.width = '216px';
		globalDiv.style.height = '138px';
		var AS3micRecDiv = document.getElementById("AS3micRec");
		/*AS3micRecDiv.style.left = '"'+this.properties[0]+'"';
		AS3micRecDiv.style.top = '"'+this.properties[1]+'"';*/
		/*AS3micRecDiv.style.left = this.x+'px';
		AS3micRecDiv.style.top = this.y+'px';	*/	
		AS3micRecDiv.style.width = '216px';
		AS3micRecDiv.style.height = '138px';
		var innerMicRecDiv = document.getElementById("innerMicRecDiv");
		/*innerMicRecDiv.style.left = '"'+this.properties[0]+'"';
		innerMicRecDiv.style.top = '"'+this.properties[1]+'"';*/
		/*innerMicRecDiv.style.left = this.x+'px';
		innerMicRecDiv.style.top = this.y+'px';	*/	
		innerMicRecDiv.style.width = '216px';
		innerMicRecDiv.style.height ='138px';
		//this.swfElem.style.display = "block";
		this.once = false;
		this.initDone = true;
		//jQuery('#flashContent').style = "visibility:display;";
		// alert the message
		try{
				// alert the message
				swfobject.getObjectById("AS3micRec").initMicrophoneSettings();
		}catch(err){
				//alert(err);
				setTimeout(function(){swfobject.getObjectById("AS3micRec").initMicrophoneSettings();},500);
		}
		//micRec.noMicOnSystem.onchange = cnds.OnMicAbsent;
		/*micRec.micAccessAllowed.onchange = cnds.OnMicAccessAllowed;
		micRec.micAccessUnallowed.onchange = cnds.OnMicAccessUnallowed;*/
		

	};
	
	acts.hidePanel = function()
	{
		var globalDiv = document.getElementById("flashContent");
		/*globalDiv.style.left = '"'+this.properties[0]+'"';
		globalDiv.style.top = '"'+this.properties[1]+'"';*/
		/*globalDiv.style.left = this.x+'px';
		globalDiv.style.top = this.y+'px';*/
		globalDiv.style.width = '1px';
		globalDiv.style.height = '1px';
		var AS3micRecDiv = document.getElementById("AS3micRec");
		/*AS3micRecDiv.style.left = '"'+this.properties[0]+'"';
		AS3micRecDiv.style.top = '"'+this.properties[1]+'"';*/
		/*AS3micRecDiv.style.left = this.x+'px';
		AS3micRecDiv.style.top = this.y+'px';*/
		AS3micRecDiv.style.width = '1px';
		AS3micRecDiv.style.height = '1px';
		var innerMicRecDiv = document.getElementById("innerMicRecDiv");
		/*innerMicRecDiv.style.left = '"'+this.properties[0]+'"';
		innerMicRecDiv.style.top = '"'+this.properties[1]+'"';*/
		/*innerMicRecDiv.style.left = this.x+'px';
		innerMicRecDiv.style.top = this.y+'px';*/
		innerMicRecDiv.style.width = '1px';
		innerMicRecDiv.style.height ='1px';
	}
	
	acts.changeColor = function(rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		if (newcolor === this.swfElem.style.backgroundColor)
			return;
		this.swfElem.style.backgroundColor = newcolor;
	}
	
	acts.startRecord = function ()
	{
		//this.swfReacting = false;
		//we reset the medias
		micRec.wavAvailable = false;
		micRec.mp3Available = false;
		micRec.oggAvailable = false;
		this.oggFileAvailableTriggered = false;
		this.mp3FileAvailableTriggered = false;
		this.wavFileAvailableTriggered = false;
		
		micRec.wavBase64string = '';
		micRec.oggBase64string = '';
		micRec.mp3Base64string = '';
		
		micRec.oggEncodingProgress = 0;
		micRec.mp3EncodingProgress = 0;
		
		swfobject.getObjectById("AS3micRec").startRecord();
		
		//cr.runtime.trigger(cr.plugins_.MicrophoneJSSWF.prototype.cnds.OnRecordingStarting, this);
	};
	
	acts.stopRecord = function ()
	{
		// alert the message
		swfobject.getObjectById("AS3micRec").stopRecord();
	};
	
	acts.startOGGEncoding = function ()
	{
		//if(this.swfReacting == true){
			try{
				// alert the message
				swfobject.getObjectById("AS3micRec").startOGGEncoding();
			}catch(err){
				//alert(err);
				setTimeout(function(){cr.plugins_.MicrophoneJSSWF.prototype.acts.startOGGEncoding();},500);
			}
		/*}else{
			setTimeout(function(){cr.plugins_.MicrophoneJSSWF.prototype.acts.startOGGEncoding();},500);
		}*/
	};
	
	acts.startMP3Encoding = function ()
	{
		try{
			// alert the message
			swfobject.getObjectById("AS3micRec").startMP3Encoding();
			//this.swfReacting = true;
		}catch(err){
			//alert(err);
			setTimeout(function(){cr.plugins_.MicrophoneJSSWF.prototype.acts.startMP3Encoding();},500);
		}
	};
	
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.wavBase64string = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(micRec.wavBase64string);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	exps.oggBase64string = function (ret)
	{
		ret.set_string(micRec.oggBase64string);
	};
	exps.mp3Base64string = function (ret)
	{
		ret.set_string(micRec.mp3Base64string);
	};
	
	//
	exps.oggEncodingProgress = function (ret)
	{
		ret.set_float(micRec.oggEncodingProgress);
	};
	exps.mp3EncodingProgress = function (ret)
	{
		ret.set_float(micRec.mp3EncodingProgress);
	};
}());