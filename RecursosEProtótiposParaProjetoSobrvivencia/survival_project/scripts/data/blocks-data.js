
const BgrowingSpeed = 4800;
const variationGrow = 1200;
const getTiming = function(){return DELTATIME*Weather.speed*Weather.speedM}

//DATA DE BLOCOS
//NOME: indiceTextura; sólido; segundoEstágio(nome do bloco); chão;  putScript; execuçãoScript; destroyScript; item concedido ao ser coletado

/*
	Classes:  knife,  axe,  row,  cutter...
*/

const BLOCKS = {
	//-----TRASH BLOCKS-----
	"floorPlantedApple":{texture:0, on:function(x,y,l,t){t[0]="floorPlanted"; t[3].seed="apple"}},
	//-----TRASH BLOCKS-----
	"air":{texture:0, solid:false},
	"errorCallback":{texture:2, solid:true},
	"void":{texture:0, solid:true},
	/*
	* Chão natural
	*/
	"grassFloor":{texture:1, solid:true, phase2:"dirtFloor", isGround:true, on:function(x, y, l){
		WORLDMAP[l][y][x][2] = isNaN(WORLDMAP[l][y][x][2])||(WORLDMAP[l][y][x][2]<=0&&WORLDMAP[l+1][y][x][0]=="air")?(BgrowingSpeed+Math.random()*variationGrow)*.25:WORLDMAP[l][y][x][2]-getTiming();
		if(WORLDMAP[l][y][x][2]<=0&&WORLDMAP[l+1][y][x][0]=="air")
			WORLDMAP[l+1][y][x] = ["lowGrass",1,{},{}];
	}},
	"floorPlanted":{texture:21, solid:true, isGround:true, on:function(x, y, l, these){
		WORLDMAP[l][y][x][2] = isNaN(WORLDMAP[l][y][x][2])||(WORLDMAP[l][y][x][2]<=0&&WORLDMAP[l+1][y][x][0]=="air")?(BgrowingSpeed+Math.random()*variationGrow)*.3:WORLDMAP[l][y][x][2]-getTiming();
		if(WORLDMAP[l][y][x][2]<=0){
			if(!BLOCKS[WORLDMAP[l+1][y][x][0]].solid&&WORLDMAP[l+1][y][x][0]!="fragmentStone")
				switch(these[3].seed){
					case "apple":
						WORLDMAP[l+1][y][x] = ["sappling",1,{},{}];
						break;
					case "bean":
						WORLDMAP[l+1][y][x] = ["beanSappling",1,{},{}];
						break;
				}
			WORLDMAP[l][y][x] = ["grassFloor",1,{},{}];
		}
	}},
	"dirtFloor":{texture:12, solid:true, isGround:true},
	"sand":{texture:36, solid:true, isGround:true},
	"gravelBlock":{texture:35, solid:true, isGround:true, stack:true, give:[[["gravel",0,0,{}],1,3,.9],[["silex",1,0,{}],1,1,.05],[["pirite",0,0,{}],1,3,.0075]]},
	"clayBlock":{texture:15, solid:true, isGround:true, stack:true, give:[[["clay",0,1],1,2,1]]},
	"clayBlockDry":{texture:34, solid:true, isGround:true},
	"water":{texture:0, solid:false, animation:{index:0, animationLength:8, animationSpeed:12}, on:function(x, y, l){
		if(WORLDMAP[l][y][x-1][0]=="air")WORLDMAP[l][y][x-1] = ["water", 1, {}, {}]
		if(WORLDMAP[l][y-1][x][0]=="air")WORLDMAP[l][y-1][x] = ["water", 1, {}, {}]
		if(WORLDMAP[l][y][x+1][0]=="air")WORLDMAP[l][y][x+1] = ["water", 1, {}, {}]
		if(WORLDMAP[l][y+1][x][0]=="air")WORLDMAP[l][y+1][x] = ["water", 1, {}, {}]
	}},

	/*
	* SEÇÃO NATURAL
	*/

	/*
	* Seção das árvores
	*/
	"sappling":{texture:9, solid:false, on:function(x, y, l){ //Stage 1
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.4:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["sappling2",1,{},{}];
	}, needForExtract:"knife", resistance:4, give:[[["stick", 1, 1, {}],1,1,1]]},
	"sappling2":{texture:18, solid:true, phase2:"sticks", on:function(x, y, l){ //Stage 2
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.6:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["tree",1,{},{}];
	}, give:["stick", 0, 2], needForExtract:"axe", resistance:4, give:[[["stick", 1, 2],2,2,1]]},
	"tree":{texture:3, solid:true, phase2:"baseTree", on:function(x, y, l){ //Final Stage
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.3:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0){
			if(!BLOCKS[WORLDMAP[l][y][x-1][0]].solid&&WORLDMAP[l][y][x-1][0]!="vineToped"&&WORLDMAP[l][y][x-1][0]!="appleToped"&&WORLDMAP[l][y][x-1][0]!="sappling")
				WORLDMAP[l][y][x-1] = [Math.random()<=.4?"appleToped":"vineToped",1,{},{}];
			else if(!BLOCKS[WORLDMAP[l][y][x+1][0]].solid&&WORLDMAP[l][y][x+1][0]!="vineToped"&&WORLDMAP[l][y][x+1][0]!="appleToped"&&WORLDMAP[l][y][x+1][0]!="sappling")
				WORLDMAP[l][y][x+1] = [Math.random()<=.4?"appleToped":"vineToped",1,{},{}];
			WORLDMAP[l][y][x][2].time = (BgrowingSpeed+Math.random()*variationGrow)*.3;
		}
	}, needForExtract:["axe"], resistance:9, give:[[["stick", 1, 12],8,15,1]]},
	"baseTree":{texture:4, solid:true, on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.35:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["baseTree2",1,{},{}];
	}, needForExtract:["axe"], resistance:5, give:[[["stick", 1, 12],8,15,1]]},
	"baseTree2":{texture:17, solid:true, phase2:"baseTree", on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.45:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["tree",1,{},{}];
	}, needForExtract:"axe", resistance:4, give:[[["stick", 1, 12],2,4,1]]},
	/*
	* Plantas
	*/
	"beanSapling":{texture:0, solid:false, type:"plant", stages:[
	[41, .4],
	[40, .4]], onendstages:function(x,y,l,these){
		if(these[3].stage==2)
			putBlock(x,y,["beanPlant",0,{},{stage:0}],l);
	}},
	//Estagios: textura, tempo
	"beanPlant":{texture:0, solid:true, type:"plant", stages:[
	[37, .3],
	[38, .15],
	[39, .1]], onInteract:function(player, these){
		if(these[3].stage>1){
			setBlock(these, ["beanPlant",0,{},{}]);
			player.giveItem(["beams", 0, 6]);
		}
	}},
	/*
	* Frutas
	*/
	"appleToped":{texture:19, solid:false, on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.4:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["apple",1,{},{}];
		if(WORLDMAP[l][y][x-1][0]!="tree"&&WORLDMAP[l][y][x+1][0]!="tree")
			WORLDMAP[l][y][x] = ["apple",1,{},{}];
	}, give:[[["apple", 0, 1, {}],1,1,1]]},
	"apple":{texture:20, solid:false, on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.04:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["appleFunged",1,{},{}];
	}, give:[[["apple", 0, 1, {}],1,1,1]]},
	"appleFunged":{texture:30, solid:false, on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)||WORLDMAP[l][y][x][2].time<=0?(BgrowingSpeed+Math.random()*variationGrow)*.15:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0){
			if(Math.random()<.2&&WORLDMAP[l-1][y][x][0]=="grassFloor")WORLDMAP[l-1][y][x] = ["floorPlanted",1,{},{seed:"apple"}];
			if(Math.random()<.12&&WORLDMAP[l-1][y][x-1][0]=="grassFloor")WORLDMAP[l-1][y][x-1] = ["floorPlanted",1,{},{seed:"apple"}];
			if(Math.random()<.12&&WORLDMAP[l-1][y][x+1][0]=="grassFloor")WORLDMAP[l-1][y][x+1] = ["floorPlanted",1,{},{seed:"apple"}];
			if(Math.random()<.12&&WORLDMAP[l-1][y-1][x][0]=="grassFloor")WORLDMAP[l-1][y-1][x] = ["floorPlanted",1,{},{seed:"apple"}];
			if(Math.random()<.12&&WORLDMAP[l-1][y+1][x][0]=="grassFloor")WORLDMAP[l-1][y+1][x] = ["floorPlanted",1,{},{seed:"apple"}];
			WORLDMAP[l][y][x] = ["air",1,{},{}];
		}
	}, give:[[["appleFunged", 0, 1, {}],1,1,1]]},
	/*
	* Asbustivos
	*/
	"lowGrass":{texture:16, solid:false, on:function(x, y, l){ //Stage 1
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.2:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["highGrass",1,{},{}];
	}},
	"highGrass":{texture:11, solid:false},
	/*
	* Materiais caídos
	*/
	"fragmentStone":{texture:10, solid:false, give:[[["stone", 0, 1, {}],2,4,1]]},
	"sticks":{texture:6, solid:false, give:[[["stick", 1, 1, {}],2,2,1]]},
	"sticksDry":{texture:28},
	"leafs":{texture:27},
	"leafsDry":{texture:29},
	/*
	* Vinhas
	*/
	"vineToped":{texture:13, solid:false, phase2:"vine", on:function(x, y, l){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?(BgrowingSpeed+Math.random()*variationGrow)*.4:WORLDMAP[l][y][x][2].time-getTiming();
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x] = ["vine",1,{},{}];
		if(WORLDMAP[l][y][x-1][0]!="tree"&&WORLDMAP[l][y][x+1][0]!="tree")
			WORLDMAP[l][y][x] = ["vine",1,{},{}];
	}},
	"vine":{texture:14, solid:false, give:[[["vineStrings", 0, 1, {}],2,5,1]]},

	/*
	* Seção humana
	*/
	"bonfire":{texture:31, solid:true, type:"cooker", fuelsize:3},
	"bonfireDry":{texture:32, solid:true, type:"cooker", fuelsize:3, onPlace:function(){
		these[3].isCooking = false;
	}},
	"bonfireActivated":{texture:31, animateTexture:true, type:"cooker", fuelsize:3, animation:{index:1, animationLength:6, animationSpeed:12}, solid:true, lightning:{intensity:1}, onPlace:function(x, y, lv, data){
		data[0]="bonfireActivated";
		WORLDMAP[lv][y][x] = data;
		//console.log(JSON.stringify(WORLDMAP[lv][y][x]))
	}, on: function(x,y,l,these){
		var empty=true;
		for(var i=0;i<these[3].fuel.length;i++){
			if(ITEMS[these[3].fuel[i][0]].fuel){
				empty = false;
				these[3].fuel[i][1] -= 1/ITEMS[these[3].fuel[i][0]].fuelDuration*getTiming();
				if(these[3].fuel[i][1]<0){
					these[3].fuel[i][2]--;
					these[3].fuel[i][1]=1;
					if(these[3].fuel[i][2]<1)
						these[3].fuel[i] = ["empty",0,0]
				}
				break;
			}
		}
		if(these[3].isCooking){
			these[3].timeForCooking -= (1/these[3].recipe.timeForCooking)*getTiming();
			if(these[3].timeForCooking<=0){
				these[3].timeForCooking = 0;
				these[3].isCooking = false;
				for(var i=0;i<these[3].ingredients.length;i++){
					these[3].ingredients[i] = ["empty",0,0,{}];
				}
				var item = these[3].recipe.result;
				putItemIntoInventory(these[3].ingredients,item);
			}
		}
		if(empty) these[0]="bonfireDry";
	}},
	/*
	* Construções
	*/
	//Modelagem
	"clay":{texture:0, solid:true, type:"clay", give:["clay",0,1], on:function(x, y, l, these){
		WORLDMAP[l][y][x][2].time = isNaN(WORLDMAP[l][y][x][2].time)?400+Math.random()*200:WORLDMAP[l][y][x][2].time-getTiming()*(Weather.isNight()?.1:1);
		if(WORLDMAP[l][y][x][2].time<=0)
			WORLDMAP[l][y][x][0] = "clayDry";
	}, raster:function(these, x, y, lv){
		drawTexture(getClayTexture(these),~~x,~~y+32,32,32);
	}},
	"clayDry":{texture:0, solid:true, onRemove:function(x,y,lv,these){
		var item = CLAYCRAFT["clay"][these[3].stage].giveOnDry;
		if(item) Player.giveItem(item);
	}, raster:function(these, x, y, lv){
		drawTexture(getClayTexture(these,true),x,y+32,32,32);
	}},
	//Materiais com gravetos e troncos
	"wallLog":{texture: 22, solid:true, onPlace:function(x, y, l){
		if(inputMove.lookRight!=0)
			WORLDMAP[l][y][x] = ["wallVLog",1,{},{}];
	}},
	"wallVLog":{texture: 23, solid:true},
	"floorLog":{texture: 24, solid:true, isGround:true},
	"containerLog":{texture: 26, solid:true, type:"container", inventorySize:12},
	//Materiais com tábuas
	"wallPlank":{texture:5, solid:true, onPlace:function(x, y, l){
		if(inputMove.lookRight!=0)
			WORLDMAP[l][y][x] = ["wallVPlank",1,{},{}];
	}},
	"wallVPlank":{texture:8, solid:true},
	"floorPlank":{texture:7, solid:true, isGround:true}

}
