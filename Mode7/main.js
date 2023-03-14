const gctx = tela.getContext("2d");
const map = new Image();
map.src = "plants.png";

const WIDTH = 300;
const HEIGHT = 300;

const vbuffers = [];
for(var i=0; i<Number(tela.height); i++){
	var buffer = document.createElement("canvas").getContext("2d");
	buffer.canvas.width = gctx.canvas.width;
	buffer.canvas.height = 1;//gctx.canvas.height;
	buffer.translate(Number(tela.width)*.5, Number(tela.height));
	//buffer.scale(.125, .125);
	buffer.imageSmoothingEnabled = false;
	vbuffers.push(buffer);
}




const POV = {
	x: -200,
	y: -200,
	dir: 1,
};
const Keys = {};


function redrawScene(){
	for(var i=0; i<HEIGHT; i++){
		vbuffers[i].fillStyle = "black";
		vbuffers[i].fillRect(POV.x, POV.y, 1000, 1000);
		if(i<150)
			continue;
		var p = (i-150)/20;
		vbuffers[i].setTransform(p, 0, 0, p, Number(tela.width)*.5, Number(tela.height));
		vbuffers[i].rotate(POV.dir);
		//vbuffers[i].clearRect(-200, -200, 500, 500);
		vbuffers[i].drawImage(map, POV.x, POV.y);
		gctx.drawImage(vbuffers[i].canvas, 0, 0, 300, 1, 0, i, WIDTH, 1);
	}
}

window.onkeydown = function(ev){
	Keys[ev.key] = true;
}

window.onkeyup = function(ev){
	Keys[ev.key] = false;
}

function update(){
	if((Keys["d"]==true)|(Keys["a"]==true)|(Keys["w"]==true)|(Keys["s"]==true)){
		var dir = [-(Keys["d"]==true)+(Keys["a"]==true), (Keys["w"]==true)-(Keys["s"]==true)];
		POV.x += Math.sin(POV.dir-(Math.atan2(dir[1], dir[0])-Math.PI*.5))*10;
		POV.y += Math.cos(POV.dir-(Math.atan2(dir[1], dir[0])-Math.PI*.5))*10;
	}
	POV.dir += ((Keys["q"]==true)-(Keys["e"]==true))*.08;
	redrawScene();
}

function Animate(){
	update();
	requestAnimationFrame(Animate);
}

map.onload = function(){
	//vbuffers[0].drawImage(map, -200, -200);
	//gctx.drawImage(vbuffers[0].canvas, 0, 0);
	//redrawScene();
	Animate();
}