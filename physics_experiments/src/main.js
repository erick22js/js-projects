const ctx = tela.getContext("2d");

var earth = new ps_circle(150); //70.685,834705770347865409476123789
earth.x = 300;
earth.y = 300;
earth.mass = 1000000.0;//700;

var c = new ps_circle(10); //314,15926535897932384626433832795
c.x = 130;
c.y = 240;
c.velocity_x = 1;
c.velocity_y = -1;
c.acceleration_x = 0;
c.acceleration_y = .05;
c.mass = 1;

//Init

function init(){
	
}

//Updates

function update(delta=0){
	
	clear_screen();
	
	var distancia = c.get_distance(earth);
	var cos = (earth.x-c.x)/distancia;
	var sen = (earth.y-c.y)/distancia;

	var f_g = c.get_gravityForce(earth);
	
	var f_x = f_g*cos;
	var f_y = f_g*sen;

	c.acceleration_x = f_x/c.mass;
	c.acceleration_y = f_y/c.mass;
	
	earth.update();
	c.update();
	
	if(earth.collides(c)){
		aplicarColisao(earth, c);
		earth.update();
		c.update();
	}
	else{
		
	}
	
	draw_pscircle(earth, earth.collides(c)?"red":"green");
	draw_pscircle(c, "blue");

}

function aplicarColisao(body1, body2){
	///////////////////////////////////////////////////////////////////////////

	var m1 = body1.mass;
	var m2 = body2.mass;

	var u1x = body1.velocity_x;
	var u1y = body1.velocity_y;
	var u2x = body2.velocity_x;
	var u2y = body2.velocity_y;
	//Carregando valores para as variaveis da equaçao
	var x1 = body1.x;
	var y1 = body1.y;
	var x2 = body2.x;
	var y2 = body2.y;

	var u1 = Math.sqrt(u1x*u1x + u1y*u1y);
	var u2 = Math.sqrt(u2x*u2x + u2y*u2y);

	//////////////////////////////////////////////////////////////////

	var a1 = Math.atan2(y2-y1, x2-x1);
	var b1 = Math.atan2(u1y, u1x);
	var c1 = b1-a1;

	var a2 = Math.atan2(y1-y2, x1-x2);
	var b2 = Math.atan2(u2y, u2x);
	var c2 = b2-a2;

	var u12 = u1*Math.cos(c1);
	var u11 = u1*Math.sin(c1);

	var u21 = u2*Math.cos(c2);
	var u22 = u2*Math.sin(c2);

	var v12 = (((m1-m2)*u12) - (2*m2*u21))/(m1+m2);
	var v21 = (((m1-m2)*u21) + (2*m1*u12))/(m1+m2);

	var v1x = u11*(-Math.sin(a1)) + v12*(Math.cos(a1));
	var v1y = u11*(Math.cos(a1)) + v12*(Math.sin(a1));

	var v2x = u22*(-Math.sin(a2)) - v21*(Math.cos(a2));
	var v2y = u22*(Math.cos(a2)) - v21*(Math.sin(a2));

	/////////////////////////////////////////////////////////////////////////

	body1.velocity_x = v1x;
	body1.velocity_y = v1y;        //Retornando o resultado final para as variaveis das esfera

	body2.velocity_x = v2x;
	body2.velocity_y = v2y;
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
