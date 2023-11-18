const ctx = tela.getContext("2d");

var earth = new ps_circle(150);
earth.x = 300;
earth.y = 300;

var c = new ps_circle(10);
c.x = 100;
c.y = 50;
c.velocity_x = 1;
c.velocity_y = -1;
c.acceleration_x = 0;
c.acceleration_y = .05;

//Init

function init(){
	
}

//Updates

function update(delta=0){
	
	clear_screen();
	
	var dir = Math.atan2(earth.y-c.y, earth.x-c.x);
	c.acceleration_x = Math.cos(dir);
	c.acceleration_y = Math.sin(dir);

	var d = Math.distance(c.x, c.y, earth.x, earth.y);
	var f_g = (c.mass*earth.mass)/(d*d)

	if(earth.collides(c)){
		/*c.velocity_y *= -1;
		console.log("bimp!");*/
	}
	earth.update();//delta*10);
	c.update();//delta*10);

	draw_pscircle(earth, earth.collides(c)?"red":"green");
	draw_pscircle(c, "blue");

}

/*
* DRAW FUNCTIONS
*/
function clear_screen(){
	ctx.clearRect(0, 0, 600, 600);
}
function draw_pscircle(c, color) {
	ctx.fillStyle = color??"black";
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.radius, -Math.PI, Math.PI, false);
	ctx.fill();
}
/*
 * UPDATE AND RENDERER FUNCTIONS
 */
var _lasttime = 0;
function _Animate(time=0) {
	var deltatime = (time-_lasttime)/1000;
	_lasttime = time;
	update(deltatime);
	requestAnimationFrame(_Animate);
}
window.onload = function(){
	init();
	_Animate(0);
}
