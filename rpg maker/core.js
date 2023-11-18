//Renderizador
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var sizeMap = [32*20,32*12];

const valToIndex = (val) => [val%16 ,~~(val/16)];

var tiles = new Image();
tiles.src = "tiles.png";
var base_skin = new Image();
base_skin.src = "base_human_skin.png";

var runner = JSON.parse(sessionStorage.getItem("project"));

var actualGameplayMap = {};
var mapsTilemap = [];

//Funções para geração de sprites e maps
function generateMap(Map){
	var actualMap = Map;
	var layers = [];
	for(var i=0; i<3; i++){
		var cv = document.createElement("canvas");
		cv.width = sizeMap[0];
		cv.height = sizeMap[1]; 
		layers.push(cv);
		var lctx = layers[i].getContext("2d");
		for(var y=0; y<Map[i].length; y++){
			for(var x=0; x<Map[i][y].length; x++){
				if(Map[i][y][x] > -1){
					var ind = valToIndex(Map[i][y][x]);
					lctx.drawImage(tiles, ind[0]*32, ind[1]*32, 32, 32, x*32, y*32, 32, 32);
				}
			}
		}
	}
	return layers;
}

/*
* Testes
*/

var Player = {
	x:320,
	y:192,
	restMove:0,
	direction:1
}

function redrawMap(){
	
	for(var layer = 0; layer<3; layer++){
		
	}
}

function Init(){
	actualGameplayMap = JSON.parse(runner.maps[0]);
	for(var i in runner.maps){
		mapsTilemap.push(generateMap(JSON.parse(runner.maps[i]).tiles));
	}
	Update();
}

function Update(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(mapsTilemap[0][0], 0, 0);
	ctx.drawImage(mapsTilemap[0][1], 0, 0);
	ctx.drawImage(base_skin, 0, 0, 32, 32, Player.x, Player.y, 32, 32);
	ctx.drawImage(mapsTilemap[0][2],0, 0);
	redrawMap();
	requestAnimationFrame(Update);
}

tiles.onload = function(){
	Init();
}
