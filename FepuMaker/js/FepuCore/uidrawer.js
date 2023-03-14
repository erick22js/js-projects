const controls = {
	activeTouches: [null, null],
	move:{
		active: false,
		touch: 0,
		x: 0,
		y: 0,
		xo: -96,
		yo: -96,
		angle: 0,
		distance: 0,
	},
	look: {
		active: false,
		touch: 0,
		mx: 0,
		my: 0,
	}
}
const touchui = new TouchUI(UI, 800, 480);

touchui.ontouchmove = function(e, box){
	mv = true;
	//mvs = e;
};
var mv = false;
var mvs = null;

function updateControls(){
	touchui.update();
	/*ctx.globalAlpha = 1;
	ctx.fillStyle = "black";
	ctx.font = "13px Arial";
	ctx.fillText(JSON.stringify(touchui.touches_obj[0]), 0, 40);
	ctx.fillText(JSON.stringify(touchui.touches_obj[1]), 0, 60);
	ctx.fillText(JSON.stringify(controls.move), 0, 80);
	ctx.fillText(JSON.stringify(controls.look), 0, 100);
	*/
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#222";
	ctx.fillRect(controls.move.xo-48, controls.move.yo-48, 96, 96);
	
	ctx.fillStyle = mv?"red":"black";
	ctx.fillRect(0, 120, 32, 32);
	if(mv)
		ctx.fillText(JSON.stringify(mvs), 0, 120);
	mv = false;
	
	//Checks for touchs inits
	for(var i=0; i<4; i++){
		touchRegionAction(touchui.touches_obj[i], i);
	}
	touchui.resetAllMotion();
}

function touchRegionAction(t, index){
	if(t.tapped){
		if(touchInRegion(t, 0, 180, 300, 300)&&!controls.move.active){
			controls.move.touch = index;
			controls.move.active = true;
			controls.move.xo = t.x;
			controls.move.yo = t.y;
			controls.activeTouches[index] = "move";
		}else if(touchInRegion(t, 500, 180, 300, 300)&&!controls.look.active){
			controls.look.touch = index;
			controls.look.active = true;
			controls.activeTouches[index] = "look";
		}
	}else if(t.released){
		if(controls.activeTouches[index]=="move"){
			controls.move.active = false;
			controls.move.xo = -96;
			controls.move.yo = -96;
		}else if(controls.activeTouches[index]=="look"){
			controls.look.active = false;
			controls.look.mx = controls.look.my = 0;
		}
		controls.activeTouches[index] = null;
	}else if(t.holding){
		if(controls.activeTouches[index]=="move"){
			controls.move.x = (t.x-controls.move.xo)/150;
			controls.move.y = -(t.y-controls.move.yo)/150;
			controls.move.distance = Math.radial(controls.move.x, controls.move.y);
			if(controls.move.x!=0&&controls.move.y!=0)
				controls.move.angle = Math.direction(controls.move.x, controls.move.y);
		}
		if(controls.activeTouches[index]=="look"){
			controls.look.mx = (t.motionX)/150;
			controls.look.my = (t.motionY)/150;
		}
	}
}

function touchInRegion(touch, x, y, w, h){
	return (touch.x >= x)&&(touch.x <= x+w)&&
			(touch.y >= y)&&(touch.y <= y+h);
}

function renderUi(){
	//ctx.clearRect(0, 0, 800, 480);
	updateControls();
	ctx.fillStyle = "#444";
	ctx.globalAlpha = 0.5;
	ctx.fillRect(0, 180, 300, 300);
	ctx.fillRect(500, 180, 300, 300);
	//console.log("ui");
}