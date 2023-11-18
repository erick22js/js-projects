
//const game = new Multiply({});

//game.clearColor(0,0,1,1);

const audio = new Audio();
audio.src = "som.3gp";
audio.autoplay = true;
/*audio.onload = function(){
audio.play();
}*/
//console.log(audio);
//audio.play();



const canvas = document.getElementById("Canvas");
canvas.onclick= function(){
	audio.currentTime = 0;
	audio.play();
}
const gl = canvas.getContext("webgl");
console.log(gl);

//gl.clearColor(0,0,1,1);
//gl.clear(gl.COLOR_BUFFER_BIT);


console.log(getDefaultShaders());

const programInfo = twgl.createProgramInfo(gl, getDefaultShaders());

const arrays = {
	a_position: [
	-.25, -.50, -.75, 
	.5, -1, -.25,        
	-.25, .50, -.75,  
	.5, -1, -.25,        
	.5, 1, -.25,         
	-.25, .50, -.75,  
	],
	a_color:[
	1, 0, 0, 1,
	0, 1, 0, 1,
	0, 0, 1, 1,
	0, 1, 0, 1,
	1, 1, 0, 1,
	0, 0, 1, 1,
	],
	a_uv:[
	0, 1, 0,
	1, 1, 1,
	0, 0, 0,
	1, 1, 1,
	1, 0, 1,
	0, 0, 0,
	],/*
	a_depth:[
	0, 0,
	1, 0,
	0, 0,
	1, 0,
	1, 0,
	0, 0,
	],*/
};

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

console.log(twgl);

var texture = twgl.createTexture(gl, {
	src:"box.jpg"
});

var pox = -1;
var angle = 1.51;

var camera = m4.perspective(75,  340/170, .01, 10000);

var obj_m = m4.create();
obj_m = m4.translate(obj_m, [0,0,-350]);
//obj_m = m4.rotateY(0);

//m4.


function render(time) {
	gl.clearColor(1,1,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	//twgl.resizeCanvasToDisplaySize(gl.canvas);
	//gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
	obj_m = m4.rotateY(obj_m, .025);
	//console.log(obj_m);
	//obj_m = m4.translate(obj_m, [0,0,-1]);
	
	const uniforms = {
		textura: texture,
		perspective: camera,
		transformation: obj_m
	};
	
	gl.useProgram(programInfo.program);
	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	twgl.setUniforms(programInfo, uniforms);
	twgl.drawBufferInfo(gl, bufferInfo);
	
	//pox += .01;
	//angle += Math.PI/180;
	//console.log("updt");
	requestAnimationFrame(render);
}

render(0);
