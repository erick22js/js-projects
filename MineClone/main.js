
var chunks = [];/*
var ck = new Chunk()
ck.updateChunk();*/
for(var x=0; x<5; x++)
	for(var z=0; z<5; z++){
		chunks.push(generateChunk(x, 0, z));
	}

//Init and Runtime functions
const Transform = {
	position: [1.5, -.5, -1.5],
	rotation: [0, Math.PI*.5, 0],
	fov: Math.PI/180*60,
	
};
function Start(){
	gl.enable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}
function Update(delta){
	gl.clearColor(0, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.useProgram(programInfo.program);
	
	ExecutePlayerInputs();
	
	for(var ci=0; ci<chunks.length; ci++)
		renderChunk(chunks[ci])
	
}

/*
 * @Application base functions
*/
var _lasttime = 0;
function _Animate(time){
	var delta = (time-_lasttime)*.001;
	_lasttime = time;
	Update(delta);
	requestAnimationFrame(_Animate);
}
window.onload = function(){
	Start();
	_Animate(0);
}