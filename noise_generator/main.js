const cv = document.getElementById("tela");
const ctx = cv.getContext("2d");

var nz = 0;

window.onkeydown = function(){
	for(var w=0; w<340; w++){
		for(var h=0; h<170; h++){
			//var inten = ~~(noise1d(w/20, h>=85)*256);
			var inten = noise3d(w/10, h/10, nz/10);
			inten = (inten+1)/2;
			inten = ~~(inten*255);
			ctx.fillStyle = "rgb("+(inten)+","+(inten)+","+(inten)+")";
			ctx.fillRect(w, h, 1, 1);
		}
	}
	nz++;
}