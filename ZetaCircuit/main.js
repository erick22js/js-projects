

App.start = function(){
	
}

var rt = 0;

App.update = function(dt){
	DW_clear();
	
	// Stops execution after 10 seconds
	rt += dt;
	if(rt>10){
		_End();
	}
	
	if(App.keysmap["="]){
		//console.log("zoom in");
		Api.view.zoom *= 1.05;
	}
	if(App.keysmap["-"]){
		//console.log("zoom out");
		Api.view.zoom /= 1.05;
	}
	
}

App.onMouseDrag = function(dx, dy, x, y){
	Api.view.x -= dx/Api.view.zoom;
	Api.view.y -= dy/Api.view.zoom;
}
