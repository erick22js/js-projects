const Animate = new function(){
	const ctxCv = stylusCv.getContext("2d");
	const ctxTl = stylusTl.getContext("2d");
	this.ctx = ctxCv;
	
	const cWIDTH = Number(stylusCv.width);
	const cHEIGHT = Number(stylusCv.height);
	const tWIDTH = Number(stylusTl.width);
	const tHEIGHT = Number(stylusTl.height);
	
	const tCv = new TouchUI(stylusCv, cWIDTH*2, cHEIGHT*2);
	const tTl = new TouchUI(stylusTl, tWIDTH*2, tHEIGHT*2);
	
	const Srcs = {
		
	}
	const Objs = [
		{
			type: "rect",
			name: "box",
			offset: {
				x: 0,
				y: 0
			},
			transform: [
				1, 0,
				0, 1,
				0, 0,
			],
			values: {
				width: 100,
				height: 100,
				fillStyle: "red",
			},
			childs: []
		}
	];
	this.obj = Objs;
	
	const Tr = {
		x: 0,
		y: 0,
		zoom: 1,
		zooma: 0,
		timex: 0,
		timey: 0,
		stime: -11,
		stimeadd: -2,
	}
	
	const Keys = {
		shift: 0,
		ctrl: 0,
		alt: 0,
		tab: 0,
	}
	
	function redraw(){
		ctxCv.fillStyle = "#cfc";
		ctxCv.fillRect(0, 0, cWIDTH, cHEIGHT);
		ctxCv.save();
		ctxCv.translate(cWIDTH*.5, cHEIGHT*.5);
		ctxCv.scale(Tr.zoom, Tr.zoom);
		ctxCv.translate(Tr.x, Tr.y);
		drawGrid();
		for(var i=0; i<Objs.length; i++){
			drawElement(Objs[i]);
		}
		ctxCv.restore();
		drawElemGui();
		//Tr.x++;
	}
	
	function drawGrid(){
		ctxCv.fillStyle = "black";
		var divzoom = 1/Tr.zoom;
		//Draw main crosses
		ctxCv.fillRect(-1*divzoom, (-cHEIGHT*.5)*divzoom-Tr.y, divzoom*2.5, cHEIGHT*divzoom);
		ctxCv.fillRect((-cWIDTH*.5)*divzoom-Tr.x, -1*divzoom, cWIDTH*divzoom, divzoom*2.5);
		//Draw grid
		var gap = 100;
		for(var x=-(~~((cWIDTH*.5*divzoom+Math.abs(Tr.x))/gap)*gap); x<(cWIDTH*.5*divzoom+Math.abs(Tr.x)); x+=gap){
			ctxCv.fillRect(x, (-cHEIGHT*.5)*divzoom-Tr.y, divzoom, cHEIGHT*divzoom);
		}
		for(var y=-(~~((cHEIGHT*.5*divzoom+Math.abs(Tr.y))/gap)*gap); y<(cHEIGHT*.5*divzoom+Math.abs(Tr.y)); y+=gap){
			ctxCv.fillRect((-cWIDTH*.5)*divzoom-Tr.x, y, cWIDTH*divzoom, divzoom);
		}
	}
	
	function drawElement(obj){
		ctxCv.save();
		ctxCv.transform(
			obj.transform[0], obj.transform[1], 
			obj.transform[2], obj.transform[3], 
			obj.transform[4], obj.transform[5]
		);
		ctxCv.shadowColor = "black";
		ctxCv.shadowBlur = 20;
		ctxCv.shadowOffsetX = ctxCv.shadowOffsetY = Tr.stime;
		switch(obj.type){
			case "rect":{
				ctxCv.fillStyle = obj.values.fillStyle||"white";
				ctxCv.fillRect(obj.offset.x, obj.offset.y, obj.values.width, obj.values.height);
			}
		}
		ctxCv.shadowColor = "rgba(0,0,0,0)";
		ctxCv.restore();
	}
	
	function drawElemGui(elem){
		ctxCv.lineWidth = 4;
		ctxCv.strokeStyle = "red";
		ctxCv.moveTo();
		ctxCv.lineTo();
		ctxCv.stroke();
		ctxCv.strokeStyle = "blue";
	}
	
	tCv.ontouchmove = function(){
	}
	tCv.onmousewheel = function(ev, dt, box){
		ev.preventDefault();
		dt.y *= -1;
		var vector = [Keys.ctrl, Keys.shift];
		Tr.x += dt.y*32*vector[0]/Tr.zoom;
		Tr.y += dt.y*32*vector[1]/Tr.zoom;
		if(!(Keys.ctrl||Keys.shift)){
			Tr.zooma += dt.y;
			Tr.zoom = Math.pow(1.25, Tr.zooma);//Math.pow(1.5, dt.y);
		}
		//return false;
	}
	window.onkeydown = function(ev){
		ev.preventDefault();
		switch(ev.key){
			case "Control":
				Keys.ctrl = 1;
				break;
			case "Shift":
				Keys.shift = 1;
				break;
			case "Alt":
				Keys.alt = 1;
				break;
			case "Tab":
				Keys.tab = 1;
				break;
		}
		//return false;
	}
	window.onkeyup = function(ev){
		ev.preventDefault();
		switch(ev.key){
			case "Control":
				Keys.ctrl = 0;
				break;
			case "Shift":
				Keys.shift = 0;
				break;
			case "Alt":
				Keys.alt = 0;
				break;
			case "Tab":
				Keys.tab = 0;
				break;
		}
		//return false;
	}
	
	function Update(dt=0){
		tCv.update();
		tTl.update();
		Tr.stimeadd = Tr.stime<-10?-Tr.stimeadd:Tr.stime>10?-Tr.stimeadd:Tr.stimeadd;
		Tr.stime += Tr.stimeadd;
		
		redraw();
		tCv.resetAllMotion();
		tTl.resetAllMotion();
		requestAnimationFrame(Update);
	}
	function Start(){
		Update();
	}
	Start();
}