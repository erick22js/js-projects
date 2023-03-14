
const programInfo = twgl.createProgramInfo(gl, ["vertSh", "fragSh"]);

const texturas = twgl.createTextures(gl, {
  // a power of 2 image
  //hftIcon: { src: "images/hft-icon-16.png", mag: gl.NEAREST },
  // a non-power of 2 image
  caixa: { src: "img/box.jpg" },}
);


var worldMatrix = m4.perspective(Math.PI/180*60, 2, 0.01, 1000);
var loc = [0, 0, 0];
var lok = [0, 0];
var point = v3.create(-50, -50, -100);
point = m4.transformPoint(worldMatrix, point);
console.log(point);
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
gl.enable(gl.DEPTH_TEST);
function render(time) {

	gl.clearColor(1, 1, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	worldMatrixB = m4.copy(worldMatrix);
	if(controls.look.active){
		lok[0] += controls.look.mx*2;
		lok[1] += controls.look.my*2;
		//worldMatrixB = m4.rotateY(worldMatrixB, controls.look.mx*2);
	}if(controls.move.active){
		loc[0] += Math.sin(controls.move.angle-1.57-lok[0])*3*controls.move.distance;//controls.move.x*1;
		loc[2] += Math.cos(controls.move.angle-1.57-lok[0])*3*controls.move.distance;//controls.move.y*1;
		//worldMatrixB = m4.translate(worldMatrix, 
		//	[controls.move.x*1, 0, controls.move.y*1]);
	}
	worldMatrixB = m4.rotateX(worldMatrixB, lok[1]);
	worldMatrixB = m4.rotateY(worldMatrixB, lok[0]);
	worldMatrixB = m4.translate(worldMatrixB, loc);
	const uniforms = {
		wMatrix: worldMatrixB,
		text:texturas.caixa,
	};
	gl.useProgram(programInfo.program);
	twgl.setUniforms(programInfo, uniforms);
	//for(var s=0; s<segs.length; s++)
	//	renderSegment(segs[s]);
	//for(var ni=0; ni<BspTree.length; ni++)
	//	if(BspTree[ni].isSubsector)
	//		for(var li=0; li<BspTree[ni].lines.length; li++)
	//			renderSegment(BspTree[ni].lines[li]);
	renderBspTree({"x":loc[0], "y":loc[1], "z":loc[2], "lookY":lok[0], "lookX":lok[1]}, BspTree);
	renderUi();
	requestAnimationFrame(render);
}
console.log("Initalizing");
requestAnimationFrame(render);