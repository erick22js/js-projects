const DCTX = display.getContext("2d");
const DWIDTH = Number(display.width);
const DHEIGHT = Number(display.height);

const IDATA = DCTX.getImageData(0, 0, DWIDTH, DHEIGHT);
const BUFFER = new Uint32Array(IDATA.data.buffer);


function z_(n, c){
	if(n==0){
		return 0;
	}
	else{
		return z_();
	}
}

function pixel_(canvasx, canvasy){
	var tx = (canvasx-128)/64;
	var ty = (-canvasy+128)/64;
	
	var cx = tx;
	var cy = ty;
	
	var zx = 0;
	var zy = 0;
	
	var max = 10;
	var i = 0;
	
	while(((zx*zx+zy*zy)<4)&&(i<max)){
		var tmx = zx*zx-zy*zx+cx;
		zy = 2*zx*zy+cy;
		zx = tmx;
		i++;
	}
	boldness = i*25;
	
	return (boldness)|(boldness<<8)|(boldness<<16)|0xff000000;
}

function render(){
	for(var y=0; y<DHEIGHT; y++){
		for(var x=0; x<DWIDTH; x++){
			BUFFER[y*DWIDTH+x] = pixel_(x, y);
		}
	}
	DCTX.putImageData(IDATA, 0, 0);
}


render();