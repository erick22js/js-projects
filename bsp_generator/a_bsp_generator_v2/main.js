
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
//var tou = new TouchUI(cv);

const WID = Number(cv.width);
const HEI = Number(cv.height);

var vs = [
];
var map = [
];
var lastv = null;

var rst = {
	x: 1, y: 1,
}

cv.ontouchstart = function(ev){
	var x = ev.touches[0].clientX;
	var y = ev.touches[0].clientY;
	x = (Math.round(x/64))*64;
	y = (Math.round(y/64))*64;
	var v = null;
	for(var vi=0; vi<vs.length; vi++){
		var vb = vs[vi];
		if(Math.distance(new Vertex(x, y), vb)<64){
			v = vb;
			break;
		}
	}
	v = v==null?new Vertex(x, y):v;
	vs.push(v);
	if(lastv!=null&&lastv!=v)
		map.push(new Line(lastv, v));
	lastv = v;
	render(map, vs);
}
cv.onmousedown = function(ev){
	var x = ev.clientX;
	var y = ev.clientY;
	x = (Math.round(x/32))*32;
	y = (Math.round(y/32))*32;
	var v = null;
	for(var vi=0; vi<vs.length; vi++){
		var vb = vs[vi];
		if(Math.distance(new Vertex(x, y), vb)<16){
			v = vb;
			break;
		}
	}
	var forAppend = v==null;
	v = v==null?new Vertex(x, y):v;
	if(forAppend)
		vs.push(v);
	if(lastv!=null&&lastv!=v)
		map.push(new Line(lastv, v));
	lastv = v;
	render(map, vs);
}

function render(map, vs){
	ctx.clearRect(0, 0, WID, HEI);
	ctx.lineWidth = 3;
	for(var l=0; l<map.length; l++){
		ctx.strokeStyle = map[l] instanceof Line ? "white" : "red";
		ctx.beginPath();
		ctx.moveTo(map[l].v1.x, map[l].v1.y);
		ctx.lineTo(map[l].v2.x, map[l].v2.y);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.fillStyle = "white";
	for(var v=0; v<vs.length; v++){
		ctx.fillRect(vs[v].x-3, vs[v].y-3, 6, 6);
	}
	ctx.fillStyle = "red";
	ctx.fillRect(rst.x-3, rst.y-3, 6, 6);
}
function renderPolygon(vs, ls, color){
	ctx.fillStyle = color;
	for(var i=0; i<vs.length; i++)
		ctx.fillRect(vs[i].x-4, vs[i].y-4, 8, 8);
	ctx.lineWidth = 4;
	for(var l=0; l<ls.length; l++){
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(ls[l].v1.x, ls[l].v1.y);
		ctx.lineTo(ls[l].v2.x, ls[l].v2.y);
		ctx.stroke();
		ctx.closePath();
		ctx.stroke();
	}
}
function renderNode(vs, ls, color){
	ctx.fillStyle = color;
	for(var i=0; i<vs.length; i++)
		ctx.fillRect(vs[i].x-4, vs[i].y-4, 8, 8);
	ctx.lineWidth = 4;
	for(var l=0; l<ls.length; l++){
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(ls[l].v1.x, ls[l].v1.y);
		ctx.lineTo(ls[l].v2.x, ls[l].v2.y);
		ctx.stroke();
		ctx.closePath();
		ctx.stroke();
	}
	var vertices = [];
	for(var li=0; li<ls.length; li++){
		if(!vertices.includes(ls[li].v1))
			vertices.push(ls[li].v1);
		if(!vertices.includes(ls[li].v2))
			vertices.push(ls[li].v2);
	}/*
	ctx.globalAlpha = 0.4;
	for(var vi=1; vi<vertices.length-1; vi++){
		ctx.beginPath();
		ctx.moveTo(vertices[0].x, vertices[0].y);
		ctx.lineTo(vertices[vi].x, vertices[vi].y);
		ctx.lineTo(vertices[vi+1].x, vertices[vi+1].y);
		ctx.fill();
	}
	ctx.globalAlpha = 1;*/
	console.log(vertices);
}
function renderLine(line, color){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(line.v1.x, line.v1.y);
	ctx.lineTo(line.v2.x, line.v2.y);
	ctx.stroke();
	ctx.closePath();
	ctx.stroke();
}
function renderVertex(ve, color){
	ctx.fillStyle = "black";
	ctx.fillRect(ve.x-7, ve.y-7, 14, 14);
	ctx.fillStyle = color;
	ctx.fillRect(ve.x-5, ve.y-5, 10, 10);
}

render(map, vs);

function testInter(){
	console.log(map.length);
	render(map, vs);
	nodesL = [];
	setorsList.innerHTML = "";
	splitTree(map, null, "");
	for(var i=0; i<nodesL.length; i++){
		setorsList.innerHTML += '<option value="'+i+'">node #'+i+nodesL[i].address+'</option>';
	}
	alert("BSP Tree built!");
	setorsList.value = null;
}
setorsList.onchange = function(){
	render(map, vs);
	var node = nodesL[Number(this.value)];
	console.log(node);
	if(node.lines!=null)
		renderNode([], node.lines, "purple");
	else{
		renderNode([], node.linesL, "red");
		renderNode([], node.linesR, "blue");
		for(var li=0; li<node.subSplitters.length; li++){
			renderLine(node.subSplitters[li], "green");
		}
		for(var i=0; i<node.inters.length; i++){
			renderVertex(node.inters[i], "green");
		}
		renderLine(node.splitter, "yellow");
	}
}
function closePath(){
	lastv = null;
	render(map, vs);
}
function save(){
	localStorage.setItem("*BSP::state", JSON.stringify(map))
}
function load(){
	var m = JSON.parse(localStorage.getItem("*BSP::state")||"[]");
	map = m;
	render(map, vs);
}