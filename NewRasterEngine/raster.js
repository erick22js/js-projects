function RasterRenderingContext(elem=null){
	if(elem==null)
		throw new Error("Illegal constructor");
	const ctx = elem.getContext("2d");
	const WIDTH = Number(elem.width);
	const HEIGHT = Number(elem.height);
	const HWIDTH = WIDTH*.5;
	const HHEIGHT = HEIGHT*.5;
	const b_data = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	const buffer_c = new Uint32Array(b_data.data.buffer);
	const buffer_d = new Float32Array(buffer_c.length);
	
	/*
	***@Internal Functions and Properties
	*/
	var cb8 = new Uint8Array(4);
	var cb32 = new Uint32Array(cb8.buffer);
	var SCISSOR_X = 0;
	var SCISSOR_Y = 0;
	var SCISSOR_W = WIDTH;
	var SCISSOR_H = HEIGHT;
	var SCISSOR_C = 0xff000000;
	var SCISSOR_D = -1;
	
	var Attributes = [];
	var Uniforms = {};
	
	//Pre-sets programs
	var VERTEX_PROGRAM = function(){};
	var FRAGMENT_PROGRAM = function(){};
	
	function fillColor(){
		for(var x=SCISSOR_X; x<SCISSOR_W; x++){
			for(var y=SCISSOR_Y; y<SCISSOR_H; y++){
				buffer_c[x+y*WIDTH] = SCISSOR_C;
			}
		}
	}
	function fillDepth(){
		for(var x=SCISSOR_X; x<SCISSOR_W; x++){
			for(var y=SCISSOR_Y; y<SCISSOR_H; y++){
				buffer_d[x+y*WIDTH] = -1;
			}
		}
	}
	function fillColorDepth(){
		for(var x=SCISSOR_X; x<SCISSOR_W; x++){
			for(var y=SCISSOR_Y; y<SCISSOR_H; y++){
				buffer_c[x+y*WIDTH] = SCISSOR_C;
				buffer_d[x+y*WIDTH] = -1;
			}
		}
	}
	function flush(){
		ctx.putImageData(b_data, 0, 0);
	}
	function toColorB(r=0, g=0, b=0, a=0){
		cb8[0] = r*0xff; cb8[1] = g*0xff; cb8[2] = b*0xff; cb8[3] = a*0xff;
		return cb32[0];
	}
	
	function generateVertices(){
		var vs = [];
		for(var i=0; i<3; i++){
			var attrs = {};
			var atts = [];
			for(var a=0; a<Attributes.length; a++){
				attrs[Attributes[a].name] = Attributes[a].buffer[i];
				atts.push(Attributes[a].buffer[i]);
			}
			var p = VERTEX_PROGRAM(attrs);
			atts[-1] = [p[2]*p[3]];
			var v = [p[0]*p[3], p[1]*p[3], p[2]*p[3], atts];
			vs.push(v);
		}
		return vs;
	}
	
	function traceTriangle(vs){
		var t = 
			((vs[1][0]-vs[0][0])*(vs[1][1]+vs[0][1]))+
			((vs[2][0]-vs[1][0])*(vs[2][1]+vs[1][1]))+
			((vs[0][0]-vs[2][0])*(vs[0][1]+vs[2][1]));
		if(t<0)
			return null;
		for(var i=0; i<3; i++){
			vs[i][0] = vs[i][0]*HWIDTH+HWIDTH;
			vs[i][1] = -vs[i][1]*HHEIGHT+HHEIGHT;
		}
		//Order for encounter
		var minY = Math.min(vs[0][1], vs[1][1], vs[2][1]);
		var maxY = Math.max(vs[0][1], vs[1][1], vs[2][1]);
		var revs = [];
		for(var i=0; i<vs.length; i++){
			if(vs[i][1]==minY){
				revs.push(vs[i]);
				vs.splice(i, 1);
				break;
			}
		}
		for(var i=0; i<vs.length; i++){
			if(vs[i][1]==maxY){
				revs.push(vs[i]);
				vs.splice(i, 1);
				break;
			}
		}
		revs.splice(1, 0, vs[0]);
		var x_int = revs[0][0]+(revs[2][0]-revs[0][0])*((revs[1][1]-revs[0][1])/(revs[2][1]-revs[0][1]));
		var x_begin = revs[1][0]<=x_int?revs[1][0]:x_int;
		var x_end = revs[1][0]>=x_int?revs[1][0]:x_int;
		//if(x_int>x_begin)
		//	return null;
		//Construct Shadding Scheme
		var shadding_scheme = [
			{
				x_b: x_int,
				xmiddle: revs[0][0],
				xbegin: x_begin,
				xend: x_end,
				ybegin: revs[0][1],
				yend: revs[1][1],
				vmiddle: revs[0],
				vend: revs[1],
				vcontinue: revs[2],
			},
			{
				ybegin: revs[1][1],
				yend: revs[2][1],
				xmiddle: revs[2][0],
				xbegin: x_begin,
				xend: x_end,
				vmiddle: revs[2],
				vend: revs[1],
				vcontinue: revs[0],
			},
		]
		return shadding_scheme;
	}
	function rasterizeTriangle(ssch){
		//First, rasterize top part
		var gsize = ssch[1].yend-ssch[0].ybegin;
		//alert(gsize);
		var fsize = ssch[0].yend-ssch[0].ybegin;
		var tfliped = 
			/*!(ssch[0].xmiddle>ssch[0].xbegin)||
			!(ssch[1].xmiddle>ssch[1].xbegin)*/
			//ssch[0].xmiddle>=ssch[0].xbegin||ssch[0].xmiddle>=ssch[0].xend;
			//true
			ssch[0].x_b!=ssch[0].xend
			;
			/*((ssch[0].xbegin>=ssch[0].xmiddle)&&(ssch[0].xbegin<=ssch[1].xmiddle))||
			((ssch[0].xbegin<=ssch[0].xmiddle)&&(ssch[0].xbegin>=ssch[1].xmiddle))*/
		;
		//if(ssch[0].xcontinue<=ssch[0].xend)
		//	console.log("p");
		var b = ssch[0].ybegin<0?0:~~ssch[0].ybegin;
		for(var y=b; y<ssch[0].yend&&y<=HEIGHT; y++){
			var p = (y-ssch[0].ybegin)/fsize;
			var pg = (y-ssch[0].ybegin)/gsize;
			var xb = ~~(ssch[0].xmiddle+(ssch[0].xbegin-ssch[0].xmiddle)*p);
			var xe = ~~(ssch[0].xmiddle+(ssch[0].xend-ssch[0].xmiddle)*p);
			var xd = xe-xb;
			for(var x=xb<0?0:xb; x<xe&&x<WIDTH; x++){
				runFragment(x, y, 
					attributesToVaryings(
						ssch[0].vmiddle, ssch[0].vend, ssch[0].vcontinue, p, 1-pg, (x-xb)/xd, tfliped));
			}
		}
		//Also, the bottom part
		fsize = ssch[1].yend-ssch[1].ybegin;
		b = ssch[1].ybegin<0?0:~~ssch[1].ybegin;
		//if((~~b)==(~~ssch[0].yend))
		//	return;
		b = (~~b)<=ssch[0].yend?(~~b)+1:b;
		for(var y=b; y<ssch[1].yend&&y<=HEIGHT; y++){
			var p = 1-((y-ssch[1].ybegin)/fsize);
			var pg = (y-ssch[0].ybegin)/gsize;
			var xb = ~~(ssch[1].xmiddle+(ssch[1].xbegin-ssch[1].xmiddle)*p);
			var xe = ~~(ssch[1].xmiddle+(ssch[1].xend-ssch[1].xmiddle)*p);
			var xd = xe-xb;
			for(var x=xb<0?0:xb; x<xe&&x<WIDTH; x++){
				runFragment(x, y, 
					attributesToVaryings(
						ssch[1].vmiddle, ssch[1].vend, ssch[1].vcontinue, p, pg, (x-xb)/xd, tfliped));
			}
		}
	}
	
	function attributesToVaryings(vm, ve, vc,   yep, ycp,   xp,   fliped){
		var varys = {};
		var lx, rx;
		if(fliped){
			lx = xp;
			rx = 1-xp;
		}else{
			lx = 1-xp;
			rx = xp;
		}
		var depth = ((vm[3][-1][a]*(1-yep))+(ve[3][-1][a]*yep))*(lx) + ((vc[3][-1][a]*(1-ycp))+(vm[3][-1][a]*ycp))*(rx);
		varys[Attributes[-1].name] = [depth];
		for(var i=0; i<Attributes.length; i++){
			var am = vm[3][i];
			var ae = ve[3][i];
			var ac = vc[3][i];
			var vary = [];
			for(var a=0; a<am.length; a++){
				vary[a] = ((am[a]*(1-yep))+(ae[a]*yep))*(lx) + ((ac[a]*(1-ycp))+(am[a]*ycp))*(rx);
					//am[a]*im+ac[a]*ic+ie*ae[a];//+ie*ae[a]+ic*ac[a];
					//((am[a]*(1-yep))+(ae[a]*yep))*(lx) + ((ac[a]*(1-ycp))+(am[a]*ycp))*(rx);
			}
			varys[Attributes[i].name] = vary;
		}
		return varys;
	}
	
	function rasterize(){
		var vs = generateVertices();
		//console.log(vs);
		//if(vs==null)
		//	return null;
		var sch = traceTriangle(vs);
		if(sch==null)
			return null;
		//console.log(sch);
		rasterizeTriangle(sch);
	}
	
	function vertexToViewport(){
		
	}
	
	function runFragment(x, y, varyings){
		var c = FRAGMENT_PROGRAM(varyings);
		setPixel(x, y, varyings["rst_depth"][0],  c[0], c[1], c[2], c[3]);
	}
	
	function setPixel(x, y, d, r, g, b, a){
		if(x<0||y<0||x>=WIDTH||y>=HEIGHT||d<-1||d>1)
			return;
		buffer_c[x+y*WIDTH] = toColorB(r, g, b, a);
	}
	
	function clearAttributes(){
		Attributes = [];
		Attributes[-1] = {};
		Attributes[-1].name = "rst_depth";
	}
	
	/*
	*
	*************************@External Functions and Properties
	*
	*/
	//Properties
	this.buffer_c = buffer_c;
	this.buffer_d = buffer_d;
	
	this.COLOR            = 0b1;
	this.DEPTH            = 0b10;
	
	this.VERTEX_SHADER    = 0b100;
	this.FRAGMENT_SHADER  = 0b1000;
	
	this.VERTICES         = 0b10000;
	this.LINES            = 0b100000;
	this.TRIANGLES        = 0b1000000;
	
	this.clear = function(bits){
		if(bits&this.COLOR&&bits&this.DEPTH)
			fillColorDepth();
		else if(bits&this.COLOR)
			fillColor();
		else if(bits&this.DEPTH)
			fillDepth();
	}
	this.clearColor = function(r=0, g=0, b=0, a=1){
		SCISSOR_C = toColorB(r, g, b, a);
	}
	this.clearDepth = function(depth){
		SCISSOR_D = depth;
	}
	
	this.setShaderProgram = function(call, mode){
		if(mode&this.VERTEX_SHADER){
			VERTEX_PROGRAM = call||VERTEX_PROGRAM;
		}else if(mode&this.FRAGMENT_SHADER){
			FRAGMENT_PROGRAM = call||FRAGMENT_PROGRAM;
		}
		clearAttributes();
	}
	
	this.setVertexAttribute = function(name, index, buffer){
		Attributes[index] = {
			"name": name,
			"buffer": buffer,
		};
	}
	
	this.drawTriangle = function(){
		rasterize();
	}
	
	//Functions
	this.flush = flush;
	clearAttributes();
}

HTMLCanvasElement.prototype.getRasterContext = function(options){
	return new RasterRenderingContext(this);
}