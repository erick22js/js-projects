var TouchUI = function(element, mx=1, my=1){
	this.touches_obj = [newTouch(0), newTouch(1), newTouch(2), newTouch(3)];
	this.box = element.getBoundingClientRect();
	var self = this;
	function updateTouch(index, event, hold){
		var t = self.touches_obj[index];
		var box = element.getBoundingClientRect();
		//event.clientX -= self.box.left;
		//event.clientY -= self.box.top;
		if(hold){
			if(t.holding){
				t.x = ((event.clientX-self.box.left)/box.width)*mx;
				t.y = ((event.clientY-self.box.top)/box.height)*my;
			}else{
				t.x = ((event.clientX-self.box.left)/box.width)*mx;
				t.y = ((event.clientY-self.box.top)/box.height)*my;
				t.oldX = t.x;
				t.oldY = t.y;
				t.motionX = t.motionY = 0;
			}
		}else{
			if(t.holding){
				t.moving = false;
				//t.motionX = t.motionY = 0;
				//t.oldX = t.x; t.oldY = t.y;
			}else{
				
			}
		}
		t.holding = hold;
	}
	function _update(){
		for(var i=0; i<4; i++){
			var t = self.touches_obj[i];
			if(t.holding){
				t.moving = t.motionX!=0||t.motionY!=0;
				//t.oldX = t.x;
				//t.oldY = t.y;
			}
			t.tapped = (!t.ta&&t.holding);
			t.ta = t.holding;
			t.released = (!t.re&&!t.holding);
			t.re = !t.holding;
			self.onUpdate(t);
		}
	}
	this.update = _update;
	this.onUpdate = function(tobj){};
	this.ontouchstart = function(){};
	this.ontouchend = function(){};
	this.ontouchmove = function(){};
	this.ontouchcancel = function(){};
	
	function newTouch(index){
		return {
		"motionX": 0, "motionY": 0,
			"index": index,
			"moving": false,
			"ta": false,
			"tapped": false,
			"re": false,
			"released": false,
			"holding": false,
			"x": 0, "y": 0,
			"oldX": 0, "oldY": 0,
		};
	}
	function _init(){
		self.box = element.getBoundingClientRect();
	}
	this.init = _init;
	/*element.onload = function(){
		self.box = element.getBoundingClientRect();
	}*/
	this.resetMotion = function(t){/*
		var t = self.touches_obj[i];
		t.motionX = t.motionY = 0;
		t.oldX = t.x; t.oldY = t.y;*/
	}
	this.resetAllMotion = function(){
		var t = self.touches_obj[0];
		t.motionX = t.motionY = 0;
		//t.oldX = t.x; t.oldY = t.y;
		t = self.touches_obj[1];
		t.motionX = t.motionY = 0;
		//t.oldX = t.x; t.oldY = t.y;
		t = self.touches_obj[2];
		t.motionX = t.motionY = 0;
		//t.oldX = t.x; t.oldY = t.y;
		t = self.touches_obj[3];
		t.motionX = t.motionY = 0;
		//t.oldX = t.x; t.oldY = t.y;
	}
	element.ontouchstart = function(ev){
		//alert("tstart");
		for(var i=0; i<ev.touches.length;i++){
			//dbg.innerHTML = ev.touches[i].identifier;
			updateTouch(ev.touches[i].identifier, ev.touches[i], true)
		}
		self.ontouchstart(ev, element.getBoundingClientRect());
	}
	element.ontouchend = function(ev){
		//alert("tend");
		var holding = []
		for(var i=0; i<ev.touches.length;i++){
			holding.push(ev.touches[i].identifier);
		}
		for(var t=0; t<4; t++){
			if(holding[0]!=t&&holding[1]!=t&&holding[2]!=t&&holding[3]!=t)
				updateTouch(t, ev.touches[t], false)
		}
		self.ontouchend(ev, element.getBoundingClientRect());
	}
	element.ontouchmove = function(ev){
		//alert("tmove");
		for(var i=0; i<ev.touches.length;i++){
			var t = self.touches_obj[ev.touches[i].identifier];
			updateTouch(ev.touches[i].identifier, ev.touches[i], true)
			mvs = t.x;
			t.motionX = t.x-t.oldX;
			t.motionY = t.y-t.oldY;
			t.oldX = t.x; t.oldY = t.y;
		}
		self.ontouchmove(ev, element.getBoundingClientRect());
	}
	element.ontouchcancel = new function(ev){
		self.ontouchcancel(ev, element.getBoundingClientRect());
	}
}