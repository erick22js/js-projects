
//Screen global
var screen = document.getElementById("screen");
var debug = document.getElementById("debug");
var gctx = screen.getContext("2d");

gctx.imageSmoothingEnabled = false;
gctx.fillStyle = "red";
styles = ["","lime","darkgreen","yellow","blue"];

var map = []
for(var y=0;y<1024; y++){
	map.push([]);
	for(var x=0;x<1024;x++){
		map[y].push(false);
	}
}

function redraw(){
	gctx.clearRect(0, 0, 1024, 1024);
	for(var y=0;y<1024; y++){
		for(var x=0;x<1024;x++){
			if(map[y][x]){
				gctx.fillStyle = styles[map[y][x]];
				gctx.fillRect(x,y,1,1);
			}
			//map[y].push([false]);
		}
	}
}
var chanceAccept = .3;
var actualPen = 2
function fillRect(xb, yb, xend, yend){
	xb = ~~xb;
	yb = ~~yb;
	xend = ~~xend;
	yend = ~~yend;
	for(var y=yb;y<yend; y++){
		for(var x=xb;x<xend;x++){
			if(x>-1&&x<map[0].length&&y>-1&&y<map.length)
			map[y][x] = actualPen;
		}
	}
	calculateArea(xb, yb, xend, yend)
}
function calculateArea(xb, yb, xend, yend){
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
				fillRect(xend, y, xend+width/subdivisions, y+height/subdivisions);
			else
				calculateArea(xend-width/subdivisions, y, xend, y+height/subdivisions);
		}
		//left
		for(var y=yb;y<yend; y+=height/subdivisions){
			if(getNextRandom()<chanceAccept)
				fillRect(xb-width/subdivisions, y, xb, y+height/subdivisions);
			else
				calculateArea(xb, y, xb+width/subdivisions, y+height/subdivisions);
		}
		//down
		for(var x=xb;x<xend; x+=width/subdivisions){
			if(getNextRandom()<chanceAccept)
				fillRect(x, yend, x+width/subdivisions, yend+height/subdivisions);
			else
				calculateArea(x, yend-height/subdivisions, x+width/subdivisions, yend);
		}
		//top
		for(var x=xb;x<xend; x+=width/subdivisions){
			if(getNextRandom()<chanceAccept)
				fillRect(x, yb-height/subdivisions, x+width/subdivisions, yb);
			else
				calculateArea(x, yb, x+width/subdivisions, yb+height/subdivisions);
		}
	}
}/*
function generatePath(penSet, pal1, pal2){
	var startCoord = [0,0];
	var size = 2;
	retrieveBegin:
	for(var y=0;y<1024;y++){
		for(var x=0;x<1023;x++){
			if((map[y][x]==pal1&&map[y][x+1]==pal2)||(map[y][x]==pal2&&map[y][x+1]==pal1)){
				var startCoord = [x, y];
				break retrieveBegin;
			}
		}
	}
	function paint(x, y){
		
	}
	findContinuos:
	while(true){
		for(var i=-1;i<size-1;i++){
			if((map[startCoord[0]+1][startCoord[1]+i]==pal1&&map[startCoord[0]+1][startCoord[1]+i]==pal2)||(map[startCoord[0]+1][startCoord[1]+i]==pal2&&map[startCoord[0]+1][startCoord[1]+1+i]==pal1)){
				
			}
			if((map[startCoord[0]+i][startCoord[1]+1]==pal1&&map[startCoord[0]+i][startCoord[1]+1]==pal2)||(map[startCoord[0]+i][startCoord[1]+1]==pal2&&map[startCoord[0]+i][startCoord[1]]==pal1)){
				
			}
		}
	}
	
}*/


var actualPen = 2;
fillRect(400, 400, 500, 500);
var actualPen = 1;
fillRect(250, 250, 400, 400);

redraw();

