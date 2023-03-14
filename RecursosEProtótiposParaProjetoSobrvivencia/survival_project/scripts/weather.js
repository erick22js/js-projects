
function renderCycleDay(){
	
	//Draw clarity
	weatherCtx.fillStyle = Weather.time<880? "black" //Claridade
	:Weather.time<930? "rgb(255,127,0)":
	Weather.time<960? "rgb("+(255-255*(Weather.time-930)/30)+","+(127-127*(Weather.time-930)/30)+",0)"
	:"black"
	;
	weatherCtx.globalAlpha = Weather.time<280?Ambiente.nightLight
	:Weather.time<340?Ambiente.nightLight-(Weather.time-280)/60*Ambiente.nightLight
	:Weather.time<880?0
	:Weather.time<960?(Weather.time-880)/80*Ambiente.nightLight:Ambiente.nightLight;
	weatherCtx.fillRect(0, 0, 512, 320);
	weatherCtx.globalAlpha = 1;
	
}

function renderRain(){
	if(Weather.isRain){ //Chuva
		insertParticle("gota", Math.random()*1024-512+Camera.getX(),-25+Camera.getY(), .8, 5+Math.random()*3+5);
		Weather.rainBuff.cloudWeight -= 1.5*getTiming();
		if(Weather.rainBuff.cloudWeight<=Weather.rainBuff.minCloudWeight){
			Weather.rainBuff.soundEffect.pause();
			Weather.rainBuff.soundEffect.currentTime = 0;
			Weather.isRain = false;
		}
	}else{
		Weather.rainBuff.cloudWeight += .4*getTiming();
		if(Weather.rainBuff.cloudWeight>=Weather.rainBuff.maxCloudWeight) Weather.isRain = true;
	}
	//Draw fog
	Weather.rainBuff.fogLevel += Weather.isRain&&Weather.rainBuff.fogLevel<.6?.0005:Weather.rainBuff.fogLevel>0?-.001:0;
	Weather.rainBuff.fogLevel = Weather.rainBuff.fogLevel<0?0:Weather.rainBuff.fogLevel;
	weatherCtx.fillStyle = "#44f";
	weatherCtx.globalAlpha = Weather.rainBuff.fogLevel;
	weatherCtx.fillRect(0, 0, 512, 320);
}

function renderTime(){
	
	
	
	//Controle do tempo
	Weather.time += DELTATIME*Weather.speed*Weather.speedM;
	if(Weather.time>=1200){
		Weather.time = 0;
		Ambiente.nightLight = .7+Math.sin(Weather.moonPhase()*.5*Math.PI)*.25;
		Weather.day++;
	}
	if(Weather.day>336){
		Weather.day = 1;
		Weather.year++;
	}
	
	//**DEBUG**
	debug.innerText = JSON.stringify(Player.buildFondationCoord(Player.actLevelB))+"\n"+
						(~~(Weather.time/50)<10?"0":"")+~~(Weather.time/50)+":"+(~~((Weather.time%50)/50*60)<10?"0":"")+~~((Weather.time%50)/50*60);
}

function renderWeather(){
	
	weatherCtx.clearRect(0,0,512,320);
	
	//Gerenciar dados
	renderTime()
	//Renderizar aparência
	renderRain();
	renderCycleDay();
	weatherCtx.globalCompositeOperation = "destination-out";
	for(var y=0; y<14; y++){
		var yb = y-~~(Camera.y*DIV2P5);
		//DESENHAR PRIMEIRA CAMADA
		for(var x=-1; x<18; x++){
			var xb = x-~~(Camera.x*DIV2P5);
			if(xb>-1&&yb>-1){
				var block = BLOCKS[WORLDMAP[1][yb][xb][0]];
				if(block.lightning){
					var bx = x*32+Camera.x%32; var by = (y-1)*32+Camera.y%32;
					weatherCtx.drawImage(EnvStrip.light, bx-160*block.lightning.intensity+16/*-64+16*/, by-160*block.lightning.intensity+48/*-256+48*/,320*block.lightning.intensity, 320*block.lightning.intensity);
				}
			}
		}
	}
	weatherCtx.globalCompositeOperation = "source-over";
	gctx.drawImage(weatherCv,0,0);
}
