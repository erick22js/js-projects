
//Nome: índices de textura de item, estado inicial, amontoamento máximo, tamanho, consumível, função ao usar, função quando caído

/*
	Tamanhos para items (comparação)
	0 => sementes e coisas pequenas
	1 => frutas como maçãs, objetos no geral, e ferramentas pequenas
	2 => panelas e objetos maiores
	3 => tábuas compridas/ferramentas grandes como uma enxada
*/

const ITEMS = {
	"empty":{texture:0, state:0, maxAmmount:1, size:0, consumible:false},
	/*
	*	Alimentos
	*/
	//Maçã
	"apple":{texture:1, type:"food", state:0, maxAmmount:5, size:1, consumible:true, onuse:function(){
		Player.hungry += .05+Math.random()*.05;
		Player.giveItem(["appleEaten", 0, 1]);
	}},
	"appleFunged":{texture:11, type:"food", state:0, maxAmmount:5, size:1, consumible:true, onuse:function(){
		Player.hungry += .01+Math.random()*.04;
		Player.giveItem(["appleFungedEaten", 0, 1]);
	}},
	"appleEaten":{texture:2, state:0, maxAmmount:8, size:1, consumible:false},
	"appleFungedEaten":{texture:12, state:0, maxAmmount:10, size:1, consumible:false},
	/*
	*	Preparações alimentíceas
	*/
	"beanGuisadeOnPot":{texture:27, state:0, maxAmmount:1, size:2},
	/*
	*	Plantio
	*/
	"seedApple":{texture:8, state:0, maxAmmount:30, size:0, consumible:false},
	"beams":{texture:25, state:0, maxAmmount:15, size:1},
	"bean":{texture:26, state:0, maxAmmount:35, size:0},
	/*
	*	Materiais
	*/
	"stick":{texture:3, state:0, maxAmmount:4, size:1, consumible:false, fuel:true, fuelDuration:30},
	"stone":{texture:4, state:0, craftActions:["bater", "esfregar"], maxAmmount:5, size:1, consumible:false},
	"vineStrings":{texture:5, state:0, craftActions:["amarrar"], maxAmmount:4, size:1, consumible:false},
	"leaf":{texture:15, size:0},
	"stickDry":{texture:13, size:1},
	"leafDry":{texture:14, size:1},
	/*
	*	Rochas e minerais
	*/
	"clay":{texture:16, size:1, maxAmmount:2},
	"gravel":{texture:21, size:1, maxAmmount:7},
	"silex":{texture:22, size:1, maxAmmount:5, durabily:25},
	"pirite":{texture:23, size:1, maxAmmount:8},
	/*
	*	Peças para ferramentas
	*/
	"affinedStone":{texture:6, state:0, maxAmmount:6, size:1, consumible:false},
	"polishedStone":{texture:9, state:0, maxAmmount:3, size:1, consumible:false},
	/*
	*	Ferramentas
	*/
	"improvedKnife":{texture:7, type:"tool", classe:"knife", durabily:10, strength:1.5, state:1, craftActions:["cortar","raspar"], maxAmmount:1, size:1, consumible:false},
	"improvedAxe":{texture:10, type:"tool", classe:"axe", durabily:15, strength:2, state:0, maxAmmount:1, size:1},
	/*
	*	Utensílios
	*/
	"clayPot":{texture:0, size:2, maxAmmount:1, type:"inventory", inventorySize:5, onuse:function(these){
		if(Player.buildFondationCoord(Player.actLevelB)[0]=="water"&&!(these[3].filled))
			these[3].filled = "water";
		if(Player.buildFondationCoord(Player.actLevelB)[0]=="bonfireActivated"&&these[3].filled=="water"){
			Player.buildFondationCoord(Player.actLevelB)[0] = "bonfireDry";
			these[3].filled = null;
		}
	}, raster:function(item, x, y, w, h){
		//alert(item);
		if(item[3].filled==null) drawTexture(Itemset[17], x, y, w, h)
		else if(item[3].filled=="water") drawTexture(Itemset[24], x, y, w, h);
	}},
	"clayJar":{texture:20, size:2, maxAmmount:1},
	"clayBowl":{texture:18, size:1, maxAmmount:3},
	"clayCup":{texture:19, size:1, maxAmmount:3}
}