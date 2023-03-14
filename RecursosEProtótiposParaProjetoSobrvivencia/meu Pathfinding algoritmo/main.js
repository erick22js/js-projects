var cv = document.getElementById("cv");
var dbg = document.getElementById("debg");
var ctx = cv.getContext("2d");

var mapa = [

];
for(var y=0;y<20;y++){
	var line = [];
	for(var x=0;x<30;x++){
		//é obstaculo, valor de proximidade, foi verificado
		line.push([false, 0, false]);
	}
	mapa.push(line);
}

var gstart = [0,0];
var gend = [25,17];
var gp = [0,0];

function redrawMap(){
	for(var y=0;y<mapa.length;y++){
		var line = [];
		for(var x=0;x<mapa[y].length;x++){
			//é obstaculo, valor de proximidade, foi verificado
			ctx.strokeStyle = "black";
			ctx.fillStyle = 
				gp[0]==x&gp[1]==y?"green":
				gstart[0]==x&&gstart[1]==y?"blue":
				gend[0]==x&&gend[1]==y?"purple":
				mapa[y][x][0]?"black":
				mapa[y][x][2]?"red":"white";
			ctx.fillRect(x*30, y*30, 30, 30);
			ctx.strokeRect(x*30, y*30, 30, 30);
		}
	}
	requestAnimationFrame(redrawMap);
}





var tries = 5;
function calculatePath(start, end, map){
	map[start[1]][start[0]][2] = true;
	var pointAct = [start[0], start[1]]; //Actual point
	var pointA = [start[0], start[1]]; //begin
	var pointB = [end[0], end[1]]; //end
	if(start[0]==end[0]&&start[1]==end[1])
		return [[0, 0]];
	var coords = {
	top:[
		pointAct[1]>0? Math.abs(pointB[0]-pointAct[0])+Math.abs(pointB[1]-(pointAct[1]-1)):Infinity,
		pointAct[1]>0? map[pointAct[1]-1][pointAct[0]][0]:true,
		pointAct[1]>0? map[pointAct[1]-1][pointAct[0]][2]:true,
		[0, -1]
	],
	down:[
		pointAct[1]<19? Math.abs(pointB[0]-pointAct[0])+Math.abs(pointB[1]-(pointAct[1]+1)):Infinity,
		pointAct[1]<19? map[pointAct[1]+1][pointAct[0]][0]:true,
		pointAct[1]<19? map[pointAct[1]+1][pointAct[0]][2]:true,
		[0, 1]
	],
	left:[
		pointAct[0]>0? Math.abs(pointB[0]-(pointAct[0]-1))+Math.abs(pointB[1]-pointAct[1]):Infinity,
		pointAct[0]>0? map[pointAct[1]][pointAct[0]-1][0]:true,
		pointAct[0]>0? map[pointAct[1]][pointAct[0]-1][2]:true,
		[-1, 0]
	],
	right:[
		pointAct[0]<29? Math.abs(pointB[0]-(pointAct[0]+1))+Math.abs(pointB[1]-pointAct[1]):Infinity,
		pointAct[0]<29? map[pointAct[1]][pointAct[0]+1][0]:true,
		pointAct[0]<29? map[pointAct[1]][pointAct[0]+1][2]:true,
		[1, 0]
	]
	}
	var freePaths = 0;
	for(var i in coords){
		if(!coords[i][1]&&!coords[i][2]){
			freePaths++;
		}
	}
	var less = Infinity;
	var selected = "none";
	while(freePaths>0){
		for(var i in coords){
			if(coords[i][0]<less&&!coords[i][1]&&!coords[i][2]){
				less = coords[i][0];
				selected = i;
			}
		}
		less = Infinity;
		if(selected!="none"){
			freePaths--;
			var adc = coords[selected][3];
			var res = calculatePath([start[0]+adc[0],start[1]+adc[1]], end, map);
			if(res){
				//alert(adc);
				return ([adc]).concat(res);
			}
			else{
				delete coords[selected];
				selected = "none";
			}
		}else{
			return null;
		}
	}
	return null;
}
function trimPath(steps){
	var i=0;
	while(true){
		var coord = [0,0];
		if(i>=steps.length) return steps;
		for(var i2=i; i2<steps.length; i2++){
			coord[0]+=steps[i2][0];
			coord[1]+=steps[i2][1];
			//alert("actI: "+i+"\nactI2: "+i2+"\nactCoords: "+coord);
			if(i2>i+1){
				if(coord[0]==1&&coord[1]==0){//&&steps[i2-1][0]!=1){
					steps.splice(i+1, i2-(i+1), [1, 0]);
					break;
				}
				else if(coord[0]==-1&&coord[1]==0){//&&steps[i2-1][0]!=-1){
					steps.splice(i+1, i2-(i+1), [-1, 0]);
					break;
				}
				else if(coord[0]==0&&coord[1]==1){//&&steps[i2-1][1]!=1){
					steps.splice(i+1, i2-(i+1), [0, 1]);
					break;
				}
				else if(coord[0]==0&&coord[1]==-1){//&&steps[i2-1][1]!=-1){
					steps.splice(i+1, i2-(i+1), [0, -1]);
					break;
				}
			}
		}
		i++
	}
	return steps;
}

var path = [];
var pathing = false;

function startPath(){
	path = calculatePath(gp, gend, mapa);
	//alert(JSON.stringify(path));
	if(!path){
		alert("can't find any path");
		path = [];
		for(var y in mapa)
			for(var x in mapa[y])
				mapa[y][x][2] = false;
	}else{
		//alert(JSON.stringify(trimPath(JSON.parse(JSON.stringify(path)))));
		path = trimPath(path);
		pathing = true;
	}
}

function init(){
	//pointAct = JSON.parse(JSON.stringify(pointA));
	redrawMap();
	setTimeout(update, 0);
}

function update(){
	
	//Lógica de busca de caminho
	if(pathing){
		if(path.length>0){
			//alert("x:"+gp[0]+"; y:"+gp[1]);
			gp[0]+=path[0][0];
			gp[1]+=path[0][1];
			path.splice(0,1);
		}else{
			for(var y in mapa)
				for(var x in mapa[y])
					mapa[y][x][2] = false;
			gp = [gstart[0], gstart[1]];
			pathing = false;
			path = [];
		}
	}
	setTimeout(update, 100);
}



cv.ontouchstart = cv.ontouchmove = function(ev){
	mapa[~~(ev.touches[0].clientY/30)][~~(ev.touches[0].clientX/30)][0] = true;
}

cv.onmousedown = function(ev){
	mapa[~~(ev.clientY/30.5)][~~(ev.clientX/30.5)][0] = !mapa[~~(ev.clientY/30.5)][~~(ev.clientX/30.5)][0];
}

init();
