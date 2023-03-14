

function quickSave(){
	var data={
		map:WORLDMAP,
		mapm:WORLDMAP[-1],
		player:cloneItem(Player),
		cam:cloneItem(Camera),
		weather:Weather,
		particles:particlesInWorld,
		items:ItemsWorld
	}
	alert("Saved!");
	localStorage.setItem("survivalProjectQCKS",JSON.stringify(data));
}
function quickLoad(){
	var data = JSON.parse(localStorage.getItem("survivalProjectQCKS"));
	console.log(data);
	WORLDMAP = data.map; WORLDMAP[-1]= data.mapm;
	p = Player; pp = data.player;
	p.sleeping = pp.sleeping; p.lessTimeForWakeup = pp.lessTimeForWakeup;
	p.sleep = pp.sleep; p.hungry = pp.hungry; p.fatigue = pp.fatigue; p.sede = pp.sede;
	p.inventory = pp.inventory; p.itemSuspend = pp.itemSuspend;
	Camera.x = data.cam.x; Camera.y = data.cam.y; Camera.xdeb = data.cam.xdeb; Camera.ydeb = data.cam.ydeb;
	Weather.time = data.weather.time; Weather.day = data.weather.day; Weather.year = data.weather.year;
	var snd = Weather.rainBuff.soundEffect;
	Weather.isRain = data.weather.isRain; Weather.rainBuff = data.weather.rainBuff;
	Weather.rainBuff.soundEffect = snd;
	particlesInWorld = data.particles;
	ItemsWorld = data.items;
	alert("Loaded!");
}


//Inputs do teclado
window.onkeydown = function(k){
	switch(k.key){
		case "w":
		case "W":
			inputMove.up = true;
			break;
		case "d":
		case "D":
			inputMove.right = true;
			break;
		case "s":
		case "S":
			inputMove.down = true;
			break;
		case "a":
		case "A":
			inputMove.left = true;
			break;
		case "l":
		case "L":
			if(Player.suspendItem(itemMove.item, itemMove.dragging)){
				itemMove.x = itemMove.y = -50;
				itemMove.dragging = false;
			}
			break;
		case "0":
		case "Insert":
			Player.putBlock([Player.actBlock], Player.actLevelB);
			break;
		case ",":
		case "Delete":
			Player.removeBlock(Player.actLevelB);
			break;
		case "Enter":
			Player.lookingMode = true;
			break;
		//case "E":
		case "e":
			Player.actBlock = prompt("Insira o nome do bloco:")
			break;
		case "Shift":
			Player.runningMode = true;
			break;
		case " ":
			Player.useItem();
			break;
		case "q":
		case "Q":
			Player.dropItem();
			break;
		case "p":
		case "P":
			Player.pickingMode = true;
			break;
		case "I":
		case "i":
			Player.interactBlock()
			break;
		case "Z":
		case "z":
			Player.sleeping = true;
			break;
		case "+":
			Player.actLevelB = Player.actLevelB<2?Player.actLevelB+1:2;
			break;
		case "-":
			Player.actLevelB = Player.actLevelB>0?Player.actLevelB-1:0;
			break;
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
			Player.slotActual = Number(k.key)-1;
			break;
		case "F2":
			quickSave();
			break;
		case "F9":
			quickLoad();
			break;
	}
}

window.onkeyup = function(k){
	switch(k.key){
		case "w":
		case "W":
			inputMove.up = false;
			break;
		case "d":
		case "D":
			inputMove.right = false;
			break;
		case "s":
		case "S":
			inputMove.down = false;
			break;
		case "a":
		case "A":
			inputMove.left = false;
			break;
		case "Enter":
			Player.lookingMode = false;
			break;
		case "Shift":
			Player.runningMode = false;
			break;
		case "p":
		case "P":
			Player.pickingMode = false;
	}
}
