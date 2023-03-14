
const rst = tela.getRasterContext();

console.log(rst);
rst.buffer_c[0] = 0xff0000ff;

rst.setShaderProgram(function(attrs){
	var p = m4.transformPoint(b_matrix, attrs.position);
	var pos = [p[0], p[1], p[2], 1];
	//console.log(pos);
	return pos;
}, rst.VERTEX_SHADER);

rst.setShaderProgram(function(varys){
	return [varys.color[0], varys.color[1], varys.color[2], 1];
	varys.color;
}, rst.FRAGMENT_SHADER);

rst.setVertexAttribute("position", 0,[
				[-.25,  .5, 0, 1],
				[ .75,  -0, 0, 1],
				[-.85, -.85, 0, 1],
			]);


//var p = 1;
var p = 0;
var g_camera = m4.perspective((Math.PI/180)*45, 80/48, .001, 1);
var b_matrix = m4.copy(g_camera);
var o_matrix = m4.create();
var pos = [1.1635088237302262, 0, 1.8831829101107112];
var dir = [0.68, 0];

window.onkeydown = function(ev){
	//console.log(ev);
	switch(ev.key){
		case 'w':
			pos[2]+=Math.cos(-dir[0])*.04;
			pos[0]+=Math.sin(-dir[0])*.04;
		break;
		case 's':
			pos[2]+=Math.cos(-dir[0]+3.14)*.04;
			pos[0]+=Math.sin(-dir[0]+3.14)*.04;
		break;
		case 'd':
			pos[2]+=Math.cos(-dir[0]-1.51)*.04;
			pos[0]+=Math.sin(-dir[0]-1.51)*.04;
		break;
		case 'a':
			pos[2]+=Math.cos(-dir[0]+1.51)*.04;
			pos[0]+=Math.sin(-dir[0]+1.51)*.04;
		break;
		case 'q':
			dir[0]-=.04;
		break
		case 'e':
			dir[0]+=.04;
		break
	}
	//debug.textContent = "x:"+pos[0]+" z:"+pos[2];
}

var mit = true;
function update(){
	mit = true;
	rst.clearColor(0, 1, 1, 1);
	rst.clear(rst.COLOR|rst.DEPTH);
	
	b_matrix = m4.copy(g_camera);
	b_matrix = m4.rotateY(b_matrix, dir[0]);
	b_matrix = m4.translate(b_matrix, pos);
	
	//var c_matrix = m4.copy(o_matrix);
	//c_matrix = m4.rotateY(c_matrix, 0.5);
	
	//c_matrix = m4.multiply(b_matrix, c_matrix);
	rst.setVertexAttribute("color", 1,[
					[ 1, 0, 0, 1],
					[ 0, 1, 0, 1],
					[ 0, 0, 1, 1],
				]);
	rst.setVertexAttribute("position", 0,[
					[-.5, .5, -3],
					[ .5, .5, -3],
					[-.5,-.5, -3],
				]);
	rst.drawTriangle();	
	rst.setVertexAttribute("color", 1,[
					[ 1, 1, 0, 1],
					[ 0, 0, 1, 1],
					[ 0, 1, 0, 1],
				]);
	rst.setVertexAttribute("position", 0,[
					[ .5,-.5, -3],
					[-.5,-.5, -3],
					[ .5, .5, -3],
				]);
	rst.drawTriangle();	
	rst.flush();
	p += .02;
	requestAnimationFrame(update);
}

update();









/*


const rst = tela.getRasterContext();

console.log(rst);
rst.buffer_c[0] = 0xff0000ff;

rst.setShaderProgram(function(attrs){
	console.log(attrs);
	var p = [
		attrs.position[0],
		attrs.position[1],
		attrs.position[2],
		1
	];
	return p;
}, rst.VERTEX_SHADER);

rst.setShaderProgram(function(varys){
	return [varys.color[0], varys.color[1], varys.color[2], 1];
	varys.color;
}, rst.FRAGMENT_SHADER);

rst.setVertexAttribute("position", 0,[
				[-.25,  .5, 0, 1],
				[ .75,  -0, 0, 1],
				[-.85, -.85, 0, 1],
			]);
rst.setVertexAttribute("color", 1,[
				[ 1, 0, 0, 1],
				[ 0, 1, 0, 1],
				[ 0, 0, 1, 1],
			]);


//var p = 1;
var p = 0;
//var g_camera = m4.perspective((Math.PI/180)*45, 80/48, .1, .25);

function update(){
	rst.clearColor(0, 1, 1, 1);
	rst.clear(rst.COLOR|rst.DEPTH);
	rst.setVertexAttribute("position", 0,[
					[-.5, .5, 0]//m4.transformPoint(g_camera,[-.5, .5, 0, 1]),
					[ .5, .5, 0]//m4.transformPoint(g_camera,[ .5, .5, 0, 1]),
					[-.5,-.5, 0]//m4.transformPoint(g_camera,[-.5,-.5, 0, 1]),
				]);
	rst.drawTriangle();	
	rst.flush();
	p += .02;
	//requestAnimationFrame(update);
}

update();*/