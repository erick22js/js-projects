
function genTerrain(terArr, width, height){
	var region = [];
	
	//Preparar terreno
	for(var l=-1; l<4; l++){
		terArr[l]=[];
	}
	for(var y=0; y<height; y++){
		terArr[-1].push([]);
		terArr[0].push([]);
		terArr[1].push([]);
		terArr[2].push([]);
		region.push([]);
		for(var x=0; x<width; x++){
			terArr[-1][y].push(["dirtFloor",1,{}]);
			terArr[0][y].push(["water",1,{}]);
			terArr[1][y].push(["air",1,{}]);
			terArr[2][y].push(["air",1,{}]);
			region[y].push(["ocean"]);
		}
	}
	
	//Gerar florestas
	actualPen = "forest";
	Shaperer.fillRect(width*.4, height*.4, width*.4+width*.3, height*.4+height*.3, region);
	//Gerar lagos
	actualPen = "lagoon";
	var lagoons = 6+getNextRandom()*5;
	do{
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		var sx = 4+getNextRandom()*(width/height)*3;
		var sy = 4+getNextRandom()*(width/height)*3;
		if(region[y][x]!="ocean"){
			Shaperer.fillRect(x, y, x+sx, y+sy, region);
			lagoons--;
		}
	}while(lagoons>0);
	//Gerar praias
	actualPen = "beach";
	Shaperer.makeBaye("ocean","forest", region);
	Shaperer.makeBaye("beach","forest", region);
	Shaperer.makeBaye("beach","forest", region);
	Shaperer.makeBaye("beach","forest", region);
	Shaperer.makeBaye("beach","forest", region);
	//Gerar bordas de lagos
	actualPen = "lagoonBorder";
	Shaperer.makeBaye("lagoon","forest", region);
	
	
	
	//Actualizar piso para biomas
	for(var y=0; y<height; y++){
		for(var x=0; x<width; x++){
			terArr[0][y][x][0] = region[y][x]=="forest"?"grassFloor":
									region[y][x]=="beach"?"sand":
									region[y][x]=="lagoonBorder"?(getNextRandom()>.7?"clayBlock":"gravelBlock"):
									"water";
			terArr[0][y][x][2].saltQuantity = region[y][x]=="ocean"?17:.5;
		}
	}
	
	
	
	
	
	
	
	//SetDebugMap
	map.width = width;map.height = height;
	for(var y=0; y<height; y++){
		for(var x=0; x<width; x++){
			mapctx.fillStyle = region[y][x]=="ocean"||region[y][x]=="lagoon"?"cyan":
								region[y][x]=="beach"?"yellow":
								region[y][x]=="lagoonBorder"?"chocolate":"lime";
			mapctx.fillRect(x, y, 1, 1);
		}
	}
	
	
	//Distribuir gramas pelo terreno
	var grass = (width*height*.8) //O terceiro valor é a densidade de gramas
	for(var i=0; i<grass; i++){
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		if(region[y][x]=="forest")
			terArr[1][y][x] = [getNextRandom()<=.65?"lowGrass":"highGrass",1,{}]; //Chance de gerar grama alta
	}
	
	//Distribuir pedras pelo terreno
	var stones = (width*height*.12) //O terceiro valor é a densidade de árvores
	for(var i=0; i<stones; i++){
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		if(region[y][x]=="forest")
			terArr[1][y][x] = ["fragmentStone",1,{}];
	}
	
	//Distribuir madeiras pelo terreno
	var sticks = (width*height*.12) //O terceiro valor é a densidade de árvores
	for(var i=0; i<sticks; i++){
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		if(region[y][x]=="forest")
			terArr[1][y][x] = ["sticks",1,{}];
	}
	
	/*
	*	Gerar exemplares de frutíferas, leguminosas, hortaliças e raízes
	*/
	//Feijão
	var bean = (width*height*.015);
	for(var i=0; i<bean; i++){
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		if(region[y][x]=="forest")
			terArr[1][y][x] = ["beanPlant",1,{},{stage: ~~Math.sqrt(getNextRandom()*9)}];
	}
	
	//Distribuir árvores e mudas pelo terreno
	var trees = (width*height*.15) //O terceiro valor é a densidade de árvores
	for(var i=0; i<trees; i++){
		var x = ~~(getNextRandom()*width);
		var y = ~~(getNextRandom()*height);
		if(region[y][x]=="forest"){
			terArr[1][y][x] = [getNextRandom()<=.85?"tree":"sappling",1,{}]; //Chance de gerar mudas é menor que a de árvores
			//Chance aleatória de gerar vinhas ou maçãs nas árvores
			if(getNextRandom()>=.8&&x>1&&terArr[1][y][x-1][0]!="tree",1)
				terArr[1][y][x-1][0] = getNextRandom()<=.4?"appleToped":"vineToped";
			if(getNextRandom()>=.8&&x<width-2&&terArr[1][y][x+1][0]!="tree")
				terArr[1][y][x+1][0] = getNextRandom()<=.4?"appleToped":"vineToped";
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//Executar limpeza e refinação final
	for(var y=0; y<height; y++){
		for(var x=0; x<width; x++){
			if(x==0||y==0||x==width-1||y==height-1){
				terArr[-1][y][x]=["void",0,{},{}];
				terArr[0][y][x]=["void",0,{},{}];
				terArr[1][y][x]=["void",0,{},{}];
				terArr[2][y][x]=["void",0,{},{}];
			}
		}
	}
}

/*function mapGenShape(map, type, mediaSize){
	var x = getNextRandom()*;
}*/