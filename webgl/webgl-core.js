var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl",{premultipliedAlpha: false});

//gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST)

/*
*	Minifyed functions, turning less verbose
*/
function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return program;
	}
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

/*
*	My codes
*/

//generate program and append shaders to it
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
var program = createProgram(gl, vertexShader, fragmentShader);

function createObject(data){
	data = data||{};
	var object = {
		position: data.position||[0, 0, 0],
		scale: data.scale||[.4, .8],
		vertex: data.vertex||[-.5, -.5, 0,    .5, -.5, 0,    -.5, .5, 0,    -.5, .5, 0,    .5, -.5, 0,    .5, .5, 0],
		draw: {vertexCount: data.vertexCount||6, vertexStart: 0},
		vertexBuffer: gl.createBuffer(),
		uv: data.uv||[ 0, 1,  1, 1,  0, 0,  0, 0,  1, 1,  1, 0 ],
		textureBuffer: gl.createBuffer(),
		texture: data.texture||createTexture(null)
	};
	return object;
}

function createTexture(map){
	var texture = gl.createTexture();
	var data = {obj:texture, map:map};
	return data;
}

function renderObject(model){
	var l_translation = gl.getUniformLocation(program, "u_translation");
	gl.uniform3fv(l_translation, model.position);
	var l_scale = gl.getUniformLocation(program, "u_scale");
	gl.uniform3fv(l_scale, [model.scale[0]*RATIO, model.scale[1], 1]);
	// carrega buffer para texcoords.
	var texcoordLocation = gl.getAttribLocation(program, "a_texcoord"); gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer); gl.enableVertexAttribArray(texcoordLocation);
	// Definir Texcoords.
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0); gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(model.uv), gl.STATIC_DRAW);
	//Setting texture map
	gl.bindTexture(gl.TEXTURE_2D, model.texture.obj);
	if(model.texture.map)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.texture.map);
	else
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
	gl.generateMipmap(gl.TEXTURE_2D);
	//Setting vertex data
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position"); gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	//Setting blend mode and alpha
	gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertex), gl.STATIC_DRAW);
	//load vertex and put it
	gl.enableVertexAttribArray(positionAttributeLocation);
	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	//var size = 3;          // 3 components per iteration
	//var type = gl.FLOAT;   // the data is 32bit floats
	//var normalize = false; // don't normalize the data
	//var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	//var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer( positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
	gl.drawArrays(gl.TRIANGLES, model.draw.vertexStart, model.draw.vertexCount);
	
}