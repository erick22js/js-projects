var cv = document.getElementById("cv");
var ctx = cv.getContext("2d");
var cvH = document.getElementById("cvH");
var ctxH = cvH.getContext("2d");
var dbg = document.getElementById("dbg");

const NGSIZE = 16;
var GRID_SIZE = 16;
var xM = 0;
var yM = 0;
var Zoom = 1;

var setZoom = [2]; var indZoom = 0;

var mode = "draw";
var component = "vertex";
var selectedC = "vertex";
var selectedI = null;
var sectorI = 0;

var cameraOrientation = "vertical";

var mapName = localStorage.getItem("~~MaPnAmE¹?!");
if(mapName){
	5;//loadMap(mapName);
}
else
	mapName = "myMap";


var vertex = [];
var lines = [];
var sectors = [];
//dataGame.texturesWall
//dataGame.texturesFlat
//dataGame.sprites
var dataGame = {
	maps: {}, texturesWall: [], texturesFlat: [], sprites: {}
};


var toX = (x) => ~~((((x) / Zoom) + (GRID_SIZE * .25 / Zoom)) / (GRID_SIZE / Zoom)) * (GRID_SIZE / Zoom) + xM;//((~~((x + GRID_SIZE / Zoom * .25) / (GRID_SIZE))) * (GRID_SIZE) )/Zoom+ xM;
var toY = (y) => ~~((((y) / Zoom) + (GRID_SIZE * .25 / Zoom)) / (GRID_SIZE / Zoom)) * (GRID_SIZE / Zoom) + yM;//((~~((y + GRID_SIZE / Zoom * .25) / (GRID_SIZE))) * (GRID_SIZE)) / Zoom + yM;

var drawToX = (x) => (x - xM) * Zoom;//toX(x) - 2 * xM;
var drawToY = (y) => (y - yM) * Zoom;//toY(y) - 2 * yM;


var polygonMaskSelect = 0;
var addPLM = 1;
function updtPolygonMask() {
	polygonMaskSelect += addPLM * .1;
	if ((addPLM > 0 && polygonMaskSelect > 1) || (addPLM < 0 && polygonMaskSelect < 0)) addPLM = -addPLM;
	redraw();
	setTimeout(updtPolygonMask, 50);
}
updtPolygonMask();

//Draw map
function redraw(){
	ctx.clearRect(0, 0, 512, 512);
	ctxH.clearRect(0, 0, 256, 512);

	//Draw Sectors
	for(var s in sectors){
		ctx.fillStyle = sectorToHue(s) +"100%,80%,1)";
		ctx.beginPath();
		if(sectors[s].vertex.length>0)
		ctx.moveTo(
			drawToX(sectors[s].vertex[0].x)//sectors[s].vertex[0].x * Zoom - xM
			, drawToY(sectors[s].vertex[0].y)//sectors[s].vertex[0].y * Zoom - yM
		);
		for(var v=1;v<sectors[s].vertex.length;v++){
			ctx.lineTo(
				drawToX(sectors[s].vertex[v].x)//sectors[s].vertex[v].x * Zoom - xM
				, drawToY(sectors[s].vertex[v].y)//sectors[s].vertex[v].y * Zoom - yM
			);
		}
		ctx.fill();
		ctx.fillStyle = selectedI + "" == s && component == "sector" ? "rgba(0,0,0," + polygonMaskSelect + ")" : "rgba(0,0,0,0)";
		ctx.beginPath();
		if(sectors[s].vertex.length>0)
		ctx.moveTo(
			drawToX(sectors[s].vertex[0].x)//sectors[s].vertex[0].x * Zoom - xM
			, drawToY(sectors[s].vertex[0].y)//sectors[s].vertex[0].y * Zoom - yM
		);
		for (var v = 1; v < sectors[s].vertex.length; v++) {
			ctx.lineTo(
				drawToX(sectors[s].vertex[v].x)//sectors[s].vertex[v].x * Zoom - xM
				, drawToY(sectors[s].vertex[v].y)//sectors[s].vertex[v].y * Zoom - yM
			);
		}
		ctx.fill();
	}


	//drawGrid on canvas
	ctx.fillStyle = "black";
	for (var x = 0; x <= 512; x += GRID_SIZE)
		ctx.fillRect(x, 0, .5, 512);
	for (var y = 0; y <= 512; y += GRID_SIZE)
		ctx.fillRect(0, y, 512, .5);
	var length_index = (Math.log2(Zoom) % 3);
	var size = Math.pow(2, length_index<0?3-Math.abs(length_index):length_index);
	ctx.fillStyle = "black";
	for (var x = 0; x <= 512; x += (GRID_SIZE * 2) * size)
		ctx.fillRect(x - 1, 0, 1, 512);
	for (var y = 0; y <= 512; y += (GRID_SIZE * 2) * size)
		ctx.fillRect(0, y - 1, 512, 1);


	//drawGrid on previsualize
	ctxH.fillStyle = "black";
	for (var x = 0; x <= 256; x += GRID_SIZE)
		ctxH.fillRect(x, 0, .5, 512);
	for (var y = 0; y <= 512; y += GRID_SIZE)
		ctxH.fillRect(0, y, 512, .5);
	ctxH.fillRect(0, 254.75, 512, 2.5);

	//Draw Lines
	for(var l in lines){
		//ctx.strokeStyle = selectedI+""==l&&selectedC=="line"?"gray":"black";
		ctx.lineWidth = 6;
		ctx.strokeStyle = selectedI + "" == l && component == "line" && mode != "draw" ? "red" : "black";
		ctx.beginPath();
		ctx.moveTo(
			drawToX(lines[l].v1.x)//lines[l].v1.x * Zoom - xM
			, drawToY(lines[l].v1.y)//lines[l].v1.y * Zoom - yM
		);
		ctx.lineTo(
			drawToX(lines[l].v2.x)//lines[l].v2.x * Zoom - xM
			, drawToY(lines[l].v2.y)//lines[l].v2.y * Zoom - yM
		);
		ctx.stroke();
		ctx.lineWidth = 3;
		ctx.strokeStyle = !lines[l].sidedef ? (lines[l].sector[0] != null ? sectorToHue(lines[l].sector)+"80%,50%,1)":"black"):"#fff";
		ctx.beginPath();
		ctx.moveTo(
			drawToX(lines[l].v1.x)//lines[l].v1.x * Zoom - xM
			, drawToY(lines[l].v1.y)//lines[l].v1.y * Zoom - yM
		);
		ctx.lineTo(
			drawToX(lines[l].v2.x)//lines[l].v2.x * Zoom - xM
			, drawToY(lines[l].v2.y)//lines[l].v2.y * Zoom - yM
		);
		ctx.stroke();
	}

	//Draw vertex
	ctx.fillStyle = "orange";
	for (var i in vertex) {
		ctx.fillStyle = selectedI + "" == i && (component == "vertex" || (component=="line"&&mode=="draw")) ? "red" : "black";
		ctx.fillRect(
			-6 + drawToX(vertex[i].x),//vertex[i].x * Zoom - xM,
			-6 + drawToY(vertex[i].y)/*vertex[i].y * Zoom - yM*/, 12, 12);
		ctx.fillStyle = vertex[i].sector!=null?"hsla("+((vertex[i].sector*50)%360)+"deg,80%,50%,1)":"white";
		ctx.fillRect(
			-4 + drawToX(vertex[i].x),//vertex[i].x * Zoom - xM,
			-4 + drawToY(vertex[i].y)/*vertex[i].y * Zoom - yM*/, 8, 8);
	}

	//Drawn previsual
	if (component == "line" && selectedI != null && mode!="draw") {
		var v1x = drawToX(lines[selectedI].v1.x);
		var v2x = drawToX(lines[selectedI].v2.x);
		var v1z = drawToY(lines[selectedI].v1.y);
		var v2z = drawToY(lines[selectedI].v2.y);

		//var bottom = 
		//var middle = 

		ctxH.fillStyle = sectorToHue(lines[selectedI].sector[0]) + "100%,50%)";
		ctxH.beginPath();
		if (cameraOrientation == "vertical") {
			ctxH.moveTo(v1x - 128, 184);
			ctxH.lineTo(v2x - 128, 184);
			ctxH.lineTo(v2x - 128, 256);
			ctxH.lineTo(v1x - 128, 256);
		} else {
			ctxH.moveTo(v1z - 128, 184);
			ctxH.lineTo(v2z - 128, 184);
			ctxH.lineTo(v2z - 128, 256);
			ctxH.lineTo(v1z - 128, 256);
		}
		ctxH.fill();

	}





	//Drawn croirs
	ctx.fillStyle = "gray";
	ctx.fillRect(254, 244, 4, 24);
	ctx.fillRect(244, 254, 24, 4);
}

function sectorToHue(s) {
	return "hsla(" + ((s * 29) % 360) + "deg,";
}
















function addSector(x, y){
	var l = pickNearestLine(x, y);
	if(l!=null){
		insertInSector(lines[l].v1, lines[l].v2, lines[l], l);
	}
}
function insertInSector(v1, v2, l, li) {
	if (valueInList(sectorI, l.sector) < 0 && !l.sidedef)
	if(sectors[sectorI]){
		if(sectors[sectorI].vertex.length==0){
			sectors[sectorI].vertex.push(v1, v2);
			return
		}
		if (sectors[sectorI].vertex.length == 2&&compareVertex(l.v2, sectors[sectorI].vertex[0])) {
			var dve1 = sectors[sectorI].vertex[1]; var dve2 = sectors[sectorI].vertex[0];
			sectors[sectorI].vertex[0] = dve1; sectors[sectorI].vertex[1] = dve2;
		}
		l.sector.push(sectorI);
		if (l.sector.length > 1)
			l.sidedef = true;
		if(compareVertex(sectors[sectorI].vertex[sectors[sectorI].vertex.length-1], v1))
			sectors[sectorI].vertex.push(v2);
		else
			sectors[sectorI].vertex.push(v1);
	} else {
		sectors[sectorI] = { vertex: [], color: [1, 1, 1, 1], textureD: "blank", textureU: "blank", floorY: 0, ceilY: 72, colorFog: [0, 0, 0, .4], distanceFogMin: 320, distanceFogMax: 640};
		//v1.sector = sectorI;
		//v2.sector = sectorI;
		l.sector.push(sectorI);
		if (l.sector.length > 1)
			l.sidedef = true;
		sectors[sectorI].vertex.push(v1);
		sectors[sectorI].vertex.push(v2);
		
	}
}

function selectComponent(x, y) {
	if (component == "vertex") {
		var pick = null;
		for (var i in vertex)
			if (distance(x, y, vertex[i].x, vertex[i].y) <= 10 / Zoom) {
				pick = i;
				break;
			}
		return pick;
	} else if (component == "line") {
		return pickNearestLine(x, y);
	} else if (component == "sector") {
		for (var i = sectors.length-1; i > -1;i--)
			if (pointInPolygon(sectors[i].vertex, x, y))
				return i;
	}
}

function insertVertex(x, y){
	if(!selectComponent(x, y)) vertex.push({x:x, y:y});
}
function createLine(x, y) {
	function genLine(ind) {
		lines.push({
			v1: vertex[selectedI], v2: vertex[ind], v1i: selectedI, v2i: ind, sector: [],
			textureU: "blank", textureM: "blank", textureD: "blank",
			skyTop: false, skyMiddle: false, skyDown: false,
			textureXU: 0, textureYU: 0, textureXM: 0, textureYM: 0, textureXD: 0, textureYD: 0,
			barrier: true, sidedef: false,
			gradientScolor: [1,1,1,0], gradientSdur: 1,
			gradientIcolor: [1,1,1,0], gradientIdur: 1
		});
	}
	if(selectedI==null){
		selectedI = pickVertex(x, y);
		if (!selectedI) {
			insertVertex(x, y);
			selectedI = vertex.length-1;
		}
	} else {
		var inserted = false;
		for(var i in vertex)
			if (distance(x, y, vertex[i].x, vertex[i].y) <= 10 / Zoom) {
				genLine(i);
				selectedI = i;
				inserted = true;
				break;
			}
		if (!inserted) {
			insertVertex(x, y);
			genLine(vertex.length - 1);
			selectedI = vertex.length - 1;
		}
	}
}
function pickVertex(x, y){
	var pick = null;
	for(var i in vertex)
		if (distance(x, y, vertex[i].x, vertex[i].y) <= 10 / Zoom){
			pick = i;
			break;
		}
	return pick;
}
function dropVertex(x, y){
	selectedI = null;
}
function compareVertex(v1, v2){
	return ~~v1.x==~~v2.x&&~~v1.y==~~v2.y;
}
function compareLine(l1, l2){
	return (compareVertex(l1.v1, l2.v1)&&compareVertex(l1.v2, l2.v2))||(compareVertex(l1.v2, l2.v1)&&compareVertex(l1.v1, l2.v2))
}
function compareReversingLine(l1, l2){
	return compareVertex(l1.v2, l2.v1)&&compareVertex(l1.v1, l2.v2);
}
function removeVertex(x, y){
	var pick = null;
	for(var i in vertex)
		if (distance(x, y, vertex[i].x, vertex[i].y) <= 10 / Zoom){
			pick = i;
			break;
		}
	for(var l=0;l<lines.length;l++){
		if(lines[l].v1i==pick+""||lines[l].v2i==pick+""){
			lines.splice(l, 1);
			l--;
		}else{
			lines[l].v1i=Number(lines[l].v1i)>pick?""+(Number(lines[l].v1i)-1):lines[l].v1i;
			lines[l].v2i=Number(lines[l].v2i)>pick?""+(Number(lines[l].v2i)-1):lines[l].v2i;
		}
	}
	if(pick!=null) vertex.splice(Number(i), 1);
}

function removeSector(x, y){
	for(var i in sectors)
		if (pointInPolygon(sectors[i].vertex, x, y)) {
			removeSectorByIndex(i);
		}
	sectorI = sectors.length;
}
function removeSectorByIndex(i) {
	clearSector(i);
	sectors.splice(i, 1);
}
function clearSector(i, maintain){
	for (var l in lines) {
		var sec = valueInList(i, lines[l].sector);
		if (lines[l].sidedef) {
			if (sec > -1) {
				//alert(lines[l].sector)
				lines[l].sector.splice(sec, 1);
				//alert(lines[l].sector)
				lines[l].sidedef = false;
			}
			if(!maintain) if (lines[l].sector[1] > i) lines[l].sector[1]--;
		} else {
			if (lines[l].sector[0] == i)
				lines[l].sector = [];
		}
		if(!maintain) if (lines[l].sector[0] > i) lines[l].sector[0]--;
	}
	sectors[i].indV = [];
	sectors[i].vertex = [];
}

function valueInList(value, list) {
	for (var ind = 0; ind < list.length; ind++)
		if (list[ind] == value)
			return ind;
	return -1;
}

function removeLine(i){
	lines.splice(i, 1);
}

function pickNearestLine(x, y){
	for(var l=0;l<lines.length;l++){
		var d1 = distance(x, y, lines[l].v1.x, lines[l].v1.y);
		var d2 = distance(x, y, lines[l].v2.x, lines[l].v2.y);
		var dl = distance(lines[l].v1.x, lines[l].v1.y, lines[l].v2.x, lines[l].v2.y);
		if ((d1 + d2) <= dl + 2 / Zoom)
			return l;
	}
}

var mouseX = 0; var mouseY = 0;
function dbgTextUpdate(x, y) {
	if (x) mouseX = x; if(y) mouseY = y
	dbg.innerText =
		"mode: " + mode + "\ncomponent: " + component + "\nselected: " + selectedC + "-" + selectedI + "\nsectorI for draw: " + sectorI
		//+ "\nselected_element: " + JSON.stringify(refObject)
		+ "\npos move: " + xM +"_"+yM
		+ "\nzoom: " + Zoom
	;
}

var inClick = false;
cv.onmousedown = function(c){
	var x = c.clientX;
	var y = c.clientY;
	dbgTextUpdate(c.clientX, c.clientY);
	x = toX(x);
	y = toY(y);
	inClick = true;
	if(mode=="draw"){
		if(component=="vertex")
			insertVertex(x, y);
		if(component=="line")
			createLine(x, y);
		if(component=="sector")
			addSector(x, y);
	}else if(mode=="remove"){
		if(component=="vertex")
			removeVertex(x, y);
		if(component=="line")
			removeLine(pickNearestLine(x, y))
		if(component=="sector")
			removeSector(x, y);
	} else if (mode == "move") {
		selectedI = selectComponent(x, y);
		if(component=="vertex")
			selectedI = pickVertex(x, y);
		
	}else if(mode=="pick"){
		component = "sector";
		selectedI = selectComponent(x, y);
		if(selectedI!=null)
			sectorI = selectedI;
	}
	updateInfo();
	redraw();
}
cv.onmouseup = function(c){
	var x = c.clientX;
	x = toX(x);
	var y = c.clientY;
	y = toY(y);
	inClick = false;
	if(mode=="move"){
		if(component=="vertex"){
			//dropVertex(x, y);
		}
	}
	redraw();
	dbgTextUpdate(c.clientX, c.clientY);
}
cv.onmouseup = function () { }
cv.onmousemove = function(c){
	var x = c.clientX;
	x = toX(x);
	var y = c.clientY;
	y = toY(y);
	if (mode == "move" && inClick) {
		if(component=="vertex"&&selectedI){
			vertex[selectedI].x = x;
			vertex[selectedI].y = y;
		}
	}
	redraw();
	dbgTextUpdate(c.clientX, c.clientY);
}
cv.onmousewheel = function (k) {
	if (k.deltaY < 0) {
		xM += (512 / Zoom) * .25;
		yM += (512 / Zoom) * .25;
		indZoom+=1;
		Zoom = Math.pow(2, indZoom);
		//xM = xM - Math.abs(xM % 16);
		//yM = yM - Math.abs(yM % 16);
	}
	if (k.deltaY > 0) {
		indZoom-=1;
		Zoom = Math.pow(2, indZoom);
		xM -= (512 / Zoom) * .25;
		yM -= (512 / Zoom) * .25;
		xM = xM - Math.abs(xM % (16 / Zoom));
		yM = yM - Math.abs(yM % (16 / Zoom));
	}
	dbgTextUpdate(0, 0);
	redraw();
}
cv.onmouseover = function(){
	mouseOverCanvas = true
}
cv.onmouseout = function(){
	mouseOverCanvas = false
}
var mouseOverCanvas = false;
var focusOnCanvas = false;
window.onkeydown = function (k) {
	if(mouseOverCanvas)
	if (!k.ctrlKey)
	switch(k.key){
		case "V":
		case "v":
			selectedI = null;
			component = "vertex";
			break;
		case "L":
		case "l":
			selectedI = null;
			component = "line";
			break;
		case "S":
		case "s":
			selectedI = null;
			component = "sector";
			break;
		case "D":
		case "d":
			selectedI = null;
			mode = "draw";
			break;
		case "M":
		case "m":
			selectedI = null;
			mode = "move";
			break;
		case "F":
		case "f": {
			var vs = { x: sectors[sectors.length - 1].vertex[0].x, y: sectors[sectors.length - 1].vertex[0].y };
			var vf = { x: sectors[sectors.length - 1].vertex[sectors[sectors.length - 1].vertex.length - 1].x, y: sectors[sectors.length - 1].vertex[sectors[sectors.length - 1].vertex.length-1].y };
			if (compareVertex(vs, vf))
				sectorI = sectors.length;
			else
				removeSectorByIndex(sectorI);
			break;
		}
		case "R":
		case "r":
			selectedI = null;
			mode = "remove";
			break;
		case "P":
		case "p":
			selectedI = null;
			mode = "pick";
			break;
		case "C":
		case "c":
			if(component=="sector"&&sectorI!=null)clearSector(sectorI, true)
			break;
		case "=":
			var s = prompt("Insira o nome do mapa para salvar:",mapName);
			if(s){"~~MaPnAmE¹?!"
				localStorage.setItem("~~MaPnAmE¹?!", s);
				mapName = s;
				saveMap(s,"mapa");
			};
			break;
		case "[":
			var s = prompt("Insira o nome do mapa para carregar:",mapName);
			if(s){
				localStorage.setItem("~~MaPnAmE¹?!", s);
				mapName = s;
				loadMap(s,"mapa")
			};
			break;
		case "]":
			var datS = exportMap(mapName);
			alert("mapa exportado! copie dos registros");
			console.log(datS);
			break;
		case ";":
			cameraOrientation = cameraOrientation == "horizontal" ? "vertical" : "horizontal";
			break;
		case "ArrowLeft":
			xM -= GRID_SIZE / Zoom;
			break;
		case "ArrowRight":
			xM += GRID_SIZE / Zoom;
			break;
		case "ArrowUp":
			yM -= GRID_SIZE / Zoom;
			break;
		case "ArrowDown":
			yM += GRID_SIZE / Zoom;
			break;
	}
	redraw();
	dbgTextUpdate();
}
redraw();












var elSecI,
	elTexU, elTexM, elTexD,
	elTexXU, elTexYU, elTexXM, elTexYM, elTexXD, elTexYD,
	elRed, elGreen, elBlue, elRedFog, elGreenFog, elBlueFog,
	elIntensityFog,
	elFogMin, elFogMax,
	elFloorY, elCeilY, elIsSide, elCol;

var refObject = null;

function updateInfo() {
	for (var e in elementsEditor){
		elementsEditor[e].element.value = "";
		elementsEditor[e].element.checked = false;
		elementsEditor[e].element.disabled = true;
	}
	if(selectedI!=null){
		var vertexs = vertex;
		refObject = eval(component+"s[selectedI]");
		for (var e in elementsEditor){
			//console.log(elementsEditor[e].element.);
			if(elementsEditor[e].element.getAttribute("components").indexOf(component)>-1){
				if(elementsEditor[e].element.type=="number"){
					if(elementsEditor[e].element.getAttribute("index")!=null){
						elementsEditor[e].element.value = Number(refObject[elementsEditor[e].element.getAttribute("key")][Number(elementsEditor[e].element.getAttribute("index"))])
					}else
						elementsEditor[e].element.value = Number(refObject[elementsEditor[e].element.getAttribute("key")]);
				}else if(elementsEditor[e].element.type=="checkbox"){
					elementsEditor[e].element.checked = Boolean(refObject[elementsEditor[e].element.getAttribute("key")]);
				}else{
					elementsEditor[e].element.value = String(refObject[elementsEditor[e].element.getAttribute("key")]);
				}
				elementsEditor[e].element.disabled = null;
			}
		}
	}
}



function pointInPolygon(vertices, px, py) {
	var collision = false;
	var next = 0;
	for (var current = 0; current < vertices.length; current++) {
		next = current + 1;
		if (next == vertices.length) next = 0;
		var vc = vertices[current];
		var vn = vertices[next];
		if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
			(px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x))
		{
			collision = !collision;
		}
	}
	return collision;
}






var elementsEditor = {
	"sectorId":null, "descriptionItem": null,
	"texIUpper":null, "texIMiddle":null, "texIDown":null,
	"skyT":null, "skyM":null, "skyD":null,
	"texXU":null, "texYU":null,
	"texXM":null, "texYM":null,
	"texXD":null, "texYD":null,
	"red":null, "green":null, "blue":null,
	"redFog":null, "greenFog":null, "blueFog":null,
	"intensityFog":null,
	"distFogMin":null, "distFogMax":null,
	"floorY":null, "ceilY":null,
	"isSidedef":null, "colision":null,
	"gsredFog":null, "gsgreenFog":null, "gsblueFog":null,
	"gsintensity":null, "gsduration":null,
	"giredFog":null, "gigreenFog":null, "giblueFog":null,
	"giintensity":null, "giduration":null
}





window.onload = function () {
	for (var e in elementsEditor){
		elementsEditor[e] = {element:document.getElementById(e)};
		var setValue = function(){
			var value = this.type=="number"?Number(this.value):this.type=="checkbox"?this.checked:String(this.value);
			console.log(value)
			console.log(this.checked);
			if(this.getAttribute("index")!=null){
				refObject[this.getAttribute("key")][Number(this.getAttribute("index"))] = value;
				console.log(refObject[this.getAttribute("key")][Number(this.getAttribute("index"))])
			}else{
				refObject[this.getAttribute("key")] = value;
				console.log(refObject[this.getAttribute("key")])
			}
		}
		elementsEditor[e].element.oninput = setValue;
		/*if(elementsEditor[e].element.type=="checkbox")
			elementsEditor[e].element.onchange*/
		console.log(elementsEditor[e].element.id);
	}/*
	elSecI = document.getElementById("sectorId");
	elTexU = document.getElementById("texIUpper"); elTexM = document.getElementById("texIMiddle"); elTexD = document.getElementById("texIDown");
	elTexXU = document.getElementById("texXU"); elTexYU = document.getElementById("texYU");
	elTexXM = document.getElementById("texXM"); elTexYM = document.getElementById("texYM");
	elTexXD = document.getElementById("texXD"); elTexYD = document.getElementById("texYD");
	elRed = document.getElementById("red"); elGreen = document.getElementById("green"); elBlue = document.getElementById("blue");
	elRedFog = document.getElementById("redFog"); elGreenFog = document.getElementById("greenFog"); elBlueFog = document.getElementById("blueFog");
	elIntensityFog = document.getElementById("intensityFog");
	elFogMin = document.getElementById("distFogMin"); elFogMax = document.getElementById("distFogMax");
	elFloorY = document.getElementById("floorY"); elCeilY = document.getElementById("ceilY");
	elIsSide = document.getElementById("isSidedef"); elCol = document.getElementById("colision");
*/
	elementListTexturesWall = document.getElementById("previsualListTexturesWall");
	elementListTexturesCeil = document.getElementById("previsualListTexturesCeil");
	elementListTexturesSprite = document.getElementById("previsualListTexturesSprite");

	lists = {
		Wall: elementListTexturesWall
		, Flat: elementListTexturesCeil
		, sprites: elementListTexturesSprite
	};
}


