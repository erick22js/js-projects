const CTX = tela.getContext("2d");
const WIDTH = Number(tela.width);
const HEIGHT = Number(tela.height);


/*
	FUNCTION CALCULATING
*/
function f_y(x){
	//return 1/(x/500);
	/*
		x^2 + y^2 = 1
	*/
	//return Math.sqrt(-((x/200)**2 - 1))*200;
	return x**2;
	//return x;
}

function f_x(y){
	return 0;
}

/*
	REDRAW GRAPHICS ON THE SCREEN
*/
const camera = {
	x: 0, y: 0,
	zoom: .5,//.2,
}

function drawGraphics(){
	/// Clears and draw the coordinate origins
	CTX.clearRect(0, 0, WIDTH, HEIGHT);
	CTX.fillStyle = "#888";
	CTX.fillRect(0, HEIGHT/2-1 - camera.y, WIDTH, 2);
	CTX.fillRect(WIDTH/2-1 - camera.x, 0, 2, HEIGHT);
	
	/// Draw the calculated graphics
	CTX.lineWidth = 4;
	CTX.lineCap = "round";
	CTX.beginPath();
	CTX.moveTo(NaN, NaN);
	for(var i=0; i<=WIDTH; i+=2){
		var x = i-WIDTH/2 + camera.x;
		
		// Formula calculation
		var y = (f_y(x*camera.zoom))/camera.zoom + camera.y;
		//console.log(x+" = "+y);
		
		if(y && Math.abs(y)!=Infinity){
			// Line Drawing
			var tx = i;
			var ty = y+WIDTH/2;
			CTX.lineTo(tx, -ty+HEIGHT);
		}
		else{
			CTX.stroke();
			CTX.beginPath();
			CTX.moveTo(NaN, NaN);
		}
	}
	CTX.stroke();
}

drawGraphics();


/**
	MOUSE WHEEL EVENT
*/

window.onmousedown = window.onmousewheel = function(ev){
	var x = ev.offsetX;
	var y = ev.offsetY;
	
	var ox = (x-WIDTH/2)/(WIDTH/2);
	var oy = (y-HEIGHT/2)/(HEIGHT/2);
	console.log(ox+", "+oy);
	var px = camera.x + (WIDTH/2)*ox;
	var py = camera.y + (HEIGHT/2)*oy;
	console.log(px+", "+py);
	
	if(ev.deltaY>0){
		camera.zoom *= 1.1;
	}
	else if(ev.deltaY<0){
		camera.zoom *= 0.9;
	}
	
	//camera.x = px + ox*(WIDTH/2)*camera.zoom;
	//camera.y = py + oy*(HEIGHT/2)*camera.zoom;
	//camera.x = px;
	//camera.y = py;
	
	drawGraphics();
}

window.onkeydown = function(ev){
	switch(ev.key){
		case 'ArrowLeft':
		case 'a':{
			camera.x -= /*camera.zoom*/50;
		}
		break;
		case 'ArrowUp':
		case 'w':{
			camera.y -= /*camera.zoom*/50;
		}
		break;
		case 'ArrowRight':
		case 'd':{
			camera.x += /*camera.zoom*/50;
		}
		break;
		case 'ArrowDown':
		case 's':{
			camera.y += /*camera.zoom*/50;
		}
		break;
	}
	console.log(camera.x+", "+camera.y);
	drawGraphics();
}
