// ECMAScript 5 strict mode
//"use strict";
/*
 Chromanin 
 Based on public domain pascal code of Texture v.0.5 (C)2K2 by CARSTEN WAECHTER http://ainc.de
 
 JavaScript version Copyright (C) 2012 Alejandro Mosquera <amsqr2@gmail.com>
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, version 3 of the License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function Chromanin(texsize,strcanvas){
	this.MAX_LAYERS=5;
	this.TEMPL =5;
	this.layerSizeX=texsize;
	this.layerSizeY=texsize;
	this.andLayerSizeX=texsize-1;
	this.andLayerSizeY=texsize-1;
	this.layers = []; // array de canvas
	this.imageData=null;
	this.seedValue=0;
	this.outcanvas = strcanvas;
}


function RGBA(){
	this.r=0;
	this.g=0;
	this.b=0;
	this.a=255;
};

Chromanin.prototype["setPixel"] = function setPixel(x, r, g, b, a) {
    var index = (x);
	var imData = this.imageData.data;
   /* this.imageData.data[index+0] = r;
    this.imageData.data[index+1] = g;
    this.imageData.data[index+2] = b;
    this.imageData.data[index+3] = a;*/
	imData[index+0] = r;
    imData[index+1] = g;
    imData[index+2] = b;
    imData[index+3] = a;
}

//Chromanin.prototype.writeCanvas= function writeCanvas()
Chromanin.prototype["writeCanvas"]= function writeCanvas(/*ctx*/plugin){
    var skel = "ch_canvas_tmp";
	var index;
	
	//for (var i=0; i<this.MAX_LAYERS+1; i++)	{
	for (var i=0, ii=this.MAX_LAYERS+1; i<ii; i++)	{
	    var ref = null;
		if (i==0){
			ctx = plugin.chLayer0.getContext("2d");
		}
		if (i==1){
			ctx = plugin.chLayer1.getContext("2d");
		}
		if (i==2){
			ctx = plugin.chLayer2.getContext("2d");
		}		
		if (i==3){
			//ref = document.getElementById(this.outcanvas);
			/*}
			else
			{
				ref = document.getElementById(skel+i);
				//alert(skel+i);
			}
			*/
			//ctx = ref.getContext('2d');
				ctx = plugin.chLayer3.getContext("2d");
			}
		if (i==4){
			ctx = plugin.chCanvas.getContext("2d");
		}		
		if(i<=4){
			this.imageData = ctx.createImageData(this.layerSizeX, this.layerSizeY);
			//alert(i);
			//for (var x=0; x<(this.layerSizeX * this.layerSizeY); x+=1)
			var imData = this.imageData.data;
				
				//if (typeof Int32Array !== 'undefined') {
				if (typeof Uint32Array !== 'undefined') {
					
					var buf = new ArrayBuffer(this.imageData.data.length);
					var buf8 = new Uint8ClampedArray(buf);
					var data = new Uint32Array(buf);
					var _data32 = new DataView(buf);
					var s=0;
					for (var y = 0; y < this.layerSizeY; y++) {
						for (var x = 0; x < this.layerSizeX; x++) {
							//var value = x * y & 0xff;
							var value = this.layers[i][s];
		
							data[y * this.layerSizeY + x] =
								(255   << 24) |    // alpha
								(value.b << 16) |    // blue
								(value.g <<  8) |    // green
								value.r;            // red
							//_data32.setUint32
							//	(s,
							//	 0xFF000000    |
							//	 ((value.b&0xFF) << 16) | // blue
							//	 ((value.g&0xFF) <<  8) | // green
							//	 (value.r&0xFF),true
							//	); // red
							s++;
						}
					}
					this.imageData.data.set(buf8);
					//this.imageData.data.set(_data32);
					ctx.putImageData(this.imageData, 0, 0); 
				}else{	
					for (var x=0, jj = (this.layerSizeX * this.layerSizeY); x<jj; x+=1)
					{
						index=4*x;
						/*this.imageData.data[index] =  Math.round(this.layers[i][x].r);
						this.imageData.data[index+1] =  Math.round(this.layers[i][x].g);
						this.imageData.data[index+2] =  Math.round(this.layers[i][x].b);
						this.imageData.data[index+3] = Math.round(this.layers[i][x].a)*/
						var layerTemp = this.layers[i][x];
						//since values are never negative, ~~ is faster
						imData[index] =  ~~(layerTemp.r);
						imData[index+1] = ~~(layerTemp.g);
						imData[index+2] = ~~(layerTemp.b);
						imData[index+3] = ~~(layerTemp.a)
						//setPixel(x, Math.round(this.layers[i][x].r),Math.round(this.layers[i][x].g),Math.round(this.layers[i][x].b),Math.round(this.layers[i][x].a));
					}
				ctx.putImageData(this.imageData, 0, 0); 
			}
		}
	}
}

Chromanin.prototype["CreateTexture"]= function CreateTexture(){}

Chromanin.prototype["initlayers"]= function initlayers(sizeX, sizeY){

	/*
	for (var i=0; i<this.MAX_LAYERS+1; i++)
	{
		var skel = "ch_canvas_tmp";
		
	    ref = document.createElement('canvas');
		ref.id = skel+i;
		ref.width = sizeX; 
        ref.height =sizeY; 
		document.body.appendChild(ref);
		
		ref = document.getElementById(skel+i);
		//alert(ref);
	}
	
	*/
	
	for (var i=0, ii = this.MAX_LAYERS+1; i<ii; i++){
		this.layers[i]=[];
		for (var x=0,jj=(sizeX * sizeY); x<jj; x+=1){
			this.layers[i][x] = new RGBA();
		}
	}	
	
	this.layerSizeX=sizeX;
	this.layerSizeY=sizeY;
	this.andLayerSizeX=sizeX-1;
	this.andLayerSizeY=sizeY-1;
}

Chromanin.prototype["deInitLayers"]= function deInitLayers(){}

Chromanin.prototype["getLayer"]= function getLayer(l){
	return this.layers[l];
}

//function myRandom()
Chromanin.prototype.myRandom = function()
{
        this.seedValue = (this.seedValue * 22695477 + 1) & 0xffffff;
        return (this.seedValue >> 16) & 0x7fff;
        //return Math.floor(Math.random()*301);
}

function cosineInterpolate(v, x, y){
	
	var f1, f2, mf1, mf2, g0, g1, g2, g3;
	var color= new RGBA();
	mf1=(1-Math.cos(x*Math.PI))*0.5;
	mf2=(1-Math.cos(y*Math.PI))*0.5;
	f1=1-mf1;
	f2=1-mf2;
	g0=f1*f2;
	g1=mf1*f2;
	g2=f1*mf2;
	g3=mf1*mf2;

	color.r=(v[0].r*g0+v[1].r*g1+v[2].r*g2+v[3].r*g3);
	color.g=(v[0].g*g0+v[1].g*g1+v[2].g*g2+v[3].g*g3);
	color.b=(v[0].b*g0+v[1].b*g1+v[2].b*g2+v[3].b*g3);

	return color;
}


function mySqrtInt(n){
	var root, tryr;

	if (n>=65025)		// 255*255
		return 255;

	root=0;
	for (var i=15; i>=0; i--){
		tryr=root+(1<<i);
		if (n>(tryr<<i)){
			n-=tryr<<i;
			root=root|(2<<i);
		}
	}
	return root>>1;
}

function fmod(a, b){
	var x = Math.floor(a/b);
	return a - b*x;
}

function hsv2rgb( h,  s, v, r, g, b){
	var f, p, q, t;
	var i;

	while (h<0) h+=360;
	while (h>=360) h-=360;

	if (s==0){
		r=v;
		g=v;
		b=v;
	}else {
		h/=60;
		i=getlo(h);
		f=fmod(h, 1);
		f=(h-i);
		p=v*(1-s);
		q=v*(1-(s*f));
		t=v*(1-(s*(1-f)));
		switch(i){
			case 0:	r=v; g=t; b=p; break;
			case 1:	r=q; g=v; b=p; break;
			case 2:	r=p; g=v; b=t; break;
			case 3:	r=p; g=q; b=v; break;
			case 4:	r=t; g=p; b=v; break;
			case 5:	r=v; g=p; b=q; break;
		}
	}
}


function rgb2hsv(r, g, b, h, s, v){
	var maxR, maxG, maxB, delta;
	var mx=Math.max(r, Math.max(g, b));
	var mn=Math.min(r, Math.min(g, b));

	v=mx;
	s=0;

	if (mx!=0)
		s=(mx-mn)/mx;
	if (s==0)
		h=-1;
	else {
		delta=mx-mn;
		maxR=mx-r;
		maxG=mx-g;
		maxB=mx-b;
		if (r==mx)
			h=(maxB-maxG)/delta;
		else
			if (g==mx)
				h=2+(maxR-maxB)/delta;
			else
				h=4+(maxG-maxR)/delta;
		h*=60;
		while (h<0) h+=360;
		while (h>=360) h-=360;
	}
}


Chromanin.prototype["getBilerpixel"]= function getBilerpixel(l, x, y){

	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var lSX = this.layerSizeX;
	var tmpLayer = this.layers[l];

	var corner = [];
	corner[0] =new RGBA();
	corner[1] =new RGBA();
	corner[2] =new RGBA();
	corner[3] =new RGBA();
	var xi, yi, xip, xip1;
	var yip, yip1;

	xi=x;
	yi=y;
	xip=xi&aLSX;
	xip1=(xi+1)&aLSX;
	yip1=((yi+1)&aLSY)*lSX;
	yip=(yi&aLSY)*lSX;

	corner[0]=tmpLayer[xip+yip];
	corner[1]=tmpLayer[xip1+yip];
	corner[2]=tmpLayer[xip+yip1];
	corner[3]=tmpLayer[xip1+yip1];

	return cosineInterpolate(corner, (x-xi), (y-yi));
}

Chromanin.prototype["subPlasma"]= function subPlasma(l, dist, seed, amplitude,  rgb){

	var x, y;
	var offset, offset2;
	var corner = [];
	corner[0] =new RGBA();
	corner[1] =new RGBA();
	corner[2] =new RGBA();
	corner[3] =new RGBA();
	var oodist;
	
	var tmpLayer,tmpLayer1;

	if (seed!=0)
		this.seedValue=seed;

	for (var y=0, ii=this.layerSizeY; y<ii; y+=dist)
		for (var x=0, jj=this.layerSizeX; x<jj; x+=dist){
			offset=y*jj+x;
			
			tmpLayer = this.layers[l][offset];
			
			tmpLayer.r=tmpLayer.g=tmpLayer.b=getlo(this.myRandom())&(amplitude-1);
			if (rgb)
			{
				tmpLayer.g=getlo(this.myRandom())&(amplitude-1);
				tmpLayer.b=getlo(this.myRandom())&(amplitude-1);
			}
		}

	if (dist<1)
		return;

	oodist=1/dist;

	for (y=0, ii = this.layerSizeY; y<ii; y+=dist){
		offset=y*this.layerSizeX;
		offset2=((y+dist)&this.andLayerSizeY)*this.layerSizeX;
		for (x=0,jj=this.layerSizeX; x<jj; x+=dist){
			tmpLayer1 = this.layers[l];
			corner[0]=tmpLayer1[x+offset];
			corner[1]=tmpLayer1[((x+dist)&this.andLayerSizeX)+offset];
			corner[2]=tmpLayer1[x+offset2];
			corner[3]=tmpLayer1[((x+dist)&this.andLayerSizeX)+offset2];
			for (var b=0; b<dist; b++)
				for (var a=0; a<dist; a++)
					tmpLayer1[x+a+(y+b)*jj]=cosineInterpolate(corner, oodist*a, oodist*b);
		}
	}
}

Chromanin.prototype["sinePlasma"]= function sinePlasma(l, dx,  dy,  amplitude){

	var tmpLayer;

	amplitude/=256;
	for (var y=0,ii=this.layerSizeY; y<ii; y++)
		for (var x=0,jj=this.layerSizeX; x<jj; x++){
			tmpLayer = this.layers[l][x+y*jj];
			tmpLayer.r=tmpLayer.g=tmpLayer.b=((63.5*Math.sin(dx*x)+127+63.5*Math.sin(dy*y))*amplitude);
		}
	
}

Chromanin.prototype["perlinNoise"]= function perlinNoise( l,  dist,  seed,  amplitude,  persistence,  octaves,  rgb){
	var r;
	
	var tmpl = this.TEMPL;
	var tmpLayer1,tmpLayer2; 

	this["subPlasma"](l, dist, seed, 1, rgb);
	
	for ( var i=0; i<octaves-2; i++){
		amplitude=(amplitude*persistence)>>8;
		if (amplitude<=0) break;
		dist=dist>>1;
		if (dist<=0) break;
		this["subPlasma"](tmpl, dist, 0, amplitude, rgb);
		for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
			tmpLayer1 = this.layers[l][v];
			tmpLayer2 = this.layers[tmpl][v];
		
			r=tmpLayer1.r+tmpLayer2.r;
			if (r>255)
				tmpLayer1.r=255;
			else
				tmpLayer1.r=r;
			r=tmpLayer1.g+tmpLayer2.g;
			if (r>255)
				tmpLayer1.g=255;
			else
				tmpLayer1.g=r;
			r=tmpLayer1.b+tmpLayer2.b;
			if (r>255)
				tmpLayer1.b=255;
			else
				tmpLayer1.b=r;
		}
	}
}


Chromanin.prototype["particle"]= function particle( l,  f){
	var r, nx, ny;
	var offset;
	
	var tmpLayer;
	
	f*=180;
	for (var y=0,ii=this.layerSizeY; y<ii; y++){
		//ny=y/(this.layerSizeY>>1)-1;
		ny=y/(ii>>1)-1;
		//for (var x=0; x<this.layerSizeX; x++){
		for (var x=0,jj=this.layerSizeX; x<jj; x++){
			//offset=y*this.layerSizeX+x;
			offset=y*jj+x;
			//nx=x/(this.layerSizeX>>1)-1;
			nx=x/(jj>>1)-1;
			r=255-f*Math.sqrt(nx*nx+ny*ny);
			if (r<0) r=0;
			if (r>255) r=255;
			tmpLayer = this.layers[l][offset];			
			tmpLayer.r=tmpLayer.g=tmpLayer.b=(r);
		}
	}
}

Chromanin.prototype["colorLayer"]= function colorLayer( l,  r,  g,  b){
	var tmpLayer = this.layers[l];

	var color= new RGBA();
	color.r=r; color.g=g; color.b=b;
	//for (var v=0; v<this.layerSizeX*this.layerSizeY; v++)
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++)
		tmpLayer[v]=color;
}

Chromanin.prototype["checkerBoardLayer"]= function checkerBoardLayer( l,  dx,  dy,  r1,  g1,  b1,  r2,  g2,  b2){
	
	var tmpLayer; 
	
	var col1=new RGBA();
	var col2=new RGBA();
	col1.r=r1; col1.g=g1; col1.b=b1;
	col2.r=r2; col2.g=g2; col2.b=b2;
	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			
			tmpLayer = this.layers[l];
		
			if (((y/dy)&1)^((x/dx)&1))
				tmpLayer[y*ii+x]=col1;
			else
				tmpLayer[y*ii+x]=col2;
		}
}

Chromanin.prototype["blobsLayer"]= function blobsLayer( l,  seed,  amount,  rgb){
	var blobX =new Array(16);
 	var blobY =new Array(16);
	var blobR=new Array(16);
	var blobG =new Array(16);
	var blobB=new Array(16);
	var r, g, b, sd, d, oosize;
	var rx, ry;
	var offset;

	this.seedValue = seed;
	

	//
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var tmpLayer;
	//
	
	for ( var v=0; v<amount; v++){
		/*blobX[v]=getlo(getlo(myRandom())&tmp1);
		blobY[v]=getlo(getlo(myRandom())&tmp2);*/
		blobX[v]=getlo(getlo(this.myRandom())&aLSX);
		blobY[v]=getlo(getlo(this.myRandom())&aLSY);
		//blobR[v]=(getlo(myRandom()&255)/255+0.1)*150;
		blobR[v]=(getlo(this.myRandom()&255)/255+0.1)*150;
		if (rgb==true){
			/*blobG[v]=getlo((getlo(getlo(myRandom())&255)/255+0.1)*150);
			blobB[v]=getlo((getlo(getlo(myRandom())&255)/255+0.1)*150);*/
			blobG[v]=getlo((getlo(getlo(this.myRandom())&255)/255+0.1)*150);
			blobB[v]=getlo((getlo(getlo(this.myRandom())&255)/255+0.1)*150);
		}
	}

	oosize=3/(this.layerSizeX*this.layerSizeY);
	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			//offset=y*this.layerSizeX+x;
			offset=y*ii+x;
			r=g=b=0;
			for (v=0; v<amount; v++){
				rx=blobX[v]-x;
				ry=blobY[v]-y;
				d=oosize*(rx*rx+ry*ry);
				sd=d*d;
				d=-0.444444*sd*d+1.888888*sd-2.444444*d+1;
				r+=d*blobR[v];
				g+=d*blobG[v];		// needn't be calculated if not rgb, but we do it for memory optimization (spares one if statement)
				b+=d*blobB[v];		// needn't be calculated if not rgb, but we do it for memory optimization (spares one if statement)
			}

			if (r<0) r=0;
			if (r>255) r=255;
			
			tmpLayer = this.layers[l][offset];
			
			tmpLayer.r=tmpLayer.g=tmpLayer.b=getlo(r);
			if (rgb){
				if (g<0) g=0;
				if (g>255) g=255;
				//this.layers[l][offset].g=getlo(g);
				tmpLayer.g=getlo(g);
				if (b<0) b=0;
				if (b>255) b=255;
				//this.layers[l][offset].b=getlo(b);
				tmpLayer.b=getlo(b);
			}
		}
}

Chromanin.prototype["scaleLayerRGB"]= function scaleLayerRGB( src,  dest,  r,  g,  b){
	var tr, tg, tb;

	var tmpLayer1,tmpLayer2;
	
	//for (var v=0; v<this.layerSizeX*this.layerSizeY; v++)
	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++)
	{
		tmpLayer1 = this.layers[src][v];
		tr=tmpLayer1.r*r;
		tg=tmpLayer1.g*g;
		tb=tmpLayer1.b*b;

		tmpLayer2 = this.layers[dest][v];
		
		if (tr>=255) tmpLayer2.r=255; else if (tr<=0) tmpLayer2.r=0; else tmpLayer2.r=tr;
		if (tg>=255) tmpLayer2.g=255; else if (tg<=0) tmpLayer2.g=0; else tmpLayer2.g=tg;
		if (tb>=255) tmpLayer2.b=255; else if (tb<=0) tmpLayer2.b=0; else tmpLayer2.b=tb;
	}
}

Chromanin.prototype["scaleLayerHSV"]= function scaleLayerHSV( src,  dest,  h,  s,  v){
	 var th, ts, tv, tr, tg, tb;

	var tmpLayer1,tmpLayer2;
	 
	for (var k=0,ii=this.layerSizeX*this.layerSizeY; k<ii; k++){
		tmpLayer1 = this.layers[src][k];
		rgb2hsv(tmpLayer1.r, tmpLayer1.g, tmpLayer1.b, th, ts, tv);
		th*=h;
		ts*=s;
		tv*=v;
		if (ts>1) ts=1; else if (ts<0) ts=0;
		if (tv>255) tv=255; else if (tv<0) tv=0;
		hsv2rgb(th, ts, tv, tr, tg, tb);
		
		tmpLayer2 = this.layers[dest][k];
		
		tmpLayer2.r=getlo(tr);
		tmpLayer2.g=getlo(tg);
		tmpLayer2.b=getlo(tb);
	}
}

Chromanin.prototype["adjustLayerRGB"]= function adjustLayerRGB( src,  dest,  r,  g,  b){
	var tr, tg, tb;

	var tmpLayer1,tmpLayer2;
	
	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		tr=tmpLayer1.r+r;
		tg=tmpLayer1.g+g;
		tb=tmpLayer1.b+b;

		tmpLayer2 = this.layers[dest][v];
		
		if (tr>=255) tmpLayer2.r=255; else if (tr<=0) tmpLayer2.r=0; else tmpLayer2.r=tr;
		if (tg>=255) tmpLayer2.g=255; else if (tg<=0) tmpLayer2.g=0; else tmpLayer2.g=tg;
		if (tb>=255) tmpLayer2.b=255; else if (tb<=0) tmpLayer2.b=0; else tmpLayer2.b=tb;
	}
}

Chromanin.prototype["adjustLayerHSV"]= function adjustLayerHSV( src,  dest,  h,  s,  v){
	var th, ts, tv, tr, tg, tb;

	var tmpLayer1,tmpLayer2;
	
	for ( k=0,ii=this.layerSizeX*this.layerSizeY; k<ii; k++){
		tmpLayer1 = this.layers[src][k];
		rgb2hsv(tmpLayer1.r, tmpLayer1.g, tmpLayer1.b, th, ts, tv);
		th+=h;
		ts+=s;
		tv+=v;
		if (ts>1) ts=1; else if (ts<0) ts=0;
		if (tv>255) tv=255; else if (tv<0) tv=0;
		hsv2rgb(th, ts, tv, tr, tg, tb);
		
		tmpLayer2 = this.layers[dest][k];
		
		tmpLayer2.r=getlo(tr);
		tmpLayer2.g=getlo(tg);
		tmpLayer2.b=getlo(tb);
	}
}

Chromanin.prototype["sineLayerRGB"]= function sineLayerRGB( src,  dest,  r,  g,  b){
	r*=Math.PI;
	g*=Math.PI;
	b*=Math.PI;
	
	var tmpLayer1,tmpLayer2;
	
	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		tmpLayer2 = this.layers[dest][v];
		tmpLayer2.r=(127.5*(Math.sin(r*tmpLayer1.r)+1));
		tmpLayer2.g=(127.5*(Math.sin(g*tmpLayer1.g)+1));
		tmpLayer2.b=(127.5*(Math.sin(b*tmpLayer1.b)+1));
	}
}

Chromanin.prototype["equalizeRGB"]= function equalizeRGB( src,  dest){
	var histogramR=new Array(256);
	var histogramG=new Array(256);
	var histogramB=new Array(256);
	var sumR, sumG, sumB, pDiv;
	
	var tmphistogramR,tmphistogramG,tmphistogramB;

	//memset(histogramR, 0, sizeof()*256);
	//memset(histogramG, 0, sizeof()*256);
	//memset(histogramB, 0, sizeof()*256);
	
	var tmpLayer1,tmpLayer2;

	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		histogramR[tmpLayer1.r]++;
		histogramG[tmpLayer1.g]++;
		histogramB[tmpLayer1.b]++;
	}

	sumR=sumG=sumB=0;
	pDiv=255/(this.layerSizeX*this.layerSizeY);
	for (v=0; v<256; v++)			// v is already defined by for (var v=0; v<this.layerSizeX*this.layerSizeY; v++)!!!
	{
		tmphistogramR = histogramR[v];
		tmphistogramG = histogramG[v];
		tmphistogramB = histogramB[v];
	
		sumR+=tmphistogramR*pDiv;
		tmphistogramR=sumR;
		sumG+=tmphistogramG*pDiv;
		tmphistogramG=sumG;
		sumB+=tmphistogramB*pDiv;
		tmphistogramB=sumB;
	}

	for (v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		tmpLayer2 = this.layers[dest][v];
	
		tmpLayer2.r=histogramR[tmpLayer1.r];
		tmpLayer2.g=histogramG[tmpLayer1.g];
		tmpLayer2.b=histogramB[tmpLayer1.b];
	}
}

Chromanin.prototype["stretchRGB"]= function stretchRGB( src,  dest){
	var histogramR=new Array(256);
	var histogramG=new Array(256);
	var histogramB=new Array(256);
	var sumR, sumG, sumB, pDivR, pDivG, pDivB;
	var minR, minG, minB, maxR, maxG, maxB;

	var tmpLayer1,tmpLayer2;
	var tmphistogramR,tmphistogramG,tmphistogramB;
	
	//memset(histogramR, 0, sizeof()*256);
	//memset(histogramG, 0, sizeof()*256);
	//memset(histogramB, 0, sizeof()*256);

	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		histogramR[tmpLayer1.r]++;
		histogramG[tmpLayer1.g]++;
		histogramB[tmpLayer1.b]++;
	}

	minR=minG=minB=-1;
	maxR=maxG=maxB=0;
	for (v=0; v<256; v++){
		if (histogramR[v]!=0){maxR=v; if(minR==-1)minR=v;}
		if (histogramG[v]!=0){maxG=v; if(minG==-1)minG=v;}
		if (histogramB[v]!=0){maxB=v; if(minB==-1)minB=v;}
	}

	sumR=minR; sumG=minG; sumB=minB;
	pDivR=(maxR-minR)/(this.layerSizeX*this.layerSizeY);
	pDivG=(maxG-minG)/(this.layerSizeX*this.layerSizeY);
	pDivB=(maxB-minB)/(this.layerSizeX*this.layerSizeY);
	for (v=0; v<256; v++)			// v is already defined by for (var v=0; v<this.layerSizeX*this.layerSizeY; v++)!!!
	{
		tmphistogramR = histogramR[v];
		tmphistogramG = histogramG[v];
		tmphistogramB = histogramB[v];
		
		sumR+=tmphistogramR*pDivR;
		tmphistogramR=sumR;
		sumG+=tmphistogramG*pDivG;
		tmphistogramG=sumG;
		sumB+=tmphistogramB*pDivB;
		tmphistogramB=sumB;
	}

	for (v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		tmpLayer2 = this.layers[dest][v];	
	
		tmpLayer2.r=histogramR[tmpLayer1.r];
		tmpLayer2.g=histogramG[tmpLayer1.g];
		tmpLayer2.b=histogramB[tmpLayer1.b];
	}
}

Chromanin.prototype["invertLayer"]= function invertLayer( src,  dest){
	
	var tmpLayer1,tmpLayer2;

	for (var v=0,ii=this.layerSizeX*this.layerSizeY; v<ii; v++){
		tmpLayer1 = this.layers[src][v];
		tmpLayer2 = this.layers[dest][v];
		tmpLayer2.r=255-tmpLayer1.r;//~this.layers[src][v].r;
		tmpLayer2.g=255-tmpLayer1.g;//~this.layers[src][v].g;
		tmpLayer2.b=255-tmpLayer1.b;//~this.layers[src][v].b;
		//this.layers[dest][v].a=~this.layers[src][v].a;
		}
}

Chromanin.prototype["matrixLayer"]= function matrixLayer( src,  dest,  myabs,  matrix){
	var r, g, b;
	var offset;

	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var lSX = this.layerSizeX;
	
	var tmpRGB,tmpLayer2;
	var tmpMatrix = {};
	
	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			r=g=b=0;
			for (var my=0; my<3; my++)
				for (var mx=0; mx<3; mx++){

					offset=((x-1+mx)&aLSX)+((y-1+my)&aLSY)*lSX;
				
					tmpRGB = this.layers[this.TEMPL][offset];
					tmpMatrix = matrix[mx][my];
				
					r+=tmpMatrix*tmpRGB.r;
					g+=tmpMatrix*tmpRGB.g;
					b+=tmpMatrix*tmpRGB.b;
				}
			if (myabs==true){
				r=Math.abs(r); //TODO CHANGE HERE !
				g=Math.abs(g);
				b=Math.abs(b);
			}

			if (r<0) r=0; else if (r>255) r=255;
			if (g<0) g=0; else if (g>255) g=255;
			if (b<0) b=0; else if (b>255) b=255;

			tmpLayer2 = this.layers[dest][x+y*lSX];
			
			tmpLayer2.r=r;
			tmpLayer2.g=g;
			tmpLayer2.b=b;
		}
}

Chromanin.prototype["embossLayer"]= function embossLayer( src,  dest){
	var r1, g1, b1, r2, g2, b2;
	var offset, offsetxm1, offsetxp1, offsetym1, offsetyp1;

	var aLSY = this.andLayerSizeY;
	var lSX = this.layerSizeX;
	var aLSX = this.andLayerSizeX;
	
	var tmpLayer1,tmpLayer2,tmpLayer3,tmpLayer4,tmpLayer5,tmpLayer6,tmpLayer7,tmpLayer8,tmpLayer;
	
	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offsetym1=(getlo(y-1)&aLSY)*lSX;
		offset=y*lSX;
		offsetyp1=(getlo(y+1)&aLSY)*lSX;
		for (var x=0; x<lSX; x++){
			offsetxm1=(getlo(x-1)&aLSX);
			offsetxp1=(getlo(x+1)&aLSX);
			
			tmpLayer1 = this.layers[this.TEMPL][offsetxm1+offsetym1];
			tmpLayer2 = this.layers[this.TEMPL][offsetxm1+offset];
			tmpLayer3 = this.layers[this.TEMPL][offsetxm1+offsetyp1];
			tmpLayer4 = this.layers[this.TEMPL][offsetxp1+offsetym1];
			tmpLayer5 = this.layers[this.TEMPL][offsetxp1+offset];
			tmpLayer6 = this.layers[this.TEMPL][offsetxp1+offsetyp1];
			tmpLayer7 = this.layers[this.TEMPL][offsetym1+x];
			tmpLayer8 = this.layers[this.TEMPL][offsetyp1+x];
			
			r1=128 - tmpLayer1.r - tmpLayer2.r - tmpLayer3.r + tmpLayer4.r + tmpLayer5.r + tmpLayer6.r;
			g1=128 - tmpLayer1.g - tmpLayer2.g - tmpLayer3.g + tmpLayer4.g + tmpLayer5.g + tmpLayer6.g;
			b1=128 - tmpLayer1.b - tmpLayer2.b - tmpLayer3.b + tmpLayer4.b + tmpLayer5.b + tmpLayer6.b;
			
			r2=128 - tmpLayer1.r - tmpLayer7.r - tmpLayer4.r + tmpLayer3.r + tmpLayer8.r + tmpLayer6.r;
			g2=128 - tmpLayer1.g - tmpLayer7.g - tmpLayer4.g + tmpLayer3.g + tmpLayer8.g + tmpLayer6.g;
			b2=128 - tmpLayer1.b - tmpLayer7.b - tmpLayer4.b + tmpLayer3.b + tmpLayer8.b + tmpLayer6.b;
			r1=Math.sqrt((r1*r1+r2*r2));
			g1=Math.sqrt((g1*g1+g2*g2));
			b1=Math.sqrt((b1*b1+b2*b2));
			if (r1>255) r1=255;
			if (g1>255) g1=255;
			if (b1>255) b1=255;
			
			tmpLayer = this.layers[dest][x+offset];
			
			tmpLayer.r=r1;
			tmpLayer.g=g1;
			tmpLayer.b=b1;
		}
	}
}


// table used for shift operations
//powtab = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

function mylshift(a,shift){
	var powtab = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
	// logical shift left
	if (shift > 7) {
		 a = 0; // if shifting more than 15 bits to the left, value is always zero
	} else {
		 a *= powtab[shift];
	}
	return a;
}

function myrshift(a,shift){
	var powtab = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
	// logical shift right (unsigned)
	if (shift > 7) {
		a = 0; // more than 15, becomes zero
	} else {//if (shift > 0) {
		//if (a < 0) {
			// deal with the sign bit (15)
		  //  a += -32768;
		   // a /= powtab[shift];
		   // a += powtab[15 - shift];
		//} else {
			a /= powtab[shift];
		//}
	}
	return a;
}



function myor(a,b){
	// OR (|)
	c = 0;
	for (x = 0; x <= 7; ++x) {
		c += c;
		if (a < 0) {
			c += 1;
		} else if (b < 0) {
			c += 1;
		}
		a += a;
		b += b;
	}
	return c;
}

function gethi(i){
    lo = i % 256;
    hi = (i-lo)/256;
	return hi;
}

function getlo(i){
	return i % 256;
}

Chromanin.prototype["woodLayer"]= function woodLayer( src,  dest,  b){
	var bm8=8-b;
	
	var tmpLayer1;
	var tmpLayer2;	
	
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
		//this.layers[dest][v].r=(this.layers[src][v].r<<b)|(this.layers[src][v].r>>bm8);
		//this.layers[dest][v].g=(this.layers[src][v].g<<b)|(this.layers[src][v].g>>bm8);
		//this.layers[dest][v].b=(this.layers[src][v].b<<b)|(this.layers[src][v].b>>bm8);
		tmpLayer1 = this.layers[src][v];
		tmpLayer2 = this.layers[dest][v];	
		
		tmpLayer2.r=getlo((mylshift(tmpLayer1.r,b))|(myrshift(tmpLayer1.r,bm8)));
		tmpLayer2.g=getlo((mylshift(tmpLayer1.g,b))|(myrshift(tmpLayer1.g,bm8)));
		tmpLayer2.b=getlo((mylshift(tmpLayer1.b,b))|(myrshift(tmpLayer1.b,bm8)));
	}
}

Chromanin.prototype["blurLayer"]= function blurLayer( src,  dest){

	var matrix=new Array(3);
	matrix[0]=new Array(3);
	matrix[1]=new Array(3);
	matrix[2]=new Array(3);
	
	matrix[0][0]=0.0625; matrix[1][0]=0.125; matrix[2][0]=0.0625;
	matrix[0][1]=0.125; matrix[1][1]=0.25; matrix[2][1]=0.125;
	matrix[0][2]=0.0625; matrix[1][2]=0.125; matrix[2][2]=0.0625;
	this["matrixLayer"](src, dest, false, matrix);
}

Chromanin.prototype["edgeHLayer"]= function edgeHLayer( src,  dest){
	var matrix=new Array(3);
	matrix[0]=new Array(3);
	matrix[1]=new Array(3);
	matrix[2]=new Array(3);
	
	matrix[0][0]=2; matrix[1][0]=4; matrix[2][0]=2;
	matrix[0][1]=0; matrix[1][1]=0; matrix[2][1]=0;
	matrix[0][2]=-2; matrix[1][2]=-4; matrix[2][2]=-2;
	this["matrixLayer"](src, dest, true, matrix);
}

Chromanin.prototype["edgeVLayer"]= function edgeVLayer( src,  dest){
	var matrix=new Array(3);
	matrix[0]=new Array(3);
	matrix[1]=new Array(3);
	matrix[2]=new Array(3);
	
	matrix[0][0]=2; matrix[1][0]=0; matrix[2][0]=-2;
	matrix[0][1]=4; matrix[1][1]=0; matrix[2][1]=-4;
	matrix[0][2]=2; matrix[1][2]=0; matrix[2][2]=-2;
	this["matrixLayer"](src, dest, true, matrix);
}

Chromanin.prototype["sharpenLayer"]= function sharpenLayer( src,  dest){
	var matrix=new Array(3);
	matrix[0]=new Array(3);
	matrix[1]=new Array(3);
	matrix[2]=new Array(3);
	
	matrix[0][0]=-0.125; matrix[1][0]=-0.25; matrix[2][0]=-0.125;
	matrix[0][1]=-0.25; matrix[1][1]=2.5; matrix[2][1]=-0.25;
	matrix[0][2]=-0.125; matrix[1][2]=-0.25; matrix[2][2]=-0.125;
	this["matrixLayer"](src, dest, false, matrix);
}

Chromanin.prototype["motionBlur"]= function motionBlur( src,  dest,  s){
	var sq, ts, r, g, b, offset, offset2;

	var aLSX = this.andLayerSizeX;
	
	var tmpLayer,tmpLayer1 ;
	
	this["copyTemp"](src);
	sq=(s+1)*(s+1);
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offset=y*this.layerSizeX;
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			r=g=b=0;
			for (var t=-s; t<=s; t++)	{
				offset2=offset+(getlo(x+t)&aLSX);
				ts=(s+1-Math.abs(t));  //TODO CHANGE HERE
				
				tmpLayer = this.layers[this.TEMPL][offset2];
				
				r+=tmpLayer.r*ts;
				g+=tmpLayer.g*ts;
				b+=tmpLayer.b*ts;
			}
			tmpLayer1 = this.layers[dest][offset+x];
			tmpLayer1.r=(r/sq);
			tmpLayer1.g=(g/sq);
			tmpLayer1.b=(b/sq);
		}
	}
}

Chromanin.prototype["makeTilable"]= function makeTilable( src,  dest,  s){
	var offset, offset2, sx, sy;
	var sq, sr, sd, srm;

	this["copyTemp"](src);
	s=this.layerSizeX/2-s;
	sq=(s*s);
	sd=(this.layerSizeX/2)*(this.layerSizeY/2)-sq;
	if (sd!=0){
		sd=0.75/sd;
	}else{
		sd=75000;
	}
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offset=y*this.layerSizeX;
		offset2=(jj-1-y)*this.layerSizeX;
		//sy=y-this.layerSizeY/2;
		sy=y-jj/2;
		sy*=sy;
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			//sx=x-this.layerSizeX/2;
			sx=x-ii/2;
			sr=sx*sx+sy-sq;
			if (sr>0){
				sr*=sd;
				if (sr>0.75){
					sr=0.25;
					srm=0.25;
				} else {
					srm=1-sr;
					sr/=3;
				}
				var tmpLayer = this.layers[dest][offset+x];
				var tmpLayer2 = this.layers[this.TEMPL][offset+x];
				var tmpLayer3 = this.layers[this.TEMPL][offset+ii-1-x];
				var tmpLayer4 = this.layers[this.TEMPL][offset2+ii-1-x];
				var tmpLayer5 = this.layers[this.TEMPL][offset2+x];
				/*this.layers[dest][offset+x].r=(this.layers[this.TEMPL][offset+x].r*srm+(this.layers[this.TEMPL][offset+this.layerSizeX-1-x].r+this.layers[this.TEMPL][offset2+this.layerSizeX-1-x].r+this.layers[this.TEMPL][offset2+x].r)*sr);
				this.layers[dest][offset+x].g=(this.layers[this.TEMPL][offset+x].g*srm+(this.layers[this.TEMPL][offset+this.layerSizeX-1-x].g+this.layers[this.TEMPL][offset2+this.layerSizeX-1-x].g+this.layers[this.TEMPL][offset2+x].g)*sr);
				this.layers[dest][offset+x].b=(this.layers[this.TEMPL][offset+x].b*srm+(this.layers[this.TEMPL][offset+this.layerSizeX-1-x].b+this.layers[this.TEMPL][offset2+this.layerSizeX-1-x].b+this.layers[this.TEMPL][offset2+x].b)*sr);*/
				tmpLayer.r=(tmpLayer2.r*srm+(tmpLayer3.r+tmpLayer4.r+tmpLayer5.r)*sr);
				tmpLayer.g=(tmpLayer2.g*srm+(tmpLayer3.g+tmpLayer4.g+tmpLayer5.g)*sr);
				tmpLayer.b=(tmpLayer2.b*srm+(tmpLayer3.b+tmpLayer4.b+tmpLayer5.b)*sr);
			}
		}
	}
}

function median(v){
	var a = new Array(5);
	var i, j, last;
	//memset(a, 0, 5);
	for (i=0; i<9; i++){
		last=4;
		for (j=4; j>=0; j--)
			if (a[j]<=v[i])
				last=j;
		for (j=3; j>=last; j--)
			a[j+1]=a[j];
		a[last]=v[i];
	}
	return a[4];
}

Chromanin.prototype["medianLayer"]= function medianLayer( src,  dest){
	var offset = new Array(9);
	var colors=new Array(9);
	var i;
	
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	
	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			for (i=0; i<9; i++)
				offset[i]=((x-1+(i%3))&aLSX)+((y-1+(i/3))&aLSY)*ii;
			for (i=0; i<9; i++)
				colors[i]=this.layers[this.TEMPL][offset[i]].r;
			this.layers[dest][offset[4]].r=median(colors);
			for (i=0; i<9; i++)
				colors[i]=this.layers[this.TEMPL][offset[i]].g;
			this.layers[dest][offset[4]].g=median(colors);
			for (i=0; i<9; i++)
				colors[i]=this.layers[this.TEMPL][offset[i]].b;
			this.layers[dest][offset[4]].b=median(colors);
		}
}

Chromanin.prototype["copyTemp"]= function copyTemp(src){
	
	var tmpLayer1,tmpLayer2;
	
	for (var x=0,ii=(this.layerSizeX * this.layerSizeY); x<ii; x+=1){
			tmpLayer1 = this.layers[5][x];
			tmpLayer2 = this.layers[src][x];
			
		    tmpLayer1.r=tmpLayer2.r;
			tmpLayer1.g=tmpLayer2.g;
			tmpLayer1.b=tmpLayer2.b;
			tmpLayer1.a=tmpLayer2.a;
	}
}

Chromanin.prototype["erodeLayer"]= function erodeLayer( src,  dest){
	var offset, offsetym1, offsetyp1, offsetxm1, offsetxp1;
	var r, g, b;

	var lSX = this.layerSizeX;
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	
	var tmpl = this.TEMPL;
	
	var tmpLayer,tmpLayer1,tmpLayer2,tmpLayer3,tmpLayer4,tmpLayer5,tmpLayer6,tmpLayer7,tmpLayer8,tmpLayer9,tmpLayer10;
	
	this["copyTemp"](src);
	
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offset=y*lSX;
		offsetym1=getlo((y-1)&aLSY)*lSX;
		offsetyp1=getlo((y+1)&aLSY)*lSX;
		for (var x=0; x<lSX; x++){
			offsetxm1=getlo(x-1)&aLSX;
			offsetxp1=getlo(x+1)&aLSX;
			
			tmpLayer10 = this.layers[tmpl];
			
			tmpLayer1 = tmpLayer10[offsetym1+offsetxm1];
			tmpLayer2 = tmpLayer10[offsetym1+x];
			tmpLayer3 = tmpLayer10[offsetym1+offsetxp1];
			tmpLayer4 = tmpLayer10[offset+offsetxm1];
			tmpLayer5 = tmpLayer10[offset+x];
			tmpLayer6 = tmpLayer10[offset+offsetxp1];
			tmpLayer7 = tmpLayer10[offsetyp1+offsetxm1];
			tmpLayer8 = tmpLayer10[offsetyp1+x];
			tmpLayer9 = tmpLayer10[offsetyp1+offsetxp1];

			r=	Math.min(tmpLayer1.r,Math.min(tmpLayer2.r,Math.min(tmpLayer3.r,Math.min(tmpLayer4.r,Math.min(tmpLayer5.r,Math.min(tmpLayer6.r,
				Math.min(tmpLayer7.r,Math.min(tmpLayer8.r,tmpLayer9.r))))))));
			g=	Math.min(tmpLayer1.g,Math.min(tmpLayer2.g,Math.min(tmpLayer3.g,Math.min(tmpLayer4.g,Math.min(tmpLayer5.g,Math.min(tmpLayer6.g,
				Math.min(tmpLayer7.g,Math.min(tmpLayer8.g,tmpLayer9.g))))))));
			b=	Math.min(tmpLayer1.b,Math.min(tmpLayer2.b,Math.min(tmpLayer3.b,Math.min(tmpLayer4.b,Math.min(tmpLayer5.b,Math.min(tmpLayer6.b,
				Math.min(tmpLayer7.b,Math.min(tmpLayer8.b,tmpLayer9.b))))))));
				
			tmpLayer = this.layers[dest][offset+x];
			
			tmpLayer.r=r;
			tmpLayer.g=g;
			tmpLayer.b=b;
		}
	}
}


Chromanin.prototype["dilateLayer"]= function dilateLayer( src,  dest){
	var offset, offsetym1, offsetyp1, offsetxm1, offsetxp1;
	var r, g, b;

	var lSX = this.layerSizeX;
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var tmpLayer,tmpLayer1,tmpLayer2,tmpLayer3,tmpLayer4,tmpLayer5,tmpLayer6,tmpLayer7,tmpLayer8,tmpLayer9,tmpLayer10;
	
	var tmpl = this.TEMPL;
	
	this["copyTemp"](src);
	
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offset=y*lSX;
		offsetym1=(getlo(y-1)&aLSY)*lSX;
		offsetyp1=(getlo(y+1)&aLSY)*lSX;
		for (var x=0; x<lSX; x++){
			offsetxm1=getlo(x-1)&aLSX;
			offsetxp1=getlo(x+1)&aLSX;
			
			tmpLayer = this.layers[dest][offset+x];		
			
			tmpLayer10 = this.layers[tmpl];
			
			tmpLayer1 = tmpLayer10[offsetym1+offsetxm1];
			tmpLayer2 = tmpLayer10[offsetym1+x];
			tmpLayer3 = tmpLayer10[offsetym1+offsetxp1];
			tmpLayer4 = tmpLayer10[offset+offsetxm1];
			tmpLayer5 = tmpLayer10[offset+x];
			tmpLayer6 = tmpLayer10[offset+offsetxp1];
			tmpLayer7 = tmpLayer10[offsetyp1+offsetxm1];
			tmpLayer8 = tmpLayer10[offsetyp1+x];
			tmpLayer9 = tmpLayer10[offsetyp1+offsetxp1];
			r=	Math.max(tmpLayer1.r,
				Math.max(tmpLayer2.r,
				Math.max(tmpLayer3.r,
				Math.max(tmpLayer4.r,
				Math.max(tmpLayer5.r,
				Math.max(tmpLayer6.r,
				Math.max(tmpLayer7.r,
				Math.max(tmpLayer8.r,
				tmpLayer9.r))))))));
			g=	Math.max(tmpLayer1.g,
				Math.max(tmpLayer2.g,
				Math.max(tmpLayer3.g,
				Math.max(tmpLayer4.g,
				Math.max(tmpLayer5.g,
				Math.max(tmpLayer6.g,
				Math.max(tmpLayer7.g,
				Math.max(tmpLayer8.g,
				tmpLayer9.g))))))));
			b=	Math.max(tmpLayer1.b,
				Math.max(tmpLayer2.b,
				Math.max(tmpLayer3.b,
				Math.max(tmpLayer4.b,
				Math.max(tmpLayer5.b,
				Math.max(tmpLayer6.b,
				Math.max(tmpLayer7.b,
				Math.max(tmpLayer8.b,
				tmpLayer9.b))))))));
			tmpLayer.r=r;
			tmpLayer.g=g;
			tmpLayer.b=b;
		}
	}
}

Chromanin.prototype["sineDistort"]= function sineDistort( src,  dest,  dx,  depthX,  dy,  depthY){
	
	var tmpl = this.TEMPL;
	var tmpLayer = this.layers[dest];
	
	
	this["copyTemp"](src);
	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii = this.layerSizeX; x<ii; x++)
			tmpLayer[x+y*ii]=this["getBilerpixel"](tmpl, Math.sin(dx*y)*depthX+x, Math.sin(dy*x)*depthY+y);
}

Chromanin.prototype["twirlLayer"]= function twirlLayer( src,  dest,  rot,  scale){
	var ooscale, a, b, d, winkel, cw, sw, na, nb;
	var ina, inb, inbp, inap1, inbp1;
	
	var tmpl = this.TEMPL;
	var aLSY = this.andLayerSizeY;
	var aLSX = this.andLayerSizeX;
	
	var tmpLayer = this.layers[tmpl];
	var tmpLayer2 = this.layers[dest];
	
	var corner = [];
	corner[0] =new RGBA();
	corner[1] =new RGBA();
	corner[2] =new RGBA();
	corner[3] =new RGBA();

	this["copyTemp"](src);

	ooscale=1/(scale*Math.sqrt(2*this.layerSizeX*this.layerSizeY));
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		b=(y-jj/2);
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			a=(x-ii/2);
			d=-Math.sqrt(a*a+b*b)+ii/2;
			if (d<=0){
				na=(ina=x);
				nb=(inb=y);
			} else {
				winkel=rot*d*d*ooscale;
				cw=Math.cos(winkel);
				sw=Math.sin(winkel);
				na=a*cw-b*sw+ii/2;
				nb=a*sw+b*cw+jj/2;
				ina=na;
				inb=nb;
			}
			inbp=(inb&aLSY)*ii;
			inbp1=((inb+1)&aLSY)*ii;
			inap1=(ina+1)&aLSX;
			corner[0]=tmpLayer[(ina&aLSX)+inbp];
			corner[1]=tmpLayer[inap1+inbp];
			corner[2]=tmpLayer[(ina&aLSX)+inbp1];
			corner[3]=tmpLayer[inap1+inbp1];
			tmpLayer2[x+y*ii]=cosineInterpolate(corner, na-ina, nb-inb);
		}
	}
}

Chromanin.prototype["tileLayer"]= function tileLayer( src,  dest){
	var offset, offset2, offset3;
	
	var lSX = this.layerSizeX;
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var tmpLayer,tmpLayer2,tmpLayer3,tmpLayer4,tmpLayer5;
	var tmpl = this.TEMPL;

	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++)	{
		offset=y*lSX;
		offset2=((y*2)&aLSY)*lSX;
		for (var x=0; x<lSX; x++){
			offset3=((x*2)&aLSX)+offset2;
			
			tmpLayer = this.layers[dest][x+offset];
			tmpLayer2 = this.layers[tmpl][offset3];
			tmpLayer3 = this.layers[tmpl][offset3+1];
			tmpLayer4 = this.layers[tmpl][offset3+lSX];
			tmpLayer5 = this.layers[tmpl][offset3+lSX+1];
			
			tmpLayer.r=(tmpLayer2.r+tmpLayer3.r+tmpLayer4.r+tmpLayer5.r)>>2;
			tmpLayer.g=(tmpLayer2.g+tmpLayer3.g+tmpLayer4.g+tmpLayer5.g)>>2;
			tmpLayer.b=(tmpLayer2.b+tmpLayer3.b+tmpLayer4.b+tmpLayer5.b)>>2;
		}
	}
}

Chromanin.prototype["noiseDistort"]= function noiseDistort( src,  dest,  seed,  radius){
	var dx, dy;
	
	var tmpl = this.TEMPL;
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var tmpLayer1,tmpLayer2;
	
	this.seedValue = seed;
	
	this["copyTemp"](src);
	
	radius=16-radius;
	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++)	{
			//dx=myRandom()+radius;//myrshift((myRandom()),radius);
			dx=this.myRandom()+radius;//myrshift((myRandom()),radius);
			//dy=myRandom()+radius;//myrshift((myRandom()),radius);
			dy=this.myRandom()+radius;//myrshift((myRandom()),radius);
			
			tmpLayer1 = this.layers[dest][x+y*ii];
			tmpLayer2 = this.layers[tmpl][(getlo(x+dx)&aLSX)+(getlo(y+dy)&aLSY)*ii];
			
			tmpLayer1.r=tmpLayer2.r;
			tmpLayer1.g=tmpLayer2.g;
			tmpLayer1.b=tmpLayer2.b;
		}
}

Chromanin.prototype["moveDistort"]= function moveDistort( src,  dest,  dx,  dy){
	
	var tmpl = this.TEMPL;
	var aLSX = this.andLayerSizeX;
	var aLSY = this.andLayerSizeY;
	var tmpLayer1,tmpLayer2;
	
	this["copyTemp"](src);
	
	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			tmpLayer1 = this.layers[dest][x+y*ii];
			tmpLayer2 = this.layers[tmpl][(getlo(x+dx)&aLSX)+(getlo(y+dy)&aLSY)*ii];
			
			tmpLayer1.r=tmpLayer2.r;
			tmpLayer1.g=tmpLayer2.g;
			tmpLayer1.b=tmpLayer2.b;
		}
}

Chromanin.prototype["move"]= function move(src,inds,dest,indd,size){

	var tmpLayer1,tmpLayer2;

	for (var x=0,ii=(size)-1; x<ii; x+=1){
			//alert(src);
			//alert(dest);
			//alert(inds);
			//alert(indd);
			tmpLayer1 = this.layers[dest][indd];
			tmpLayer2 = this.layers[src][inds];
			
			tmpLayer1.r=tmpLayer2.r;
			tmpLayer1.g=tmpLayer2.g;
			tmpLayer1.b=tmpLayer2.b;
			tmpLayer1.a=tmpLayer2.a;
			indd++;
			inds++;
		}
}

Chromanin.prototype["MirrorCorner"]= function MirrorCorner(c0,dest) {
	var xc,yc,offset;
 
	var lX = this.layerSizeX;
	var lY = this.layerSizeY;
	
	var tmpLayer1,tmpLayer2;
 
   switch(c0){

   case 0: 
        for (var yc=0,jj=(lY/2)-1;yc<jj;yc++){
			offset=yc*lX;
			for (var xc=0;xc<(lX/2)-1;xc++){
				tmpLayer1 = this.layers[dest][Math.floor(offset+(lX-xc))];
				tmpLayer2 = this.layers[dest][offset+xc];
				
				tmpLayer1.r=tmpLayer2.r;
				tmpLayer1.g=tmpLayer2.g;
				tmpLayer1.b=tmpLayer2.b;
			}
		}
		break;
	case 1: 
		for (var yc=0,jj=(lY/2)-1;yc<jj;yc++){
			this["move"](dest,yc*lX+(lX/2),dest,(lY-yc-1)*lX+(lX/2),(lX/2));
		}
		break;
	case 2:
		for (var yc=0,jj=(lY/2)-1;yc<jj;yc++){
			offset=(yc+(lY/2))*lX;
			for (var xc=0,ii=(lX/2)-1;xc<ii;xc++){
				tmpLayer1 = this.layers[dest][Math.floor(offset+xc)];
				tmpLayer2 = this.layers[dest][offset+(lX-xc)];
				//alert(offset+xc);
				tmpLayer1.r=tmpLayer2.r;
				tmpLayer1.g=tmpLayer2.g;
				tmpLayer1.b=tmpLayer2.b;
			}
		}
       break;
    case 3: 
		for (var yc=0,jj=(this.layerSizeY/2)-1;yc<jj;yc++){
			this["move"](dest,(this.layerSizeY-yc-1)*lX,dest,yc*lX,(lX/2));
		}
		break;
	}
}

Chromanin.prototype["kaleidLayer"]= function kaleidLayer( src,  dest,  corner){
	
	var y;
	corner=corner-1;
	
	for (var y=0,jj=(this.layerSizeY/2); y<jj;y++){
		//this.move(src,(y+(corner/2)*(this.layerSizeY/2))*this.layerSizeX+(corner%2)*(this.layerSizeX/2),dest,(y+(corner/2)*(this.layerSizeY/2))*this.layerSizeX+(corner%2)*(this.layerSizeX/2),(this.layerSizeX/2));
		this["MirrorCorner"](corner,dest);
		this["MirrorCorner"]((corner+1)%4,dest);
		this["MirrorCorner"]((corner+2)%4,dest);
	}	
}

Chromanin.prototype["tunnelDistort"]= function tunnelDistort( src,  dest,  f){
	 var ina, inb, inap1, inbp, inbp1;
	 var a, b, na, nb;
	 
	 var aLSX = this.andLayerSizeX;
	 var aLSY = this.andLayerSizeY;
	 var tmpl = this.TEMPL;
	 
	var tmplLayer = this.layers[tmpl];
	var tmplLayer2 = this.layers[dest];
	 
	 var corner = [];
	 corner[0] =new RGBA();
	 corner[1] =new RGBA();
	 corner[2] =new RGBA();
	 corner[3] =new RGBA();
	 
	var arct, lsd2p;

	this["copyTemp"](src);
	var lsd2p=this.layerSizeX/(2*Math.PI);
	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		b=-0.5*jj+y;
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			a=-0.5*ii+x;
			if (a!=0){
				a=1/a;
				arct=Math.atan(b*a);
				if (a>0)
					na=lsd2p*arct+ii/2;
				else
					na=lsd2p*arct;
				nb=Math.abs(Math.cos(arct)*f*a);
				ina=na;
				inb=nb;
				inap1=(ina+1)&aLSX;
				inbp=(inb&aLSY)*ii;
				inbp1=((inb+1)&aLSY)*ii;
				corner[0]=tmplLayer[(ina&aLSX)+inbp];
				corner[1]=tmplLayer[inap1+inbp];
				corner[2]=tmplLayer[(ina&aLSX)+inbp1];
				corner[3]=tmplLayer[inap1+inbp1];
			}
			tmplLayer2[x+y*ii]=cosineInterpolate(corner, na-ina, nb-inb);
		} 
	}
}

Chromanin.prototype["sculptureLayer"]= function sculptureLayer( src,  dest){
	var ipi=255.0/(2.0*3.1415926536);
    var x,y,offset,offsetym1,offsetyp1,offsetxm1,offsetxp1;
    var r1,r2,g1,g2,b1,b2;
    var a;
	var lSX = this.layerSizeX;
	var aLSY = this.andLayerSizeY;
	var aLSX = this.andLayerSizeX;

	var tmpl = this.TEMPL;
	var tmpLayer1,tmpLayer2,tmpLayer3,tmpLayer4,tmpLayer5,tmpLayer6,tmpLayer7,tmpLayer8;
	var tmpLayer = this.layers[dest];
	
	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++){
		offset=y*lSX;
		offsetym1=((y-1)&aLSY)*lSX;
		offsetyp1=((y+1)&aLSY)*lSX;
		for (var x=0;x<lSX; x++){
			offsetxm1=((x-1)&aLSX);
			offsetxp1=((x+1)&aLSX);
		
			tmpLayer1 = this.layers[tmpl][offsetxm1 + offsetym1];
			tmpLayer2 = this.layers[tmpl][offsetxm1 + offset];
			tmpLayer3 = this.layers[tmpl][offsetxm1 + offsetyp1];
			tmpLayer4 = this.layers[tmpl][offsetxp1 + offsetym1];
			tmpLayer5 = this.layers[tmpl][offsetxp1 + offset];
			tmpLayer6 = this.layers[tmpl][offsetxp1 + offsetyp1];
			tmpLayer7 = this.layers[tmpl][offsetym1 + x];
			tmpLayer8 = this.layers[tmpl][offsetyp1 + x];
		
			r1= tmpLayer1.r	+ 2*tmpLayer2.r	+ tmpLayer2.r - tmpLayer4.r	- 2*tmpLayer5.r	- tmpLayer6.r;
			r2= tmpLayer1.r	+ 2*tmpLayer7.r	+ tmpLayer4.r - tmpLayer2.r	- 2*tmpLayer8.r	- tmpLayer6.r;

			g1= tmpLayer1.g	+ 2*tmpLayer2.g	+ tmpLayer2.g - tmpLayer4.g	- 2*tmpLayer5.g	- tmpLayer6.g;
			g2= tmpLayer1.g	+ 2*tmpLayer7.g	+ tmpLayer4.g - tmpLayer2.g	- 2*tmpLayer8.g	- tmpLayer6.g;

			b1= tmpLayer1.b	+ 2*tmpLayer2.b	+ tmpLayer2.b - tmpLayer4.b	- 2*tmpLayer5.b	- tmpLayer6.b;
			b2= tmpLayer1.b	+ 2*tmpLayer7.b	+ tmpLayer4.b - tmpLayer2.b	- 2*tmpLayer8.b	- tmpLayer6.b;

			if (r1==0) {
				if (r2>0) tmpLayer[x + offset].r=196;
				else if (r2==0) tmpLayer[x + offset].r=128;
					else tmpLayer[x + offset].r=64;
			}else {
				a=Math.atan(r2/r1);
				if (r1>0) tmpLayer[x + offset].r=trunc(a*ipi+127.5)
				else tmpLayer[x + offset].r=trunc(a*ipi);
			}

			if (g1==0) {
				if (g2>0) tmpLayer[x + offset].g=196;
				else if (g2==0) tmpLayer[x + offset].g=128;
					else tmpLayer[x + offset].g=64;
			}else {
				a=Math.atan(g2/g1);
				if (g1>0) tmpLayer[x + offset].g=trunc(a*ipi+127.5);
				else tmpLayer[x + offset].g=trunc(a*ipi);
			}

			if (b1==0) {
				if (b2>0) tmpLayer[x + offset].b=196;
				else if (b2==0) tmpLayer[x + offset].b=128;
					else tmpLayer[x + offset].b=64;
			}else {
				a=Math.atan(b2/b1);
				if (b1>0) tmpLayer[x + offset].b=trunc(a*ipi+127.5)
					else tmpLayer[x + offset].b=trunc(a*ipi);
			}
		} 
	}
}

function trunc(n){
   return ~~n;
}

/*
Chromanin.prototype["mapDistort"] = function mapDistort( src,  dist,  dest,  xd,  yd){
	var offset;
	var v;
	
	var tmpl = this.TEMPL;
	var tmpLayer1,tmpLayer2;

	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			offset=y*ii+x;
		
			tmpLayer1 = this.layers[dist][offset];
			tmpLayer2 = this.layers[dest][offset];
		
			v=Math.max(tmpLayer1.r, Math.max(tmpLayer1.g, tmpLayer1.b));
			tmpLayer2=this["getBilerpixel"](tmpl, xd*v+x, yd*v+y);
		}
}
*/

Chromanin.prototype["mapDistort"] = function mapDistort( src,  dist,  dest,  xd,  yd){
	var offset;
	var v;
	
	var tmpl = this.TEMPL;
	var tmpLayer1,tmpLayer2;

	this["copyTemp"](src);

	for (var y=0,jj=this.layerSizeY; y<jj; y++)
		for (var x=0,ii=this.layerSizeX; x<ii; x++){
			offset=y*ii+x;
			
			tmpLayer1 = this.layers[dist][offset];
			tmpLayer2 = this.layers[dest];
			
			v=Math.max(tmpLayer1.r, Math.max(tmpLayer1.g, tmpLayer1.b));
			tmpLayer2[offset]=this["getBilerpixel"](tmpl, xd*v+x, yd*v+y);
		}
}

Chromanin.prototype["addLayers"]= function addLayers( src1,  src2,  dest,  perc1,  perc2){
	 var r, g, b;

	var tmpLayer1,tmpLayer2,tmpLayer3; 
	
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];
	
		r=tmpLayer1.r*perc1+tmpLayer2.r*perc2;
		g=tmpLayer1.g*perc1+tmpLayer2.g*perc2;
		b=tmpLayer1.b*perc1+tmpLayer2.b*perc2;
		if (r>255) r=255; else if (r<0) r=0;
		if (g>255) g=255; else if (g<0) g=0;
		if (b>255) b=255; else if (b<0) b=0;
		tmpLayer3.r=r;
		tmpLayer3.g=g;
		tmpLayer3.b=b;
	}
}

Chromanin.prototype["mulLayers"]= function mulLayers( src1,  src2,  dest,  perc1,  perc2){
	var r, g, b, perc;

	var tmpLayer1,tmpLayer2,tmpLayer3; 
	
	perc=perc1*perc2/255;
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];
	
		r=tmpLayer1.r*tmpLayer2.r*perc;
		g=tmpLayer1.g*tmpLayer2.g*perc;
		b=tmpLayer1.b*tmpLayer2.b*perc;
		if (r>255) r=255; else if (r<0) r=0;
		if (g>255) g=255; else if (g<0) g=0;
		if (b>255) b=255; else if (b<0) b=0;
		tmpLayer3.r=r;
		tmpLayer3.g=g;
		tmpLayer3.b=b;
	}
}

Chromanin.prototype["xorLayers"]= function xorLayers( src1,  src2,  dest,  perc1,  perc2){
	var r, g, b;

	var tmpLayer1,tmpLayer2,tmpLayer3; 
	
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];
	
		r=tmpLayer1.r^tmpLayer2.r;
		g=tmpLayer1.g^tmpLayer2.g;
		b=tmpLayer1.b^tmpLayer2.b;
		if (r>255) r=255; else if (r<0) r=0;
		if (g>255) g=255; else if (g<0) g=0;
		if (b>255) b=255; else if (b<0) b=0;
		tmpLayer3.r=r;
		tmpLayer3.g=g;
		tmpLayer3.b=b;
	}
}

Chromanin.prototype["andLayers"]= function andLayers( src1,  src2,  dest,  perc1,  perc2){
	var r, g, b;
	
	var tmpLayer1,tmpLayer2,tmpLayer3; 

	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
		
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];
	
	
		r=tmpLayer1.r&tmpLayer2.r;
		g=tmpLayer1.g&tmpLayer2.g;
		b=tmpLayer1.b&tmpLayer2.b;
		if (r>255) r=255; else if (r<0) r=0;
		if (g>255) g=255; else if (g<0) g=0;
		if (b>255) b=255; else if (b<0) b=0;
		tmpLayer3.r=r;
		tmpLayer3.g=g;
		tmpLayer3.b=b;
	}	
}

Chromanin.prototype["orLayers"]= function orLayers( src1,  src2,  dest,  perc1,  perc2){
	var r, g, b;
	
	var tmpLayer1,tmpLayer2,tmpLayer3; 

	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];

		r=tmpLayer1.r|tmpLayer2.r;
		g=tmpLayer1.g|tmpLayer2.g;
		b=tmpLayer1.b|tmpLayer2.b;
		if (r>255) r=255; else if (r<0) r=0;
		if (g>255) g=255; else if (g<0) g=0;
		if (b>255) b=255; else if (b<0) b=0;
		tmpLayer3.r=r;
		tmpLayer3.g=g;
		tmpLayer3.b=b;
	}
}

Chromanin.prototype["randCombineLayers"]= function randCombineLayers( src1,  src2,  dest,  perc1,  perc2){
	var tmpLayer1,tmpLayer2,tmpLayer3; 

	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];	
	
		/*tmpLayer3.r=myRandom()&1?tmpLayer1.r:tmpLayer2.r;
		tmpLayer3.g=myRandom()&1?tmpLayer1.g:tmpLayer2.g;
		tmpLayer3.b=myRandom()&1?tmpLayer1.b:tmpLayer2.b;*/
		tmpLayer3.r=this.myRandom()&1?tmpLayer1.r:tmpLayer2.r;
		tmpLayer3.g=this.myRandom()&1?tmpLayer1.g:tmpLayer2.g;
		tmpLayer3.b=this.myRandom()&1?tmpLayer1.b:tmpLayer2.b;
	}
}

Chromanin.prototype["maxCombineLayers"]= function maxCombineLayers( src1,  src2,  dest,  perc1,  perc2){
	var tmpLayer1,tmpLayer2,tmpLayer3; 
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];	
		
		tmpLayer3.r=Math.max(tmpLayer1.r, tmpLayer2.r);
		tmpLayer3.g=Math.max(tmpLayer1.g, tmpLayer2.g);
		tmpLayer3.b=Math.max(tmpLayer1.b, tmpLayer2.b);
	}
}

Chromanin.prototype["minCombineLayers"]= function minCombineLayers( src1,  src2,  dest,  perc1,  perc2){
	var tmpLayer1,tmpLayer2,tmpLayer3; 
	for (var v=0,jj=this.layerSizeX*this.layerSizeY; v<jj; v++){
	
		tmpLayer1 = this.layers[src1][v];
		tmpLayer2 = this.layers[src2][v];
		tmpLayer3 = this.layers[dest][v];	
		
		tmpLayer3.r=Math.min(tmpLayer1.r, tmpLayer2.r);
		tmpLayer3.g=Math.min(tmpLayer1.g, tmpLayer2.g);
		tmpLayer3.b=Math.min(tmpLayer1.b, tmpLayer2.b);
	}
}

Chromanin.prototype["cellMachine"]= function cellMachine(l,seed,rule){
	var x,y,base_off,m ;
    var c = new RGBA();
	
	this.seedValue=seed;
	
	var tmpLayer = this.layers[l];
	var tmpLayer2;
	var aLSX = this.andLayerSizeX;
	
	c.r=255; c.g=255; c.b=255;
	
	for (var x=0,ii=this.layerSizeX; x<ii;x++){
		if (((this.myRandom())>>100)==0){
			tmpLayer[x]=c;
		}
	}

	base_off=0;
	for (var y=1,jj=this.layerSizeY;y<jj;y++){
		for (var x=0,ii=this.layerSizeX; x<ii;x++){
		
			if (tmpLayer[((x-1)&aLSX)+base_off].r!=0){
				m=1;
			}else{
				m=0;
			}
			if (tmpLayer[x+base_off].r!=0){
				m=m|2;
			}
			
			if (tmpLayer[((x+1)&aLSX) +base_off].r!=0){
				m=m|4;
			}

			if (((1<<m)&rule)!=0){
				tmpLayer2 = tmpLayer[x+base_off+ii];
				tmpLayer2.r=c.r;
				tmpLayer2.g=c.g;
				tmpLayer2.b=c.b;
			}
		}
	
		base_off=base_off + ii;
	}
}


///////////////////////////////
////////////////////////////////
////////////////////////////

//top of file
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Pode_Chromanin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Pode_Chromanin.prototype;
		
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
		this.size = 0;
		
		this.chCanvas = document.createElement("canvas");
		this.chCanvas.id = "chCanvas";

		this.chLayer0 = document.createElement("canvas");
		this.chLayer0.id = "chLayer0";
		this.chLayer1 = document.createElement("canvas");
		this.chLayer1.id = "chLayer1";
		this.chLayer2 = document.createElement("canvas");
		this.chLayer2.id = "chLayer2";
		this.chLayer3 = document.createElement("canvas");
		this.chLayer3.id = "chLayer3";
		
		this.ch = {};
		
		this.renderedTexture = "";
		
		//context to draw the texture
		//avoid minification, need to be called from outside "eval"
		this["chTmpCtx"] = 0;
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
	Cnds.prototype.OnRendered = function (myparam)
	{
		// return true if number is positive
		//return myparam >= 0;
		return true;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	//regex tester : http://www.pagecolumn.com/tool/regtest.htm
	Acts.prototype.renderScript = function (myScript)
	{
		var start = Date.now();
		console.log("______________");
		
		this.chCanvas.width = this.size;
		this.chCanvas.height = this.size;
		
		this.chLayer0.width = this.size;
		this.chLayer0.height = this.size;
		this.chLayer1.width = this.size;
		this.chLayer1.height = this.size;
		this.chLayer2.width = this.size;
		this.chLayer2.height = this.size;
		this.chLayer3.width = this.size;
		this.chLayer3.height = this.size;
		
		this.ch = new Chromanin(this.size,'chCanvas');	
		
		this.ch["initlayers"](this.size,this.size);

		//we remove the first line, we need to remove the canvas id also, which can be anything printable, without some HTML reserved characters
		myScript = myScript.replace(/ch = new Chromanin\(([0-9])*,.([A-Za-z0-9\!\#\$\%\&\(\)\*\+\,\.\/\:\;\=\?\@\^\_\`\{\|\}\~\-])*.\)\;/,""); 
		myScript = myScript.replace(/ch\./g,"this.ch."); 
		//this["chTmpCtx"] = this.chCanvas.getContext("2d");
		//var i = this.chCanvas.getContext("2d"); //rewrite context name to avoid minification
		//myScript = myScript.replace(/this\.ch\.writeCanvas\(\)/g,"this.ch.writeCanvas(this[\"chTmpCtx\"])"); 
		myScript = myScript.replace(/this\.ch\.writeCanvas\(\)/g,"this.ch.writeCanvas(this)"); 
		//myScript = myScript.replace(/this\.ch\.writeCanvas\(\)/g,"this.ch.writeCanvas(document.getElementById(\"chCanvas\").getContext(\"2d\"))"); 
		eval(myScript);

		this.runtime.trigger(cr.plugins_.Pode_Chromanin.prototype.cnds.OnRendered, this);
		this.runtime.redraw = true;
		console.log("Access took " + (Date.now() - start) + " milliseconds");
	};
	
	/*Acts.prototype.clearTexGen = function (myScript)
	{
		//var texCtx = this.chCanvas.getContext("2d");
		//texCtx.fillStyle = "rgb(0,0,0)";
		//texCtx.fillRect (0,0,this.chCanvas.width,this.chCanvas.height);	
		
		this.ch = new Chromanin(this.size,'chCanvas');	
		this.ch.initlayers(256,256); 
		this.ch.addLayers(0,1,4,1,1);
		var tmpCtx = this.chCanvas.getContext("2d");
		this.ch.writeCanvas(tmpCtx);				
	};*/
	Acts.prototype.setTextureSize = function (size)
	{
		this.size = size;
	}
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.RenderedBase64Texture = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.chCanvas.toDataURL("image/png"));				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.RenderedBase64Layer0 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.chLayer0.toDataURL("image/png"));				// return our value
	};
	Exps.prototype.RenderedBase64Layer1 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.chLayer1.toDataURL("image/png"));				// return our value
	};
	Exps.prototype.RenderedBase64Layer2 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.chLayer2.toDataURL("image/png"));				// return our value
	};	
	Exps.prototype.RenderedBase64Layer3 = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.chLayer3.toDataURL("image/png"));				// return our value
	};	
	pluginProto.exps = new Exps();

}());