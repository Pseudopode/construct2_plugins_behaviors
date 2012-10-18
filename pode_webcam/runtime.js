/*globals document:true, localStorage:true, navigator: true*/

;(function(window, document) {
    "use strict";

    window.getUserMedia = function(options, successCallback, errorCallback) {

        // getUserMedia() feature detection
        navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        // detect if {video: true} or "video" style options
        // by creating an iframe and blowing it up
        // style jacked from @kangax
        // taken here from @miketaylr: //gist.github.com/f2ac64ed7fc467ccdfe3
        var optionStyle = (function(win) {

            var el = document.createElement('iframe'),
                root = document.body || document.documentElement,
                string = true,
                object = true,
                nop = function() {},
                f;
            root.appendChild(el);

            f = win.frames[win.frames.length - 1];
            f.navigator.getUserMedia = f.navigator.getUserMedia || (f.navigator.getUserMedia = f.navigator.webkitGetUserMedia || f.navigator.mozGetuserMedia || f.navigator.msGetUserMedia);

            try {
                // Try spec (object) syntax
                f.navigator.getUserMedia({
                    video: true,
                    audio: true
                }, nop);
            } catch (e) {
                object = false;
                try {
                    // Try string syntax
                    f.navigator.getUserMedia("video, audio", nop);
                } catch (e) { // Neither supported
                    string = false;
                }
            } finally { // Clean up
                root.removeChild(el);
                el = null;
            }

            return {
                string: string,
                object: object
            };

        }(window));

        if (!! navigator.getUserMedia_) {

            if (!optionStyle.string && !optionStyle.object) {
                return undefined;
            }

            var getUserMediaOptions;

            if (optionStyle.string) {
                if (options.video && options.audio) {
                    getUserMediaOptions = 'video, audio';
                } else if (options.video) {
                    getUserMediaOptions = 'video';
                } else if (options.audio) {
                    getUserMediaOptions = 'audio';
                }
            } else if (optionStyle.object) {
                if (options.video) {
                    getUserMediaOptions.video = true;
                }
                if (options.audio) {
                    getUserMediaOptions.audio = true;
                }
            }

            var container, temp, video, ow, oh;

            container = document.getElementById(options.el);
            temp = document.createElement('video');

            // Fix for ratio
            ow = parseInt(container.offsetWidth, 10);
            oh = parseInt(container.offsetHeight, 10);
            if (options.width < ow && options.height < oh) {
                options.width = ow;
                options.height = oh;
            }

            temp.width = options.width;
            temp.height = options.height;
            temp.autoplay = true;
            container.appendChild(temp);
            video = temp;
            options.videoEl = video;
            options.context = 'webrtc';

            navigator.getUserMedia_(getUserMediaOptions, successCallback, errorCallback);

        } else {
            // Fallback to flash
            var source, el, cam;

            source = '<object id="XwebcamXobjectX" type="application/x-shockwave-flash" data="' + options.swffile + '" width="' + options.width + '" height="' + options.height + '"><param name="movie" value="' + options.swffile + '" /><param name="FlashVars" value="mode=' + options.mode + '&amp;quality=' + options.quality + '" /><param name="allowScriptAccess" value="always" /></object>';
            el = document.getElementById(options.el);
            el.innerHTML = source;


            (function register(run) {

                cam = document.getElementById('XwebcamXobjectX');

                if (cam.capture !== undefined) {

                    // Simple callback methods are not allowed
                    options.capture = function(x) {
                        try {
                            return cam.capture(x);
                        } catch (e) {}
                    };
                    options.save = function(x) {
                        try {
                            return cam.save(x);
                        } catch (e) {

                        }
                    };
                    options.setCamera = function(x) {
                        try {
                            return cam.setCamera(x);
                        } catch (e) {}
                    };
                    options.getCameraList = function() {
                        try {
                            return cam.getCameraList();
                        } catch (e) {}
                    };

                    // options.onLoad();
                    options.context = 'flash';
                    options.onLoad = successCallback;

                } else if (run === 0) {
                    // options.debug("error", "Flash movie not yet registered!");
                    errorCallback();
                } else {
                    // Flash interface not ready yet
                    window.setTimeout(register, 1000 * (4 - run), run - 1);
                }
            }(3));

        }
    };

}(this, document));

// ! getUserMedia - v0.5.0 - 4/21/2012
// https://github.com/addyosmani/getUserMedia.js
// Copyright (c) 2012 addyosmani; Licensed MIT 
/*(function(a,b){"use strict",a.getUserMedia=function(c,d,e){navigator.getUserMedia_=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;var f=function(a){var c=b.createElement("iframe"),d=b.body||b.documentElement,e=!0,f=!0,g=function(){},h;d.appendChild(c),h=a.frames[a.frames.length-1],h.navigator.getUserMedia=h.navigator.getUserMedia||(h.navigator.getUserMedia=h.navigator.webkitGetUserMedia||h.navigator.mozGetuserMedia||h.navigator.msGetUserMedia);try{h.navigator.getUserMedia({video:!0,audio:!0},g)}catch(i){f=!1;try{h.navigator.getUserMedia("video, audio",g)}catch(i){e=!1}}finally{d.removeChild(c),c=null}return{string:e,object:f}}(a);if(!navigator.getUserMedia_){var m,n,o;m='<object id="XwebcamXobjectX" type="application/x-shockwave-flash" data="'+c.swffile+'" width="'+c.width+'" height="'+c.height+'"><param name="movie" value="'+c.swffile+'" /><param name="FlashVars" value="mode='+c.mode+"&amp;quality="+c.quality+'" /><param name="allowScriptAccess" value="always" /></object>',n=b.getElementById(c.el),n.innerHTML=m,function p(f){o=b.getElementById("XwebcamXobjectX"),o.capture!==undefined?(c.capture=function(a){try{return o.capture(a)}catch(b){}},c.save=function(a){try{return o.save(a)}catch(b){}},c.setCamera=function(a){try{return o.setCamera(a)}catch(b){}},c.getCameraList=function(){try{return o.getCameraList()}catch(a){}},c.context="flash",c.onLoad=d):f===0?e():a.setTimeout(p,1e3*(4-f),f-1)}(3)}else{if(!f.string&&!f.object)return undefined;var g;f.string?c.video&&c.audio?g="video, audio":c.video?g="video":c.audio&&(g="audio"):f.object&&(c.video&&(g.video=!0),c.audio&&(g.audio=!0));var h,i,j,k,l;h=b.getElementById(c.el),i=b.createElement("video"),k=parseInt(h.offsetWidth,10),l=parseInt(h.offsetHeight,10),c.width<k&&c.height<l&&(c.width=k,c.height=l),i.width=c.width,i.height=c.height,i.autoplay=!0,h.appendChild(i),j=i,c.videoEl=j,c.context="webrtc",navigator.getUserMedia_(g,d,e)}}})(this,document)
*/
/////////

///////////////////////////////////////////////////////
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Webcam = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Webcam.prototype;
		
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
		
		this.snapshotString = '';
		
		this.canvasWebcam = document.createElement("canvas");
		this.ctxWebcam = this.canvasWebcam.getContext("2d");
		/*this.img = new Image();
		this.ctxcanvasWebcam.clearRect(0, 0, this.options.width, this.options.height);
		this.image = this.ctx.getImageData(0, 0, this.options.width, this.options.height);*/
		
		this.options = '';
		this.cameraElement = document.createElement('div');
		this.cameraElement = document.createElement('div');
		this.cameraElement.setAttribute("id","webcam");
		this.cameraElement.setAttribute("width",this.width);
		this.cameraElement.setAttribute("height",this.height);
		
		// calculate displacement
		this.left = this.layer.layerToCanvas(this.x, this.y, true)-this.width*this.hotspotX;
		this.top = this.layer.layerToCanvas(this.x, this.y, false)-this.height*this.hotspotY;
		this.right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		this.bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || this.right <= 0 || this.bottom <= 0 || this.left >= this.runtime.width ||this.top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}

		// Truncate to canvas size
		if (this.left < 1)
			this.left = 1;
		if (this.top < 1)
			this.top = 1;
		if (this.right >= this.runtime.width)
			this.right = this.runtime.width - 1;
		if (this.bottom >= this.runtime.height)
			this.bottom = this.runtime.height - 1;

		this.offx = this.left + (jQuery(this.runtime.canvas).offset().left);
		this.offy = this.top + (jQuery(this.runtime.canvas).offset().top);
		
		this.cameraElement.setAttribute('style',"left:"+this.offx+"px;"+"top:"+this.offy+"px;z-index:15;position:absolute;");
		//this.cameraElement.setAttribute('style',"left:"+0+"px;"+"top:"+0+"px;z-index:15;position:absolute;");
		jQuery("body").append(this.cameraElement);
		
		this.success = '';
		this.deviceError = '';
		
		this.App = {		
					init: {},
					/*init: function () {

						// The shim requires options to be supplied for it's configuration,
						// which can be found lower down in this file. Most of the below are
						// demo specific and should be used for reference within this context
						// only
						if ( !!this.options) {
				
							// Initialize getUserMedia with options
							getUserMedia(this.options,this.success, this.deviceError);
							

							// Initialize webcam options for fallback
							window.webcam = this.options;

						} else {
							alert('No options were supplied to the shim!');
						}
					},*/

					addEvent: function (type, obj, fn) {
						if (obj.attachEvent) {
							obj['e' + type + fn] = fn;
							obj[type + fn] = function () {
								obj['e' + type + fn](window.event);
							}
							obj.attachEvent('on' + type, obj[type + fn]);
						} else {
							obj.addEventListener(type, fn, false);
						}
					},

					// options contains the configuration information for the shim
					// it allows us to specify the width and height of the video
					// output we're working with, the location of the fallback swf,
					// events that are triggered onCapture and onSave (for the fallback)
					// and so on.
					options: {},
					success: {},
					deviceError : {},

					changeFilter: function () {
						if (this.filter_on) {
							this.filter_id = (this.filter_id + 1) & 7;
						}
					},

					/*getSnapshot: function () {
						// If the current context is WebRTC/getUserMedia (something
						// passed back from the shim to avoid doing further feature
						// detection), we handle getting video/images for our canvas 
						// from our HTML5 <video> element.
						if (App.options.context === 'webrtc') {
							var video = document.getElementsByTagName('video')[0]; 
							App.canvas.width = video.videoWidth;
							App.canvas.height = video.videoHeight;
							App.canvas.getContext('2d').drawImage(video, 0, 0);

						// Otherwise, if the context is Flash, we ask the shim to
						// directly call window.webcam, where our shim is located
						// and ask it to capture for us.
						} else if(App.options.context === 'flash'){

							window.webcam.capture();
							App.changeFilter();
						}
						else{
							alert('No context was supplied to getSnapshot()');
						}
					},*/
					getSnapshot: {},

					drawToCanvas: function (effect) {
						var source, glasses, canvas, ctx, pixels, i;

						source = document.querySelector('#canvas');
						glasses = new Image();
						glasses.src = "js/glasses/i/glasses.png";
						canvas = document.querySelector("#output");
						ctx = canvas.getContext("2d");

						ctx.drawImage(source, 0, 0, 520, 426);

						pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

						// Hipstergram!
						if (effect === 'hipster') {

							for (i = 0; i < pixels.data.length; i = i + 4) {
								pixels.data[i + 0] = pixels.data[i + 0] * 3;
								pixels.data[i + 1] = pixels.data[i + 1] * 2;
								pixels.data[i + 2] = pixels.data[i + 2] - 10;
							}

							ctx.putImageData(pixels, 0, 0);

						}

						// Green Screen
						else if (effect === 'greenscreen') {

							// Selectors 
							var rmin = $('#red input.min').val(),
								gmin = $('#green input.min').val(),
								bmin = $('#blue input.min').val(),
								rmax = $('#red input.max').val(),
								gmax = $('#green input.max').val(),
								bmax = $('#blue input.max').val(),
								green = 0, red = 0, blue = 0;


							for (i = 0; i < pixels.data.length; i = i + 4) {
								red = pixels.data[i + 0];
								green = pixels.data[i + 1];
								blue = pixels.data[i + 2];
								alpha = pixels.data[i + 3];

								if (red >= rmin && green >= gmin && blue >= bmin && red <= rmax && green <= gmax && blue <= bmax) {
									pixels.data[i + 3] = 0;
								}
							}

							ctx.putImageData(pixels, 0, 0);

						} else if (effect === 'glasses') {

							var comp = ccv.detect_objects({
								"canvas": (canvas),
								"cascade": cascade,
								"interval": 5,
								"min_neighbors": 1
							});

							// Draw glasses on everyone!
							for (i = 0; i < comp.length; i++) {
								ctx.drawImage(glasses, comp[i].x, comp[i].y, comp[i].width, comp[i].height);
							}
						}

					}

				};		
						
		this.updatePosition();
		
		this.runtime.tickMe(this);
		
		this.styleWebcam = "#webcam, #canvas, #output {	width: 320px;	height:261px;	border:10px solid #333;	background:#eee;	-webkit-border-radius: 10px;	-moz-border-radius: 10px;	border-radius: 10px;	overflow:hidden;}#webcam {	position:relative;	margin-bottom:30px;}#webcam > span {	z-index:2;	position:absolute;	color:#eee;	font-size:10px;	bottom: -16px;	left:152px;}#webcam video{	margin-top:-9px; /*forced vertical centering*/}#webcam > img {	z-index:1;	position:absolute;	border:0px none;	padding:0px;	bottom:-40px;	left:89px;}#webcam > div {	border:5px solid #333;	position:absolute;	right:-90px;	padding:5px;	-webkit-border-radius: 8px;	-moz-border-radius: 8px;	border-radius: 8px;	cursor:pointer;}#webcam a {	background:#fff;	font-weight:bold;}#webcam a > img {	border:0px none;}#canvas {	border:10px solid #ccc;	background:#eee;}#flash {	position:absolute;	top:0px;	left:0px;	z-index:5000;	width:100%;	height:500px;	background-color:#c00;	display:none;}object {	display:block;	position:relative;	z-index:1000;	margin-top:9px; /*forced vertical centering*/}";
		
		this.styleElem = document.createElement("style");
		this.styleElem.innerHTML = this.styleWebcam;
		jQuery('head').append(this.styleElem);
		
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
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

	acts.configureCamera = function(){
		// The shim requires options to be supplied for it's configuration,
		// which can be found lower down in this file. Most of the below are
		// demo specific and should be used for reference within this context
		// only
		// options contains the configuration information for the shim
		// it allows us to specify the width and height of the video
		// output we're working with, the location of the fallback swf,
		// events that are triggered onCapture and onSave (for the fallback)
		// and so on.
		this.App.options = {

            "audio": true,
            "video": true,

            // the element (by id) you wish to apply
            el: "webcam",

            extern: null,
            append: true,

            // height and width of the output stream
            // container
            width: 320,
            height: 240,

            // the recommended mode to be used is 
            //'callback '
            // where a callback is executed once data
            // is available
            mode: "callback",

            // the flash fallback Url
            swffile: "jscam_canvas_only.swf",
			//swffile: "jscam.swf",

            // quality of the fallback stream
            quality: 85,
            context: "",

            debug: function () {},

            // callback for capturing the fallback stream
            onCapture: function () {
                window.webcam.save();
            },
            onTick: function () {},

            // callback for saving the stream, useful for
            // relaying data further.
            onSave: function (data) {},
            onLoad: function () {}
        };
				
		var App = this.App;
		this.App.success = function (stream) {

			if (App.options.context === 'webrtc') {

				var video = App.options.videoEl,
					vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;

				video.onerror = function () {
					stream.stop();
					streamError();
				};

			} else{
				//flash context
			}
			
		};
							
							
		this.App.deviceError = function (error) {
			alert('No camera available.');
			//console.error('An error occurred: [CODE ' + error.code + ']');
		};

		//this.App.init();
	}
	
	acts.streamPicture = function ()
	{
		this.App.init = function () {
			// The shim requires options to be supplied for it's configuration,
			// which can be found lower down in this file. Most of the below are
			// demo specific and should be used for reference within this context
			// only
			if ( !!this.options) {
				// Initialize getUserMedia with options
				getUserMedia(this.options,this.success, this.deviceError);						

				// Initialize webcam options for fallback
				window.webcam = this.options;
			} else {
				alert('No options were supplied to the shim!');
			}
		};
	
		this.App.init();
	};
	
	acts.getSnapshot = function ()
	{
		// If the current context is WebRTC/getUserMedia (something
		// passed back from the shim to avoid doing further feature
		// detection), we handle getting video/images for our canvas 
		// from our HTML5 <video> element.
		if (this.App.options.context === 'webrtc') {
			var video = document.getElementsByTagName('video')[0]; 
			this.canvasWebcam.width = video.videoWidth;
			this.canvasWebcam.height = video.videoHeight;
			this.canvasWebcam.getContext('2d').drawImage(video, 0, 0);
			this.snapshotString = this.canvasWebcam.toDataURL();

		// Otherwise, if the context is Flash, we ask the shim to
		// directly call window.webcam, where our shim is located
		// and ask it to capture for us.
		} else if(App.options.context === 'flash'){

			window.webcam.capture();
			App.changeFilter();
		}
		else{
			alert('No context was supplied to getSnapshot()');
		}
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	exps.base64snapshot = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		ret.set_string(this.snapshotString);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

}());