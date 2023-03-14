function prepareUi(){
	uiData = {
		containerUi: [
			{	//Background inventory
				color:"chocolate", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){if(Player.moving||Player.lookingMode){activeUis.splice(0,1); activeUi("gameplay")}}
			},
			{
				type:"panel", count:[7,4], img:UiSheet.cellInventory, x:105, y:33, width:46, height:46, spacing: [4.8,6], on: function(i){
					this.visible = (i[0]+i[1]*7)<BLOCKS[blockIcon.actBlock[0]].inventorySize;
					if(!blockIcon.actBlock[3]||!blockIcon.actBlock[3][0]){
						blockIcon.actBlock[3]=[];
						for(var i=0;i<BLOCKS[blockIcon.actBlock[0]].inventorySize;i++){
							blockIcon.actBlock[3].push(["empty",0,0,{}]);
						}
					}
				},
					ondraw: function(i, x, y){ drawItem(blockIcon.actBlock[3][i[0]+i[1]*7], x, y, 46, 46)}, onup: function(i){
					if(itemMove.dragging&&(i[0]+i[1]*7)<BLOCKS[blockIcon.actBlock[0]].inventorySize){
						var item = putItemIntoInventory(blockIcon.actBlock[3], itemMove.item)
						Player.giveItem(item);
						itemMove.reset();
					}
				},
				onclick: function(i){ if(!Player.crafting){
					itemMove.dragging = true; itemMove.item = cloneItem(blockIcon.actBlock[3][i[0]+i[1]*7]); blockIcon.actBlock[3][i[0]+i[1]*7] = ["empty", 1, 0,{}]
					}
				}
			},{ //Count items
				type: "panel", count: [7, 4], text:"000", x: 114, y: 70, width:46, height:46, spacing: [4.8,6], on:function(i){
					if((i[0]+i[1]*7)<BLOCKS[blockIcon.actBlock[0]].inventorySize)this.text = blockIcon.actBlock[3][i[0]+i[1]*7][2];
					this.visible = (i[0]+i[1]*7)<BLOCKS[blockIcon.actBlock[0]].inventorySize;
					}
			}
			
		],
		clayUi:[
			{	//Background inventory
				color:"chocolate", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){if(Player.moving||Player.lookingMode){activeUis.splice(0,1); activeUi("gameplay")}}
			},{	//Panel view
				color:"#830", x: 203, y: 33, width: 150, height: 150
			},{	//Clay
				img: UiSheet.clayDefault, x: 230, y: 60, width: 96, height: 96, on: function(){ this.img = getClayTexture(blockIcon.actBlock);}
			},{	//Ingredients
				type:"panel", count:[2,2], img:UiSheet.cellMaterial, x:151, y:33, width:46, height:46, spacing: [162,6]
			},
			
			{
				color:"#2f2", stroke:"black", strokeLine:1.5, x:105, y:189, width:92, height:46, strokeWidth:92, visible:false,
				on: function(){
					this.width = Player.progressCrafting*92;
					if(Player.crafting&&Player.progressCrafting<0){
						this.visible = false;Player.crafting = false; blockIcon.actBlock[3].stage = CLAYCRAFT[blockIcon.actBlock[0]][blockIcon.actBlock[3].stage][Player.processClay].result;
					}if(Player.progressCrafting>0){
						this.visible = true; Player.progressCrafting-=DELTATIME/Player.timeForCraft;
					}else{this.visible = false;}
				}
			},
			
			//Interact UI
			{	//mash icon
				img:UiSheet.mashIcon, x:105, y:33, width:46, height:46, on: function(){this.allowed = itemIn("mash",CLAYCRAFT[blockIcon.actBlock[0]][blockIcon.actBlock[3].stage].actions)!=null; this.opacity=this.allowed?1:.2}, onclick: function(){if(this.these.allowed&&!Player.crafting){
					Player.progressCrafting=1; Player.timeForCraft=4; Player.crafting = true; Player.processClay = "mash";
				}}
			},{	//roll icon
				img:UiSheet.rollIcon, x:405, y:33, width:46, height:46, on: function(){this.allowed = itemIn("roll",CLAYCRAFT[blockIcon.actBlock[0]][blockIcon.actBlock[3].stage].actions)!=null; this.opacity=this.allowed?1:.2}, onclick: function(){if(this.these.allowed&&!Player.crafting){
					Player.progressCrafting=1; Player.timeForCraft=4; Player.crafting = true; Player.processClay = "roll";
				}}
			},{	//cut icon
				img:UiSheet.cutIcon, x:105, y:137, width:46, height:46, on: function(){this.allowed = itemIn("cut",CLAYCRAFT[blockIcon.actBlock[0]][blockIcon.actBlock[3].stage].actions)!=null; this.opacity=this.allowed?1:.2}, onclick: function(){if(this.these.allowed&&!Player.crafting){
					Player.progressCrafting=1; Player.timeForCraft=4; Player.crafting = true; Player.processClay = "cut";
				}}
			},{	//retouch icon
				img:UiSheet.retouchIcon, x:405, y:137, width:46, height:46, on: function(){this.allowed = itemIn("retouch",CLAYCRAFT[blockIcon.actBlock[0]][blockIcon.actBlock[3].stage].actions)!=null; this.opacity=this.allowed?1:.2}, onclick: function(){if(this.these.allowed&&!Player.crafting){
					Player.progressCrafting=1; Player.timeForCraft=4; Player.crafting = true; Player.processClay = "retouch";
				}}
			}
		],
		cookerUi:[
			{	//Background inventory
				color:"#f80", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){if(Player.moving||Player.lookingMode){activeUis.splice(0,1); activeUi("gameplay")}
					if(!(blockIcon.actBlock[3].ingredients)){
					blockIcon.actBlock[3].ingredients = [["empty",0,0,{}],["empty",0,0,{}],["empty",0,0,{}]];
					blockIcon.actBlock[3].fuel = [];
					for(var i=0;i<BLOCKS[blockIcon.actBlock[0]].fuelsize;i++)
						blockIcon.actBlock[3].fuel.push(["empty",0,0,{}])
					blockIcon.actBlock[3].isCooking = false;
					blockIcon.actBlock[3].timeForCooking = 0;
					}
				}
			},{ //Ingredients panel
				type:"panel", count:[3,1], img:UiSheet.cellIngredient, x:151, y:66, width:46, height:46, spacing: [6,6], onup: function(i){
					if(itemMove.dragging){
						var item = putItemIntoInventory(blockIcon.actBlock[3].ingredients, itemMove.item);
						Player.giveItem(item);
						itemMove.reset();
					}
				}, ondraw: function(i, x, y){ drawItem(blockIcon.actBlock[3].ingredients[i[0]], x, y, 46, 46)},
				onclick: function(i){
					if(!Player.crafting){
					itemMove.dragging = true;
					itemMove.item = cloneItem(blockIcon.actBlock[3].ingredients[i[0]]);
					blockIcon.actBlock[3].ingredients[i[0]] = ["empty", 0, 0,{}];
					}
				}
			},{ //Count items
				type: "panel", count: [3,1], text:"000", x: 160, y: 103, width:46, height:46, spacing: [4.8,6], on: function(i){
					this.text = blockIcon.actBlock[3].ingredients[i[0]][2];
				}
			},
			{	//time for cook bar
				color: "#0f0", stroke: "black", strokeLine:1.5, x: 174, y: 112, width: 98, strokeWidth: 98, height: 24, spacing: [0,0], on:function(){
					this.width = blockIcon.actBlock[3].timeForCooking*98;
				}
			},{	//Button for cook
				img: UiSheet.goCook, x:359, y:118, width:46, height:46, onclick: function(){
					blockIcon.actBlock[3].recipe = JSON.parse(checkCookRecipe(blockIcon.actBlock));
					if(!blockIcon.actBlock[3].isCooking){
					if(blockIcon.actBlock[3].recipe){
						alert("Receita válida")
						if(blockIcon.actBlock[0]=="bonfireActivated"){
							blockIcon.actBlock[3].isCooking = true;
							blockIcon.actBlock[3].timeForCooking = 1;
						}else{
							alert("É preciso acender o fogo para cozinhar.")
						}
					}
					else alert("Essa é uma receita estranha");
					}
				}
			},
			{ //fuel panel
				type:"panel", count:[7,1], img:UiSheet.cellFuel, x:99, y:170, width:46, height:46, spacing: [6,6],on:function(i){
					this.visible = i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize;
				},onup: function(i){
					if(itemMove.dragging&&i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize){
						var item = putItemIntoInventory(blockIcon.actBlock[3].fuel, itemMove.item);
						Player.giveItem(item);
						itemMove.reset();
					}
				},ondraw: function(i, x, y){ if(i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize)drawItem(blockIcon.actBlock[3].fuel[i[0]], x, y, 46, 46)},
				onclick: function(i){
					if(!Player.crafting&&i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize){
					itemMove.dragging = true;
					itemMove.item = cloneItem(blockIcon.actBlock[3].fuel[i[0]]);
					blockIcon.actBlock[3].fuel[i[0]] = ["empty", 0, 0,{}];
					}
				}
			},{ //Count items
				type: "panel", count: [7,1], text:"000", x: 108, y: 210, width:46, height:46, spacing: [4.8,6], on: function(i){
					if(i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize)	this.text = blockIcon.actBlock[3].fuel[i[0]][2];
					this.visible = i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize;
				}
			},{	//durability bar
				type: "panel", count: [7,1], color: "#0f0", stroke: "black", strokeLine:1.5, x: 98, y: 210, width: 48, strokeWidth: 48, height: 12, spacing: [5,0], on: function(i){
					if(i[0]<BLOCKS[blockIcon.actBlock[0]].fuelsize&&blockIcon.actBlock[3].fuel[i[0]][1]>0){this.width = blockIcon.actBlock[3].fuel[i[0]][1]*48;this.visible = true}
					else this.visible = false;
				}
			}
		],
		gameplay:[ //Tela normal de jogo
			{	//selection object
				img: null, x: 8, y: 8, width: 64, height: 64, on: function(){ this.img = UiSheet["selection1"]; this.x =  ~~(Player.x+inputMove.lookRight)*32+Camera.x; this.y = ~~(Player.y+inputMove.lookDown)*32+Camera.y-(Player.actLevelB*32)}
			},{	//Life bar
				color: "red", stroke: "black", strokeLine:2, x: 25, y: 16, width: 94, strokeWidth: 94, height: 12, on: function(){ this.width = 94*Player.health;}
			},{	//Life icon
				img: UiSheet.heartIcon, x: 8, y: 8, width: 24, height: 24
			},{	//Hungry bar
				color: "red", stroke: "black", strokeLine:2, x: 25, y: 48, width: 94, strokeWidth: 94, height: 12, on: function(){ this.width = 94*Player.hungry;}
			},{	//Hungry icon
				img: UiSheet.hungryIcon, x: 8, y: 40, width: 24, height: 24
			},{	//sede bar
				color: "red", stroke: "black", strokeLine:2, x: 25, y: 80, width: 94, strokeWidth: 94, height: 12, on: function(){ this.width = 94*Player.sede;}
			},{	//sede icon
				img: UiSheet.sedeIcon, x: 8, y: 72, width: 24, height: 24
			},{	//fatigue bar
				color: "red", stroke: "black", strokeLine:2, x: 140, y: 16, width: 94, strokeWidth: 94, height: 12, on: function(){ this.width = 94*(1-Player.fatigue);}
			},{	//fatigue icon
				img: UiSheet.energyIcon, x: 123, y: 8, width: 24, height: 24
			},{	//sono bar
				color: "red", stroke: "black", strokeLine:2, x: 140, y: 48, width: 94, strokeWidth: 94, height: 12, on: function(){ this.width = 94*Player.sleep;}
			},{	//sono icon
				img: UiSheet.sleepIcon, x: 123, y: 40, width: 24, height: 24
			},{	//temperature icon
				img: UiSheet.temperatureIcon, x: 8, y: 104, width: 24, height: 24
			},{
				text: "Cº 36.5", x:30, y:125, width:24, height:24, textColor:"white", font:"20px arial", shadow:4, on: function(){this.text = "Cº "+Player.temperature}
			}
		],
		uiInventory:[
			{	//Background inventory
				color:"brown", stroke: "black", strokeLine:4, x: 96, y: 24, width: 224, height: 224, 
			},{	//Background player
				color:"brown", stroke: "black", strokeLine:4, x: 336, y: 24, width: 128, height: 224, 
			},{	//Background player
				color:"#400", x: 352, y: 64, width: 96, height: 160
			},{
				img: PlayerSheet.stand.frames[1][0], x: 304, y: 32, width: 192, height: 192
			},{
				type:"panel", count:[4,4], img:UiSheet.cellInventory, x:105, y:33, width:46, height:46, spacing: [6,6], visible:false, onup: function(i){}
			}
		],
		uiCraft: [
			{	//Background inventory
				color:"tomato", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){}
			},
			
			{ //Material panel
				type:"panel", count:[3,3], img:UiSheet.cellMaterial, x:151, y:33, width:46, height:46, spacing: [6,6], onup: function(i){
					if(Player.craftItems[i[1]][i[0]][0]=="empty"){
						Player.craftItems[i[1]][i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]--;
						if(itemMove.item[2]<=0){itemMove.reset()}}
						Player.giveItem(itemMove.item); itemMove.reset();
					},
					ondraw: function(i, x, y){ drawItem(Player.craftItems[i[1]][i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.craftItems[i[1]][i[0]][0],Player.craftItems[i[1]][i[0]][1],Player.craftItems[i[1]][i[0]][2]]; Player.craftItems[i[1]][i[0]]=["empty", 0, 0]}}
			},{	//Inserter panel
				type:"panel", count:[2,2], img:UiSheet.cellInsert, x:105, y:33, width:46, height:46, spacing: [150,58], onup: function(i){ if(Player.insertItem[i[1]][i[0]][0]=="empty"){ Player.insertItem[i[1]][i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]-=1; if(itemMove.item[2]<=0){itemMove.item=["empty",0,0,{}]}}Player.giveItem(itemMove.item); itemMove.reset(); updateActActions(Player)},
					ondraw: function(i, x, y){ drawItem(Player.insertItem[i[1]][i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.insertItem[i[1]][i[0]][0],Player.insertItem[i[1]][i[0]][1],Player.insertItem[i[1]][i[0]][2]]; Player.insertItem[i[1]][i[0]]=["empty", 0, 0]; updateActActions(Player)}}
			},{	//Tool panel
				type:"panel", count:[2,1], img:UiSheet.cellTool, x:105, y:85, width:46, height:46, spacing: [150,58], onup: function(i){ if(Player.toolItems[i[0]][0]=="empty"){ Player.toolItems[i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]-=1; if(itemMove.item[2]<=0){itemMove.item=["empty",0,0,{}]}}Player.giveItem(itemMove.item); itemMove.reset(); updateActActions(Player)},
					ondraw: function(i, x, y){ drawItem(Player.toolItems[i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.toolItems[i[0]][0],Player.toolItems[i[0]][1],Player.toolItems[i[0]][2]]; Player.toolItems[i[0]]=["empty", 0, 0]; updateActActions(Player)}}
			},{	//Result panel
				img:UiSheet.cellResult, x:203, y:189, width:46, height:46, ondraw: function(i, x, y){ drawItem(Player.resultItem, x, y, 46, 46)}, onclick: function(i){ itemMove.dragging = true; itemMove.item = [Player.resultItem[0],Player.resultItem[1],Player.resultItem[2],Player.resultItem[3]]; Player.resultItem=["empty", 0, 0, {}]}
			},
			{	//Prev panel
				img:UiSheet.goPrev, x:255, y:189, width:46, height:46, onclick: function(){Player.listI=Player.listI>0?Player.listI-4:Player.listI}
			},{	//Next button
				img:UiSheet.goNext, x:301, y:189, width:46, height:46, onclick: function(){Player.listI=Player.listI+4<Player.actActions.length?Player.listI+4:Player.listI}
			},{ //Action key
				type:"panel", count:[1,4], color:"#bbb", stroke:"#888", strokeLine:2, x:353, y:33, width:105, height:46, spacing:[0,6], on: function(i){this.color = "#bbb"; this.visible = Player.actActions[i[1]+Player.listI]!=null; }, onclick: function(i){
					if(!Player.crafting){this.color = "#555"; Player.actualAction=Player.actActions[i[1]+Player.listI];var item = pickEqualRecipe(Player);if(item&&item.requireProcess==Player.actualAction){Player.progressCrafting=1;Player.timeForCraft=item.time;Player.crafting = true; itemToGave = JSON.parse(JSON.stringify(item.result))}else{alert("Esta e uma receita estranha.")}}}
			},{	//Action text
				type:"panel", count:[1,4], text:"pressionar", x:357, y:63, width:105, height:46, spacing:[0,6], shadow:4, on: function(i){ this.text = Player.actActions[i[1]+Player.listI];this.visible = Player.actActions[i[1]+Player.listI]!=null;}
			},{
				color:"#2f2", stroke:"black", strokeLine:1.5, x:105, y:189, width:92, height:46, strokeWidth:92, visible:false,
				on: function(){ this.width = Player.progressCrafting*92; if(Player.crafting&&Player.progressCrafting<0){ this.visible = false; Player.crafting = false; Player.resultItem = itemToGave; Player.clearCraftInv(); updateActActions(Player)} if(Player.progressCrafting>0){this.visible = true; Player.progressCrafting-=DELTATIME/Player.timeForCraft;}else{this.visible = false;} }
			}
		],
		uiBuild: [
			{ //block icon button
				img:UiSheet.containerIcon, x: 24, y: 204, width: 48, height: 48, shadow: 1, shadowAlign:[4,4], on: function(){ this.actBlock = Player.buildFondationCoord(1); this.img = UiSheet[BLOCKS[this.actBlock[0]].type+"Icon"] }, onclick: function(){ if(!Player.crafting){if( uiData[BLOCKS[this.these.actBlock[0]].type+"Ui"] ){deactiveUi(actualInv); activeUi(BLOCKS[this.these.actBlock[0]].type+"Ui");}}}
			},{	//Background inventory
				color:"steelblue", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){}
			},
			{ //Craft panel
				type:"panel", count:[3,3], img:UiSheet.cellMaterial, x:151, y:33, width:46, height:46, spacing: [6,6], onup: function(i){ if(Player.craftItems[i[1]][i[0]][0]=="empty"){ Player.craftItems[i[1]][i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]-=1; if(itemMove.item[2]<=0){itemMove.item=["empty",0,0, {}]}}Player.giveItem(itemMove.item); itemMove.reset();},
					ondraw: function(i, x, y){ drawItem(Player.craftItems[i[1]][i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.craftItems[i[1]][i[0]][0],Player.craftItems[i[1]][i[0]][1],Player.craftItems[i[1]][i[0]][2]]; Player.craftItems[i[1]][i[0]]=["empty", 0, 0]}}
			},{	//Inserter panel
				type:"panel", count:[2,2], img:UiSheet.cellInsert, x:105, y:33, width:46, height:46, spacing: [150,58], onup: function(i){ if(Player.insertItem[i[1]][i[0]][0]=="empty"){ Player.insertItem[i[1]][i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]-=1; if(itemMove.item[2]<=0){itemMove.item=["empty",0,0, {}]}}Player.giveItem(itemMove.item); itemMove.reset(); updateActActions(Player)},
					ondraw: function(i, x, y){ drawItem(Player.insertItem[i[1]][i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.insertItem[i[1]][i[0]][0],Player.insertItem[i[1]][i[0]][1],Player.insertItem[i[1]][i[0]][2]]; Player.insertItem[i[1]][i[0]]=["empty", 0, 0]; updateActActions(Player)}}
			},{	//Tool panel
				type:"panel", count:[2,1], img:UiSheet.cellTool, x:105, y:85, width:46, height:46, spacing: [150,58], onup: function(i){ if(Player.toolItems[i[0]][0]=="empty"){ Player.toolItems[i[0]] = [itemMove.item[0], itemMove.item[1], 1, itemMove.item[3]]; itemMove.item[2]-=1; if(itemMove.item[2]<=0){itemMove.item=["empty",0,0, {}]}}Player.giveItem(itemMove.item); itemMove.reset(); updateActActions(Player)},
					ondraw: function(i, x, y){ drawItem(Player.toolItems[i[0]], x, y, 46, 46)}, onclick: function(i){ if(!Player.crafting){itemMove.dragging = true; itemMove.item = [Player.toolItems[i[0]][0],Player.toolItems[i[0]][1],Player.toolItems[i[0]][2]]; Player.toolItems[i[0]]=["empty", 0, 0]; updateActActions(Player)}}
			},{	//block ahead
				img: UiSheet.slot, x: 212, y: 180, width: 32, height: 64, on: function(i){ this.img = Tileset[BLOCKS[Player.buildFondationCoord(Player.actLevelB)[0]].texture];}
			},{	//selection identification
				img: null, x: 212, y: 180, width: 64, height: 64, on: function(){ this.img = UiSheet["selection"+Player.actLevelB]}
			},
			{	//prev panel
				img:UiSheet.goPrev, x:255, y:189, width:46, height:46, onclick: function(){Player.listI=Player.listI>0?Player.listI-4:Player.listI}
			},{	//next panel
				img:UiSheet.goNext, x:301, y:189, width:46, height:46, onclick: function(){Player.listI=Player.listI+4<Player.actActions.length?Player.listI+4:Player.listI}
			},{ //Action key
				type:"panel", count:[1,4], color:"#bbb", stroke:"#888", strokeLine:2, x:353, y:33, width:105, height:46, spacing:[0,6], on: function(i){this.color = "#bbb"; this.visible = Player.actActions[i[1]+Player.listI]!=null; }, onclick: function(i){
					if(!Player.crafting){
						this.color = "#555"; Player.actualAction=Player.actActions[i[1]+Player.listI]; var item = pickEqualPlant(Player); Player.baseBlock = [Player.buildFondationCoord(0)[0], Player.buildFondationCoord(1)[0], Player.buildFondationCoord(2)[0]];
						if(item&&item.requireProcess==Player.actualAction&&(item.requireBaseBlock?(itemIn(Player.baseBlock[Player.actLevelB],item.requireBaseBlock)!=null):Player.baseBlock[Player.actLevelB]=="air")&&(Player.baseBlock[Player.actLevelB+1]?!BLOCKS[Player.baseBlock[Player.actLevelB+1]].solid:true)){
							Player.progressCrafting=1; Player.timeForCraft=item.time; Player.crafting = true;  Player.blockToBuild = JSON.parse(JSON.stringify(item.result))}else{alert("Esta e uma planta estranha.")}}}
			},{	//Action text
				type:"panel", count:[1,4], text:"pressionar", x:357, y:63, width:105, height:46, spacing:[0,6], shadow:4, on: function(i){ this.text = Player.actActions[i[1]+Player.listI];this.visible = Player.actActions[i[1]+Player.listI]!=null;}
			},{
				color:"#2f2", stroke:"black", strokeLine:1.5, x:105, y:189, width:92, height:46, strokeWidth:92, visible:false,
				on: function(){
					this.width = Player.progressCrafting*92;
					if(Player.crafting&&Player.progressCrafting<0){
						this.visible = false;
						Player.crafting = false;
						Player.putBlock(Player.blockToBuild, Player.actLevelB); Player.removeBlock(Player.actLevelB+1, true);
						Player.clearCraftInv();
						updateActActions(Player)}
					if(Player.progressCrafting>0){this.visible = true; Player.progressCrafting-=DELTATIME/Player.timeForCraft;}else{this.visible = false;} }
			}
		],
		inventoryUiItem: [
			{	//Background inventory
				color:"chocolate", stroke: "black", strokeLine:4, x: 96, y: 24, width: 368, height: 224, on: function(){}
			},
			{
				type:"panel", count:[7,4], img:UiSheet.cellInventory, x:105, y:33, width:46, height:46, spacing: [4.8,6], on: function(i){
					Player.itemSuspend[3].container
					if(!Player.itemSuspend[3].container){
						Player.itemSuspend[3].container=[];
						for(var i=0;i<ITEMS[Player.itemSuspend[0]].inventorySize;i++){
							Player.itemSuspend[3].container.push(["empty",0,0]);
						}
					}
					this.visible = (i[0]+i[1]*7)<Player.itemSuspend[3].container.length;
				}, onup: function(i){
					if(itemMove.dragging&&(i[0]+i[1]*7)<Player.itemSuspend[3].container.length){
						var item = putItemIntoInventory(Player.itemSuspend[3].container, itemMove.item)
						Player.giveItem(item);
						itemMove.reset();
					}
				}, ondraw: function(i, x, y){if((i[0]+i[1]*7)<Player.itemSuspend[3].container.length)drawItem(Player.itemSuspend[3].container[i[0]+i[1]*7], x, y, 46, 46)},
				onclick: function(i){ if(!Player.crafting){
					itemMove.dragging = true; itemMove.item = cloneItem(Player.itemSuspend[3].container[i[0]+i[1]*7]); Player.itemSuspend[3].container[i[0]+i[1]*7] = ["empty", 0, 0,{}]
				}}
			},{ //Count items
				type: "panel", count: [7, 4], text:"000", x: 114, y: 70, width:46, height:46, spacing: [4.8,6], on:function(i){
					if((i[0]+i[1]*7)<Player.itemSuspend[3].container.length)this.text = Player.itemSuspend[3].container[i[0]+i[1]*7][2];
					this.visible = (i[0]+i[1]*7)<Player.itemSuspend[3].container.length;
					}
			}
			
		],
		slotBar: [
			{	//slot bar
				type: "panel", count: [5, 1], img: UiSheet.slot, x:0, y: 272, width: 48, height: 48, spacing: [0,0], on: function(i){ this.img = i[0]==Player.slotActual?UiSheet.slotS:UiSheet.slot},
					ondraw: function(i, x, y){ drawItem(Player.inventory[i[0]], x, y, 48, 48)},
					onup: function(i){ Player.giveItem(cloneItem(itemMove.item), i[0]); itemMove.reset() }, onclick: function(i){ if(!Player.crafting){if(Player.slotActual==i[0]){itemMove.dragging = true; itemMove.item = [Player.inventory[i[0]][0],Player.inventory[i[0]][1],Player.inventory[i[0]][2], Player.inventory[i[0]][3]]; Player.inventory[i[0]]=["empty", 0, 0, {}]} Player.slotActual = i[0]}}
			},{	//durability bar
				type: "panel", count: [5, 1], color: "#0f0", stroke: "black", strokeLine:1.5, x: 0, y: 272, width: 48, strokeWidth: 48, height: 12, spacing: [0,0], on: function(i){ this.width = this.strokeWidth*Player.inventory[i[0]][1]; this.visible = Player.inventory[i[0]][1]>0;}
			},{ //Count items
				type: "panel", count: [5, 1], text:"000", x: 8, y: 312, width:48, height:64, on:function(i){this.text = Player.inventory[i[0]][2];}
			},
			
			{	//item in suspend
				img: UiSheet.slot, x: 240, y: 272, width: 48, height: 48, on: function(i){ this.img = Itemset[ITEMS[Player.itemSuspend[0]].texture]}, onclick: function(i){
					if(!Player.crafting&&Player.itemSuspend[2]>0){
						itemMove.dragging = true; itemMove.item = [Player.itemSuspend[0],Player.itemSuspend[1],1,Player.itemSuspend[3]];
						Player.unsuspendItem() }}, ondraw: function(i, x, y){ drawItem(Player.itemSuspend, x, y, 48, 48)}
			},{ //quantity item in suspend
				text:"000", x: 248, y: 312, width:48, height:64, on:function(i){this.text = Player.itemSuspend[2];}
			},
			
			{	//acess inventory button
				img: UiSheet.slotInv, x: 464, y: 272, width: 48, height: 48, spacing: 0, onclick: function(){
					if(!Player.crafting){
						if(hasActiveUi("gameplay")){
							deactiveUi("gameplay");
							activeUi(actualInv);
							updateActActions(Player);
						}else{
							if(activeUis[0]!=actualInv)
								activeUis.splice(0,1);
							else deactiveUi(actualInv);
							Player.dropCraftInv();
							activeUi("gameplay")}
					}
				}
			},
			
			{ //inventory icon button
				img:UiSheet.invIcon, x: 24, y: 24, width: 48, height: 48, shadow: 1, shadowAlign:[4,4], on: function(){this.visible = !hasActiveUi("gameplay")}, onclick: function(){
					if(!Player.crafting&&this.these.visible){
						if(activeUis[0]!=actualInv)
							deactiveUi(BLOCKS[blockIcon.actBlock[0]].type+"Ui");
						else deactiveUi(actualInv); actualInv = "uiInventory"; activeUi(actualInv); updateActActions(Player)
				}}
			},{ //craft icon button
				img:UiSheet.craftIcon, x: 24, y: 84, width: 48, height: 48, shadow: 1, shadowAlign:[4,4], on: function(){this.visible = !hasActiveUi("gameplay")}, onclick: function(){
					if(!Player.crafting&&this.these.visible){
						if(activeUis[0]!=actualInv)
							deactiveUi(BLOCKS[blockIcon.actBlock[0]].type+"Ui");
						else deactiveUi(actualInv); actualInv = "uiCraft"; activeUi(actualInv);
				}}
			},{ //build icon button
				img:UiSheet.buildIcon, x: 24, y: 144, width: 48, height: 48, shadow: 1, shadowAlign:[4,4], on: function(){this.visible = !hasActiveUi("gameplay")}, onclick: function(){
					if(!Player.crafting&&this.these.visible){
						if(activeUis[0]!=actualInv)
							deactiveUi(BLOCKS[blockIcon.actBlock[0]].type+"Ui");
						else deactiveUi(actualInv); actualInv = "uiBuild"; activeUi(actualInv);
				}}
			},{ //block icon button
				img:UiSheet.containerIcon, id:"blockIcon", x: 24, y: 204, width: 48, height: 48, shadow: 1, shadowAlign:[4,4], on: function(){
					this.actBlock = Player.buildFondationCoord(Player.actLevelB); this.img = UiSheet[BLOCKS[this.actBlock[0]].type+"Icon"]; this.visible = !hasActiveUi("gameplay");
				}, onclick: function(){
					if(!Player.crafting&&this.these.visible){if( uiData[BLOCKS[this.these.actBlock[0]].type+"Ui"] ){deactiveUi(actualInv); activeUi(BLOCKS[this.these.actBlock[0]].type+"Ui");
				}}}
			},
			
			{	//Item for drag
				draggable: true, id:"itemMove", item:["empty",0,0,{}], img: null, x:-50, y:-50, width:48, height:48, reset:function(){this.item=["empty",0,0,{}]}, ondragging: function(){}, ondrop: function(){ this.x = this.y =-50; dropItem(JSON.parse(JSON.stringify(this.item)), Player.x, Player.y); this.item = ["empty",0,0,{}] },
					ondraw: function(i, x, y){ drawItem(this.item, x, y, 48, 48)}
			}
			
		]
	}
	loadUiElements();
}