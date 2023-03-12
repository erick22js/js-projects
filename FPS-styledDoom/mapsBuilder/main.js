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

var p_position = [0, 0];


var toX = (x) => ~~((((x) / Zoom) + (GRID_SIZE * .25 / Zoom)) / (GRID_SIZE / Zoom)) * (GRID_SIZE / Zoom) + xM;//((~~((x + GRID_SIZE / Zoom * .25) / (GRID_SIZE))) * (GRID_SIZE) )/Zoom+ xM;
var toY = (y) => ~~((((y) / Zoom) + (GRID_SIZE * .25 / Zoom)) / (GRID_SIZE / Zoom)) * (GRID_SIZE / Zoom) + yM;//((~~((y + GRID_SIZE / Zoom * .25) / (GRID_SIZE))) * (GRID_SIZE)) / Zoom + yM;

var drawToX = (x) => (x - xM) * Zoom;//toX(x) - 2 * xM;
var drawToY = (y) => (y - yM) * Zoom;//toY(y) - 2 * yM;

function saveMap(tag){
	for(var v in vertex){
		vertex[v].ind = v;
	}for(var l in lines){
		lines[l].ind1 = lines[l].v1.ind;
		lines[l].ind2 = lines[l].v2.ind;
	}for(var s in sectors){
		sectors[s].indV = [];
		for(var i=0;i<sectors[s].vertex.length;i++)
			sectors[s].indV.push(sectors[s].vertex[i].ind);
	}
	var data = {
		vertex:vertex,
		lines:lines,
		sectors:sectors,
		sectorI:sectorI,
		ppos:p_position
	}
	sectorI = sectors.length;
	localStorage.setItem(tag, JSON.stringify(data));
}
function loadMap(tag){
	var data = JSON.parse(localStorage.getItem(tag));
	vertex = data.vertex;
	lines = data.lines;
	sectors = data.sectors;
	p_position = data.ppos;
	for(var l in lines){
		lines[l].v1 = vertex[lines[l].ind1];
		lines[l].v2 = vertex[lines[l].ind2];
	}for(var s in sectors){
		var size = sectors[s].vertex.length;
		sectors[s].vertex = [];
		for(var i=0;i<size;i++)
			sectors[s].vertex.push(vertex[data.sectors[s].indV[i]]);
	}
	sectorI = sectors.length;
	sectorI = data.sectorI;
}
function exportMap(tag){
	var mapData = {vertex:[], walls:[], sector:[], ppos:p_position};
	for(var v in vertex){
		vertex[v].ind = v;
		mapData.vertex.push([vertex[v].x, vertex[v].y]);
	}
	for (var l in lines) {
		lines[l].ind = l;
		mapData.walls.push({
			v1: lines[l].v1.ind
			, v2: lines[l].v2.ind
			, textureX: lines[l].textureX
			, textureY: lines[l].textureY
			, textureU: lines[l].sidedef ? lines[l].textureU : lines[l].textureD
			, textureM: lines[l].textureM
			, textureD: lines[l].sidedef ? lines[l].textureD : lines[l].textureU
			, sidedef: lines[l].sidedef
			, barrier: lines[l].barrier
			, sector: lines[l].sector
		})
	}
	for(var s in sectors){
		mapData.sector.push({
			walls: []
			, region: []
		});
		for (var l in lines)
			if (valueInList(s, lines[l].sector)>-1) {
				mapData.sector[s].walls.push(lines[l].ind)
			}
		for(var v in sectors[s].vertex)
			mapData.sector[s].region.push({ x: sectors[s].vertex[v].x, y: sectors[s].vertex[v].y });
		mapData.sector[s].textureU = sectors[s].textureU;
		mapData.sector[s].textureD = sectors[s].textureD;
		mapData.sector[s].ceilY = sectors[s].ceilY;
		mapData.sector[s].floorY = sectors[s].floorY;
		mapData.sector[s].color = sectors[s].color;
	}
	sectorI = sectors.length;
	var st = JSON.stringify(mapData);
	alert("$ExPoRtEd$&MaP:" + tag)
	localStorage.setItem("$ExPoRtEd$&MaP:" + tag, st);
	return st;
}
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
	
	//drawGrid on canvas
	ctx.fillStyle = "black";
	for (var x = 0; x <= 512; x += GRID_SIZE)
		ctx.fillRect(x, 0, .5, 512);
	for (var y = 0; y <= 512; y += GRID_SIZE)
		ctx.fillRect(0, y, 512, .5);
	var size = Math.pow(2, Math.abs((Math.log2(Zoom)) % 3));
	ctx.fillStyle = "black";
	for (var x = 0; x <= 512; x += (GRID_SIZE*2) * size)
		ctx.fillRect(x-1, 0, 1, 512);
	for (var y = 0; y <= 512; y += (GRID_SIZE*2) * size)
		ctx.fillRect(0, y-1, 512, 1);


	//drawGrid on previsualize
	ctxH.fillStyle = "black";
	for (var x = 0; x <= 256; x += GRID_SIZE)
		ctxH.fillRect(x, 0, .5, 512);
	for (var y = 0; y <= 512; y += GRID_SIZE)
		ctxH.fillRect(0, y, 512, .5);
	ctxH.fillRect(0, 254.75, 512, 2.5);

	for(var s in sectors){
		ctx.fillStyle = sectorToHue(s) +"100%,50%,.4)";
		ctx.beginPath();
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
	
	{
		ctx.fillStyle = "green";
		ctx.fillRect(
			-7 + drawToX(p_position[0]),//vertex[i].x * Zoom - xM,
			-7 + drawToY(p_position[1])/*vertex[i].y * Zoom - yM*/, 14, 14);
	}
	
	//Drawn previsual
	if (component == "line" && selectedI != null) {
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
		l.sector.push(sectorI);
		if (l.sector.length > 1)
			l.sidedef = true;
		if(compareVertex(sectors[sectorI].vertex[sectors[sectorI].vertex.length-1], v1))
			sectors[sectorI].vertex.push(v2);
		else
			sectors[sectorI].vertex.push(v1);
	} else {
		sectors[sectorI] = { vertex: [], color: [1, 1, 1, 1], textureD: 0, textureU: 0, floorY: 0, ceilY: 72 };
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
		for (var i in sectors)
			if (pointInPolygon(sectors[i].vertex, x, y))
				return i;
	}
}

function insertVertex(x, y){
	if(!selectComponent(x, y)) vertex.push({x:x, y:y});
}
function createLine(x, y) {
	if(selectedI==null){
		selectedI = pickVertex(x, y);
	}else{
		for(var i in vertex)
			if (distance(x, y, vertex[i].x, vertex[i].y) <= 10 / Zoom) {
				lines.push({ v1: vertex[selectedI], v2: vertex[i], v1i: selectedI, v2i: i, sector: [], textureU:0, textureM:0, textureD:0, textureX: 0, textureY:0, barrier: true, sidedef: false });
				selectedI = i;
				break;
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
	for (var l in lines) {
		var sec = valueInList(i, lines[l].sector);
		if (lines[l].sidedef) {
			if (sec > -1) {
				//alert(lines[l].sector)
				lines[l].sector.splice(sec, 1);
				//alert(lines[l].sector)
				lines[l].sidedef = false;
			}
			if (lines[l].sector[1] > i) lines[l].sector[1]--;
		} else {
			if (lines[l].sector[0] == i)
				lines[l].sector = [];
		}
		if (lines[l].sector[0] > i) lines[l].sector[0]--;
	}
	sectors.splice(i, 1);
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
		"mode: " + mode + "\ncomponent: " + component + "\nselected: " + selectedC + "-" + selectedI + "\nmouse x: " + mouseX + " y: " + mouseY
		+ "\nfirst vertex: " + JSON.stringify(vertex[0])
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
		
	} else if (mode == "pov_position_set") {
		/*selectedI = selectComponent(x, y);
		if(component=="vertex")
			selectedI = pickVertex(x, y);*/
		pov_position_set = [x, y];
		
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
window.onmouseup = function () { }
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
	redraw();
}

window.onkeydown = function(k){
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
			mode = "pov_position_set";
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












var elSecI = document.getElementById("sectorId");

var elTexU = document.getElementById("texIUpper");
var elTexM = document.getElementById("texIMiddle");
var elTexD = document.getElementById("texIDown");
var elTexX = document.getElementById("texX");
var elTexY = document.getElementById("texY");

var elRed = document.getElementById("red"); var elGreen = document.getElementById("green"); var elBlue = document.getElementById("blue");

var elFloorY = document.getElementById("floorY");
var elCeilY = document.getElementById("ceilY");

var elIsSide = document.getElementById("isSidedef");
var elCol = document.getElementById("colision");

var refObject = null;

function updateInfo() {
	elIsSide.disabled = true; elIsSide.checked = false;
	elCol.disabled = true; elCol.checked = false;
	elSecI.disabled = true; elSecI.value = "";
	elTexU.disabled = true; elTexU.value = "";
	elTexM.disabled = true; elTexM.value = "";
	elTexD.disabled = true; elTexD.value = "";
	elFloorY.disabled = true; elFloorY.value = "";
	elCeilY.disabled = true; elCeilY.value = "";
	elTexX.disabled = true; elTexX.value = ""; elTexY.disabled = true; elTexY.value = "";
	elRed.disabled = true; elRed.value = ""; elGreen.disabled = true; elGreen.value = ""; elBlue.disabled = true; elBlue.value = "";
	if (selectedI != null) {
		switch (component) {
			case "vertex": {
				refObject = vertex[selectedI];
				break;
			}
			case "line": {
				elementListTexturesWall.hidden = null;
				elementListTexturesCeil.hidden = "hidden";
				refObject = lines[selectedI];
				elSecI.value = refObject.sector;
				elIsSide.checked = refObject.sidedef; elCol.disabled = null; elCol.checked = refObject.barrier;
				if (refObject.sidedef)elTexU.disabled = null; elTexU.value = refObject.textureU;
				elTexM.disabled = null; elTexM.value = refObject.textureM;
				if (refObject.sidedef)elTexD.disabled = null; elTexD.value = refObject.textureD;
				elTexX.disabled = null; elTexX.value = refObject.textureX; elTexY.disabled = null; elTexY.value = refObject.textureY;
				break;
			}
			case "sector": {
				elementListTexturesWall.hidden = "hidden";
				elementListTexturesCeil.hidden = null;
				refObject = sectors[selectedI];
				elSecI.value = selectedI;
				elFloorY.disabled = null; elFloorY.value = refObject.floorY;
				elCeilY.disabled = null; elCeilY.value = refObject.ceilY;
				elTexU.disabled = null; elTexU.value = refObject.textureU;
				elTexD.disabled = null; elTexD.value = refObject.textureD;
				elRed.disabled = null; elRed.value = refObject.color[0]; elGreen.disabled = null; elGreen.value = refObject.color[1]; elBlue.disabled = null; elBlue.value = refObject.color[2];
				break;
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













//load textures by path
var textureLoaderInput = document.getElementById("textureLoader");
var fileReader = new FileReader();
var decoded = "";
var less = null;
var actIndexTextures = 0;
var texturesLoaded = [];
var loadFor = "Wall";

var texturePack = {
	wall:[],
	ceil:[]
}

fileReader.onloadend = function () {
	decoded = fileReader.result;
	texturesLoaded.push(decoded);
	less--;
	if (less > -1) {
		fileReader.readAsDataURL(textureLoaderInput.files[less]);
		addTextureIndex(decoded, actIndexTextures);
		console.log(decoded);

		actIndexTextures++;
	} else {
		alert("As texturas foram cerregadas!");
		console.log(texturesLoaded);
		console.log(JSON.stringify(texturesLoaded));
	}
}

textureLoaderInput.oninput = function () {
}

function createTexturePack() {
	texturesLoaded = [];
	var decision = prompt("Que conjunto prefere carregar:\n1 para paredes\n2 para teto e piso\nqualquer outro valor para cancelar");
	loadFor = decision == "1" ? "Wall" : decision == "2" ? "Ceil" : null;
	if (!loadFor) return;

	actIndexTextures = 0;
	if (loadFor == "Wall") {
		texturePack.wall = [];
		elementListTexturesWall.innerHTML = "";
	}
	else {
		texturePack.ceil = [];
		elementListTexturesCeil.innerHTML = "";
	}
	less = textureLoaderInput.files.length;
	fileReader.readAsDataURL(textureLoaderInput.files[0]);
}



var elementListTexturesWall;
var elementListTexturesCeil;

window.onload = function () {
	elementListTexturesWall = document.getElementsByTagName("div")[0];
	elementListTexturesCeil = document.getElementsByTagName("div")[1];
}

function addTextureIndex(uri, index) {
	var img = document.createElement("img");
	img.src = uri;
	elementListTexturesWall.hidden = "hidden";
	elementListTexturesCeil.hidden = "hidden";
	if (loadFor == "Wall") {
		img.uri = uri;
		elementListTexturesWall.hidden = null;
		elementListTexturesWall.innerHTML = elementListTexturesWall.innerHTML + "<hr><h2>" + "#" + index + "</h2>";
		elementListTexturesWall.appendChild(img);
		img.onload = function () {
			texturePack.wall.push(this.uri);
		}
	} else {
		img.uri = uri;
		elementListTexturesCeil.hidden = null;
		elementListTexturesCeil.innerHTML = elementListTexturesCeil.innerHTML + "<hr><h2>" + "#" + index + "</h2>";
		elementListTexturesCeil.appendChild(img);
		img.onload = function () {
			texturePack.ceil.push(this.uri);
		}
	}
}

function createTexture(img) {
	var gctx = document.createElement("canvas").getContext("2d");
	gctx.canvas.width = img.width;
	gctx.canvas.height = img.height;
	gctx.drawImage(img, 0, 0);
	var data = gctx.getImageData(0, 0, img.width, img.height).data;
	var mapData = [];
	for (var y = 0; y < img.height; y++) {
		var line = [];
		var x = 0;
		for (; x < img.width; x++)
			line.push([data[y * img.width * 4 + x * 4] / 255, data[y * img.width * 4 + x * 4 + 1] / 255, data[y * img.width * 4 + x * 4 + 2] / 255, data[y * img.width * 4 + x * 4 + 3] / 255]);
		line.push([data[y * img.width * 4 + x * 4] / 255, data[y * img.width * 4 + x * 4 + 1] / 255, data[y * img.width * 4 + x * 4 + 2] / 255, data[y * img.width * 4 + x * 4 + 3] / 255]);
		mapData.push(line);
		if (y == img.height - 1)
			mapData.push(line);
	}
	return { map: mapData, width: img.width, height: img.height };
}
function exportTexturePack(tag) {
	localStorage.setItem("$$MapBiuLder;..:" + tag, JSON.stringify(texturePack));
}

function importTexturePack(tag) {
	texturePack = JSON.parse(localStorage.getItem("$$MapBiuLder;..:" + tag));
	elementListTexturesWall.innerHTML = "";
	elementListTexturesCeil.innerHTML = "";
	for (var i in texturePack.wall) {
		var dat = texturePack.wall[i];
		var img = document.createElement("canvas");
		img.src = dat;
		elementListTexturesWall.appendChild(document.createElement("hr"));
		var tag = document.createElement("h2"); tag.innerHTML = "#" + i;
		elementListTexturesWall.appendChild(tag);
		elementListTexturesWall.appendChild(img);
	}
	for (var i in texturePack.ceil) {
		var dat = texturePack.ceil[i];
		var img = document.createElement("canvas")
		img.src = dat;
		elementListTexturesCeil.appendChild(document.createElement("hr"));
		var tag = document.createElement("h2"); tag.innerHTML = "#" + i;
		elementListTexturesCeil.appendChild(tag);
		elementListTexturesCeil.appendChild(img);
	}
}
