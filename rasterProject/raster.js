

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
	var UVBuffer = [0, 0,   1, 0,   0, 1,   1, 1];
	var TextureBuffer = [[[1,0,0,1], [0,1,0,1]],[[1,0,1,1], [0,1,1,1]]];
	var TextureSize = [2,2];
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
		console.log(data)
		for(var y=0;y<img.height;y++){
			var line=[];
			var x=0;
			for(;x<img.width;x++)
				line.push([data[y*img.width*4+x*4]/255,data[y*img.width*4+x*4+1]/255,data[y*img.width*4+x*4+2]/255,data[y*img.width*4+x*4+3]/255]);
			line.push([data[y*img.width*4+x*4]/255,data[y*img.width*4+x*4+1]/255,data[y*img.width*4+x*4+2]/255,data[y*img.width*4+x*4+3]/255]);
			mapData.push(line);
			if(y==img.height-1)
				mapData.push(line);
		}
		console.log(mapData);
		return {map:mapData, width:img.width, height:img.height};
	}
	function drawPixel(x, y, r, g, b, a, depth){
		if(x>-1&&x<WIDTH&&y>-1&&y<HEIGHT)
			if(depth>=screenBuffer[~~y][~~x][4]){
				var des = screenBuffer[~~y][~~x];
				screenBuffer[~~y][~~x]=[r+des[0]*(1-a),g+des[1]*(1-a),b+des[2]*(1-a),a+des[3]*(1-a),depth+des[4]*(1-a)];
			}
	}
	this.bindVertexBuffer = function(vertex){
		VertexBuffer = vertex;
	}
	this.bindUV = function(UVs){
		UVBuffer = UVs;
	}
	this.bindTexture = function(texture){
		TextureBuffer = texture.map;//alert(TextureBuffer)
		TextureSize = [texture.width, texture.height];
	}
	this.drawArray = function(){
		//drawTriangle(VertexBuffer);
		drawQuadrilateral(VertexBuffer);
	}
	function drawTriangle(vertex){
		var bx=by=Infinity;var fx=fy=-Infinity;
		for(var i=0;i<9;i+=3)bx=vertex[i]<bx?vertex[i]:bx;
		for(var i=1;i<9;i+=3)by=vertex[i]<by?vertex[i]:by;
		for(var i=0;i<9;i+=3)fx=vertex[i]>fx?vertex[i]:fx;
		for(var i=1;i<9;i+=3)fy=vertex[i]>fy?vertex[i]:fy;
		for(var y=by;y<=fy;y++){
			var minX=maxX=null;
			var l1 = pointInLine(vertex[0], vertex[1], vertex[3], vertex[4], y, vertex[2], vertex[5], UVBuffer.slice(0,2), UVBuffer.slice(2,4));
			var l2 = pointInLine(vertex[3], vertex[4], vertex[6], vertex[7], y, vertex[5], vertex[8], UVBuffer.slice(2,4), UVBuffer.slice(4,6));
			var l3 = pointInLine(vertex[6], vertex[7], vertex[0], vertex[1], y, vertex[8], vertex[2], UVBuffer.slice(4,6), UVBuffer.slice(0,2));
			var points=[l1, l2, l3];
			//alert(l1);
			var selects = []; if(points[0])selects.push(points[0]); if(points[1])selects.push(points[1]); if(points[2])selects.push(points[2]);
			if(selects[0][0]>=selects[1][0]){maxX=selects[0];minX=selects[1]}
			else {maxX=selects[1];minX=selects[0]}
			if(minX[0]==maxX[0]&&points[2])
				{minX=points[2][0]<minX[0]?points[2]:minX;
				maxX=points[2][0]>maxX[0]?points[2]:maxX}
			var DIFFERENCEX = maxX[1]-minX[1];
			var DEPTHDIV = 1/(maxX[0]-minX[0]);
			var MAP1 = (maxX[2][0]-minX[2][0]);
			var MAP2 = (maxX[2][1]-minX[2][1]);
			for(var x=~~minX[0];x<=maxX[0];x++){
				var progressX = (x-minX[0])*DEPTHDIV;
				var depth = minX[1]+DIFFERENCEX*progressX;
				var map = [minX[2][0]+MAP1*progressX, minX[2][1]+MAP2*progressX];
				var color = TextureBuffer[~~(map[1]*TextureSize[1])][~~(map[0]*TextureSize[0])];
				drawPixel(x, y, color[0], color[1], color[2], color[3], depth)
			}
		}
	}
	function drawQuadrilateral(vertex){
		var bx=by=Infinity;var fx=fy=-Infinity;
		for(var i=0;i<12;i+=3)bx=vertex[i]<bx?vertex[i]:bx;
		for(var i=1;i<12;i+=3)by=vertex[i]<by?vertex[i]:by;
		for(var i=0;i<12;i+=3)fx=vertex[i]>fx?vertex[i]:fx;
		for(var i=1;i<12;i+=3)fy=vertex[i]>fy?vertex[i]:fy;
		for(var y=by;y<=fy;y++){
			var minX=maxX=null;
			var l1 = pointInLine(vertex[0], vertex[1], vertex[3], vertex[4], y, vertex[2], vertex[5], UVBuffer.slice(0,2), UVBuffer.slice(2,4));
			var l2 = pointInLine(vertex[3], vertex[4], vertex[6], vertex[7], y, vertex[5], vertex[8], UVBuffer.slice(2,4), UVBuffer.slice(4,6));
			var l3 = pointInLine(vertex[6], vertex[7], vertex[9], vertex[10], y, vertex[8], vertex[11], UVBuffer.slice(4,6), UVBuffer.slice(6,8));
			var l4 = pointInLine(vertex[9], vertex[10], vertex[0], vertex[1], y, vertex[11], vertex[2], UVBuffer.slice(6,8), UVBuffer.slice(0,2));
			var points=[l1, l2, l3, l4];
			var selects = []; if(points[0])selects.push(points[0]); if(points[1])selects.push(points[1]); if(points[2])selects.push(points[2]); if(points[3])selects.push(points[3]);
			//alert(selects[0]+" | "+selects[1]+" | "+selects[2]+" | "+selects[3]);
			if(selects[0][0]>=selects[1][0]){maxX=selects[0];minX=selects[1]}
			else {maxX=selects[1];minX=selects[0]}
			if(minX[0]==maxX[0]&&points[2])
				{minX=points[2][0]<minX[0]?points[2]:minX;
				maxX=points[2][0]>maxX[0]?points[2]:maxX}
			var DIFFERENCEX = maxX[1]-minX[1];
			var DEPTHDIV = 1/(maxX[0]-minX[0]);
			var MAP1 = (maxX[2][0]-minX[2][0]);
			var MAP2 = (maxX[2][1]-minX[2][1]);
			for(var x=~~minX[0];x<=maxX[0];x++){
				var progressX = (x-minX[0])*DEPTHDIV;
				var depth = minX[1]+DIFFERENCEX*progressX;
				var map = [minX[2][0]+MAP1*progressX, minX[2][1]+MAP2*progressX];
				try{var color = TextureBuffer[Math.abs(~~(map[1]*TextureSize[1]))][Math.abs(~~(map[0]*TextureSize[0]))];}catch(e){}
				if(color)drawPixel(x, y, color[0], color[1], color[2], color[3], depth)
			}
		}
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
	this.clearColor = function(r, g, b, a){
		for(var y=0;y<HEIGHT;y++)
			for(var x=0;x<WIDTH;x++)
				screenBuffer[~~y][~~x] = [r, g, b, a, -Infinity];
	}
	this.raster = function(){
		for(var y=0;y<HEIGHT;y+=STACK_DRAW){
			for(var r=0;r<STACK_DRAW;r++){
				for(var x=0;x<WIDTH;x++){
					imageData.data[r*WIDTH*4+x*4]=screenBuffer[y+r][x][0]*255;
					imageData.data[r*WIDTH*4+x*4+1]=screenBuffer[y+r][x][1]*255;
					imageData.data[r*WIDTH*4+x*4+2]=screenBuffer[y+r][x][2]*255;
					imageData.data[r*WIDTH*4+x*4+3]=screenBuffer[y+r][x][3]*255;
				}
			}
			gl.putImageData(imageData,0,y);
		}
	}
	}
	return new RASTER(canvas);
}

