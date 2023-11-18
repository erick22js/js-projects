const DCTX = display.getContext("2d");
const DWIDTH = Number(display.width);
const DHEIGHT = Number(display.height);


/**
	@ APPLICATION PROGRAM INTERFACE
*/

var Api = {
	view: {
		x: 0,
		y: 0,
		zoom: 1,
	},
	grid: 16,
};

function DW_tr_(view){
	DCTX.save();
	DCTX.scale(view.zoom, view.zoom);
	DCTX.translate(-view.x, -view.y);
}

function DW_utr_(){
	DCTX.restore();
}

function DW_clear(){
	DCTX.fillStyle = "#555";
	DCTX.fillRect(0, 0, DWIDTH, DHEIGHT);
	
	DCTX.fillStyle = "#fff";
	
	DW_tr_(Api.view);
	
	var grid = Api.grid;
	var wid = 1024;
	var hei = 1024;
	
	for(var i=0; i<=hei; i+=grid){
		DCTX.fillRect(-1, i-1, wid, 1);
	}
	
	for(var i=0; i<=wid; i+=grid){
		DCTX.fillRect(i-1, -1, 1, hei);
	}
	
	DW_utr_();
}

function DW_drawBlock(block){
	DW_tr_(block);
	
	
	
	DW_utr_();
}


/**
	@ WORKING COMPONENTS
*/

function WC_update(dt){
	
}


/**
	@ INTERNAL MODULES
*/

var App = {
	keysmap: {},
	mouse: {
		x: 0,
		y: 0,
		hold: false
	},
	
	running: true,
	
	start: function(){},
	update: function(dt){},
	
	onKeyDown: function(key){},
	onKeyUp: function(key){},
	onMouseMove: function(x, y){},
	onMouseDown: function(x, y){},
	onMouseUp: function(x, y){},
	onMouseDrag: function(dx, dy, x, y){},
	
	_lastTime: 0,
};

function _End(){
	App.running = false;
}

function _Animate(time){
	if(!App.running){
		return;
	}
	var dt = (time-App._lastTime)/1000;
	App._lastTime = time;
	WC_update(dt);
	App.update(dt);
	requestAnimationFrame(_Animate);
}

window.onload = function(){
	App.running = true;
	App.start();
	_Animate(0);
}

window.onkeydown = function(ev){
	App.keysmap[ev.key] = true;
	App.onKeyDown(ev.key);
}

window.onkeyup = function(ev){
	App.keysmap[ev.key] = false;
	App.onKeyUp(ev.key);
}

display.onmousedown = function(ev){
	App.mouse.x = ev.offsetX;
	App.mouse.y = ev.offsetY;
	App.mouse.hold = true;
	App.onMouseDown(App.mouse.x, App.mouse.y);
}

display.onmouseup = function(ev){
	App.mouse.x = ev.offsetX;
	App.mouse.y = ev.offsetY;
	App.mouse.hold = false;
	App.onMouseUp(App.mouse.x, App.mouse.y);
}

display.onmousemove = function(ev){
	var dx = ev.offsetX-App.mouse.x;
	var dy = ev.offsetY-App.mouse.y;
	App.mouse.x = ev.offsetX;
	App.mouse.y = ev.offsetY;
	App.onMouseMove(App.mouse.x, App.mouse.y);
	if(App.mouse.hold){
		App.onMouseDrag(dx, dy, App.mouse.x, App.mouse.y);
	}
}
