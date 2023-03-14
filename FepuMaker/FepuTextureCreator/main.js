const ctxE = editLayer.getContext("2d");
ctxE.imageSmoothingEnabled = false;
ctxE.translate(176, 128);
const touch = new TouchUI(editLayer, 352, 256);

const WIDTH = 352;
const HEIGHT = 256;

var canvas = document.createElement("canvas");
canvas.style.imageRendering = "pixelated";
var ctx = canvas.getContext("2d");
//Preload image
canvas.width = 32;
canvas.height = 32;
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 1000, 1000);

//*********************************************
//Backing transparent background
var bkc = document.createElement("canvas");
bkc.width = WIDTH; bkc.height = HEIGHT;
var cbk = bkc.getContext("2d");
cbk.fillStyle = "#ddd";
cbk.fillRect(0, 0, WIDTH, HEIGHT);
cbk.fillStyle = "#777";
const BKG = 16;
for(var y=0; y<HEIGHT; y+=BKG){
	for(var x=y%(BKG*2); x<WIDTH; x+=BKG*2){
		cbk.fillRect(x, y, BKG, BKG);
	}
}
//*********************************************

const Tr = {
	x: 0,
	y: 0,
	zoom: 1,
	zooml: 0,
	zoomdist: 0,
	
	gap: 16,
	colorPen: "#ff0000",
	sizePen: 1,
	pixMode: false,
	
	actionMode: null,
}

function Redraw(){
	ctxE.fillStyle = "#555";
	ctxE.fillRect(-176, -128, 352, 256);
	var vtr = editorToView([0, 0]);
	ctxE.drawImage(bkc, ~~(vtr[0]+WIDTH*.5), ~~(vtr[1]+HEIGHT*.5), ~~(32*Tr.zoom), ~~(32*Tr.zoom), ~~vtr[0], ~~vtr[1], ~~(32*Tr.zoom), ~~(32*Tr.zoom));
	ctxE.save();
	ctxE.scale(Tr.zoom, Tr.zoom);
	ctxE.translate(Tr.x, Tr.y);
	ctxE.drawImage(canvas, 0, 0);
	ctxE.restore();
}

Redraw();

/*	@Interactions
*/


touch.ontouchstart = function(ev, box){
	editSection("down", ev, box);
}
touch.ontouchend = function(ev, box){
	editSection("up", ev, box);
}
touch.ontouchmove = function(ev, box){
	editSection("drag", ev, box);
}
function editSection(gest, ev, box){
	var t0 = touch.touches_obj[0];
	var t1 = touch.touches_obj[1];
	switch(Tr.actionMode){
		case "move":{
				/*if(gest=="up"&&t0.holdTime<MINHOLDTIME){
					var t = touchToEditor(t0.x, t0.y, .0625);
					selectElement(
						Tr.structMode=="vertex"? nearestVertex(t[0], t[1])[0]:
						Tr.structMode=="line"? nearestLine(t[0], t[1])[0]:
						Tr.structMode=="polygon"? pickPolygon(t):
						Tr.structMode=="thing"?nearestThing(t[0], t[1])[0]:
						null
						);
				}else if(gest=="up"){
					Tr.acumx = 0;
					Tr.acumy = 0;
				}else if(gest=="drag"){
					var gap = Tr.gap*.25;
					Tr.acumx += t0.motionX/Tr.zoom;
					Tr.acumy += t0.motionY/Tr.zoom;
					translateSelecteds(~~(Tr.acumx/gap)*gap, ~~(Tr.acumy/gap)*gap);
					Tr.acumx %= gap;
					Tr.acumy %= gap;
				}*/
			}
			break;
		case "hand":{
				if(gest=="down"&&t0.holding&&t1.holding){
					Tr.zoomdist = Math.distance(t0.x, t0.y, t1.x, t1.y);
					//Tr.zoomb++;
				}if(t0.holding&&t1.holding){
					var dist = Math.distance(t0.x, t0.y, t1.x, t1.y);
					var div = dist/Tr.zoomdist;
					Tr.zoomdist *= div;
					Tr.zooml += Math.log(div);
					Tr.zoom = Math.pow(2, Tr.zooml);
					Tr.gap = 32/Math.pow(2, ~~Tr.zooml);
				}else{
					Tr.x += t0.motionX/Tr.zoom;
					Tr.y += t0.motionY/Tr.zoom;
				}
			}
			break;
		default:{
				pencilActing(gest, ev, box);
			}
			break;
	}
	Redraw();
}
function pencilActing(gest, ev, box){
	var tc = touch.touches_obj[0];
	var tr = touchToEditor(tc.x, tc.y, .5);
	ctx.fillStyle = Tr.colorPen;
	var x = tr[0]-(Tr.sizePen*.5)+.5;
	x = Tr.pixMode?~~x:x;
	var y = tr[1]-(Tr.sizePen*.5)+.5;
	y = Tr.pixMode?~~y:y;
	switch(Tr.actionMode){
		case "pencil":{
				ctx.fillRect(x, y, Tr.sizePen, Tr.sizePen);
			}
			break;
		case "eraser":{
				ctx.clearRect(x, y, Tr.sizePen, Tr.sizePen);
			}
			break;
		case "picker":{
				if(gest=="down"){
					var data = ctx.getImageData(~~x, ~~y, 1, 1);
					var c = "rgb("+data.data[0]+","+data.data[1]+","+data.data[2]+")";
					//alert(c);
					var ccode = pickColor(c, function(e){
						paletteP.style.backgroundColor = e;
						Tr.colorPen = e;
						}, true);
					//ic_penc.click();
				}
			}
			break;
		case "polygon":{
				//if(gest=="down")
				//	generatePolygon(tr[0], tr[1]);
			}
			break;
		case "thing":{
				//if(gest=="down")
				//	createThing(tr[0], tr[1])
			}
			break;
	}
}

//Ui Actions
function clearIcAction(){
	ic_hand.style.border = "0px solid red";
	ic_move.style.border = "0px solid red";
	ic_penc.style.border = "0px solid red";
	ic_ersr.style.border = "0px solid red";
	ic_pick.style.border = "0px solid red";
	ic_slct.style.border = "0px solid red";
}
function setAction(ic, action){
	clearIcAction();
	ic.style.border = "4px inset red";
	Tr.actionMode = action;
	Redraw();
}
function togglePixelPrecision(){
	Tr.pixMode = !Tr.pixMode;
	if(Tr.pixMode){
		ic_pxat.style.border = "4px inset red";
	}else{
		ic_pxat.style.border = "0px solid red";
	}
}
ic_pxat.click();

function setBrushSize(size){
	Tr.sizePen = size;
}

ic_hand.click();

function SaveImage(){
	alert('hi');
	var data = ctx.getImageData(0, 0, 32, 32).data;
	alert(data);
	var dt = [];
	for(var i=0; i<data.length; i++)
		dt.push(data[i]);
	IO.writeImagePixels('/sdcard/ime.png', new Uint8Array(dt), 32, 32);
	IO.writeBinaryFile('/sdcard/ime.bin', 
			new Uint8Array(dt));
}


/*	@Math
*/
function touchToEditor(x, y, subgrid){
	var tr = [x, y];
	tr[0] -= WIDTH*.5;
	tr[1] -= HEIGHT*.5;
	tr = [tr[0]/Tr.zoom-Tr.x, tr[1]/Tr.zoom-Tr.y];
	return [tr[0], tr[1]];
}
function editorToView(p){
	return [(p[0]+Tr.x)*Tr.zoom, (p[1]+Tr.y)*Tr.zoom];
}
Math.distance = function(x1, y1, x2, y2){
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}
Math.distanceDiag = function(x1, y1, x2, y2){
	return (x2-x1)+(y2-y1);
}
Math.angle = function(x1, y1, x2, y2){
	return Math.atan2((y2-y1),(x2-x1));
}
Math.intersection = function(l1, l2){
	/*
	 * y1+dx*a1 = py+dx*a2
	 * y1-py = (dx*a2)-(dx*a1)
	 * (y1-py)/dx = a2-a1
	 * (y1-py)/(a2-a1) = dx
	 *
	*/
	var a1 = (l1.v2.y-l1.v1.y)/(l1.v2.x-l1.v1.x);
	var a2 = (l2.v2.y-l2.v1.y)/(l2.v2.x-l2.v1.x);
	var py = l2.v1.y+(l2.v1.x-l1.v1.x)*a2;
	var addx = (l1.v1.y-py)/(a2-a1);
	
	return [l1.v1.x+addx, l1.v1.y+addx*a1];
};

