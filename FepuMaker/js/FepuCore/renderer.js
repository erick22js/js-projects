const ctx = UI.getContext("2d");
const gl = Tela.getContext("webgl");

const arraysSegBuffer = {
	position:[],
	uv:[],
	indices: [0, 1, 2,  1, 3, 2]
}

function renderSegment(seg){
	/* Gerando buffers para renderização
	*/
	/*var v1 = seg.v1;
	var v2 = seg.v2;
	arraysSegBuffer.position = [
		v1.y, -5, v1.x,
		v2.y, -5, v2.x,
		v1.y,  5, v1.x,
		v2.y,  5, v2.x,
	];
	arraysSegBuffer.uv = [
		0, 1, 0,
		1, 1, 0,
		0, 0, 0,
		1, 0, 0,
	];*/
	//var bufferInfo = twgl.createBufferInfoFromArrays(gl, seg.buffer);
	twgl.setBuffersAndAttributes(gl, programInfo, seg.bufferInfo);
	twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
}