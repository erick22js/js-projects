
/**
	DISPLAY PROPERTIES
*/

const DCTX = display.getContext("2d");
const DWIDTH = 160;
const DHEIGHT = 144;

const DDATA = DCTX.getImageData(0, 0, DWIDTH, DHEIGHT);
const DBUFFER8 = DDATA.data;
const DBUFFER32 = new Uint32Array(DBUFFER8.buffer);


/**
	DISPLAY FUNCTIONS
*/

display.update = function(){
	DCTX.putImageData(DDATA, 0, 0);
}


/**
	BUFFER DUMP VRAM PROPERTIES
*/

const VDATA = DCTX.getImageData(DWIDTH, 0, DWIDTH, DHEIGHT);
const VBUFFER8 = VDATA.data;
const VBUFFER32 = new Uint32Array(VBUFFER8.buffer);

display.updateV = function(){
	DCTX.putImageData(VDATA, DWIDTH, 0);
}

