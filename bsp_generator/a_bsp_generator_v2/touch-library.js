var TouchUI = function(element){
	this.touches_obj = [newTouch(0), newTouch(1), newTouch(2), newTouch(3)];
	var self = this;
	function updateTouches(){
		
	}
	function updateTouch(index, event, hold){
		var t = self.touches_obj[index];
		if(hold){
			if(t.holding){
				t.x = event.clientX;
				t.y = event.clientY;
			}else{
				t.x = event.clientX;
				t.y = event.clientY;
				t.oldX = t.x;
				t.oldY = t.y;
			}
		}else{
			if(t.holding){
				t.motionX = t.motionY = 0;
				t.moving = false;
			}else{
				
			}
		}
		t.holding = hold;
	}
	function _update(){
		for(var i=0; i<4; i++){
			var t = self.touches_obj[i];
			if(t.holding){
				t.motionX = t.x-t.oldX;
				t.motionY = t.y-t.oldY;
				t.moving = t.motionX!=0||t.motionY!=0;
				t.oldX = t.x;
				t.oldY = t.y;
			}
		}
	}
	this.update = _update;
	
	function newTouch(index){
		return {
			"moving": false,
			"x": 0, "y": 0,
			"oldX": 0, "oldY": 0,
			"motionX": 0, "motionY": 0,
			"holding": false,
		};
	}
	element.ontouchstart = function(ev){
		for(var i=0; i<ev.touches.length;i++){
			//dbg.innerHTML = ev.touches[i].identifier;
			updateTouch(ev.touches[i].identifier, ev.touches[i], true)
		}
	}
	element.onmousedown = function(ev){
		updateTouch(0, ev, true)
		alert();
	}
	element.ontouchend = function(ev){
		var holding = []
		for(var i=0; i<ev.touches.length;i++){
			holding.push(ev.touches[i].identifier);
		}
		for(var t=0; t<4; t++){
			if(holding[0]!=t&&holding[1]!=t&&holding[2]!=t&&holding[3]!=t)
				updateTouch(t, ev.touches[t], false)
		}
	}
	element.onmouseup = function(ev){
		updateTouch(0, ev, false);
	}
	element.ontouchmove = function(ev){
		for(var i=0; i<ev.touches.length;i++){
			updateTouch(ev.touches[i].identifier, ev.touches[i], true)
		}
	}
}