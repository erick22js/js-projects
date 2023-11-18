
/*----------------------------------------------------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------DRAWER DRIVE-------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------
*/

const DRAWERDRIVE = new function () {
	const CANVAS = document.getElementById("canvas");
	const CTX = CANVAS.getContext("2d");
	const WIDTH = CANVAS.width;
	const HEIGHT = CANVAS.height;

	const SCREENBUFFER = CTX.getImageData(0, 0, WIDTH, HEIGHT);

	this.drawPixel = function (x, y, red, green, blue, alpha) {
		SCREENBUFFER.data[y * WIDTH * 4 + x * 4] = red;
		SCREENBUFFER.data[y * WIDTH * 4 + x * 4+1] = green;
		SCREENBUFFER.data[y * WIDTH * 4 + x * 4+2] = blue;
		SCREENBUFFER.data[y * WIDTH * 4 + x * 4+3] = alpha;
	}
	this.redraw = function () {
		CTX.putImageData(SCREENBUFFER, 0, 0);
	}

}

DRAWERDRIVE.drawPixel(5, 5, 255, 0, 0, 255);
DRAWERDRIVE.redraw();