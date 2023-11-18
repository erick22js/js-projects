
const screen = document.getElementById("screen");
const gl = screen.getContext("experimental-webgl");

console.log(gl);

gl.clearColor(0, 0, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.enable(gl.GL_SCISSOR_TEST);
gl.glScissor(0, 0, 1, 1); /// position of pixel
gl.glClearColor(1, 0, 0, 1); /// color of pixel
gl.glClear(GL_COLOR_BUFFER_BIT);
gl.disable(gl.GL_SCISSOR_TEST);
