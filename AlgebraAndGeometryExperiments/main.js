
const ctx = tela.getContext("2d");

const line1 = [130, 20,  550, 290];
const line2 = [300, 240,  570, 18];

function Update(deltatime){
	//line2[3]++;
	Redraw();
}
function Redraw(){
	
	var inter = getLinesIntersection(line1, line2);
	
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.moveTo(line1[0], line1[1]);
	ctx.lineTo(line1[2], line1[3]);
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.strokeStyle = inter[2]?"red":"blue";
	ctx.moveTo(line2[0], line2[1]);
	ctx.lineTo(line2[2], line2[3]);
	ctx.stroke();
	ctx.closePath();
	
	ctx.fillStyle = "green";
	ctx.fillRect(inter[0]-4, inter[1]-4, 8, 8);
}

tela.onmousemove = function(me){
	line2[2] = me.clientX;
	line2[3] = me.clientY;
}

function Animate(time=0){
	Update(0);
	requestAnimationFrame(Animate);
}

window.onload = function(){
	Animate()
}
