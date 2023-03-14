
//Propriedades de jogador
var inputMove = {down:false, up:false, right:false, left:false, lookDown:1, lookRight:0};
var Player = {
	/*
	*	Movimento e posicionamento
	*/
	x:64.5,
	y:64.5,
	speedM:1/32,
	moveX:0,
	moveY:0,
	speed:1,
	direction:0,
	moving: false,
	strafeMode:false,
	lookingMode:false,
	runningMode:false,
	pickingMode: false,
	
	//Sleep properties
	sleeping: false,
	REMphase: 1,
	lessTimeForWakeup: 0,
	
	
	/*
	*	Animação e aparência
	*/
	actAnimation: "stand",
	frame:0,
	maxFrames:1,
	animationSpeedM:1,
	animationSpeed:6,
	changeAnimation: function(tag){
		if(this.actAnimation!=tag)
			this.frame = 0;
		this.actAnimation = tag;
		this.maxFrames = PlayerSheet[tag].maxFrames;
		this.animationSpeed = playerAtlas[tag].speed;
	},
	//Controle de sons e efeitos sonoros
	soundWalking: new Audio(),
	soundInteraction: new Audio(),
	
	/*
	*	Inventário
	*/
	//item, estado, quantidade
	inventory: [["empty", 0, 0,{}],["empty", 0, 0,{}],["empty", 0, 0,{}],["empty", 0, 0,{}],["empty", 0, 0,{}]],
	slotActual: 0,
	actLevelB: 1,
	actBlock: "bonfire",
	//Suspend Item
	itemSuspend: ["empty", 0, 0],
	suspendItem: function(item, condition){
		if(item[0]!="empty"&&condition&&this.itemSuspend[0]=="empty"){
			this.itemSuspend = cloneItem(item);
			if(ITEMS[item[0]].type&&uiData[ITEMS[item[0]].type+"UiItem"]){
				if(activeUis[0]!=actualInv)
					activeUis.splice(0,1);
				else deactiveUi(actualInv);
				Player.dropCraftInv();
				activeUi(ITEMS[item[0]].type+"UiItem");
			}
			item[0] = "empty"; item[1] = 0; item[2] = 0; item[3] = {};
			return true;
		}
		return false;
	},
	unsuspendItem: function(){
		var item = this.itemSuspend;
		if(ITEMS[item[0]].type&&uiData[ITEMS[item[0]].type+"UiItem"]){
			if(activeUis[0]!="gameplay")
				activeUis.splice(0,1);
			activeUi("gameplay");
		}
		if(this.itemSuspend[2]<=1){
			this.itemSuspend = ["empty", 0, 0, {}]
		}else{
			this.itemSuspend[2]-=1;
		}
	},
	//Crafting
	actActions: ["encaixar","pressionar","bater"], progressCrafting: 0, timeForCraft: 1, crafting: false, actualAction: "encaixar", itemToGave: ["empty",0,0], listI: 0,
	craftItems: [[["empty"],["empty"],["empty"]],
				[["empty"],["empty"],["empty"]],
				[["empty"],["empty"],["empty"]]],
	insertItem: [[["empty"],["empty"]],
				[["empty"],["empty"]]],
	toolItems: [["empty"],["empty"]],
	resultItem: ["empty"],
	clearCraftInv: function(){
		for(var y in this.craftItems)
			for(var x in this.craftItems[y])
				this.craftItems[y][x] = ["empty", 0, 0];
		for(var y in this.insertItem)
			for(var x in this.insertItem[y])
				this.insertItem[y][x] = ["empty", 0, 0];
		for(var x in this.toolItems)
			useTool(this.toolItems[x]);
	},
	dropCraftInv: function(){
		for(var y in this.craftItems)
			for(var x in this.craftItems[y])
				dropItem([this.craftItems[y][x][0],this.craftItems[y][x][1],this.craftItems[y][x][2]], this.x, this.y);
		for(var y in this.insertItem)
			for(var x in this.insertItem[y])
				dropItem([this.insertItem[y][x][0],this.insertItem[y][x][1],this.insertItem[y][x][2]], this.x, this.y);
		for(var x in this.toolItems)
			dropItem([this.toolItems[x][0],this.toolItems[x][1],this.toolItems[x][2]], this.x, this.y);
		for(var x in this.toolItems)
			this.toolItems[x] = ["empty", 0, 0];
		this.clearCraftInv();
	},
	//Building
	blockToBuild: ["air"], baseBlock: [], blistI: 0,
	buildFondationCoord: function(i){return WORLDMAP[i][~~(this.y+inputMove.lookDown)][~~(this.x+inputMove.lookRight)]},
	
	//Status físicos e ?mentais
	health: 1, //100%
	hungry: 1,
	sede: 1,
	fatigue: 0,
	temperature: 36.5, //in Cº
	
	sleep: 1,
	
	
	//Habilidades e capacidades
	HspeedM: 1.2,
	HrunM: 2,
	
	fatMass: 10, //kg/m^3
	muscularMass: 5, //kg/m^3
	
	
	/*
	* Renderização principal
	*/
	render: function(){
		Weather.speed = Weather.speedM*(Player.sleeping?(Weather.isNight()||Player.sleep<1?10:1.5):1);
		
		Player.speed = Player.HspeedM * (Player.runningMode?Player.HrunM:1) * (Player.fatigue>.6?2*(1.1-Player.fatigue):1);
		Player.soundWalking.playbackRate = Player.speed<.1?.1:Player.speed>10?10:Player.speed;
		Player.animationSpeedM = (Player.runningMode?Player.HrunM:1)*(Player.fatigue>.6?2*(1.1-Player.fatigue):1);
		
		//Status de jogador
		Player.fatigue += (Player.runningMode?.001:Player.moving?.0002:-.0004);
		Player.fatigue = Player.fatigue<0?0:Player.fatigue>1?1:Player.fatigue;
		
		Player.sleep -= (Player.sleeping?(Player.sleep<1?-1.8:0):1)*(0.0008+0.002*Player.fatigue)*getTiming();
		Player.lessTimeForWakeup = Player.sleeping?((Weather.isNight()||Player.sleep<1)?Player.lessTimeForWakeup:Player.lessTimeForWakeup-getTiming()):0;
		
		//Player.sleep<1?(!(Weather.isNight())&&Player.lessTimeForWakeup>0?Player.lessTimeForWakeup-DELTATIME:0):Player.lessTimeForWakeup;
		if(Player.sleep<=0){
			Player.sleeping = true;
		}
		
		Player.hungry -= 0.0005*DELTATIME+0.004*DELTATIME*(Player.runningMode?4:Player.moving?2:1)*Player.fatigue;
		Player.hungry = Player.hungry<0?0:Player.hungry>1?1:Player.hungry;
		
		
		
		
		//MOVIMENTAÇÃO DE JOGADOR
		Player.x += (Player.moveX-Player.speedM*Player.speed<0?Player.moveX*inputMove.lookRight:Player.speedM*Player.speed*inputMove.lookRight);
		Player.moveX += (Player.moveX-Player.speedM*Player.speed<0?-Player.moveX:-Player.speedM*Player.speed);
		Player.y += (Player.moveY-Player.speedM*Player.speed<0?Player.moveY*inputMove.lookDown:Player.speedM*Player.speed*inputMove.lookDown);
		Player.moveY += (Player.moveY-Player.speedM*Player.speed<0?-Player.moveY:-Player.speedM*Player.speed);
		Player.moving = !(Player.moveX==0&&Player.moveY==0);//Detect Player Moving
		if(this.fatigue<0.95&&!this.crafting&&!this.moving&&!this.sleeping){
			//horizontal
			if(inputMove.right||inputMove.left){
				if(!Player.lookingMode){//Jogador não esta no modo observador
					Player.changeAnimation("move");
					Player.soundWalking.play();
					Player.moveX = BLOCKS[WORLDMAP[1][~~(Player.y)][~~(Player.x-(inputMove.left-inputMove.right))][0]].solid?0:1;
					inputMove.lookDown = 0;
					inputMove.lookRight = inputMove.right-inputMove.left;
				}else{
					inputMove.lookDown = 0;
					inputMove.lookRight = inputMove.right-inputMove.left;
				}
			}
			//vertical
			if((inputMove.up||inputMove.down)&&~~(Player.moveX*100000)==0){
				if(!Player.lookingMode){
					Player.changeAnimation("move");
					Player.soundWalking.play();
					Player.moveY = BLOCKS[WORLDMAP[1][~~(Player.y-(inputMove.up-inputMove.down))][~~(Player.x)][0]].solid?0:1;
					inputMove.lookDown = inputMove.down-inputMove.up;
					inputMove.lookRight = 0;
				}else{
					inputMove.lookDown = inputMove.down-inputMove.up;
					inputMove.lookRight = 0;
				}
			}
		}
		if(Player.sleeping&&Player.actAnimation!="sleep"&&Player.actAnimation!="wakeup"){
			Player.changeAnimation("gotosleep");
			Player.lessTimeForWakeup = 30;
		}
		if(Player.sleeping&&Player.lessTimeForWakeup<=0){
			Player.changeAnimation("wakeup");
			Player.sleeping = false;
		}
		
		Player.moving = !(Player.moveX==0&&Player.moveY==0);//Detect Player Moving
		if(!Player.moving&&!Player.sleeping&&Player.actAnimation!="wakeup"){
			Player.changeAnimation("stand");
			Player.soundWalking.pause();
			Player.soundWalking.currentTime = 0;
		}
		Player.frame += DELTATIME*Player.animationSpeed*Player.animationSpeedM;
		if(Player.frame>=Player.maxFrames){
			Player.frame = 0;
			if(playerAtlas[Player.actAnimation].onend)
				Player.changeAnimation(playerAtlas[Player.actAnimation].onend);
		}
		
		Player.direction = ~~(Math.atan2(inputMove.lookRight, inputMove.lookDown)*DIVPI*2)+1;
		
		//Draw Player on Screen
		gctx.drawImage(PlayerSheet[Player.actAnimation].frames[Player.direction][~~Player.frame]//humanSprites
			,0
			,0
			, 96, 96, Player.x*32-48+Camera.x, Player.y*32-80+Camera.y, 96, 96);
		
	},
	pinged: function(){
		this.temperature-=.1
	},
	/*
	*	Funções auxiliares
	*/
	giveItem: function(item, index){
		var ocuper = this.inventory[index];
		/*if(ITEMS[item[0]].onPutOnAnother){
			ITEMS[item[0]].onPutOnAnother(item, ocuper);
		}*/
		var item = putItemIntoInventory(this.inventory, item, index);
		if(item[2]>0)
			dropItem(item, this.x, this.y);
	},
	tossItem: function(slotIndex, ammount){
		this.inventory[slotIndex][2] -= ammount;
		if(this.inventory[slotIndex][2]<=0){
			this.inventory[slotIndex]=["empty", 0, 0, {}];
		}
	},
	useItem: function(){
		var item = this.inventory[this.slotActual][0];
		if(ITEMS[item].consumible) this.tossItem(this.slotActual, 1);
		if(ITEMS[item].onuse) ITEMS[item].onuse(this.inventory[this.slotActual]);
	},
	dropItem: function(){
		if(this.inventory[this.slotActual][0]!="empty"){
			dropItem(this.inventory[this.slotActual], this.x, this.y);
			this.inventory[this.slotActual] = ["empty", 0, 0, {}];
		}
	},
	putBlock: function(block, level){
		putBlock(~~(this.x+inputMove.lookRight), ~~(this.y+inputMove.lookDown), block, level);
	},
	removeBlock: function(level, forced){
		var block = WORLDMAP[level][~~(this.y+inputMove.lookDown)][~~(this.x+inputMove.lookRight)];
		if(BLOCKS[block[0]].needForExtract){
			if(ITEMS[this.inventory[this.slotActual][0]].classe==BLOCKS[block[0]].needForExtract||forced){
				block[1] -= ITEMS[this.inventory[this.slotActual][0]].strength/BLOCKS[block[0]].resistance;
				useTool(this.inventory[this.slotActual]);
				if(block[1]<=0||forced){
					remBlock(block, ~~(this.x+inputMove.lookRight), ~~(this.y+inputMove.lookDown), level);
					if(BLOCKS[block[0]].give){
						this.blockDrop(block);
					}
				}
			}
		}else{
			if(BLOCKS[block[0]].stack){
				block[1] -= .2;
				block[2].ammount = block[1];
				if(block[1]<=0)
					remBlock(block, ~~(this.x+inputMove.lookRight), ~~(this.y+inputMove.lookDown), level);
			}else
				remBlock(block, ~~(this.x+inputMove.lookRight), ~~(this.y+inputMove.lookDown), level);
			if(BLOCKS[block[0]].give){
				this.blockDrop(block);
			}
		}
	},
	blockDrop: function(block){
		for(var i=0;i<BLOCKS[block[0]].give.length; i++){
			var item = cloneItem(BLOCKS[block[0]].give[i][0]);
			item[2] = BLOCKS[block[0]].give[i][1]+~~(Math.random()*(BLOCKS[block[0]].give[i][2]-BLOCKS[block[0]].give[i][1]));
			if(Math.random()<=(BLOCKS[block[0]].give[i][3]||1)) this.giveItem(item);
		}
	},
	interactBlock: function(){
		var block = this.buildFondationCoord(this.actLevelB);
		console.log(JSON.stringify(BLOCKS[block[0]]));
		if(BLOCKS[block[0]].onInteract)
			BLOCKS[block[0]].onInteract(this, block);
	}
}

/*
*	Funções externas
*/

function putItemIntoInventory(inventory, item, index){
	item = cloneItem(item);
	var ammount = item[2];
	for(var i=0;i<inventory.length;i++){
			if(inventory[i][0]=="empty"||inventory[i][0]==item[0]){
				if(inventory[i][0]=="empty"){
					inventory[i]=[item[0], item[1], 0, item[3]];
				}
				inventory[i][2]=!inventory[i][2]?0:inventory[i][2];
				var passed = 0;
				if(inventory[i][2]+ammount>ITEMS[inventory[i][0]].maxAmmount)
					passed = inventory[i][2]+ammount-ITEMS[inventory[i][0]].maxAmmount;
				inventory[i][2]+=ammount-passed;
				//alert(this.inventory[i][2]);
				ammount = passed;
				if(ammount<=0)
					break;
			}
		}
		if(ammount>0)
			return [item[0], item[1], ammount, item[3]];
		else
			return ["empty",0,0,{}];
}

var putBlock = function(x, y, block, level){
	var oldBlock = JSON.parse(JSON.stringify(WORLDMAP[level][y][x]))
	WORLDMAP[level][y][x] = 
		BLOCKS[block[0]]?[block[0],block[1],block[2]||{},block[3]||{}]:["errorCallback",0,{},{}];
	if(BLOCKS[block[0]].onPlace){
		BLOCKS[block[0]].onPlace(x,y, level, oldBlock);
	}
}
var setBlock = function(blockToModif, blockWithModif){
	blockToModif[0] = blockWithModif[0];blockToModif[1] = blockWithModif[1];blockToModif[2] = blockWithModif[2];blockToModif[3] = blockWithModif[3];
}

var remBlock = function(block, x, y, level){
	if(BLOCKS[block[0]].onRemove){
		BLOCKS[block[0]].onRemove(x, y, level, block);
	}
	WORLDMAP[level][y][x] = BLOCKS[block[0]].phase2?[BLOCKS[block[0]].phase2,1,{},{}]:["air",1,{},{}];
}

var dropItem = function(data, x, y){ //Data: [id, estado, ammount]
	if(data[0]!="empty")ItemsWorld.push([data, x-.1+Math.random()*.2, y-.1+Math.random()*.2]);
}

var cloneItem = function(item){
	return JSON.parse(JSON.stringify(item));
}

var useTool = function(item){
	if(ITEMS[item[0]].type=="tool") item[1]-= 1/ITEMS[item[0]].durabily;
	if(item[1]<=0){ item[0]=item[2]>1?item[0]:"empty"; item[1]=item[2]>1?1:0; item[2]=item[2]>1?item[2]-1:0;}
}

var Camera = {
	x:-64,
	y:-64,
	getX: function(){return -this.x-32},
	getY: function(){return -this.y-32},
	xdeb:128,
	ydeb:128
}
