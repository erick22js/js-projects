var cv = document.getElementById("cv");
var ctxp = document.getElementById("dbgcvl").getContext("2d");
var dbg = document.getElementById("dbg");

var gl = createRaster(cv);
const WIDTH = Number(cv.width);
const HEIGHT = Number(cv.height);
const HEIPROP = HEIGHT/WIDTH;

ctxp.translate(512, 512);

function createRaster(canvas){
	function RASTER(canvas){
	var gl = canvas.getContext("2d");
	const WIDTH = Number(cv.width);
	const HEIGHT = Number(cv.height);
	const STACK_DRAW = 4;
	var screenBuffer = [];
	var BLENDMODE = null;
	var COLORTOBLEND = [0,0,0,1];
	var VertexBuffer = [];
	var UVBuffer = [0, 0,   1, 0,   0, 1];
	var TextureBuffer = [[[1,0,0,1], [0,1,0,1]],[[1,0,1,1], [0,1,1,1]]];
	this.TextureSize = [2, 2];
	var TextureWidth = 2;
	const imageData = gl.getImageData(0,0,WIDTH,STACK_DRAW);
	for(var y=0;y<HEIGHT;y++){
		screenBuffer.push([]);
		for(var x=0;x<WIDTH;x++)
			screenBuffer[y].push([0,0,0,0,-Infinity]);
	}
	this.createTexture = function(img){
		var gctx = document.createElement("canvas").getContext("2d");
		gctx.canvas.width = img.width;
		gctx.canvas.height = img.height;
		gctx.drawImage(img, 0, 0);
		var data = gctx.getImageData(0, 0, img.width, img.height).data;
		var mapData = [];
		for (var i in data) {
			mapData.push(data[i] / 255);
		}
		/*for(var y=0;y<img.height;y++){
			var line=[];
			var x=0;
			for(;x<img.width;x++)
				line.push([data[y*img.width*4+x*4]/255,data[y*img.width*4+x*4+1]/255,data[y*img.width*4+x*4+2]/255,data[y*img.width*4+x*4+3]/255]);
			line.push([data[y*img.width*4+x*4]/255,data[y*img.width*4+x*4+1]/255,data[y*img.width*4+x*4+2]/255,data[y*img.width*4+x*4+3]/255]);
			mapData.push(line);
			if(y==img.height-1)
				mapData.push(line);
		}*/
		return {map:mapData, width:img.width, height:img.height};
	}
		function getTexel(x, y) {
			var ind = y * TextureWidth * 4 + x * 4;
			return [TextureBuffer[ind], TextureBuffer[ind+1], TextureBuffer[ind+2], TextureBuffer[ind+3]];
	}
	function drawPixel(x, y, r, g, b, a, depth){
		if(x>-1&&x<WIDTH&&y>-1&&y<HEIGHT)
			if(depth>=screenBuffer[~~y][~~x][4]&&a>0){
				var des = screenBuffer[~~y][~~x];
				screenBuffer[~~y][~~x]=[r,g,b,a,depth];
				//screenBuffer[~~y][~~x]=[r+des[0]*(1-a),g+des[1]*(1-a),b+des[2]*(1-a),a+des[3]*(1-a),a>0?depth:screenBuffer[~~y][~~x][4]];
			}
	}
	this.bindVertexBuffer = function(vertex){
		VertexBuffer = vertex;
	}
	this.bindUV = function(UVs){
		UVBuffer = UVs;
	}
	this.bindTexture = function(texture){
		TextureBuffer = texture.map;
		TextureWidth = texture.width;
		this.TextureSize = [texture.width, texture.height];
	}
	this.drawWall = function(xs, xe, a1, a2, d1, d2, hs, he){
		xs=~~xs;xe=~~xe;var rprog = 1/(xe-xs);
		var ys = 80; var ye = 80; var ds = -d1; var de = -d2;
		var difh = he-hs; var dify = ye-ys; var difd = de-ds; var difa = a2-a1;
		var add = ~~((xe - xs) / Math.abs(xe - xs));
		for (var x = xs < 0 ? 0 : xs > WIDTH ? WIDTH:xs; x != xe; x += add){
			stripsDrawn++;
			if((add<0&&x<0)||(add>0&&x>WIDTH)) break;
			var progress=(x-xs)*rprog;
			var nh=hs+(difh*progress); var nd=ds+(difd*progress); var na=a1+(difa*progress);
			var divh=1/nh;
			var aligny = ys - nh * .5 + (dify * progress);
			for(var y=aligny<0?-aligny:0;y<=nh;y++){
				//dbg.innerHTML = y;
				var yn = y + aligny;
				var map = [progress, y * divh];
				if (yn > HEIGHT) break;
				var color = TextureBuffer[~~(map[1]*this.TextureSize[1])][~~(map[0]*this.TextureSize[0])]||[0,0,0,1];
				drawPixel(x,yn,color[0],color[1],color[2],color[3],nd);
			}
		}
	}
		this.drawStrip = function (x, ys, u, height, depth, wallheight, s) {
			var q = (wallheight / this.TextureSize[1]);
			var mColor = actMap.sector[s].color;
			for (var y = ys < 0 ? 0 : ys; y <= ys + height && y <= HEIGHT; y++){
				//(y-ys)/height
				var map = [(u)%1, ((y - ys) / height*q)%1];
				var color = getTexel(~~(map[0] * this.TextureSize[0]), ~~(map[1] * this.TextureSize[1]));
				drawPixel(x, y, color[0] * mColor[0], color[1] * mColor[1], color[2] * mColor[2],color[3],depth);
		}
	}
		this.drawFloorStrip = function (x, ys, d, s, h, angleX, max) {
			var y = ys;
			var angleAdd = WorldMatrix.fov / (HEIGHT* .5);
			var actAngle = angleAdd * (y - HEIGHT * .5);
			var mColor = actMap.sector[s].color;
			while (y < max && y < HEIGHT) {
				var dp = h / Math.tan(actAngle);
				var xp = Math.sin(angleX + WorldMatrix.rotation)* (dp / Math.cos(angleX));
				var yp = Math.cos(angleX + WorldMatrix.rotation) * (dp / Math.cos(angleX));
				var u = (xp * 1.5) + WorldMatrix.z;
				var v = (yp * 1.5) + WorldMatrix.x;
				var color = getTexel(Math.abs(~~(u % this.TextureSize[0])), Math.abs(~~(v % this.TextureSize[1])));
				drawPixel(x, y, color[0] * mColor[0], color[1] * mColor[1], color[2] * mColor[2], color[3], d);
				y++;
				actAngle += angleAdd;
			}
		}
		this.drawCeilStrip = function (x, ys, d, s, h, angleX, min) {
			var y = ys;
			var color = colorId(s);
			var angleAdd = WorldMatrix.fov / (HEIGHT * .5);
			var actAngle = angleAdd * (y - HEIGHT * .5);
			var mColor = actMap.sector[s].color;
			while (y > -1&&y>min) {
				var dp = h / Math.tan(actAngle);
				var xp = Math.sin(angleX + WorldMatrix.rotation) * (dp / Math.cos(angleX));
				var yp = Math.cos(angleX + WorldMatrix.rotation) * (dp / Math.cos(angleX));
				var u = WorldMatrix.z-(xp * 1.5);
				var v = WorldMatrix.x - (yp * 1.5);
				var color = getTexel(Math.abs(~~(u % this.TextureSize[0])), Math.abs(~~(v % this.TextureSize[1])));
				drawPixel(x, y, color[0] * mColor[0], color[1] * mColor[1], color[2] * mColor[2], color[3], d);
				//drawPixel(x, y, s == 0 ? 1 : s == 1 ? .66 : s == 2 ? .33 : 0, 0, 0, 1, d);
				y--;
				actAngle -= angleAdd;
			}
		}
		this.drawBackStrip = function (x, ys, ye) {
			var y = ys < 0 ? 0 : ~~ys;
			var nx = (x + (((WorldMatrix.rotation + Math.PI) / Math.PI)*2) * 256) % 256;
			while (y < ye) {
				var color = getTexel(~~nx, y < this.TextureSize[1] ? y : this.TextureSize[1] - 1) || [0, 0, 0, 1];
				drawPixel(x, y, color[0], color[1], color[2], color[3], -WorldMatrix.camReach);
				y++;
			}
		}
		function colorId(sector) {
			var mod = (sector % 2)*.5;
			return [1 - mod, 0, 0];
		}
	this.drawArray = function(x, y, r, g, b, a, depth){
		drawPixel(x, y, r, g, b, a, depth);
	}
	function pointInLine(xs, ys, xe, ye, y, ds, df, uvs, uvf){
		if((y>=ys&&y<=ye)||(y<=ys&&y>=ye)){
			var xi = xe-xs;
			var yi = ye-ys;
			var yvs = ((y-ys)/yi);
			var x = xs+(y-ys)*(xi/yi);
			var d = ds+(df-ds)*yvs;
			var m = [uvs[0]+(uvf[0]-uvs[0])*yvs, uvs[1]+(uvf[1]-uvs[1])*yvs];
			return [x, d, m];
		}
		else return null
	}
	this.drawLine = function(x1, y1, x2, y2){
		var ang = angle(x1, y1, x2, y2);
		ang = ang<0?ang+2*Math.PI:ang;
		var difX = x2-x1;
		var difY = y2-y1;
		if(ang>Math.PI*.25&&ang<=Math.PI*.75){
			for(var y=y1;y<=y2;y++){
				drawPixel(x1+((y-y1)/difY)*difX, y, 0, 0, 0, 1, 0);
			}
		}else if(ang>Math.PI*.75&&ang<=Math.PI*1.25){
			for(var x=x1;x>=x2;x--){
				drawPixel(x, y1+((x-x1)/difX)*difY, 0, 0, 0, 1, 0);
			}
		}else if(ang>Math.PI*1.25&&ang<=Math.PI*1.75){
			for(var y=y1;y>=y2;y--){
				drawPixel(x1+((y-y1)/difY)*difX, y, 0, 0, 0, 1, 0);
			}
		}else{
			for(var x=x1;x<=x2;x++){
				drawPixel(x, y1+((x-x1)/difX)*difY, 0, 0, 0, 1, 0);
			}
		}
	}
	this.clearColor = function(r, g, b, a, clearDepth){
		for(var y=0;y<HEIGHT;y++)
			for(var x=0;x<WIDTH;x++)
				screenBuffer[~~y][~~x] = [r, g, b, a, clearDepth?-Infinity:screenBuffer[~~y][~~x][4]];
	}
	this.getBuffer = function(){
		return screenBuffer;
	}
	this.clearDepth = function(){
		for(var y=0;y<HEIGHT;y++)
			for(var x=0;x<WIDTH;x++)
				screenBuffer[~~y][~~x][4] = -Infinity;
	}
	this.raster = function(){
		for(var y=0;y<HEIGHT;y+=STACK_DRAW){
			for(var r=0;r<STACK_DRAW;r++){
				for(var x=0;x<WIDTH;x++){
					imageData.data[r*WIDTH*4+x*4]=screenBuffer[y+r][x][0]*255;
					imageData.data[r*WIDTH*4+x*4+1]=screenBuffer[y+r][x][1]*255;
					imageData.data[r*WIDTH*4+x*4+2]=screenBuffer[y+r][x][2]*255;
					imageData.data[r*WIDTH*4+x*4+3]=screenBuffer[y+r][x][3]*255;
					screenBuffer[y+r][x][4] = -Infinity;
				}
			}
			gl.putImageData(imageData,0,y);
		}
	}
	}
	return new RASTER(canvas);
}

function distance(x1, y1, x2, y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
function angle(x1, y1, x2, y2){
	return Math.atan2(y2-y1, x2-x1);
}

function isBetweenValue(value, min, max){
	return value>=min&&value<=max;
}

function lineInsideAngle(d1, d2, mina, maxa, a1, a2){
	//a1 = toAngle(a1); a2 = toAngle(a2);
	var inter1 = intersection(0, 0, Math.cos(mina)*2048,  Math.sin(mina)*2048,
		Math.cos(a1)*d1, Math.sin(a1)*d1, Math.cos(a2)*d2, Math.sin(a2)*d2);
	var inter2 = intersection(0, 0, Math.cos(maxa)*2048,  Math.sin(maxa)*2048,
		Math.cos(a1) * d1, Math.sin(a1) * d1, Math.cos(a2) * d2, Math.sin(a2) * d2);
	var inters = inter1 || inter2 ? (a1 < a2 ? [inter1, inter2] : [inter2, inter1]):null;
	return inters||isBetweenValue(a1, mina, maxa)||isBetweenValue(a2, mina, maxa);
}

function toAngle(angle){
	return angle>Math.PI?angle-Math.PI*2:angle<-Math.PI?angle+Math.PI*2:angle;
}

function range(s, e){
	var list = [s];
	var add = (e-s)/Math.abs(e-s);
	for(var i=~~s;i!=~~e+add;i+=add)list.push(i)
	return list;
}

function intersection(x1, y1, x2, y2, x3, y3, x4, y4, db){
	db = db?db:1;
	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	if (uA>=0&&uA<=db&&uB>=0&&uB<=db) {
		return [x1+(uA*(x2-x1)),y1+(uA*(y2-y1))];
	}
	return null;
}
function radianToDeg(v) { return v / Math.PI * 180; }
