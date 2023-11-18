function Multiply(settings){
	var canvas = document.createElement("canvas");
	//Preset canvas settings
	canvas.width = settings.width||340;
	canvas.height = settings.height||170;
	canvas.style.border = "1px solid black";
	document.body.appendChild(canvas);
	
	//Obtain gl context for drawing
	var gl = canvas.getContext("webgl");
	
	
	//Preset functions
	this.clearColor = function(r, g, b, a){
		gl.clearColor(r,g,b,a);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
	
}