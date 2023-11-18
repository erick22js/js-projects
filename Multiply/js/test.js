
//window.onload = function(){
const Mul = new MULTIPLY({
	canvas: "screen"
});

var textura = document.getElementById("textura");//new Image();
var tex = Mul.createTexture2D({
	"width": 2,
	"height": 2,
	"data":[
		  0, 0, 255, 255,    255, 0, 0, 255,
		255, 255, 0, 255,    0, 255, 0, 255,
	]
});
var tex2 = Mul.createTexture2D({
	"data":document.getElementById("textura2")
});
//textura.src = "image/textura.png";

var program = Mul.createShaderProgram(
	document.getElementById("vs").innerHTML,
	document.getElementById("fs").innerHTML,
	["tete", "textura", "matrix"]
);

var mesha1 = Mul.createMesh([
	-0.5, 0.5,   0,0,0,0,   1.0, 0.0, 0.0,     0.0, 0.0,
	-0.5,-0.5,   0,0,0,0,   0.0, 1.0, 0.0,     0.0, 1.0,
	 0.5,-0.5,   0,0,0,0,   0.0, 0.0, 1.0,     1.0, 1.0,
	 0.5, 0.5,   0,0,0,0,   1.0, 1.0, 0.0,     1.0, 0.0,
], [0, 1, 2,   0, 2, 3], [
	"a_position", 2, 
	"a_other", 4, 
	"a_color", 3,
	"a_uv", 2
], program);
var mesha2 = Mul.createMesh([
	-0.5, 1, 0.0,    1.0, 0.0, 0.0,     .5, 0.0,
	-0.5,-1, 0.0,    0.0, 1.0, 0.0,     .5, 1.0,
	 0.5,-1, 0.0,    0.0, 0.0, 1.0,     1.0, 1.0,
	// 0.5, 1, 0.0,    1.0, 1.0, 0.0,     1.0, 0.0,
], [0, 1, 2],[//,   0, 2, 3], [
	"a_position", 3,
	"a_color", 3,
	"a_uv", 2
], program);

Mul.bindShaderProgram(program);
var gl = Mul.getContext();

var mov = 0;

var matrix = Matrix4.createPerspectiveMatrix(75/180*Math.PI, 2, 0.0001, 1000);
matrix = Matrix4.translate(matrix, [0, 0, -1]);
Mul.shaderUniformMat4("matrix", matrix);

Mul.enableDepthTest();
var nx = 0;
function update(){
	Mul.clearColor(0,1,1,1);
	matrix = Matrix4.rotate(matrix, [1, 0, 0], .01);
	Mul.shaderUniformMat4("matrix", matrix);
	Mul.bindTextureUniform(tex, "texturam", 0);
	Mul.shaderUniformFloat("tete", -.45);
	/*Mul.changeMeshVertices(mesha2, [
		-0.5+nx, 0.5, 0.0,    1.0, 0.0, 0.0,     0.0, 0.0,
		-0.5+nx,-0.5, 0.0,    0.0, 1.0, 0.0,     0.0, 1.0,
		 0.5+nx,-0.5, 0.0,    0.0, 0.0, 1.0,     1.0, 1.0,
		 0.5+nx, 0.5, 0.0,    1.0, 1.0, 0.0,     1.0, 0.0,
	]);*/
	Mul.renderMesh(mesha1);
	for(var i=0; i<1; i++){
		Mul.bindTextureUniform(tex2, "textura", 0);
		Mul.bindTextureUniform(tex, "texturam", 1);
		Mul.shaderUniformFloat("tete", .45+mov);
		Mul.renderMesh(mesha2);
	}//mov += .01;
	nx+=.01;
	requestAnimationFrame(update);
}

update();
