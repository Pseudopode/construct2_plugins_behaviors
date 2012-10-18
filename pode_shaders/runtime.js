// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.GLShaders = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.GLShaders.prototype;
		
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
		//var gl = 0;
		var canvas;
		var startTime; 
		var gl;
		var squareVertexPositionBuffer;
		var shaderProgram;
		var vertexShader;
		var fragmentShader;
		var neheTexture;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.initGL = function(canvas) {
		try {
			instanceProto.gl = instanceProto.canvas.getContext("experimental-webgl");
			instanceProto.gl.viewportWidth = canvas.width;
			instanceProto.gl.viewportHeight = canvas.height;
		} catch(e) {
		}
		if (!instanceProto.gl) {
		alert("Could not initialise WebGL!");
		}
		startTime = (new Date()).getTime();
	}
	
	instanceProto.getShaderFS = function(gl,id) {
		var str = "";
		str = instanceProto.fragmentShader;

		var shader;
		shader = gl.createShader(gl.FRAGMENT_SHADER);
		
		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  alert(gl.getShaderInfoLog(shader));
		  return null;
		}

		return shader;
	}
	  
	instanceProto.getShaderVS = function(gl,id) {
		var str = "";
		str = instanceProto.vertexShader;

		var shader;
		
		shader = gl.createShader(gl.VERTEX_SHADER);
		
		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  alert(gl.getShaderInfoLog(shader));
		  return null;
		}

		return shader;
	}
	  
	instanceProto.loadFragmentShader = function(gl,str) {
		var shader;
		shader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		  alert(gl.getShaderInfoLog(shader));
		  return null;
		}

		return shader;  
	  }


	instanceProto.initShaders= function() {
		//var fragmentShader = loadFragmentShader(gl, document.getElementById("customshadercode").value);
		var fragmentShader = instanceProto.getShaderFS(instanceProto.gl, "shader-fs");
		var vertexShader = instanceProto.getShaderVS(instanceProto.gl, "shader-vs");

		instanceProto.shaderProgram = instanceProto.gl.createProgram();
		instanceProto.gl.attachShader(instanceProto.shaderProgram, vertexShader);
		instanceProto.gl.attachShader(instanceProto.shaderProgram, fragmentShader);
		instanceProto.gl.linkProgram(instanceProto.shaderProgram);

		if (!instanceProto.gl.getProgramParameter(instanceProto.shaderProgram, instanceProto.gl.LINK_STATUS)) {
		  alert("Could not initialise shaders");
		}

		instanceProto.gl.useProgram(instanceProto.shaderProgram);

		instanceProto.shaderProgram.vertexPositionAttribute = instanceProto.gl.getAttribLocation(instanceProto.shaderProgram, "aVertexPosition");
		instanceProto.gl.enableVertexAttribArray(instanceProto.shaderProgram.vertexPositionAttribute);

		instanceProto.shaderProgram.pResolutionUniform = instanceProto.gl.getUniformLocation(instanceProto.shaderProgram, "resolution");
		instanceProto.shaderProgram.pTimeUniform = instanceProto.gl.getUniformLocation(instanceProto.shaderProgram, "time");
	  }


	 instanceProto.setUniforms= function(){
	  
		instanceProto.gl.activeTexture(instanceProto.gl.TEXTURE0);
		instanceProto.gl.bindTexture(instanceProto.gl.TEXTURE_2D, neheTexture);
		instanceProto.gl.uniform1i(instanceProto.shaderProgram.samplerUniform, 0);
	  
		instanceProto.gl.uniform2f(instanceProto.shaderProgram.pResolutionUniform, instanceProto.canvas.width, instanceProto.canvas.height);
		var time = (new Date()).getTime();
		var t = (time - startTime) / 1000.0;
		instanceProto.gl.uniform1f(instanceProto.shaderProgram.pTimeUniform,  t );
		//document.getElementById('timeCount').innerHTML = t;
	  }


	 instanceProto.initBuffers= function(){
		instanceProto.squareVertexPositionBuffer = instanceProto.gl.createBuffer();
		instanceProto.gl.bindBuffer(instanceProto.gl.ARRAY_BUFFER, instanceProto.squareVertexPositionBuffer);
		vertices = [
			 1.0,  1.0,  0.0,
			-1.0,  1.0,  0.0,
			 1.0, -1.0,  0.0,
			-1.0, -1.0,  0.0
		];
		instanceProto.gl.bufferData(instanceProto.gl.ARRAY_BUFFER, new Float32Array(vertices), instanceProto.gl.STATIC_DRAW);
		instanceProto.squareVertexPositionBuffer.itemSize = 3;
		instanceProto.squareVertexPositionBuffer.numItems = 4;
	  }
	  
	instanceProto.handleLoadedTexture= function(texture) {
		instanceProto.gl.bindTexture(instanceProto.gl.TEXTURE_2D, texture);
		instanceProto.gl.pixelStorei(instanceProto.gl.UNPACK_FLIP_Y_WEBGL, true);
		instanceProto.gl.texImage2D(instanceProto.gl.TEXTURE_2D, 0, instanceProto.gl.RGBA, instanceProto.gl.RGBA, instanceProto.gl.UNSIGNED_BYTE, texture.image);
		instanceProto.gl.texParameteri(instanceProto.gl.TEXTURE_2D, instanceProto.gl.TEXTURE_MAG_FILTER, instanceProto.gl.NEAREST);
		instanceProto.gl.texParameteri(instanceProto.gl.TEXTURE_2D, instanceProto.gl.TEXTURE_MIN_FILTER, instanceProto.gl.NEAREST);
		instanceProto.gl.bindTexture(instanceProto.gl.TEXTURE_2D, null);
	  }

	instanceProto.initTexture= function() {
		neheTexture = instanceProto.gl.createTexture();
		neheTexture.image = new Image();
		neheTexture.image.onload = function() {
		  instanceProto.handleLoadedTexture(neheTexture)
		}
		//tex1src = document.getElementById("tex0");
		//neheTexture.image.src = tex1src.value;
		neheTexture.image.src = "logo.jpg"
	   }
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		/*var nameOfCSSFile;
		if(typeof cr_is_preview != undefined){
			//alert(this.properties[4]);
			nameOfCSSFile  = this.properties[4];
		}else{
			nameOfCSSFile  = this.properties[5];
		}*/
		/*this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.compositeOp = this.effectToCompositeOp(this.properties[1]);*/
		/*this.canvas = document.createElement('canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;*/
		instanceProto.canvas = document.createElement('canvas');
		instanceProto.canvas.width=this.width;
		instanceProto.canvas.height=this.height;
		/*this.ctx = this.canvas.getContext('2d');
		this.ctx.drawImage(this.type.texture_img,0,0,this.width,this.height);*/
		
		instanceProto.fragmentShader = this.properties[2];
		instanceProto.vertexShader = this.properties[3];
		 
		instanceProto.initGL(this.canvas);
		instanceProto.initShaders()
		instanceProto.initBuffers();
		instanceProto.initTexture();

		instanceProto.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		instanceProto.gl.disable(instanceProto.gl.DEPTH_TEST);
		
		//this.returnValue= "";
		//<link rel="stylesheet" type="text/css" href="style.css" />
		/*var myWebFontTag=document.createElement('link');
		myWebFontTag.setAttribute("type","text/css");
		myWebFontTag.setAttribute("rel", "stylesheet");
		myWebFontTag.setAttribute("href", "nameOfCSSFile");*/
		/*var linkTag = "<link rel='stylesheet' type='text/css' href='"+nameOfCSSFile+"' />";
		jQuery('head').append(linkTag);*/
		var fragmentShader = this.properties[2];
		var pixelShader = this.properties[3];
		/*jQuery('head').append(fragmentShader);
		jQuery('head').append(pixelShader);*/
		
		/*if (typeof myWebFontTag != "undefined")
		document.getElementsByTagName("head")[0].appendChild(myWebFontTag);*/
		//jQuery(this.elem).appendTo("head");

	
		var myDiv = document.createElement("div");
		myDiv.setAttribute("id","div-shader");
		this.elem = myDiv
		//this.elem.type = "button";		
		jQuery(this.elem).appendTo("body");
		//this.elem.value = this.properties[0];
		/*this.elem.innerHTML = this.properties[0];
		this.elem.title = this.properties[1];
		this.elem.disabled = (this.properties[3] === 0);*/
		
		/*var tmpt = this.properties[7];
		jQuery(window).bind("load", function() {
			jQuery('myp').addClass('shown');
		});*/

		
		/*if (this.properties[2] === 0)
		{
			jQuery(this.elem).hide();
			this.visible = false;
		}*/
		
		this.elem.onclick = (function (self) {
			return function() {
				self.runtime.trigger(cr.plugins_.Button.prototype.cnds.OnClicked, self);
			};
		})(this);
			
		this.updatePosition();
		
		this.runtime.tickMe(this);
	};
	
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
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
		
		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
		instanceProto.gl.clear(instanceProto.gl.COLOR_BUFFER_BIT);

		instanceProto.gl.bindBuffer(instanceProto.gl.ARRAY_BUFFER, instanceProto.squareVertexPositionBuffer);
		instanceProto.gl.vertexAttribPointer(instanceProto.shaderProgram.vertexPositionAttribute, instanceProto.squareVertexPositionBuffer.itemSize, instanceProto.gl.FLOAT, false, 0, 0);

		instanceProto.setUniforms();
		instanceProto.gl.drawArrays(instanceProto.gl.TRIANGLE_STRIP, 0, instanceProto.squareVertexPositionBuffer.numItems);
		
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		//ctx.drawImage(typeProto.canvas.toDataURL("image/png"),
		ctx.drawImage(instanceProto.canvas,
						  myx - (this.hotspotX * this.width),
						  myy - (this.hotspotY * this.height),
						  this.width,
						  this.height);
	};
	
	instanceProto.drawGL = function(glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	cnds.OnClicked = function ()
	{
		return true;
	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.SetText = function (text)
	{
		//this.elem.value = text;
		this.elem.innerHTML = text;
	};
	
	acts.SetTooltip = function (text)
	{
		this.elem.title = text;
	};
	
	acts.SetVisible = function (vis)
	{
		this.visible = (vis !== 0);
	};
	
	acts.SetEnabled = function (en)
	{
		this.elem.disabled = (en === 0);
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

}());