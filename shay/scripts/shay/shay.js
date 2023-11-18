// Include external script
function include(path, onload){path = document.currentScript.src.split('/').slice(0, -1).join('/')+'/'+path;var se = document.createElement("script");se.src = path;document.body.appendChild(se);if(onload){se.onload = function(){onload();}}};


var cv = display;
var gl = cv.getContext("webgl");
{
	var vs =
"attribute vec3 a_position;"+
"void main(){"+
"	gl_Position = vec4(a_position, 1.0);"+
"}";
	var fs =
"void main(){"+
"	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);"+
"}";
	
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0.5, 0,  0.5, -0.5, 0,  -0.5, -0.5, 0
	]), gl.STATIC_DRAW);
	
	var vc = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vc, vs);
	gl.compileShader(vc);
	console.log(gl.getShaderInfoLog(vc));
	
	var fc = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fc, fs);
	gl.compileShader(fc);
	console.log(gl.getShaderInfoLog(fc));
	
	var pg = gl.createProgram();
	gl.attachShader(pg, vc);
	gl.attachShader(pg, fc);
	gl.linkProgram(pg);
	gl.useProgram(pg);
	console.log(gl.getProgramInfoLog(pg));
	
	var a_pos = gl.getAttribLocation(pg, "a_position");
	gl.enableVertexAttribArray(a_pos);
	gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, gl.FALSE, 0, 0);
	
	gl.clearColor(1, 1, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

console.log("Shay Loaded!");
