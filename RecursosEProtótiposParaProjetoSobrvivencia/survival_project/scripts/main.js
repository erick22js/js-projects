gctx.imageSmoothingEnabled = false;


const DIVPI = 1/Math.PI;
const DIV2P5 = 1/32;
const DIV28 = 1/28;
const DIV7 = 1/7;
var DELTATIME = 0;
var M30DELTATIME = 0;
var M60DELTATIME = 0;
var deltatimeold = 0;

var renderBehaviorBlocksMode = "chunk";

/*
 *chunk -> Renderiza por área
* mapFully -> Renderiza todo o mapa
* viewOnly -> Apenas o que é visto pelo jogador e em volta
*/


/*
var entities = {
	"tree1":{

	}
}*/


//MAPA
var WORLDMAP = [
	[],//camada mais inferior
	[],//objetos
	[]//camada superior
];
const MAPWIDTH = 128;
const MAPHEIGHT = 128;
const CHUNKSIZE = 64;

const LIMITFORITEMSINWORLD = 128;

var ItemsWorld = [];
var particlesInWorld = [];
var EntitiesWorld = [
	//Nothing for now
];

//GERADOR DE MAPA (experimental para uso de testes)
genTerrain(WORLDMAP, MAPWIDTH, MAPHEIGHT);

//Tempo, clima, ambiente e Atmosfera
var Weather = {
	time: 400, //8 horas da manhã (um dia equivale 1200 segundos, uma hora = 50 segundos)
	speed: 1,
	speedM: 1,//360,
	day: 1, //1 ano equivale a 336 dias, cada mês contendo 28 dias, ou seja, 4 semanas
	year: 1,
	moonPhase: function(){return (this.day-~~(this.day*DIV28)*28)*DIV7;}, //0=cheia, 1=minguante, 2=nova, 3=crescente
	isRain: false,
	rainBuff:{
		fogLevel: 0,
		cloudWeight: 100, //in kg
		maxCloudWeight: 1500,
		minCloudWeight: 50,
		soundEffect: new Audio()
	},
	isNight: function(){return this.time>900||this.time<300;}
}
var Ambiente = {
	temperature: 32.5,
	umidity: .2,
	lightning: 0,
	dayLight: 0,
	nightLight: 0.7

}



function renderBlockBehavior(x, y){
	//console.log(BLOCKS[WORLDMAP[1][y][x][0]]);
	for(var l=0;l<2;l++){
		var block = WORLDMAP[l][y][x];
		if(BLOCKS[block[0]].on){
			BLOCKS[block[0]].on(x,y,l,block);
		}
		if(BLOCKS[block[0]].type=="plant"){
			if(isNaN(block[3].stage)) block[3].stage = 0;
			if(block[2].time<0){
				block[3].stage++;
				if(block[3].stage>=BLOCKS[block[0]].stages.length){
					if(BLOCKS[block[0]].onendstages)
						BLOCKS[block[0]].onendstages(x,y,l,block)
					block[3].stage= BLOCKS[block[0]].stages.length-1;
				}
				else block[2].time = BLOCKS[block[0]].stages[block[3].stage][1]*(BgrowingSpeed+Math.random()*variationGrow);
			}else block[2].time = isNaN(block[2].time)?BLOCKS[block[0]].stages[block[3].stage][1]*(BgrowingSpeed+Math.random()*variationGrow):block[2].time-getTiming();
		}
	}
}


function render(){
	//Behavior render
	if(renderBehaviorBlocksMode=="viewOnly")
		for(var y=0; y<14; y++){
			var yb = y-~~(Camera.y*DIV2P5);
			for(var x=-1; x<18; x++){
				var xb = x-~~(Camera.x*DIV2P5);
				if(xb>-1&&yb>-1){
					renderBlockBehavior(xb, yb);
				}
			}
		}
	else if(renderBehaviorBlocksMode=="mapFully")
		for(var y=0; y<MAPHEIGHT; y++){
			for(var x=0; x<MAPWIDTH; x++){
				renderBlockBehavior(x, y);
			}
		}
	else if(renderBehaviorBlocksMode=="chunk"){
		var chunkX = [~~(Camera.getX()*DIV2P5/CHUNKSIZE), ~~((Camera.getX()+512)*DIV2P5/CHUNKSIZE+1)];
		var chunkY = [~~(Camera.getY()*DIV2P5/CHUNKSIZE), ~~((Camera.getY()+320)*DIV2P5/CHUNKSIZE+1)];
		//var cksx = ~~(Player.x/CHUNKSIZE)*CHUNKSIZE;
		//var cksy = ~~(Player.y/CHUNKSIZE)*CHUNKSIZE;
		for(var y=chunkY[0]*CHUNKSIZE; y<chunkY[1]*CHUNKSIZE; y++){
			for(var x=chunkX[0]*CHUNKSIZE; x<chunkX[1]*CHUNKSIZE; x++){
				//console.log(x+" "+y);
				renderBlockBehavior(x, y);
			}
		}
	}
	//Renderiza items caídos
	for(var i=0;i<ItemsWorld.length; i++){
		if(ITEMS[ItemsWorld[i][0][0]].onground) ITEMS[ItemsWorld[i][0][0]].onground(ItemsWorld[i][0]*32, ItemsWorld[i][1]*32);
		if(Player.pickingMode&&(~~ItemsWorld[i][1])==(~~Player.x)&&(~~ItemsWorld[i][2])==(~~Player.y)){
			Player.giveItem(ItemsWorld[i][0]);
			ItemsWorld.splice(i, 1);
			break;
		}
		if(ItemsWorld.length>LIMITFORITEMSINWORLD){
			ItemsWorld.splice(i, 1);
			break;
		}
	}

	//GraphicalRender
	for(var y=-1; y<14; y++){
		var yb = y-~~(Camera.y*DIV2P5);
		//DESENHAR PRIMEIRA CAMADA
		for(var x=-1; x<18; x++){
			var xb = x-~~(Camera.x*DIV2P5);
			if(xb>-1&&yb>-1){
				var bx = x*32+Camera.x%32; var by = (y-1)*32+Camera.y%32;
				drawTile(xb, yb, bx, by, -1);
				drawTile(xb, yb, bx, by, 0);
			}
		}
		for(var i=0;i<ItemsWorld.length; i++){
			if((~~((ItemsWorld[i][2]*32+(17)+Camera.y-Camera.y%32)*DIV2P5))==y)
				drawItem(ItemsWorld[i][0], ItemsWorld[i][1]*32-16+Camera.x, ItemsWorld[i][2]*32-16+Camera.y, 32, 32);
		}
		if((~~((Player.y*32+(17)+Camera.y-Camera.y%32)*DIV2P5))==y){
			Player.render();
		}
		//DESENHAR OUTRAS CAMADAS
		for(var x=-1; x<18; x++){
			var xb = x-~~(Camera.x*DIV2P5);
			if(xb>-1&&yb>-1){
				var bx = x*32+Camera.x%32; var by = (y-1)*32+Camera.y%32;
				drawTile(xb, yb, bx, by, 1);
				//Terceira Camada
				if(BLOCKS[WORLDMAP[2][yb][xb][0]].isGround)
					gctx.globalAlpha = .8;
				drawTile(xb, yb, bx, by, 2);
				gctx.globalAlpha = 1;
			}
		}
		//Desenhar topos de árvores
		for(var x=-1; x<18; x++){
			var xb = x-~~(Camera.x*DIV2P5);
			if(xb>-1&&yb>-1){
				var bx = x*32+Camera.x%32; var by = (y-1)*32+Camera.y%32;
				if(yb>0&&WORLDMAP[1][yb][xb][0]=="tree")
						gctx.drawImage(TreesStrip[0], bx-32, by-32, 96, 96);
			}
		}
	}

	//Renderizar partículas
	renderParticles();

	//Draw Weather
	renderWeather();

}


function init(){
	loadImages();
	loadSounds();
	prepareUi();

	update();
}

function update(time){
	DELTATIME = ~~(time - deltatimeold)*.001;
	deltatimeold = time;
	//Camera
	Camera.xdeb=Camera.xdeb-(Camera.xdeb-Player.x*32)*.02;
	Camera.ydeb=Camera.ydeb-(Camera.ydeb-Player.y*32)*.02;
	Camera.x=-Camera.xdeb+256;
	Camera.x= Camera.x>-32?-32:Camera.x;
	Camera.y=-Camera.ydeb+180;
	Camera.y= Camera.y>-32?-32:Camera.y;

	render();

	//Desenhar UI
	drawUi();

	requestAnimationFrame(update, 33);
}

window.onload = init;
