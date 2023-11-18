
const Shaders = {
	defaultV:`
		attribute vec3 a_position;
		attribute vec4 a_color;
		attribute vec3 a_uv;
		
		uniform mat4 globalMatrix;
		
		varying vec4 v_color;
		varying vec2 v_uv;
		void main(){
			v_color = a_color;
			v_uv = a_uv.xy*.25;
			gl_Position = globalMatrix*vec4(a_position, 1.0);
		}
	`,
	defaultF:`
		precision mediump float;
		
		uniform sampler2D texture;
		
		varying vec4 v_color;
		varying vec2 v_uv;
		void main(){
			gl_FragColor = texture2D(texture, v_uv)*v_color;
		}
	`,
};
