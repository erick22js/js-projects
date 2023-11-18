function RaycastEngine(canvas){
	this.collums = 128;//Number(canvas.width); using a little number
	this.collumWidth = Number(canvas.width)/this.collums;
	var width = Number(canvas.width);
	var self = this;
	var ctx = canvas.getContext("2d");
	var buffer_color = null;
	var buffer_depth = [[],[],[]];
	var map = null;
	this.proj = new function(){
		/*
		*angle: -0.006539047207938617
fov: 1.0471975511965976
x: 6.959988027483916
y: 3.496338159659873
		*/
		this.x = 6.959988027483916;//6.4;//4.5;
		this.y = 3.496338159659873;//3.5;
		this.angle = -0.006539047207938617;//Math.PI/180*140;
		this.fov = Math.PI/180*45;
	}
	//Initialize ours buffers!
	buffer_color = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(var x=0; x<Number(canvas.width); x++){
		buffer_depth[0].push(-Infinity);
		buffer_depth[1].push(0);
		buffer_depth[2].push(Number(canvas.height));
	}
	//Load a map to game
	this.loadMap = function(data){
		map = data;
	}
	//Now we manage rays behavior
	function rayCast(x, y, dir, i){
		var cos = Math.cos(dir);
		var sen = Math.sin(dir);
		var tan = Math.tan(dir);
		var overtan = 1/tan;
		//Get intersections and do some math...
		var bx = x; //begin x
		var by = y; // begin y
		var xa = dir<=-Math.HALFPI||dir>=Math.HALFPI?-1:1; //progress x add
		var xcor = (xa-1)*.5;//(xa-1)*-.5;
		var xx = ~~x; //progress x horizontal
		var xy = y-(x-xx)*tan; //progress y horizontal
		var xc = 0; //progress cells horizontal
		var xd = 0; //distance in progress horizontal
		var ya = dir<0?-1:1; // progress y add
		var ycor = (ya-1)*.5;
		var yy = ~~y; //progress y vertical
		var yx = x-(y-yy)*overtan; //progress x vertical
		var yc = 0; //progress cells vertical
		var yd = 0; //distance in progress vertical
		var horizontal = Math.abs(dir)<=Math.QUARTERPI||Math.abs(dir)>Math.TREEQUARTERPI;
		var blocksX = [];
		var logx = [];
		var blocksY = [];
		var logy = [];
		// -  -1 +1
		globalcheck: while(true){
			mctx.fillStyle = "blue";
			while(xd<=yd&&xc<10){
				if(xa>0){
					xx += xa;
					xy += tan*xa;
					xd += Math.distanceSimple(xa, tan*xa);
				}
				if(map[~~xy]){
					if(map[~~xy][~~xx-xa+xcor]==0)
					if(map[~~xy][(~~xx)+xcor]==1){
						blocksX.push([~~xx, xy, Math.distance(bx, by, xx, xy)]);
					}
				}
				if(xa<0){
					xx += xa;
					xy += tan*xa;
					xd += Math.distanceSimple(xa, tan*xa);
				}
				xc++;
			}
			while(yd<=xd&&yc<10){
				if(ya>0){
					yy += ya;
					yx += overtan*ya;
					yd += Math.distanceSimple(overtan*ya, ya);
				}
				if(map[~~yy+ycor]){
					if(map[~~yy-ya+ycor][~~yx]==0)
					if(map[~~yy+ycor][(~~yx)]==1){
						blocksY.push([yx, ~~yy, Math.distance(bx, by, yx, yy)]);
					}
				}
				if(ya<0){
					yy += ya;
					yx += overtan*ya;
					yd += Math.distanceSimple(overtan*ya, ya);
				}
				yc++;
			}
			if(xc>=10||yc>=10){
				break;
			}
		}
		//For debug purposes
		mctx.fillStyle = "yellow";
		if(blocksX.length>0&&blocksY.length>0){
			var blocks = blocksX[0][2]<blocksY[0][2]?blocksX[0]:blocksY[0];
			mctx.strokeStyle = "purple";
			drawLine(bx, by, blocks[0], blocks[1]);
			return blocks;
			//blocks = blocksX[0];
			//mctx.fillRect(blocks[0]*grids-2, blocks[1]*grids-2, 4, 4);
			//blocks = blocksY[0];
			//mctx.fillRect(blocks[0]*grids-2, blocks[1]*grids-2, 4, 4);
		}else if(blocksX.length>0){
			mctx.strokeStyle = "green";
			drawLine(bx, by, blocksX[0][0], blocksX[0][1]);
			mctx.fillRect(blocksX[0][0]*grids-2, blocksX[0][1]*grids-2, 4, 4);
			return blocksX[0];
		}else if(blocksY.length>0){
			mctx.strokeStyle = "green";
			drawLine(bx, by, blocksY[0][0], blocksY[0][1]);
			mctx.fillRect(blocksY[0][0]*grids-2, blocksY[0][1]*grids-2, 4, 4);
			return blocksY[0];
		}
		//console.log(blocks);
		//throw new Error("breakpoint");
	}
	//Its rendered all the scene
	this.render = function(){
		//We iterate each collum
		var x=0;
		for(var c=0; c<self.collums; c++){
			//Calcule direction ray
			var dir = c;
			dir /= self.collums;
			dir -= .5;
			dir *= self.proj.fov*2;
			var cos = Math.cos(dir);
			//Gets ray
			mctx.lineWidth = 1;
			var ray = rayCast(self.proj.x, self.proj.y, Math.normalizeAngle(dir+self.proj.angle), c);
			var hei = 170/(ray[2]*cos);
			var ystart = (170-hei)*.5;
			self.drawCollum(~~x, ~~ystart, ~~self.collumWidth+1, hei, 100, 100, 100);
			x += self.collumWidth;
		}
	}
	this.drawCollum = function(x, y, w, h, r, g, b){
		ctx.fillStyle = "rgb("+r+","+g+","+b+")";
		ctx.fillRect(x, y, w, h);
		return;
		for(var xt=0; xt<w; xt++)
			for(var yt=0; yt<h; yt++){
				//console.log("x:"+(xt+x)+"   y:"+(yt+y));
				self.drawPixel(x+xt, y+yt, r, g, b);
				}
	}
	this.drawPixel = function(x, y, r, g, b){
		var p = y*width*4+x*4;
		if(x>width)
			throw new Error("pixel exceded limit:"+x);
		buffer_color.data[p] = r;
		buffer_color.data[p+1] = g;
		buffer_color.data[p+2] = b;
		buffer_color.data[p+3] = 255;
	}
	//We render all draws
	this.flush = function(){
		//ctx.putImageData(buffer_color, 0, 0);
	}
}

Math.distance = function(x1, y1, x2, y2){
	return Math.sqrt( (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
Math.distanceSimple = function(x, y){
	return Math.sqrt(x*x + y*y);
}
Math.normalizeAngle = function(rad){
	return rad>Math.PI?rad-Math.DOUBLEPI:rad<-Math.PI?rad+Math.DOUBLEPI:rad;
}
Math.DOUBLEPI = Math.PI*2;
Math.QUARTERPI = Math.PI*.25;
Math.TREEQUARTERPI = Math.PI*.75;
Math.HALFPI = Math.PI*.5;
Math.TREEHALFPI = Math.PI*1.5;