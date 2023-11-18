
const cv = document.getElementById("tela");
const dbgt = document.getElementById("dbg");
const ctx = cv.getContext("2d");


var caixa = new Box(80, 50, 40, 40, 0, 20, 20);
var caixa2 =  new Box(60, -20, 40, 40, 0, 20, 20);

var mundo = new World({
	gravity: 1
});
mundo.addBody(caixa);
mundo.addBody(caixa2);

for(var i=1; i<10; i++)
	mundo.addBody(new Box(70, -20-i*70, 40, 40, 0, 20, 20));

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
	ctx.clearRect(0, 0, cv.width, cv.height);
	
	
	mundo.update(deltatime, function(body){
		//Draw body on screen
		ctx.fillStyle = "black";
		ctx.lineWidth = 4;
		ctx.save();
		ctx.translate(body.x, body.y);
		ctx.rotate(body.a);
		ctx.strokeRect(-body.px, -body.py, body.w, body.h);
		ctx.restore();
	});
	
	requestAnimationFrame(update);
}
update(0);