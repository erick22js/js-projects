const edCtx = editLayer.getContext("2d");
var edT = new TouchUI(editLayer);

/*	@Pre-sets
*/
const WIDTH = 320;
const HEIGHT = 256;
const MINHOLDTIME = 0.201;
edCtx.translate(WIDTH*.5, HEIGHT*.5);
edCtx.imageSmoothingEnabled = false;
const Tr = {
	x:0,
	y:0,
	zoom:1,
	gap: 32,
	zooml:0,
	zoomdist: 0,
	
	acumx: 0,
	acumy: 0,
	
	actionMode:"pencil",
	structMode:"vertex"
}


const Objs = {
	pickeds:[],
	
	vertices: [],
	lines: [],
	sectors: [],
	things: [],
	
	activeVertices:[],
	activeLines: [],
	activeSectors: [],
	activeThings: [],
	
	movedVertices:[],
	
	tmpPolygon: null,
	
	node: null,
}

function redrawEditor(){
	edCtx.clearRect(-(WIDTH*.5), -(HEIGHT*.5), WIDTH, HEIGHT);
	
	editObjButton.disabled = Objs.pickeds.length>0?null:"false";
	
	/*	@Desenhar as grades
	*/
	edCtx.fillStyle = "white";
	for(var x=0; x<(WIDTH*.5+Tr.gap)/Tr.zoom; x+=Tr.gap){
		edCtx.fillRect((x+(Tr.x%Tr.gap))*Tr.zoom, -(HEIGHT*.5), 1, HEIGHT);
		edCtx.fillRect((-x+(Tr.x%Tr.gap))*Tr.zoom, -(HEIGHT*.5), 1, HEIGHT);
	}
	for(var y=0; y<(HEIGHT*.5+Tr.gap)/Tr.zoom; y+=Tr.gap){
		edCtx.fillRect(-(WIDTH*.5), (y+(Tr.y%Tr.gap))*Tr.zoom, WIDTH, 1);
		edCtx.fillRect(-(WIDTH*.5), (-y+(Tr.y%Tr.gap))*Tr.zoom, WIDTH, 1);
	}
	
	/*	@Draw sectors
	*/
	edCtx.globalAlpha = .4;
	for(var i=0; i<Objs.activeSectors.length; i++){
		var s = Objs.activeSectors[i];
		edCtx.beginPath();
		edCtx.fillStyle = s.selected?"#900":"#888";
		edCtx.moveTo(s.vs[0].tx, s.vs[0].ty);
		for(var v=1; v<s.vs.length; v++){
			edCtx.lineTo(s.vs[v].tx, s.vs[v].ty);
		}
		edCtx.fill();
	}
	edCtx.globalAlpha = 1;
	
	/*	@Draw lines
	*/
	for(var i=0; i<Objs.activeLines.length; i++){
		var l = Objs.activeLines[i];
		edCtx.beginPath();
		edCtx.strokeStyle = l.selected?"#a00":
			lineInTempPolygon(l)?"#1aa":
			"#aaa";
		edCtx.lineWidth = 4;
		edCtx.moveTo(l.v1.tx, l.v1.ty);
		edCtx.lineTo(l.v2.tx, l.v2.ty);
		edCtx.stroke();
	}
	
	/*	@Draw vertices
	*/
	for(var i=0; i<Objs.activeVertices.length; i++){
		var v = Objs.activeVertices[i];
		edCtx.fillStyle = v.selected?"#f00":
			v==getFirstVertexPolygon()?"#07f":
			vertexInTempPolygon(v)?"#2ff":
			"#fff";
		edCtx.fillRect(v.tx-5, v.ty-5, 10, 10);
	}
	
	/*	@Draw things
	*/
	for(var i=0; i<Objs.activeThings.length; i++){
		var t = Objs.activeThings[i];
		edCtx.fillStyle = t.selected?"#f0f":"#00f";
		edCtx.fillRect(t.tx-8, t.ty-8, 16, 16);
	}
	
	edCtx.fillStyle = "#4bf";
	edCtx.font = "17px Arial";
	if(Objs.pickeds.length>0){
		edCtx.fillText(Objs.pickeds.length+" element"+(Objs.pickeds.length!=1?"s":"")+" selected"+(Objs.pickeds.length!=1?"s":""), -WIDTH*.5, -HEIGHT*.5+15);
	}
	
	/* @Render picked node
	*/
	if(Objs.nodes!=null){
		/*	@Draw lines
		*/
		if(Objs.nodes.subsector){
			for(var i=0; i<Objs.nodes.lines.length; i++){
				var l = Objs.nodes.lines[i];
				edCtx.beginPath();
				edCtx.strokeStyle = edCtx.fillStyle = "purple";
				edCtx.lineWidth = 5;
				var t1 = transformVertex(l.v1);
				var t2 = transformVertex(l.v2);
				var ce = transformVertex(Objs.nodes.center);
				//var t2 = transformVertex(l.v2);
				edCtx.moveTo(t1[0], t1[1]);
				edCtx.lineTo(t2[0], t2[1]);
				edCtx.stroke();
				edCtx.closePath();
				edCtx.fillRect(t1[0]-5, t1[1]-5, 10, 10);
				edCtx.fillRect(t2[0]-5, t2[1]-5, 10, 10);
				edCtx.fillRect(ce[0]-5, ce[1]-5, 10, 10);
			}
			//console.log(Objs.nodes.lines.length);
		}else{
			for(var i=0; i<Objs.nodes.linesL.length; i++){
				var l = Objs.nodes.linesL[i];
				edCtx.beginPath();
				edCtx.strokeStyle = edCtx.fillStyle = "red";
				edCtx.lineWidth = 5;
				var t1 = transformVertex(l.v1);
				var t2 = transformVertex(l.v2);
				edCtx.moveTo(t1[0], t1[1]);
				edCtx.lineTo(t2[0], t2[1]);
				edCtx.stroke();
				edCtx.closePath();
				edCtx.fillRect(t1[0]-5, t1[1]-5, 10, 10);
				edCtx.fillRect(t2[0]-5, t2[1]-5, 10, 10);
			}
			for(var i=0; i<Objs.nodes.linesR.length; i++){
				var l = Objs.nodes.linesR[i];
				edCtx.beginPath();
				edCtx.strokeStyle = edCtx.fillStyle = "blue";
				edCtx.lineWidth = 5;
				var t1 = transformVertex(l.v1);
				var t2 = transformVertex(l.v2);
				edCtx.moveTo(t1[0], t1[1]);
				edCtx.lineTo(t2[0], t2[1]);
				edCtx.stroke();
				edCtx.closePath();
				edCtx.fillRect(t1[0]-5, t1[1]-5, 10, 10);
				edCtx.fillRect(t2[0]-5, t2[1]-5, 10, 10);
			}
			for(var i=0; i<Objs.nodes.subSplitters.length; i++){
				var l = Objs.nodes.subSplitters[i];
				edCtx.beginPath();
				edCtx.strokeStyle = edCtx.fillStyle = "green";
				edCtx.lineWidth = 5;
				var t1 = transformVertex(l.v1);
				var t2 = transformVertex(l.v2);
				edCtx.moveTo(t1[0], t1[1]);
				edCtx.lineTo(t2[0], t2[1]);
				edCtx.stroke();
				edCtx.closePath();
				edCtx.fillRect(t1[0]-5, t1[1]-5, 10, 10);
				edCtx.fillRect(t2[0]-5, t2[1]-5, 10, 10);
			}
			var l = Objs.nodes.splitter;
			edCtx.beginPath();
			edCtx.strokeStyle = "yellow";
			edCtx.lineWidth = 5;
			edCtx.moveTo(l.v1.tx, l.v1.ty);
			edCtx.lineTo(l.v2.tx, l.v2.ty);
			edCtx.stroke();
			edCtx.closePath();
		}
	}
	
}
function reloadActives(){
	//Analise vertices
	for(var i=0; i<Objs.activeVertices.length; i++){
		Objs.activeVertices[i].active = false;
	}
	Objs.activeVertices = [];
	for(var i=0; i<Objs.vertices.length; i++){
		var v = Objs.vertices[i];
		var t = transformVertex(v);
		v.tx = t[0];
		v.ty = t[1];
		if(
			t[0]>=(-WIDTH *.5)&&t[0]<=(WIDTH *.5)&&
			t[1]>=(-HEIGHT*.5)&&t[1]<=(HEIGHT*.5)
		){
			v.active = true;
			Objs.activeVertices.push(v);
		}
	}
	for(var i=0; i<Objs.activeLines.length; i++){
		Objs.activeLines[i].active = false;
	}
	Objs.activeLines = [];
	for(var i=0; i<Objs.lines.length; i++){
		var l = Objs.lines[i];
		if(l.v1.active||l.v2.active){
			l.active = true;
			Objs.activeLines.push(l);
		}
	}
	Objs.activeSectors = Objs.sectors;
	for(var i=0; i<Objs.activeThings.length; i++){
		Objs.activeThings[i].active = false;
	}
	Objs.activeThings = [];
	for(var i=0; i<Objs.things.length; i++){
		var th = Objs.things[i];
		var t = transformVertex(th);
		th.tx = t[0];
		th.ty = t[1];
		if(
			t[0]>=(-WIDTH *.5)&&t[0]<=(WIDTH *.5)&&
			t[1]>=(-HEIGHT*.5)&&t[1]<=(HEIGHT*.5)
		){
			th.active = true;
			Objs.activeThings.push(th);
		}
	}
	//Objs.activeThings = Objs.things;
}

function Begin(){
	edT = new TouchUI(editLayer,
		WIDTH,
		HEIGHT
	);
	edT.ontouchstart = function(ev, box){
		editSection("down", ev, box);
	}
	edT.ontouchend = function(ev, box){
		editSection("up", ev, box);
	}
	edT.ontouchmove = function(ev, box){
		editSection("drag", ev, box);
	}
}

function Update(){
	//if(edT.touches_obj[0].released||edT.touches_obj[0].released)
	reloadActives();
	debug.textContent = 
		"zoom: "+Tr.zoom.toFixed(2)+"\n"+
		//"zooml: "+Tr.zooml.toFixed(2)+"\n"+
		//"zdist: "+Tr.zoomdist.toFixed(1)+"\n"+
		"gap: "+Tr.gap.toFixed(2)+"\n"+
		"Vs: "+Objs.vertices.length+"\n"+
		"Ls: "+Objs.lines.length+"\n"+
		"Ss: "+Objs.sectors.length+"\n"+
		"Ts: "+Objs.things.length+"\n"+
		"x: "+(Tr.x).toFixed(1)+" y: "+(Tr.y).toFixed(1);
	;
}

function editSection(gest, ev, box){
	//reloadActives();
	var t0 = edT.touches_obj[0];
	var t1 = edT.touches_obj[1];
	switch(Tr.actionMode){
		case "pencil":{
				pencilActing(gest, ev, box);
			}
			break;
		case "move":{
				if(gest=="up"&&t0.holdTime<MINHOLDTIME){
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
				}
			}
			break;
		case "hand":{
				if(gest=="down"&&t0.holding&&t1.holding){
					Tr.zoomdist = Math.distance(t0, t1);
					//Tr.zoomb++;
				}if(t0.holding&&t1.holding){
					var dist = Math.distance(t0, t1);
					var div = dist/Tr.zoomdist;
					Tr.zoomdist *= div;
					Tr.zooml += Math.log(div);
					Tr.zooml = Tr.zooml>5?5:Tr.zooml<-7.6?-7.6:Tr.zooml;
					Tr.zoom = Math.pow(2, Tr.zooml);
					Tr.gap = 32/Math.pow(2, ~~Tr.zooml);
				}else{
					Tr.x += t0.motionX/Tr.zoom;
					Tr.y += t0.motionY/Tr.zoom;
				}
				var bExtX = 32767-(WIDTH*.5)/Tr.zoom;
				var bExtY = 32767-(HEIGHT*.5)/Tr.zoom;
				var eExtX = -32767+(WIDTH*.5)/Tr.zoom;
				var eExtY = -32767+(HEIGHT*.5)/Tr.zoom;
				Tr.x = Tr.x>bExtX ?bExtX : Tr.x<eExtX ?eExtX :Tr.x;
				Tr.y = Tr.y>bExtY ?bExtY : Tr.y<eExtY ?eExtY :Tr.y;
				//Tr.x = Tr.x<-32768?-32768:Tr.x>32768?32768:Tr.x;
				//Tr.y = Tr.y<-32768?-32768:Tr.y>32768?32768:Tr.y;
			}
			break;
	}
	reloadActives();
	redrawEditor();
}
function pencilActing(gest, ev, box){
	var tc = edT.touches_obj[0];
	var tr = touchToEditor(tc.x, tc.y, .5);
	switch(Tr.structMode){
		case "vertex":{
				if(gest=="down")
					createVertex(tr[0], tr[1]);
			}
			break;
		case "line":{
				if(gest=="down")
					generateLine(tr[0], tr[1]);
			}
			break;
		case "polygon":{
				if(gest=="down")
					generatePolygon(tr[0], tr[1]);
			}
			break;
		case "thing":{
				if(gest=="down")
					createThing(tr[0], tr[1])
			}
			break;
	}
}

/*	@Do coordinate math
*/
function touchToEditor(x, y, subgrid){
	var tr = [x, y];
	tr[0] -= WIDTH*.5;
	tr[1] -= HEIGHT*.5;
	tr = [tr[0]/Tr.zoom-Tr.x, tr[1]/Tr.zoom-Tr.y];
	return nearestNeighbor(tr[0], tr[1], subgrid);
}
function nearestNeighbor(x, y, subgrid){
	var tr = [x, y];
	var gap = Tr.gap*subgrid;
	tr[0] = (Math.round(tr[0]/gap))*gap;
	tr[1] = (Math.round(tr[1]/gap))*gap;
	return tr;
}

/*	@Objects creation and manages
*/
/*	General
*/
function selectElement(elem){
	if(elem==null)
		return;
	if(getMainlySelectedType()!=elem.class)
		unselectAllElements();
	if(elem.selected){
		unselectElement(elem);
		return;
	}
	Objs.pickeds.push(elem);
	elem.selected = true;
}
function unselectElement(elem){
	if(elem==null)
		return;
	for(var i=0; i<Objs.pickeds.length; i++)
		if(Objs.pickeds[i]==elem){
			Objs.pickeds.splice(i, 1);
			break;
		}
	elem.selected = false;
}
function unselectAllElements(elem){
	for(var i=0; i<Objs.pickeds.length; i++)
		Objs.pickeds[i].selected = false;
	Objs.pickeds = [];
}
function getMainlySelectedType(){
	for(var i=0; i<Objs.pickeds.length; i++)
		return Objs.pickeds[i].class;
	return null;
}
function translateSelecteds(x=0, y=0){
	for(var i=0; i<Objs.pickeds.length; i++){
		var obj = Objs.pickeds[i];
		if(obj.class=="vertices")
			translateVertex(obj, x, y);
		else if(obj.class=="lines")
			translateLine(obj, x, y)
		else if(obj.class=="sectors")
			translatePolygon(obj, x, y)
		else if(obj.class=="things")
			translateVertex(obj, x, y)
	}
	resetMovedVertices();
}
function resetMovedVertices(){
	for(var i=0; i<Objs.movedVertices.length; i++)
		Objs.movedVertices[i].moved = false;
	Objs.movedVertices[i] = [];
}
function deleteSelecteds(){
	for(var i=0; i<Objs.pickeds.length; i++)
		deleteElement(Objs.pickeds[i]);
	Objs.pickeds = [];
	reloadActives();
	redrawEditor();
}
function deleteElement(elem){
	validatePolygon();
	if(elem.class=="vertices")
		return deleteVertex(elem);
	else if(elem.class=="lines")
		return deleteLine(elem);
	else if(elem.class=="sectors")
		return deletePolygon(elem);
	else if(elem.class="things")
		return deleteThing(elem);
	return false;
}

/*	Vertices
*/
function createVertex(x=0, y=0){
	var v = {
		"class": "vertices",
		"x": x,
		"y": y,
		"rlines":[],
		"rsectors":[],
		"moved": false,
		"active": true,
		"selected": false,
	};
	var nearV = nearestVertex(x, y);
	if(nearV[0]==null){
		Objs.vertices.push(v);
	}else
		return nearV[0];
	return v;
}
function translateVertex(v, x=0, y=0){
	if(v.moved)
		return;
	v.x += x;
	v.y += y;
	v.moved = true;
	Objs.movedVertices.push(v);
}
function nearestVertex(x, y){
	for(var i=0; i<Objs.activeVertices.length; i++){
		var v = Objs.activeVertices[i];
		var dist = Math.distance({"x":x, "y":y}, v);
		if(dist<Tr.gap*.25){
			return [v, i];
		}
	}
	return [null, -1];
}
function transformVertex(v){
	return [(v.x+Tr.x)*Tr.zoom, (v.y+Tr.y)*Tr.zoom];
}
function deleteVertex(v){
	for(var i=0; i<Objs.vertices.length; i++){
		if(Objs.vertices[i]==v){
			Objs.vertices.splice(i, 1);
			for(var i=0; i<v.rlines.length; i++)
				deleteLine(v.rlines[i]);
			return true;
		}
	}
	return false;
}
function removeSectorFromVertex(vertex, sector){
	for(var i=0; i<vertex.rsectors.length; i++){
		if(vertex.rsectors[i]==sector){
			vertex.rsectors.splice(i, 1);
			return true;
		}
	}
	return false;
}
function removeLineFromVertex(vertex, line){
	for(var i=0; i<vertex.rlines.length; i++){
		if(vertex.rlines[i]==line){
			vertex.rlines.splice(i, 1);
			return true;
		}
	}
	return false;
}
function isEqualVertexes(v1, v2){
	return (((v1.x))==((v2.x)))&&(((v1.y))==((v2.y)));
}

/*	Lines
*/
function generateLine(x=0, y=0){
	/* Program must select someone vertex
	 * After this, create or pick any other vertex
	 * When do that, it's able to create line
	*/
	if(Objs.pickeds.length==1){
		var v1 = Objs.pickeds[0];
		var v2 = createVertex(x, y);
		if(v1==v2)
			return null;
		var l = createLine(v1, v2);
		unselectAllElements();
		selectElement(v2)
		return l;
	}else{
		var vertex = createVertex(x, y);
		selectElement(vertex);
		return null;
	}
}
function createLine(v1=createVertex(), v2=createVertex()){
	var l = {
		"class": "lines",
		"v1": v1,
		"v2": v2,
		"s1": null,
		"s2": null,
		"rsectors": [],
		"active": true,
		"twosided": false,
		"selected": false,
	}
	var sl = getSimilarLine(l);
	if(sl!=null){
		return sl;
	}
	Objs.lines.push(l);
	v1.rlines.push(l);
	v2.rlines.push(l);
	return l;
}
function translateLine(line, x=0, y=0){
	translateVertex(line.v1, x, y);
	translateVertex(line.v2, x, y);
}
function nearestLine(x, y){
	for(var i=0; i<Objs.activeLines.length; i++){
		var l = Objs.activeLines[i];
		var dist = Math.distance({"x":x, "y":y}, l.v1)+Math.distance({"x":x, "y":y}, l.v2);
		if(dist<=(Math.distance(l.v1, l.v2)+Tr.gap*.25)){
			return [l, i];
		}
	}
	return [null, -1];
}
function medianLine(line){
	return [(line.v1.x+line.v2.x)*.5, (line.v1.y+line.v2.y)*.5];
}
function deleteLine(line){
	for(var i=0; i<Objs.lines.length; i++){
		if(Objs.lines[i]==line){
			Objs.lines.splice(i, 1);
			for(var i=0; i<line.rsectors.length; i++){
				deletePolygon(line.rsectors[i]);
			}
			return true;
		}
	}
	return false;
}
function removeSectorFromLine(line, sector){
	for(var i=0; i<line.rsectors.length; i++){
		if(line.rsectors[i]==sector){
			line.rsectors.splice(i, 1);
			return true;
		}
	}
	return false;
}
function getSimilarLine(line){
	for(var i=0; i<Objs.activeLines.length; i++)
		if(isEqualLines(Objs.activeLines[i], line))
			return Objs.activeLines[i];
	return null;
}
function isEqualLines(l1, l2){
	return (isEqualVertexes(l1.v1, l2.v1)&&isEqualVertexes(l1.v2, l2.v2))||
		   (isEqualVertexes(l1.v1, l2.v2)&&isEqualVertexes(l1.v2, l2.v1));
}

/*	Polygons
*/
function appendVertexToPolygon(vertex=null){
	var poly = Objs.tmpPolygon;
	poly.vs.push(vertex);
	vertex.rsectors.push(poly);
}
function appendLineToPolygon(line=null){
	var poly = Objs.tmpPolygon;
	var forClose = false;
	if(isEqualVertexes(getLastVertexPolygon(), line.v1)){
		if(isEqualVertexes(getFirstVertexPolygon(), line.v2)){
			forClose = true;
		}else{
			poly.vs.push(line.v2);
			poly.offsets.push(1);
			line.v2.rsectors.push(poly);
		}
	}else if(isEqualVertexes(getLastVertexPolygon(), line.v2)){
		if(isEqualVertexes(getFirstVertexPolygon(), line.v1)){
			forClose = true;
		}else{
			poly.vs.push(line.v1);
			poly.offsets.push(2);
			line.v1.rsectors.push(poly);
		}
	}else{
		poly.vs.push(line.v1);
		poly.vs.push(line.v2);
		poly.offsets.push(1);
		line.v1.rsectors.push(poly);
		line.v2.rsectors.push(poly);
	}
	poly.ls.push(line);
	line.rsectors.push(poly);
	if(forClose){
		closePolygon();
		unselectAllElements();
	}
}
function closePolygon(){
	validatePolygon();
	Objs.tmpPolygon = null;
}
function validatePolygon(){
	if(Objs.tmpPolygon==null)
		return null;
	if((Objs.tmpPolygon.vs.length<3)||
		!isClosedPolygon()
		){
		deletePolygon(Objs.tmpPolygon);
		Objs.tmpPolygon = null;
		return false;
	}
	return true;
}
function generatePolygon(x=0, y=0){
	/*The polygon process creator require picking
	 *or selecting lines and vertices, if not closed
	 *or being less two sides, must be removed
	*/
	if(Objs.tmpPolygon==null){
		var poly = createPolygon();
	}else{
		
	}
	var line = generateLine(x, y);
	if(line!=null){
		appendLineToPolygon(line);
	}else{
		appendVertexToPolygon(Objs.pickeds[0]);
	}
}
function getLastVertexPolygon(){
	if(Objs.tmpPolygon==null)
		return null;
	return Objs.tmpPolygon.vs[Objs.tmpPolygon.vs.length-1];
}
function getFirstVertexPolygon(){
	if(Objs.tmpPolygon==null)
		return null;
	return Objs.tmpPolygon.vs[0];
}
function isClosedPolygon(){
	var poly = Objs.tmpPolygon;
	if(poly.ls.length<3)
		return false;
	var v = poly.vs[0];
	var l = poly.ls[poly.ls.length-1];
	if(isEqualVertexes(v, l.v1)||
		isEqualVertexes(v, l.v2))
		return true;
	return false;
}
function vertexInTempPolygon(vertex){
	if(Objs.tmpPolygon==null)
		return false;
	for(var i=0; i<Objs.tmpPolygon.vs.length; i++){
		if(Objs.tmpPolygon.vs[i]==vertex)
			return true;
	}
	return false;
}
function lineInTempPolygon(line){
	if(Objs.tmpPolygon==null)
		return false;
	for(var i=0; i<Objs.tmpPolygon.ls.length; i++){
		if(Objs.tmpPolygon.ls[i]==line)
			return true;
	}
	return false;
}
function createPolygon(){
	var poly = {
		"class": "sectors",
		"vs": [],
		"ls": [],
		"floorY": 0,
		"ceilY": 70,
		"offsets": [],
		"clockwise":null,
		"active": true,
		"selected": false,
	};
	Objs.tmpPolygon = poly;
	Objs.sectors.push(poly);
	return poly;
}
function deletePolygon(poly){
	var hasRemoved = false
	for(var i=0; i<Objs.sectors.length; i++){
		if(Objs.sectors[i]==poly){
			Objs.sectors.splice(i, 1);
			hasRemoved = true;
			break;
		}
	}
	if(hasRemoved){
		//Delete on lines and vertex
		for(var i=0; i<poly.ls.length; i++)
			removeSectorFromLine(poly.ls[i], poly);
		for(var i=0; i<poly.vs.length; i++)
			removeSectorFromVertex(poly.vs[i], poly);
	}
	return hasRemoved;
}
function translatePolygon(poly, x=0, y=0){
	for(var i=0; i<poly.vs.length; i++){
		translateVertex(poly.vs[i], x, y);
	}
}
function pickPolygon(p){
	for(var i=Objs.activeSectors.length-1; i>-1; i--){
		if(testPointInPolygon(p, Objs.activeSectors[i]))
			return Objs.activeSectors[i];
	}
	return null;
}
function pickSector(p){
	for(var i=Objs.sectors.length-1; i>-1; i--){
		if(testPointInPolygon(p, Objs.sectors[i]))
			return Objs.sectors[i];
	}
	return null;
}
function medianSector(poly){
	poly = poly instanceof Array?poly:poly.vs;
	var x = 0;
	var y = 0;
	for(var vi=0; vi<poly.length; vi++){
		x += poly[vi].x;
		y += poly[vi].y;
	}
	return {"x":x/poly.length, "y":y/poly.length};
}

function testPointInPolygon(p, poly){
	var x = p[0];
	var y = p[1]+.0000000001;
	var count = 0;
	for(var i=0; i<poly.ls.length; i++){
		var l = poly.ls[i];
		var d = (l.v2.x-l.v1.x)/(l.v2.y-l.v1.y);
		var r = l.v1.x+(y-l.v1.y)*d;
		count += (r<=x)&&((y>=l.v1.y&&y<=l.v2.y)||(y>=l.v2.y&&y<=l.v1.y));//l.v2.y-l.v1.y==0?(l.v1.y==y&&(l.v1.x<=x||l.v2.x<=x))*2:
			//(r<=x)&&((y>=l.v1.y&&y<=l.v2.y)||(y>=l.v2.y&&y<=l.v1.y));
	}
	return count%2;
}

/*	Things
*/
function createThing(x=0, y=0, type=0){
	var th = {
		"class": "things",
		"x": x,
		"y": y,
		"type": type,
		"moved": false,
		"active": true,
		"selected": false,
	};
	Objs.things.push(th);
	/*var nearV = nearestVertex(x, y);
	if(nearV[0]==null){
		Objs.vertices.push(v);
	}else
		return nearV[0];*/
	return th;
}
function nearestThing(x, y){
	for(var i=0; i<Objs.activeThings.length; i++){
		var th = Objs.activeThings[i];
		var dist = Math.distance({"x":x, "y":y}, th);
		if(dist<Tr.gap*.25){
			return [th, i];
		}
	}
	return [null, -1];
}
function deleteThing(th){
	for(var i=0; i<Objs.things.length; i++){
		if(Objs.things[i]==th){
			Objs.things.splice(i, 1);
			return true;
		}
	}
	return false;
}

/*	@Icon Handdle
*/
function clearIcAction(){
	ic_hand.style.border = "0px solid red";
	ic_move.style.border = "0px solid red";
	ic_penc.style.border = "0px solid red";
}
function clearIcStruct(){
	ic_vert.style.border = "0px solid red";
	ic_line.style.border = "0px solid red";
	ic_poly.style.border = "0px solid red";
	ic_thng.style.border = "0px solid red";
}
function setAction(ic, action){
	clearIcAction();
	ic.style.border = "4px inset red";
	if(action!="hand"&&(action!="pencil"))
		validatePolygon();
	if(action==Tr.actionMode){
		if(action=="move"){
			if(Objs.pickeds.length>0){
				unselectAllElements();
			}else{
				var t = (Tr.structMode=="vertex"?"vertice":Tr.structMode)+"s";
				//alert(t);
				var name = "active"+(t.charAt(0)).toUpperCase()+(t.substr(1,t.length));
				//alert(name);
				for(var i=0; i<Objs[name].length; i++){
					selectElement(Objs[name][i]);
				}
			}
		}
	}
	Tr.actionMode = action;
	//if(Tr.structMode=="polygon"&&Tr.actionMode=="pencil")
	//	unselectAllElements();
	redrawEditor();
}
function setStruct(ic, mode){
	clearIcStruct();
	ic.style.border = "4px inset red";
	Tr.structMode = mode;
	unselectAllElements();
	//reloadActives();
	validatePolygon();
	redrawEditor();
}

function GenerateMap(){
	//Apenas uma base para o protótipo não ficar sem nada
	var map = {
		"lines":Objs.lines,
	}
	for(var i=0; i<map.lines.length; i++){
		map.lines[i].v1.rlines = null;
		map.lines[i].v2.rlines = null;
	}
	return map
}

function initLevel(){
	var map = GenerateMap();
	localStorage.setItem("map", JSON.stringify(map));
	location.href = "../index.html";
}

setAction(ic_penc, "pencil");
setStruct(ic_vert, "vertex");

/*
 * @Windows handling for most situations
 *
*/

function entryTxt(input, text){
	input.value = prompt(text, input.value)||input.value;
}
function entryNmb(input, text){
	var n = Number(prompt(text, input.value));
	input.value = isNaN(n)||n==null?input.value:n;
}

var actWindow = windowSector;

function closeWindow(){
	if(actWindow==null)
		return;
	saveProperties();
	actWindow.style.left = "-100%";
}
function openWindow(){
	if(actWindow==null)
		return;
	loadProperties();
	actWindow.style.left = "2%";
	objLog.textContent = pretty(Objs.pickeds[0]);
}
function loadProperties(){
	var inputs = actWindow.getElementsByClassName("input");
	for(var i=0; i<Objs.pickeds.length&&i<1; i++){
		var elem = Objs.pickeds[i];
		for(var inp=0; inp<inputs.length; inp++){
			var att = inputs[inp];
			att.value = elem[att.getAttribute("attrib")];
		}
	}
}
function saveProperties(){
	var inputs = actWindow.getElementsByClassName("input");
	for(var i=0; i<Objs.pickeds.length; i++){
		var elem = Objs.pickeds[i];
		for(var inp=0; inp<inputs.length; inp++){
			var att = inputs[inp];
			var value = 
				att.getAttribute("attribMode")=="number"?Number(att.value):
				att.value;
			elem[att.getAttribute("attrib")] = value;
		}
	}
}


/*
 * @Funções logo abaixo não devem sofrer de modificações
 *  deverão ser mantidas, e mudadas somente se preciso
*/
var LASTTIME = 0;
function Animate(dt=0){
	var deltaTime = (dt-LASTTIME)*.001;
	LASTTIME = dt;
	edT.update(deltaTime);
	Update(deltaTime);
	requestAnimationFrame(Animate);
}

window.onload = function(){
	Begin();
	Animate();
}

function pretty(obj){
	return JSON.stringify(obj, [
		"class",
		"vs", "ls",
		"floorY", "ceilY",
		"v1", "v2",
		"x", "y",
		
		]);
}

redrawEditor();