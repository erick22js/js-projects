var cv = document.getElementById("cv");
var dbg = document.getElementById("dbg");

var gl = createRaster(cv);

var imagem = new Image();
imagem.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAADXUAAA11AFeZeUIAAABJ0lEQVR4nO2bsQ3CMBBFzwiYhEk8AsOkoqQhwzBCFqOABhpHIZjk/CLdfx0gmaefzxFHSTqZPS0wO1qARgHQAjT78o0zYdGQe/E6fAMUAC1AM5oBJddhaOHhxiXnr5+Hb4ACoAVoZmdAyWHmN0XzqJxZasDaC9YegV/wbJ0a4LXwMee0dI3ufa3itlxnkvANUAC0AE34ANyGYEm30YuvakDrL/T8S/uH8A1QALQATfMZ8M9mSZshR5o1oDdLZmZ9xdHUZqgBCoAWoAkfgDZDtACNNkO0AI0CoAVoFAAtQKMAaAEaBUAL0LidCW713L9EDVh7wc8FzK2d808RvgEKgBagqZ4BHneBkYRvgAKgBWhS+dygnhkKhgKgBWhGMyAa4RugAGgBmhem3iEdmcANiAAAAABJRU5ErkJggg==";
var DELTATIME = 0;
var then = 0;

var ani = 0;
var i = 0;
var verti = [64,64,0,  192, 64,0,  192,192,0,  64, 192,0];
function update(now){
	DELTATIME = (now-then)*.001;
	then = now;
	dbg.textContent = 1/DELTATIME;
	
	ani++;
	gl.clearColor(1,1,0,1);/*
	gl.bindVertexBuffer([0,64,0,  192,64,0,  192,192,0,  0,192,0]);
	gl.bindUV([0,0,  1,0,  1,1,  0,1]);
	gl.drawArray();*/
	gl.bindVertexBuffer(verti);
	gl.bindUV([0,0,  1,0,  1,1,  0,1]);
	gl.drawArray();
	
	verti[0]=Math.cos(i)*64+128;
	verti[1]=Math.sin(i)*16+64;
	verti[2]=Math.sin(i)*16;
	verti[9]=Math.cos(i)*64+128;
	verti[10]=-Math.sin(i)*16+192;
	verti[11]=10;//Math.sin(i)*16;
	
	verti[3]=-Math.cos(i)*64+128;
	verti[4]=-Math.sin(i)*16+64;
	verti[5]=-Math.sin(i)*16;
	verti[6]=-Math.cos(i)*64+128;
	verti[7]=Math.sin(i)*16+192;
	verti[8]=-Math.sin(i)*16;
	
	i+=.05;
	gl.raster();
	requestAnimationFrame(update)
}

window.onload = function(){
	var tex = gl.createTexture(imagem);
	gl.bindTexture(tex);
	update();
}

