var fragmentShaderSource =`
	precision mediump float;
	// Passado do sombreador de vértice.
	varying vec2 v_texcoord;
	// A textura.
	uniform sampler2D u_texture;
	void main() {
		gl_FragColor = texture2D(u_texture, v_texcoord);
	}
`