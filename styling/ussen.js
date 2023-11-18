window.addEventListener("load",function(){
	console.log("USSEN INTERFACE!");
	var rects = document.getElementsByTagName("rect");
	for(var r=0; r<rects.length; r++){
		rects[r].style.position = "absolute";
		rects[r].style.backgroundColor = rects[r].getAttribute("color")||"black";
		rects[r].style.width = (rects[r].getAttribute("width")||50)+"%";
		rects[r].style.height = (rects[r].getAttribute("height")||50)+"%";
		rects[r].style.left = (rects[r].getAttribute("x")||0)+"%";
		rects[r].style.top = (rects[r].getAttribute("y")||0)+"%";
	}
});

