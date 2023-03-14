

function checkCookRecipe(block){
	recipeVer:
	for(var r=0;r<COOK.length;r++){
		//Obter ingredientes do bloco específico
		var container = JSON.parse(JSON.stringify(block[3].ingredients));
		testeZero:
		for(var ingC=0;ingC<container.length;ingC++){
			console.log(container[ingC][0]);
			if(container[ingC][0]!="empty"){
				break testeZero;
			}
			continue recipeVer;
		}
		//Realizar um looping em cada ingrediente da receita
		ingVer:
		for(var ingR=0;ingR<COOK[r].ingredient.length;ingR++){
			//Realizar looping em cada ingrediente no container
			for(var ingC=0;ingC<container.length;ingC++){
				//Checar se o ingrediente bate com a receita
				console.log(container[ingC][0]+" | "+COOK[r].ingredient[ingR].item);
				if(container[ingC][0]==COOK[r].ingredient[ingR].item&&(COOK[r].ingredient[ingR].ammount?container[ingC][2]>=COOK[r].ingredient[ingR].ammount:true)){
					//Se sim, verificar se o item é algum outro container
					if(COOK[r].ingredient[ingR].container){
						if(container[ingC][3].filled!=COOK[r].ingredient[ingR].filled)
							continue recipeVer;
						//console.log(COOK[r].ingredient[ingR].container);
						//verificar se há conteúdo
						testeZero:
						for(var sbC=0; sbC<container[ingC][3].container.length;sbC++){
							//console.log(container[ingC][3].container[sbC][0])
							if(container[ingC][3].container[sbC][0]!="empty")
								break testeZero;
							continue recipeVer;
						}
						//Fazer looping em cada sub-item da receita
						for(var sbR=0; sbR<COOK[r].ingredient[ingR].container.length;sbR++){
							//Fazer looping em cada sub-item do container
							for(var sbC=0; sbC<container[ingC][3].container.length;sbC++){
								//Verificar se há o sub-item
								if(container[ingC][3].container[sbC][0]==COOK[r].ingredient[ingR].container[sbR][0]&&(container[ingC][3].container[sbC][2]>=COOK[r].ingredient[ingR].container[sbR][1])){
									//console.log(container[ingC][3].container[sbC][0]+" | "+COOK[r].ingredient[ingR].container[sbR][0]);
									container[ingC][3].container[sbC][0] = "empty";
								}
							}
							//Agora verificar se o conteúdo bate com o conteúdo da receita
							for(var sbC=0; sbC<container[ingC][3].container.length;sbC++){
								//console.log(container[ingC][3].container[sbC][0])
								if(container[ingC][3].container[sbC][0]!="empty")
									continue recipeVer;
							}
						}
					}
					container[ingC][0] = "empty";
					console.log(JSON.stringify(container))
					continue ingVer;
				}
			}
				continue recipeVer;
		}
		for(var ingC=0;ingC<container.length;ingC++){
			//console.log(container[ingC][0]);
			if(container[ingC][0]!="empty"){
				continue recipeVer;
			}
		}
		return JSON.stringify(COOK[r]);
	}
	return null;
}
