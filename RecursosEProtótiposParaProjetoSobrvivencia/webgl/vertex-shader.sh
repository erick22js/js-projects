var vertexShaderSource =`
	//an attribute will receive data from a buffer
	attribute vec3 a_position;
	attribute vec2 a_texcoord;
	varying vec2 v_texcoord;
	uniform vec3 u_translation;
	uniform vec3 u_scale;
	// all shaders have a main function
	void main() {
		// gl_Position is a special variable a vertex shader
		// is responsible for setting
		vec3 scaled = a_position*u_scale;
		gl_Position = vec4(scaled+u_translation,1);
		v_texcoord = a_texcoord;
	}
`