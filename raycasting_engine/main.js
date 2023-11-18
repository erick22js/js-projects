const screen = document.getElementById("screen");
const stylus = document.getElementById("map");

var game = new RaycastEngine(screen);
const mctx = stylus.getContext("2d");

const map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
game.loadMap(map);

const grids = 20;
function drawLine(xb, yb, xe, ye){
	mctx.beginPath();
	mctx.moveTo(xb*grids, yb*grids);
	mctx.lineTo(xe*grids,  ye*grids);
	mctx.stroke();
}
/**
*** Render mini-map ***/
function renderMiniMap(){
	mctx.clearRect(0,0, stylus.width, stylus.height);
	//draw ceils
	mctx.fillStyle = "black";
	for(var y=0; y<map.length; y++){
		for(var x=0; x<map[y].length; x++){
			if(map[y][x]==1)
				mctx.fillRect(x*grids, y*grids, grids, grids);
			mctx.fillRect(x*grids, 0, 1, map.length*grids);
		}
		mctx.fillRect(0, y*grids,  map[0].length*grids, 1);
	}
	//draw player
	var pj = game.proj;
	mctx.fillStyle = mctx.strokeStyle = "green";
	mctx.lineWidth = 3;
	mctx.fillRect(pj.x*grids-5, pj.y*grids-5, 10, 10);
	mctx.beginPath();
	mctx.moveTo(pj.x*grids, pj.y*grids);
	mctx.lineTo(pj.x*grids+Math.cos(pj.angle)*60,  pj.y*grids+Math.sin(pj.angle)*60);
	mctx.stroke();
}

function update(time){
	game.drawCollum(0,0,340,85,128,128,255);
	game.drawCollum(0,85,340,85,150,150,150);
	lookPlayer();
	movePlayer();
	renderMiniMap();
	game.render();
	game.flush();
	//return;
	requestAnimationFrame(update);
}

//Events for player motion
var Moving = 0;
var Rotating = 0;
function lookPlayer(){
	game.proj.angle += Rotating*0.05;
	//normalize angle
	game.proj.angle += game.proj.angle<-Math.PI?Math.PI*2:game.proj.angle>Math.PI?-2*Math.PI:0;
}
function movePlayer(){
	game.proj.x += Math.cos(game.proj.angle)*.08*Moving;
	game.proj.y += Math.sin(game.proj.angle)*.08*Moving;
}
stylus.ontouchstart = stylus.ontouchmove = function(ev){
	if(ev.touches[0].clientX>=170)
		Rotating = 1;
	else
		Rotating = -1;
}
stylus.ontouchend = function(){
	Rotating = 0;
}
screen.ontouchstart = screen.ontouchmove = function(ev){
	if(ev.touches[0].clientX>=170)
		Moving = 1;
	else
		Moving = -1;
}
screen.ontouchend = function(){
	Moving = 0;
}


console.log(stylus);
console.log("Game initialized!");
update(0);
