function getDefaultShaders(){
	///vertex preset****************************************
	var vertex = `
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_uv;
//attribute vec2 a_depth;

uniform mat4 perspective;
uniform mat4 transformation;

varying vec4 colorize;
varying vec3 uv;
void main() {
   gl_Position = vec4(a_position.xyz, 1.0);
   colorize = a_color;
   uv = a_uv;//vec3(a_uv.x, a_uv.y, 1.0);
}`;
	//vertex end*******************************************
	///fragment preset*************************************
	var fragment = `
uniform sampler2D textureTrashBin1001;
precision mediump float;

uniform sampler2D textura;

varying vec4 colorize;
varying vec3 uv;
void main() {
	vec4 texColor = texture2D(textura, 
		vec2(
			uv.x
			,pow(uv.y, 1.0)
		)
	);
	gl_FragColor= texColor;//vec4(1, 0, 0, 1);
}`;
	//fragment end****************************************
	return [vertex, fragment];
}