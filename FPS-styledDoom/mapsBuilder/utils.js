
const listMaps = document.getElementById("listMaps");

function containMap(name) {
	//var s = new HTMLSelectElement();
	for (var i in listMaps.options) {
		if (listMaps.options[i].text == name)
			return i;
	}
	return -1;
}

function createMap(tag) {
	dataGame.maps[tag] = '{"vertex":[],"lines":[],"sectors":[],"sectorI":0}';
	if (containMap(tag) == -1) {
		var op = document.createElement("option");
		op.text = tag;
		listMaps.add(op);
	}
	loadMap(tag);
}
function saveMap(tag) {
	var meshs = [];
	for (var v in vertex) {
		vertex[v].ind = v;
	} for (var l in lines) {
		lines[l].ind1 = lines[l].v1.ind;
		lines[l].ind2 = lines[l].v2.ind;
	} for (var s in sectors) {
		sectors[s].indV = [];
		for (var i = 0; i < sectors[s].vertex.length; i++)
			sectors[s].indV.push(sectors[s].vertex[i].ind);
	} for (var s in sectors) {
		meshs.push(tri_gen_mesh(sectors[s].vertex));
	}
	var data = {
		vertex: vertex,
		lines: lines,
		sectors: sectors,
		meshs: meshs,
		sectorI: sectorI
	}
	sectorI = sectors.length;
	dataGame.maps[tag] = JSON.stringify(data);
	if (containMap(tag) == -1) {
		var op = document.createElement("option");
		op.text = tag;
		listMaps.add(op);
	}
}
function loadMap(tag) {
	var data = JSON.parse(dataGame.maps[tag]);
	vertex = data.vertex;
	lines = data.lines;
	sectors = data.sectors;
	listMaps.selectedIndex = containMap(tag);
	for (var l in lines) {
		lines[l].v1 = vertex[lines[l].ind1];
		lines[l].v2 = vertex[lines[l].ind2];
	} for (var s in sectors) {
		var size = sectors[s].vertex.length;
		sectors[s].vertex = [];
		for (var i = 0; i < size; i++)
			sectors[s].vertex.push(vertex[data.sectors[s].indV[i]]);
	}
	sectorI = sectors.length;
	sectorI = data.sectorI;
}
function importMap(){
	pickAndReadFiles("text", false, false, function(data){
		data = data[0]
		var data = JSON.parse(data);
		vertex = data.vertex;
		lines = data.lines;
		sectors = data.sectors;
		for (var l in lines) {
			lines[l].v1 = vertex[lines[l].ind1];
			lines[l].v2 = vertex[lines[l].ind2];
		}for (var s in sectors) {
			var size = sectors[s].indV.length;
			sectors[s].vertex = [];
			for (var i = 0; i < size; i++)
				sectors[s].vertex.push(vertex[data.sectors[s].indV[i]]);
		}
	}, "json")
}
function exportMap(data) {
	var data = JSON.parse(data);
	var vertex = data.vertex; var lines = data.lines; var sectors = data.sectors;
	var mapData = { vertex: [], walls: [], sector: [] };
	for (var v in vertex) {
		vertex[v].ind = v;
		mapData.vertex.push([vertex[v].x, vertex[v].y]);
	}
	for (var l in lines) {
		lines[l].ind = l;
		mapData.walls.push({
			v1: lines[l].v1.ind
			, v2: lines[l].v2.ind
			, textureXU: lines[l].textureXU, textureYU: lines[l].textureYU
			, textureXM: lines[l].textureXM, textureYM: lines[l].textureYM
			, textureXD: lines[l].textureXD, textureYD: lines[l].textureYD
			, textureU: lines[l].sidedef ? lines[l].textureU : lines[l].textureD
			, textureM: lines[l].textureM
			, textureD: lines[l].sidedef ? lines[l].textureD : lines[l].textureU
			, sidedef: lines[l].sidedef
			, barrier: lines[l].barrier
			, sector: lines[l].sector
		})
	}
	for (var s in sectors) {
		mapData.sector.push({
			walls: []
			, region: []
		});
		for (var l in lines)
			if (valueInList(s, lines[l].sector) > -1) {
				mapData.sector[s].walls.push(lines[l].ind)
			}
		for (var v in sectors[s].vertex)
			mapData.sector[s].region.push({ x: sectors[s].vertex[v].x, y: sectors[s].vertex[v].y });
		mapData.sector[s].textureU = sectors[s].textureU;
		mapData.sector[s].textureD = sectors[s].textureD;
		mapData.sector[s].ceilY = sectors[s].ceilY;
		mapData.sector[s].floorY = sectors[s].floorY;
		mapData.sector[s].color = sectors[s].color;
		mapData.sector[s].colorFog = sectors[s].colorFog;
		mapData.sector[s].distanceFogMin = sectors[s].distanceFogMin;
		mapData.sector[s].distanceFogMax = sectors[s].distanceFogMax;
	}
	sectorI = sectors.length;
	var st = JSON.stringify(mapData);
	/*alert("$ExPoRtEd$&MaP:" + tag)
	localStorage.setItem("$ExPoRtEd$&MaP:" + tag, st);*/
	return st;
}

function saveProject(nameFile) {
	saveFile(JSON.stringify(dataGame), "data.pwod");
}
function loadProject() {
	pickAndReadFiles("text", false, false, function (dat) {
		var strDat = dat[0];
		dataGame = JSON.parse(strDat);
		lists.Wall.innerHTML = "";
		lists.Flat.innerHTML = "";
		//lists.sprites.innerHTML = "";
		for (var i in dataGame.texturesWall)
			addTextureIndex(dataGame.texturesWall[i], i, "Wall")
		for (var i in dataGame.texturesFlat)
			addTextureIndex(dataGame.texturesFlat[i], i, "Flat")
		for (var i in dataGame.texturesSprites)
			addTextureIndex(dataGame.texturesSprites[i], i, "sprites")

		listMaps.length = 0;
		for (var i in dataGame.maps) {
			var op = document.createElement("option");
			op.text = i;
			listMaps.add(op);
		}
		listMaps.value = null;
		
	},".pwod")
}
function exportProject(nameFile) {
	var data = { maps: {} };
	for (var i in dataGame.maps) {
		data.maps[i] = exportMap(dataGame.maps[i]);
	}
	saveFile(JSON.stringify(data), "data.wod");
}



function pickAndReadFiles(mode, multiples, registerByName, callback, extensions) {
	//Mode can be: "url", "binary", "buffer", "text" or anyone
	extensions = extensions || "*";
	//extensions example: ".png", ".png,.gif,.bmp", ".ogg,.wav", "text/plain"
	var inp = document.createElement("input");
	inp.type = "file";
	inp.accept = extensions;
	inp.multiple = multiples;
	var data = registerByName ? {}:[];
	inp.oninput = function () {
		var rd = new FileReader();
		if (inp.files.length > 0) {
			indEmUiPlçAAAccvvHJKLKLqqq = 0;
			rd.onload = function (r) {
				if (registerByName) data[inp.files[indEmUiPlçAAAccvvHJKLKLqqq].name] = rd.result
				else data.push(rd.result);
				indEmUiPlçAAAccvvHJKLKLqqq += 1;
				if (indEmUiPlçAAAccvvHJKLKLqqq < inp.files.length) {
					switch (mode) {
						case "url": rd.readAsDataURL(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
						case "binary": rd.readAsBinaryString(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
						case "buffer": rd.readAsArrayBuffer(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
						case "text": default: rd.readAsText(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
					}
				}
				else callback(data);
			}
			switch (mode) {
				case "url": rd.readAsDataURL(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
				case "binary": rd.readAsBinaryString(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
				case "buffer": rd.readAsArrayBuffer(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
				case "text": default: rd.readAsText(inp.files[indEmUiPlçAAAccvvHJKLKLqqq]); break;
			}
		}
		console.log(inp.files)
	}
	inp.click();
}



var lists;


function reimportTexture(dest) {
	dest = dest == 1 ? "Wall" : dest == 2 ? "Flat" : "sprites";
	pickAndReadFiles("url", true, false, function (data) {
		lists.Wall.hidden = "hidden";
		lists.Flat.hidden = "hidden";
		lists.sprites.hidden = "hidden";
		lists[dest].hidden = null;
		dataGame["textures" + dest] = {}
		lists[dest].innerHTML = "";
		for (var i in data) {
			var img = document.createElement("img");
			img.src = data[i];
			dataGame["textures" + dest][i] = data[i];
			lists[dest].innerHTML = elementListTexturesWall.innerHTML + "<hr><h2>" + "#" + i + "</h2>";
			lists[dest].appendChild(img);
		}
	})
}
function addTexture(dest) {
	dest = dest == 1 ? "Wall" : dest == 2 ? "Flat" : "sprites";
	pickAndReadFiles("url", true, false, function (data) {
		lists.Wall.hidden = "hidden";
		lists.Flat.hidden = "hidden";
		lists.sprites.hidden = "hidden";
		lists[dest].hidden = null;
		var size = dataGame["textures" + dest].length;
		for (var i in data) {
			var img = document.createElement("img");
			img.src = data[i];
			dataGame["textures" + dest][i] = data[i];
			lists[dest].innerHTML = elementListTexturesWall.innerHTML + "<hr><h2>" + "#" + i + "</h2>";
			lists[dest].appendChild(img);
		}
	})
}



function addTextureIndex(uri, tag, dest) {
	var img = document.createElement("img");
	img.src = uri;
	lists[dest].innerHTML = lists[dest].innerHTML + "<hr><h2>" + "#" + tag + "</h2>";
	lists[dest].appendChild(img);
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
		var dat = dataGame.texturesWall[i];
		var img = document.createElement("img");
		img.src = dat;
		elementListTexturesWall.appendChild(document.createElement("hr"));
		var tag = document.createElement("h2"); tag.innerHTML = "#" + i;
		elementListTexturesWall.appendChild(tag);
		elementListTexturesWall.appendChild(img);
	}
	for (var i in texturePack.ceil) {
		var dat = dataGame.texturesFlat[i];
		var img = document.createElement("img")
		img.src = dat;
		elementListTexturesCeil.appendChild(document.createElement("hr"));
		var tag = document.createElement("h2"); tag.innerHTML = "#" + i;
		elementListTexturesCeil.appendChild(tag);
		elementListTexturesCeil.appendChild(img);
	}
}



function saveFile(data, filename) {
	var a = document.createElement("a");
	a.href = "data:text/plain;charse=utf-8," + encodeURIComponent(data);
	a.download = filename;
	//document.body.appendChild(a);
	a.click();
	//document.body.removeChild(a);
}

