
const $GetId = (id) => document.getElementById(id);
const valToIndex = (val) => [val%16 ,~~(val/16)];
const SCREEN_WIDTH = window.innerWidth;
//window.screen.width;
const SCREEN_HEIGHT = window.innerHeight;
//window.screen.height;
const TILESRC = new Image();
TILESRC.src = "tiles.png";
const TILEMASKSRC = new Image();
TILEMASKSRC.src = "masks_tiles.png";
const MAPWINDOWWID = 20;
const MAPWINDOWHEI = 12;

//DADOS DE PROJETO
var projectData = {
	projactid: 10000,
	maps : [],
	characters : [],
	items : [],
	setings : {
		titleGame : "My RPG Game",
		version : "1.0",
		//gaming properties below
	}
}
var actualMapIndex = 0;
var actualMapData;

//Operações com mapa
function resetMap(ind){
	projectData.projactid++;
	actualMapData = {
		name: "Mapa"+(listMaps.length),
		id: projectData.projactid,
		tiles : [],
		colision : [],
		zones : [],
		events : []
	}
	for(var layer = 0; layer<3; layer++){
		var table = [];
		for(var y=0; y<MAPWINDOWHEI; y++){
			var line = [];
			for(var x=0; x<MAPWINDOWWID; x++){
				line.push(layer==0?[0, 0, 0, 0, 0, 0]:-1);
			}
			table.push(line);
		}
		actualMapData.tiles.push(table);
	}
	for(var y=0; y<MAPWINDOWHEI; y++){
			var line = [];
			for(var x=0; x<MAPWINDOWWID; x++){
				line.push(0);
			}
			actualMapData.colision.push(line);
		}
	projectData.maps[ind] = JSON.stringify(actualMapData);
	redrawMap();
}
function saveMap(){
	projectData.maps[actualMapIndex] = JSON.stringify(actualMapData);
}
function loadMap(){
	actualMapData = JSON.parse(projectData.maps[actualMapIndex]);
	redrawMap();
}
function addMap(){
	saveMap();
	actualMapIndex++;
	listMaps.add(new Option("Mapa"+(listMaps.length+1),""),actualMapIndex);
	projectData.maps.splice(actualMapIndex,0,{});
	listMaps.selectedIndex = actualMapIndex;
	resetMap(actualMapIndex);
	document.getElementById('nameMap').value=actualMapData.name
}
function delMap(){
	if(listMaps.length==1)
		alert("Você não pode apagar o último mapa!");
	else{
		listMaps.remove(actualMapIndex);
		projectData.maps.splice(actualMapIndex, 1);
		actualMapIndex = actualMapIndex==0?0:actualMapIndex-1;
		listMaps.selectedIndex = actualMapIndex;
		loadMap();
	}
}
function renameMap(name){
	listMaps.add(new Option(name,""),actualMapIndex+1);
	listMaps.remove(actualMapIndex);
	listMaps.selectedIndex = actualMapIndex;
	actualMapData.name = name;
}
function redrawMap(){
	ctxMap.clearRect(0, 0, MAPWINDOWWID*32, MAPWINDOWHEI*32);
	for(var layer = 0; layer<3; layer++){
		for(var y=0; y<MAPWINDOWHEI; y++){
			for(var x=0; x<MAPWINDOWWID; x++){
				if(actualMapData.tiles[layer][y][x] != -1){
					var tileA = actualMapData.tiles[layer][y][x];
					var ind = valToIndex(tileA[0]);
					ctxMap.globalAlpha = actualLayerMap==layer?1:modeMapEditing=="draw"?0.4:1;
					ctxMap.drawImage(TILESRC, ind[0]*32, ind[1]*32, 32, 32, x*32, y*32, 32, 32);
				}
			}
		}
	}
	
	if(modeMapEditing=="colision"){
		for(var y=0; y<MAPWINDOWHEI; y++){
			for(var x=0; x<MAPWINDOWWID; x++){
				if(actualMapData.colision[y][x]==1){
					ctxMap.fillStyle = "rgba(255,0,0,.4)";
					ctxMap.strokeStyle = "red";
					ctxMap.strokeRect(x*32, y*32, 32, 32);
					ctxMap.fillRect(x*32, y*32, 32, 32);
				}
			}
		}
	}
	
	ctxMap.globalAlpha = 1;
}
function executeMap(){
	saveMap();
	sessionStorage.setItem("project",JSON.stringify(projectData));
	document.location = "exec.html";
}

//LayoutScreens
var sectionsEditor = {
mapSection:$GetId("mapSection"),
charSection:$GetId("charSection")
};
var mapVisual = $GetId("mapVisual");
var palleteTileVisual = $GetId("palleteTilePick");



//STARTING PROPERTIES INITIALS
function setWindow(tag){
	palleteTileVisual.style.top= "-101%";
	for(var i in sectionsEditor){
		sectionsEditor[i].style.top = "-101%";
	}
	sectionsEditor[tag].style.top = "0%"
}
setWindow('mapSection');


//SETTING VISUAL CANVAS
const ratioMap = 100*(SCREEN_HEIGHT/SCREEN_WIDTH)*(MAPWINDOWWID/MAPWINDOWHEI);
console.log(ratioMap);
mapVisual.width = MAPWINDOWWID*32+"";
mapVisual.height = MAPWINDOWHEI*32+"";
mapVisual.style.width = ratioMap+"%";
mapVisual.style.left = (100-ratioMap)*0.5+"%";

var actualLayerMap = 0;
var modeMapEditing = "draw";

const ctxMap = mapVisual.getContext("2d");
ctxMap.imageSmoothingEnabled = false;
var mouseDown = false;

var listMaps = $GetId("selectionMap");
var indTextureElm = $GetId("indexTexture");
var delMapOption = $GetId("optionDeleteMap");

//TextureIndexBase -- TextureIndexTop -- maskIndex -- flipX -- flipY -- showShadow
var indexTextureToDraw = [0, 0, 0, 0, 0, 0];
var textureMode = 0;

function editMap(event){
	var rect = mapVisual.getBoundingClientRect();
	var x = (event.clientX-rect.left)*(MAPWINDOWWID*32/rect.width);
	var y = (event.clientY-rect.top)*(MAPWINDOWHEI*32/rect.height);
	switch(modeMapEditing){
		case "draw":
			actualMapData.tiles[actualLayerMap][~~(y/32)][~~(x/32)] = !delMapOption.checked ? JSON.parse(JSON.stringify(indexTextureToDraw)) : -1;
			break;
		case "colision":
			actualMapData.colision[~~(y/32)][~~(x/32)] = !delMapOption.checked ? 1 : 0;
			break;
	}
	redrawMap();
}

mapVisual.onmousedown = function(event){
	mouseDown=true;
	editMap(event);
}
window.onmouseup = function(){mouseDown=false}
mapVisual.onmousemove = function(event){
	if(mouseDown){
		editMap(event);
	}
}

//Executar após carregamento de página
var palTabTiles = $GetId("tableTiles")
function loadTiles(){
	for(var y=0; y<16; y++){
		var line = document.createElement("div");
		line.style.width = "100%";
		line.style.height = "11%";
		line.style.display = "flex";
		for(var x=0; x<16; x++){
			var cell = document.createElement("canvas");
			cell.style.border = "1px solid black";
			cell.style.width = "6%";
			cell.style.height = "100%";
			cell.width = cell.height = "32";
			cell.style.imageRendering = "pixelated";
			cell.getContext("2d").drawImage(TILESRC, x*32, y*32, 32, 32, 0, 0, 32, 32);
			cell.value = y*16+x;
			cell.onclick = function(){
				$GetId("mainTexture").style.backgroundImage = "url("+cell.url+")";
				indexTextureToDraw[textureMode] = this.value;
				palleteTileVisual.style.top='-101%';
			}
			line.appendChild(cell);
		}
		palTabTiles.appendChild(line);
	}
}
//Função de carregamento de dados existentes
function reloadmapslist(){while(listMaps.length > 0)listMaps.remove(0);var i = 0;while(listMaps.length < projectData.maps.length){listMaps.add(new Option(JSON.parse(projectData.maps[i]).name,""));i++;}}
function load(){
	var data = sessionStorage.getItem("project");
	try{
	if(data){
		projectData = JSON.parse(data);
		reloadmapslist();
		loadMap();
		
	}else{
		resetMap();
	}
	}finally{sessionStorage.removeItem("project");}
}

window.onload = function(){
	loadTiles();
	load();
	redrawMap();
}