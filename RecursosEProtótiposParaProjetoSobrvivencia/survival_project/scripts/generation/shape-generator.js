
var chanceAccept = .3;
var actualPen = "";
var actualMask = "";
var actualFilter = null;
var Shaperer = new function(){
	this.fillRect = function(xb, yb, xend, yend, map){
		//console.log(map);
		xb = ~~xb;
		yb = ~~yb;
		xend = ~~xend;
		yend = ~~yend;
		for(var y=yb;y<yend; y++){
			for(var x=xb;x<xend;x++){
				if(x>-1&&x<map[0].length&&y>-1&&y<map.length&&map[y][x]!=actualMask&&(actualFilter?map[y][x]==actualFilter:true))
					map[y][x] = actualPen;
			}
		}
		this.calculateArea(xb, yb, xend, yend, map)
	}
	this.makeBaye = function(byPal, onPal, map){
		var positions = [];
		for(var y=0;y<map.length; y++){
			for(var x=0;x<map[y].length;x++){
				if((map[y][x-1]==byPal||map[y][x+1]==byPal)&&(onPal?map[y][x]==onPal:true))
					positions.push([x, y]);
			}
		}
		for(var y=0;y<map.length; y++){
			for(var x=0;x<map[y].length;x++){
				if(((y>0&&map[y-1][x]==byPal)||(y<map.length-1&&map[y+1][x]==byPal))&&(onPal?map[y][x]==onPal:true))
					positions.push([x, y]);
			}
		}
		for(var i=0;i<positions.length;i++){
			map[positions[i][1]][positions[i][0]] = actualPen;
		}
	}
	this.calculateArea = function(xb, yb, xend, yend, map){
		xb = ~~xb;
		yb = ~~yb;
		xend = ~~xend;
		yend = ~~yend;
		var height = yend-yb;
		var width = xend-xb;
		var subdivisions = 2;
		if(width>1||height>1){
			//Right
			for(var y=yb;y<yend; y+=height/subdivisions){
				if(getNextRandom()<chanceAccept)
					this.fillRect(xend, y, xend+width/subdivisions, y+height/subdivisions, map);
				else
					this.calculateArea(xend-width/subdivisions, y, xend, y+height/subdivisions, map);
			}
			//left
			for(var y=yb;y<yend; y+=height/subdivisions){
				if(getNextRandom()<chanceAccept)
					this.fillRect(xb-width/subdivisions, y, xb, y+height/subdivisions, map);
				else
					this.calculateArea(xb, y, xb+width/subdivisions, y+height/subdivisions, map);
			}
			//down
			for(var x=xb;x<xend; x+=width/subdivisions){
				if(getNextRandom()<chanceAccept)
					this.fillRect(x, yend, x+width/subdivisions, yend+height/subdivisions, map);
				else
					this.calculateArea(x, yend-height/subdivisions, x+width/subdivisions, yend, map);
			}
			//top
			for(var x=xb;x<xend; x+=width/subdivisions){
				if(getNextRandom()<chanceAccept)
					this.fillRect(x, yb-height/subdivisions, x+width/subdivisions, yb, map);
				else
					this.calculateArea(x, yb, x+width/subdivisions, yb+height/subdivisions, map);
			}
		}
	}
}

