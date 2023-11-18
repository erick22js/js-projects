
var modif = 0;
var ago = 1;
function pickAndReadFiles(mode, multiples, registerByName, callback) {
	//Mode can be: "url", "binary", "buffer", "text" or anyone
	var inp = document.createElement("input");
	inp.type = "file";
	inp.multiple = multiples;
	var data = registerByName ? {} : [];
	inp.oninput = function () {
		var rd = new FileReader();
		if (inp.files.length > 0) {
			indvaldecfilseledifre = 0;
			rd.onload = function (r) {
				if (registerByName) data[inp.files[indvaldecfilseledifre].name] = rd.result
				else data.push(rd.result);
				indvaldecfilseledifre += 1;
				if (indvaldecfilseledifre < inp.files.length) {
					switch (mode) {
						case "url": rd.readAsDataURL(inp.files[indvaldecfilseledifre]); break;
						case "binary": rd.readAsBinaryString(inp.files[indvaldecfilseledifre]); break;
						case "buffer": rd.readAsArrayBuffer(inp.files[indvaldecfilseledifre]); break;
						case "text": default: rd.readAsText(inp.files[indvaldecfilseledifre]); break;
					}
				}
				else callback(data);
			}
			switch (mode) {
				case "url": rd.readAsDataURL(inp.files[indvaldecfilseledifre]); break;
				case "binary": rd.readAsBinaryString(inp.files[indvaldecfilseledifre]); break;
				case "buffer": rd.readAsArrayBuffer(inp.files[indvaldecfilseledifre]); break;
				case "text": default: rd.readAsText(inp.files[indvaldecfilseledifre]); break;
			}
		}
		console.log(inp.files)
	}
	inp.click();
}


ctxp.lineWidth = 6;

var dataGame;

var actMap = {};
var lineWalls = [];
var sectors = [];

const RAYS = [];
for (var a = -WorldMatrix.fov; a <= WorldMatrix.fov; a += WorldMatrix.fov / (WIDTH * .5))
	RAYS.push(a);

var DELTATIME = 0;
var then = 0;
function update(now)
{
	DELTATIME = (now-then)*.001;
	then = now;
	//1/DELTATIME;
	//var str = JSON.stringify(lineWalls[0][0]);while (str.indexOf(",") > -1){str = str.replace(",", "<br>");}
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

	WorldMatrix.lookf = Math.tan(WorldMatrix.inclination);
	movePlayer();
	
	renderVisiblesSector();
	
	WorldMatrix.rotation=WorldMatrix.rotation>Math.PI?WorldMatrix.rotation-Math.PI*2:WorldMatrix.rotation<-Math.PI?Math.PI*2+WorldMatrix.rotation:WorldMatrix.rotation;
	gl.raster();
	requestAnimationFrame(update)
}

window.onload = function () {
}




function loadMap(mapData) {
	actMap = JSON.parse(JSON.stringify(mapData));
	for (var s in mapData.sector) {
		sectors.push([]);
		var sec = actMap.sectors[s];
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
				v1: v1, v2: v2, cosdir: 1 - ((Math.abs(Math.cos(angle(v1[0], v1[1], v2[0], v2[1])))) + 1) * .32,
				textureU: wall.textureU, textureM: wall.textureM, textureD: wall.textureD,
				textureXU: wall.textureU > -1 ? wall.textureXU / textureDataWall[wall.textureU].width : 0,
				textureYU: wall.textureU > -1 ? wall.textureYU / textureDataWall[wall.textureU].height : 0,
				textureXM: wall.textureM > -1 ? wall.textureXM / textureDataWall[wall.textureM].width : 0,
				textureYM: wall.textureM > -1 ? wall.textureYM / textureDataWall[wall.textureM].height : 0,
				textureXD: wall.textureD > -1 ? wall.textureXD / textureDataWall[wall.textureD].width : 0,
				textureYD: wall.textureD > -1 ? wall.textureYD / textureDataWall[wall.textureD].height : 0, 
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
	for (var i = 0; i < listImagesUri.length;i++) {
		var img = new Image();
		img.src = listImagesUri[i];
		listImagesUri[i] = img;
		img.ind = i;
		if (i == listImagesUri.length - 1)
			img.onload = function () {
				genTextureResources(listImagesUri);
				//listImagesUri[this.ind] = gl.createTexture(listImagesUri[this.ind]);
			}
	}
}

var loadedImages = 2;

function genTextureResources(listImages) {
	for (var i in listImages) {
		listImages[i] = gl.createTexture(listImages[i]);
		if (Number(i) == listImages.length - 1) {
			loadedImages--;
			if (loadedImages == 0) {
				alert("textures generated!")
				initialize2();
			}
		}
	}
}

function initialize() {
	pickAndReadFiles("txt", false, false, function (data) {
		dataGame = JSON.parse(data[0]);
		genImagesResources(textureDataWall);
		genImagesResources(textureDataCeil);
	})
}

function initialize2() {
	loadMap(JSON.parse(dataGame.maps["E1M1"]));
	update();
}
