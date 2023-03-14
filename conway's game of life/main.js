const cv = document.getElementById("cv");
const toggleB = document.getElementById("toggleB");
const toolB = document.getElementById("toolB");
const ctx = cv.getContext("2d");
const layoutWid = 128;const layoutHei = 128;

var TIMER = 20;

var zoom = 8;

var travellableScreen = true;
var showGrid = true;
var globalX = 0;
var globalY = 0;

var threadExec;
var executionState = "ended";
/*
* "ended" para finalizado
* "paused" para pausado
* "running" para executando
*/

const dataGrid = [];
//fill data
for(var x=0;x<layoutWid;x++){
	dataGrid[x]=[];
	for(var y=0;y<layoutHei;y++)
		dataGrid[x][y] = "blank";
}

const bufferGrid = [];
//fill data
for(var x=0;x<layoutWid;x++){
	bufferGrid[x]=[];
	for(var y=0;y<layoutHei;y++)
		bufferGrid[x][y] = "blank";
}

//MÉTODO PARA ATUALIZAR A VISUALIZAÇÃO NA TELA
function redraw(){
	ctx.clearRect(0,0,256,256);
	//draw borders
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 256, 256);
	//draw cells
	for(var x=0;x<layoutWid;x++)
		for(var y=0;y<layoutHei;y++){
			ctx.fillStyle = (
				dataGrid[x][y]=="blank"?"white":
				dataGrid[x][y]=="live"?"blue":
				"red");
			ctx.fillRect((x+globalX)*zoom, (y+globalY)*zoom, zoom, zoom);
		}
	
	ctx.fillStyle = "black";
	//draw grid
	if(showGrid){
		for(var x=0;x<=256;x+=zoom)
			if(x-globalX*zoom>=0)
				ctx.fillRect(x-.5,0,1,256);
		for(var y=0;y<=256;y+=zoom)
			ctx.fillRect(0,y-.5,256,1);
	}
}
//MÉTODOS PARA EXECUÇÃO CÉLULA POR CÉLULA
function returnCountNear(x, y){
	var count = 0;
	var left = dataGrid[x-1]?x-1:layoutWid-1;
	var right = dataGrid[x+1]?x+1:0;
	var top = dataGrid[0][y-1]?y-1:layoutHei-1;
	var bottom = dataGrid[0][y+1]?y+1:0;
	//Left
	if(dataGrid[left][top]=="live") count++;
	if(dataGrid[left][y]=="live") count++;
	if(dataGrid[left][bottom]=="live") count++;
	//Right
	if(dataGrid[right][top]=="live") count++;
	if(dataGrid[right][y]=="live") count++;
	if(dataGrid[right][bottom]=="live") count++;
	//Top
	if(dataGrid[x][top]=="live") count++;
	//Down
	if(dataGrid[x][bottom]=="live") count++;
	return count;
}
function logicCell(x, y){
	bufferGrid[x][y] = dataGrid[x][y];
	switch(dataGrid[x][y]){
		case "blank":
			if(returnCountNear(x, y)==3) bufferGrid[x][y]="live";
			break;
		case "live":
			var q=returnCountNear(x, y);
			if(q<2||q>3) bufferGrid[x][y]="dead";
			break;
		case "dead":
			if(returnCountNear(x, y)==3) bufferGrid[x][y]="live";
			break;
	}
}

//MÉTODO PARA ATUALIZAR A LÓGICA DO JOGO
function resetGrid(){
	for(var x=0;x<layoutWid;x++)
		for(var y=0;y<layoutHei;y++){
			dataGrid[x][y]=bufferGrid[x][y];
			//logicCell(x, y);
		}
}
function logic(){
	for(var x=0;x<layoutWid;x++)
		for(var y=0;y<layoutHei;y++){
			logicCell(x, y);
		}
	resetGrid();
}

//MÉTODO DE ATUALIZAÇÃO DO JOGO
function update(){
	logic();
	redraw();
}

//MÉTODO ONDE IREMOS PAUSAR, RETOMAR OU INICIAR UM PROCESSO
function toggleState(){
	switch(executionState){
		case "ended":
			threadExec = setInterval(update, TIMER);
			toggleB.innerText = "Pausar";
			executionState = "running";
			break;
		case "running":
			clearInterval(threadExec);
			toggleB.innerText = "Retomar";
			executionState = "paused";
			break;
		case "paused":
			threadExec = setInterval(update, TIMER);
			toggleB.innerText = "Pausar";
			executionState = "running";
			break;
	}
}

//MÉTODO ONDE IREMOS ENCERRAR A EXECUÇÃO E RESETAR A TABELA
function abortRun(){
	clearInterval(threadExec);
	toggleB.innerText = "Iniciar";
	executionState = "ended";
	for(var x=0;x<layoutWid;x++)
		for(var y=0;y<layoutHei;y++)
			dataGrid[x][y] = "blank";
	redraw();
}

//GATILHOS PARA FAZER O DESENHO DE CÉLULAS NA TELA

function drawInGrid(x, y){
	//x=x<0?0:x>256/zoom-1?256/zoom-1:x;
	//y=y<0?0:y>256/zoom-1?256/zoom-1:y;
	dataGrid[x-globalX][y-globalY] = toolB.value;
}

const touchMove = {
	lastX:0,
	lastY:0
}

function evalTouch(ev){
	var x = ~~(ev.touches[0].clientX/zoom);
	var y = ~~(ev.touches[0].clientY/zoom);
	return [x, y];
}
function evalClick(ev){
	var x = ~~(ev.clientX/zoom-1);
	var y = ~~(ev.clientY/zoom-1);
	return [x, y];
}

var ismouse = false;
cv.onmousedown = function(ev){
	ismouse = true;
	var evalued = evalClick(ev);
	var x = evalued[0]; var y = evalued[1];
	if(toolB.value!="mover"){
		drawInGrid(x, y);
	}else{
		touchMove.lastX = x;
		touchMove.lastY = y;
	}
	redraw();
	
}
window.onmouseup = function(ev){
	ismouse = false;
	
}
cv.onmousemove = function(ev){
	if(!ismouse)
		return;
	var evalued = evalClick(ev);
	var x = evalued[0]; var y = evalued[1];
	if(toolB.value!="mover"){
		drawInGrid(x, y);
	}else{
		globalX -= touchMove.lastX-x;
		globalY -= touchMove.lastY-y;
		touchMove.lastX = x;
		touchMove.lastY = y;
	}
	redraw();
	
}
cv.ontouchstart = function(ev){
	var evalued = evalTouch(ev);
	var x = evalued[0]; var y = evalued[1];
	if(toolB.value!="mover"){
		drawInGrid(x, y);
	}else{
		touchMove.lastX = x;
		touchMove.lastY = y;
	}
	redraw();
	
}
cv.ontouchmove = function(ev){
	var evalued = evalTouch(ev);
	var x = evalued[0]; var y = evalued[1];
	if(toolB.value!="mover"){
		drawInGrid(x, y);
	}else{
		globalX -= touchMove.lastX-x;
		globalY -= touchMove.lastY-y;
		touchMove.lastX = x;
		touchMove.lastY = y;
	}
	redraw();
}



update();