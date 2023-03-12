
ctxp.lineWidth = 6;


var actMap = {};
var lineWalls = [];
var sectors = [];

loadMap(JSON.parse(localStorage.getItem("$ExPoRtEd$&MaP:" + prompt("Insira o nome do mapa:", localStorage.getItem("~~MaPnAmE¹?!") || "myMap"))));

/* Transformações
	x' = x;  depth' = z;  altitude = y;
	
	x = 
	
*/

var g = 0;
var stripsDrawn = 0;

var DELTATIME = 0;
var then = 0;
function update(now)
{
	DELTATIME = (now-then)*.001;
	then = now;
	//1/DELTATIME;
	var str = JSON.stringify(lineWalls[0][0]);while (str.indexOf(",") > -1){str = str.replace(",", "<br>");}
	//dbg.innerHTML = str;
	;
	gl.clearColor(1,1,1,1, true);
	
	ctxp.clearRect(-512, -512, 1028, 1028);
	ctxp.fillRect(-2, -2, 4, 4);
	ctxp.beginPath();
	ctxp.moveTo(0,0);
	ctxp.lineTo(Math.cos(0)*64,Math.sin(0)*64);
	ctxp.stroke();
	ctxp.beginPath();
	ctxp.moveTo(0,0);
	ctxp.lineTo(Math.cos(WorldMatrix.fov)*256,Math.sin(WorldMatrix.fov)*256);
	ctxp.stroke();
	ctxp.beginPath();
	ctxp.moveTo(0,0);
	ctxp.lineTo(Math.cos(-WorldMatrix.fov)*256,Math.sin(-WorldMatrix.fov)*256);
	ctxp.stroke();
	
	
	movePlayer();
	//console.log(WorldMatrix);
	
	renderVisiblesSector();
	
	WorldMatrix.rotation=WorldMatrix.rotation>Math.PI?WorldMatrix.rotation-Math.PI*2:WorldMatrix.rotation<-Math.PI?Math.PI*2+WorldMatrix.rotation:WorldMatrix.rotation;
	gl.raster();
	requestAnimationFrame(update)
}

window.onload = function () {
	genTextureResources(textureDataWall);
	genTextureResources(textureDataCeil);
	texturesSTored.push(gl.createTexture(imagem));
	texturesSTored.push(gl.createTexture(floorTexture));
	texturesSky.push(gl.createTexture(skyImg));
	gl.bindTexture(texturesSTored[0]);
	update();
}




function loadMap(mapData) {
	actMap = JSON.parse(JSON.stringify(mapData));
	for (var s in mapData.sector) {
		sectors.push([]);
		var sec = actMap.sector[s];
		sec.index = Number(s);
		sec.minX = Infinity; sec.minY = Infinity;
		sec.maxX = -Infinity; sec.maxY = -Infinity;
		lineWalls.push([]);
		for (var w in mapData.sector[s].walls) {
			var wall = mapData.walls[mapData.sector[s].walls[w]];
			if (wall.sidedef && (wall.sector[0] != Number(s)))
				continue;
			var v1 = mapData.vertex[wall.v1];
			var v2 = mapData.vertex[wall.v2];
			var aWall = {
				v1: v1, v2: v2, textureU: wall.textureU, textureM: wall.textureM, textureD: wall.textureD,
				sector: wall.sector, sidedef: wall.sidedef
			};
			aWall.inSector = s;
			//alert(v1[0])
			//var wall
			lineWalls[s].push(aWall);
			sec.minX = v1[0] < sec.minX ? v1[0] : sec.minX;
			sec.minY = v1[1] < sec.minY ? v1[1] : sec.minY;
			sec.maxX = v1[0] > sec.maxX ? v1[0] : sec.maxX;
			sec.maxY = v1[1] > sec.maxY ? v1[1] : sec.maxY;
			sec.minX = v2[0] < sec.minX ? v2[0] : sec.minX;
			sec.minY = v2[1] < sec.minY ? v2[1] : sec.minY;
			sec.maxX = v2[0] > sec.maxX ? v2[0] : sec.maxX;
			sec.maxY = v2[1] > sec.maxY ? v2[1] : sec.maxY;
			sectors[s].push(lineWalls[lineWalls.length - 1]);
		}
	}
}


function genImagesResources(listImagesUri) {
	for (var i in listImagesUri) {
		var img = new Image();
		img.src = listImagesUri[i];
		listImagesUri[i] = img;
	}
}
function genTextureResources(listImages) {
	for (var i in listImages) {
		listImages[i] = gl.createTexture(listImages[i]);
	}
}
genImagesResources(textureDataWall);
genImagesResources(textureDataCeil);


