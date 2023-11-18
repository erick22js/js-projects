
const canvas = document.getElementById("canvas");
const gl = new MORE(canvas);

var imagem = new Image();
imagem.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAADXUAAA11AFeZeUIAAABJ0lEQVR4nO2bsQ3CMBBFzwiYhEk8AsOkoqQhwzBCFqOABhpHIZjk/CLdfx0gmaefzxFHSTqZPS0wO1qARgHQAjT78o0zYdGQe/E6fAMUAC1AM5oBJddhaOHhxiXnr5+Hb4ACoAVoZmdAyWHmN0XzqJxZasDaC9YegV/wbJ0a4LXwMee0dI3ufa3itlxnkvANUAC0AE34ANyGYEm30YuvakDrL/T8S/uH8A1QALQATfMZ8M9mSZshR5o1oDdLZmZ9xdHUZqgBCoAWoAkfgDZDtACNNkO0AI0CoAVoFAAtQKMAaAEaBUAL0LidCW713L9EDVh7wc8FzK2d808RvgEKgBagqZ4BHneBkYRvgAKgBWhS+dygnhkKhgKgBWhGMyAa4RugAGgBmhem3iEdmcANiAAAAABJRU5ErkJggg==";
var textura = null;

imagem.onload = function(){
	textura = gl.buildTexture(imagem);
	gl.setUniform("sampler", textura);
	render();
}

gl.clear(1, 1, 0, 1);

var mover = false;

gl.setProgram(
	function(attribute, uniform){
		var pos = attribute.position;
		pos[0] += Math.cos(uniform.angle);
		pos[1] += Math.sin(uniform.angle);
		return pos;
	},
	function(attribs, uniform, prop){
		var cor;
		if(uniform.sampler!=null)
			cor=gl.texture2D(uniform.sampler, attribs.uv);
		if(cor[3]==0){
			cor = prop.fragColor;
		}else{
			cor[0]*=attribs.position[0];
			cor[1]*=attribs.position[1];
			cor[2]*=attribs.position[2];
		}
		return cor;//[attribs.position[2],0,0,1];
	}
);
gl.setAttribute("color",[
	1, 0, 0, 1,
	0, 1, 0, 1,
	0, 0, 1, 1,
], 4);
gl.setAttribute("uv",[
	0, 0,
	0, 1,
	1, 0,
], 2);
gl.setUniform("posX",0);

var po = 0;
function render(){
	gl.clear(1, 1, 0, 1);
	//console.log("the static");
	gl.setUniform("angle",po);
	gl.setAttribute("position",[
		.2, .2, -1,
		.2, .95, -1,
		.95, .2, -1,
	], 3);
	gl.drawTriangle({});
	gl.flush();
	po +=.002;
	requestAnimationFrame(render);
}
