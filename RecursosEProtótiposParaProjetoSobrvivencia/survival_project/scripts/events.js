
var isInputEvent = false;

var uionclick = [];
var uionup = [];
var draggableelements = [];
function executeEvent(eventList, hx, hy){
	for(var e=0; e<eventList.length; e++){
		if(hasActiveUi(eventList[e].father)){
			if(hx>=eventList[e].box[0]&&hx<=eventList[e].box[2]&&hy>=eventList[e].box[1]&&hy<=eventList[e].box[3]){
				if(eventList[e].event)eventList[e].event(eventList[e].i)
			}
		}
	}
}

function ondrag(hx, hy){
	for(var e=draggableelements.length-1; e>-1; e--){
		if(hasActiveUi(draggableelements[e].father)){
			var box = [draggableelements[e].element.x, draggableelements[e].element.y, draggableelements[e].element.x+draggableelements[e].element.width, draggableelements[e].element.y+draggableelements[e].element.height];
			if(hx>=box[0]&&hx<=box[2]&&hy>=box[1]&&hy<=box[3]&&!draggableelements[e].element.dragging){
				draggableelements[e].element.dragging = true;
				if(draggableelements[e].element.ondrag) draggableelements[e].element.ondrag()
				return;
			}
		}
	}
}
function isDragging(hx, hy){
	for(var e=0; e<draggableelements.length; e++){
		if(draggableelements[e].element.dragging){
			draggableelements[e].element.x = hx-draggableelements[e].element.width*.5;
			draggableelements[e].element.y = hy-draggableelements[e].element.height*.5;
			if(draggableelements[e].element.ondragging) draggableelements[e].element.ondragging()
		}
	}
}
function ondrop(){
	for(var e=0; e<draggableelements.length; e++){
		if(hasActiveUi(draggableelements[e].father)){
			draggableelements[e].element.dragging = false;
			if(draggableelements[e].element.ondrop) draggableelements[e].element.ondrop();
		}
	}
}

screen.onmousedown = function(ev){
	var x = ev.clientX/1.875;
	var y = ev.clientY/1.875;
	isInputEvent = true;
	executeEvent(uionclick, x, y);
	ondrag(x, y);
}
screen.ontouchdown = function(ev){
	var x = ev.touches[ev.touches.length].clientX/1.875;
	var y = ev.touches[ev.touches.length].clientY/1.875;
	isInputEvent = true;
	executeEvent(uionclick, x, y);
	ondrag(x, y);
}
screen.onmousemove = function(ev){
	var x = ev.clientX/1.875;
	var y = ev.clientY/1.875;
	if(isInputEvent){
		isDragging(x, y);
	}
}
screen.ontouchmove = function(ev){
	var x = ev.touches[ev.touches.length].clientX/1.875;
	var y = ev.touches[ev.touches.length].clientY/1.875;
	isDragging(x, y);
}

window.onmouseup = function(ev){
	var x = ev.clientX/1.875;
	var y = ev.clientY/1.875;
	isInputEvent = false;
	executeEvent(uionup, x, y);
	ondrop();
}
window.ontouchup = function(ev){
	var x = ev.touches[ev.touches.length].clientX/1.875;
	var y = ev.touches[ev.touches.length].clientY/1.875;
	isInputEvent = false;
	executeEvent(uionup, x, y);
	ondrop();
}