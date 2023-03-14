
//Screen global
var screen = document.getElementById("screen");
var debug = document.getElementById("debug");
var gctx = screen.getContext("2d");

var map = document.getElementById("dgbmap")
var mapctx = map.getContext("2d");
mapctx.imageSmoothingEnabled = false;

//weather screen
var weatherCv = document.createElement("Canvas");
weatherCv.width = screen.width; weatherCv.height = screen.height;
var weatherCtx = weatherCv.getContext("2d");

var Images = {
	humanSprites: new Image(),
	tileset: new Image(),
	tileanimated: new Image(),
	itemset: new Image(),
	clay: new Image(),
	treesSprites: new Image(),
	uiSprites: new Image(),
	enviorment: new Image()
}
Images.humanSprites.src = "imgs/human.png";
Images.tileset.src = "imgs/tileset.png";
Images.tileanimated.src = "imgs/tileanimated.png";
Images.itemset.src = "imgs/itemset.png";
Images.clay.src = "imgs/clay.png";
Images.treesSprites.src = "imgs/trees.png";
Images.uiSprites.src = "imgs/ui.png";
Images.enviorment.src = "imgs/enviorment.png";


var Tileset = [];
var Tileanimated = [];
var Itemset = [];
var TreesStrip = [];
var UiSheet = {};
var EnvStrip = {};
var ClayStrip = {};
var PlayerSheet = {};

function loadPlayerSheet(){
	for(a in playerAtlas){
		PlayerSheet[a] = {};
		PlayerSheet[a].maxFrames = playerAtlas[a].frames.length;
		PlayerSheet[a].frames = [];
		for(var d=0; d<4; d++){
			PlayerSheet[a].frames.push([]);
			for(var f=0; f<PlayerSheet[a].maxFrames; f++){
				var cv = document.createElement("Canvas");
				cv.width = cv.height = 96;
				var ctx = cv.getContext("2d");
				ctx.drawImage(Images.humanSprites, playerAtlas[a].frames[f].x*96, (playerAtlas[a].frames[f].y+playerAtlas[a].directions[d])*96, 96, 96, 0, 0, 96, 96);
				PlayerSheet[a].frames[d].push(cv);
			}
		}
	}
}

function loadFramesIntoArray(image, array, frameWid, frameHei){
	var imgsForRow = image.width/frameWid;
	var rows = image.height/frameHei;
	for(var y=0;y<rows;y++){
		for(var x=0;x<imgsForRow;x++){
			var cv = document.createElement("Canvas");
			cv.width = frameWid; cv.height = frameHei;
			var ctx = cv.getContext("2d");
			ctx.drawImage(image, x*frameWid, y*frameHei, frameWid, frameHei, 0, 0, frameWid, frameHei);
			array.push(cv);
		}
	}
}

function loadAtlasIntoData(image, data, atlas){
	for(var i in atlas){
		data[i] = document.createElement("Canvas");
		data[i].width = data[i].height = atlas[i].size;
		var ctx = data[i].getContext("2d");
		ctx.drawImage(image, atlas[i].x, atlas[i].y, atlas[i].size, atlas[i].size, 0, 0, atlas[i].size, atlas[i].size);
	}
}

function loadImages(){
	//Load Tileset
	loadFramesIntoArray(Images.tileset, Tileset, 32, 64);
	var imgsForRow = Images.tileanimated.width/32;
	var rows = Images.tileanimated.height/64;
	//Load Tileanimated
	for(var i=0;i<rows;i++){
		Tileanimated.push([]);
		for(var x=0;x<imgsForRow;x++){
			var cv = document.createElement("Canvas");
			cv.width = 32; cv.height = 64;
			var ctx = cv.getContext("2d");
			ctx.drawImage(Images.tileanimated, x*32, i*64, 32, 64, 0, 0, 32, 64);
			Tileanimated[i].push(cv);
		}
	}
	//Load Itemset
	loadFramesIntoArray(Images.itemset, Itemset, 32, 32);
	//Load clay graphics
	loadAtlasIntoData(Images.clay, ClayStrip, clayAtlas);
	//Load Trees Texture
	for(var y=0;y<1;y++){
		for(var x=0;x<1;x++){
			var cv = document.createElement("Canvas");
			cv.width = cv.height = 96;
			var ctx = cv.getContext("2d");
			ctx.drawImage(Images.treesSprites, x*96, y*96, 96, 96, 0, 0, 96, 96);
			TreesStrip.push(cv);
		}
	}
	//Load UiSheets
	loadAtlasIntoData(Images.uiSprites, UiSheet, uiAtlas);
	//Load enviorment Sheets
	loadAtlasIntoData(Images.enviorment, EnvStrip, enviormentAtlas);
	//Load player sprites
	loadPlayerSheet();
}
























