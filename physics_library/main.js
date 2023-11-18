
const cv = document.getElementById("tela");
const dbgt = document.getElementById("dbg");
const ctx = cv.getContext("2d");


var caixa = new Circle(80, 50, 0, 30);
var caixa2 =  new Circle(60, -20, 0, 30);

var mundo = new World({
	gravity: 1
});
mundo.addBody(caixa);
mundo.addBody(caixa2);

for(var i=1; i<100; i++)
	mundo.addBody(new Circle(70, -20-i*70, 0, 30));

//DeltaTime
var deltatime = 0;
var lasttime = 0;

function update(time){
	/************DELTATIME SET********/
	deltatime = ~~(time-lasttime)*.001;
	lasttime = time;
	dbgt.innerHTML = deltatime
	/*********************************/
	
	//Clear screen
	ctx.clearRect(-Number(cv.width), -Number(cv.height), Number(cv.width)*2, Number(cv.height)*2);
	ctx.fillStyle = "#0fa";
	ctx.fillRect(-Number(cv.width), -Number(cv.height), Number(cv.width)*2, Number(cv.height)*2);
	ctx.fillStyle = "black";
	
	
	mundo.update(deltatime, function(body){
		//Draw body on screen
		ctx.fillStyle = "black";
		ctx.lineWidth = 4;
		ctx.save();
		ctx.translate(body.x, body.y);
		ctx.rotate(body.a);
		if(body instanceof Box){
			ctx.strokeRect(-body.px, -body.py, body.w, body.h);
		}else{
			ctx.beginPath();
			ctx.arc(0, 0, body.r, .0000001, 0, false);
			ctx.stroke();
			ctx.closePath();
			ctx.fillRect(-2,-2,body.r, 4);
		}
		//	ctx.strokeRect(-body.r*.5, -body.r*.5, body.r, body.r);
		ctx.restore();
	});
	
	requestAnimationFrame(update);
}
update(0);