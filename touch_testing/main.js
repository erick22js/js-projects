const cv = document.getElementById("tela");
var ctx = cv.getContext("2d");
const dbg = document.getElementById("dbgText");

console.log("Started!");

var touch = new TouchUI(cv);

var x = 0;
var y = 0;

function update(time){
	touch.update();
	//dbg.innerHTML = JSON.stringify(touch.touches_obj);
	ctx.clearRect(0, 0, cv.width, cv.height);
	ctx.fillStyle = touch.touches_obj[0].holding?(touch.touches_obj[0].moving?"green":"blue"):"black";
	ctx.fillRect(x,100+y, 40,40);
	x+=touch.touches_obj[0].motionX;
	y+=touch.touches_obj[0].motionY;
	requestAnimationFrame(update);
}

update();