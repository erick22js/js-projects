
function updateActActions(player){
	player.listI = 0;
	player.actActions = ["encaixar","pressionar","bater","descascar"];
	for(var i=0;i<player.toolItems.length;i++){
		if(ITEMS[player.toolItems[i][0]].craftActions){
			for(var acti=0;acti<ITEMS[player.toolItems[i][0]].craftActions.length;acti++){
				var hasAdded = false;
				for(var act=0;act<player.actActions.length;act++)
					if(ITEMS[player.toolItems[i][0]].craftActions[acti]==player.actActions[act]){
						hasAdded = true;
						break;
					}
				if(!hasAdded){
					player.actActions.push(ITEMS[player.toolItems[i][0]].craftActions[acti]);
				}
			}
		}
	}
	for(var y=0;y<player.insertItem.length;y++){
		for(var x=0;x<player.insertItem[y].length;x++){
			if(ITEMS[player.insertItem[y][x][0]].craftActions){
				for(var acti=0;acti<ITEMS[player.insertItem[y][x][0]].craftActions.length;acti++){
					var hasAdded = false;
					for(var act=0;act<player.actActions.length;act++)
						if(ITEMS[player.insertItem[y][x][0]].craftActions[acti]==player.actActions[act]){
							hasAdded = true;
							break;
						}
					if(!hasAdded){
						player.actActions.push(ITEMS[player.insertItem[y][x][0]].craftActions[acti]);
					}
				}
			}
		}
	}
}
function pickEqualRecipe(player){
	for(var r=0;r<CRAFTS.length;r++){
		var dataCraft = {material:JSON.parse(JSON.stringify(player.craftItems)), insert:JSON.parse(JSON.stringify(player.insertItem)), tool:JSON.parse(JSON.stringify(player.toolItems))}
		console.log(CRAFTS[r]);
		if(CRAFTS[r].shaped){
			var materialMatch = false;
			for(var yi=0;yi<4-CRAFTS[r].material.length;yi++){
				for(var xi=0;xi<4-CRAFTS[r].material[0].length;xi++){
					var itemMatch = true;
					for(var y=0;y<CRAFTS[r].material.length;y++){
						for(var x=0;x<CRAFTS[r].material[y].length;x++){
							if(dataCraft.material[y+yi][x+xi][0]!=CRAFTS[r].material[y][x]){
								itemMatch = false;
								break;
							}
						}
						if(!itemMatch) break;
					}
					if(!itemMatch) continue;
					else{
						for(var y=0;y<CRAFTS[r].material.length;y++){
							for(var x=0;x<CRAFTS[r].material[y].length;x++){
								dataCraft.material[y+yi][x+xi][0] = "empty";
							}
						}
						materialMatch = true;
						break;
					}
				}
				if(materialMatch) break;
			}
			for(var y=0;y<dataCraft.material.length;y++){
				for(var x=0;x<dataCraft.material[y].length;x++){
					if(dataCraft.material[y][x][0]!="empty"){
						materialMatch = false;
					}
				}
			}
			if(!materialMatch) continue;
			var insertMatch = true;
			for(var y=0;y<dataCraft.insert.length;y++){
				for(var x=0;x<dataCraft.insert[y].length;x++){
					if(dataCraft.insert[y][x][0]!=CRAFTS[r].insert[y][x]){
						insertMatch = false;
					}
				}
			}
			if(!insertMatch) continue;
			if(!(dataCraft.tool[0][0]==CRAFTS[r].tool[0]&&dataCraft.tool[1][0]==CRAFTS[r].tool[1])) continue;
			
			return CRAFTS[r];
		}else{
			var materialMatch = false;
			for(var m=0;m<CRAFTS[r].material.length; m++){
				var itemMatch = false;
				for(var y=0;y<dataCraft.material.length;y++){
					for(var x=0;x<dataCraft.material[y].length;x++){
						console.log(dataCraft.material[y][x][0]);
						console.log(CRAFTS[r].material[m]);
						if(dataCraft.material[y][x][0]==CRAFTS[r].material[m]){
							dataCraft.material[y][x][0]="empty";
							itemMatch = true;
							break;
						}
					}
					if(itemMatch)break;
				}
				if(!itemMatch){materialMatch = false; break}
				else{materialMatch = true}
			}
			for(var y=0;y<dataCraft.material.length;y++)
				for(var x=0;x<dataCraft.material[y].length;x++){
					if(dataCraft.material[y][x][0]!="empty"){
					materialMatch = false;
				}
			}
			if(!materialMatch) continue;
			///Inserts
			var insertMatch = true;
			if(CRAFTS[r].insert){
				var itemMatch = false;
				for(var m=0;m<CRAFTS[r].material.length; m++){
					for(var y=0;y<dataCraft.insert.length;y++){
						for(var x=0;x<dataCraft.insert[y].length;x++){
							if(dataCraft.insert[y][x][0]==CRAFTS[r].insert[m]){
								dataCraft.insert[y][x][0]="empty";
								itemMatch = true;
								break;
							}
						}
						if(itemMatch)break;
					}
					if(!itemMatch){insertMatch = false; break}
					else{insertMatch = true}
				}
			}
			for(var y=0;y<dataCraft.insert.length;y++)
				for(var x=0;x<dataCraft.insert[y].length;x++){
					if(dataCraft.insert[y][x][0]!="empty"){
						insertMatch = false;
				}
			}
			console.log(JSON.stringify(dataCraft));
			if(!insertMatch) continue;
			
			///Ferramentas
			var toolMatch = true;
			if(CRAFTS[r].tool){
				for(var m=0;m<CRAFTS[r].tool.length; m++){
					var itemMatch = false;
					for(var x=0;x<dataCraft.tool.length;x++){
						if(dataCraft.tool[x][0]==CRAFTS[r].tool[m]){
							dataCraft.tool[x][0]="empty";
							itemMatch = true;
							break;
						}
					}
					if(!itemMatch){toolMatch = false; break}
					else{toolMatch = true}
				}
			}
			for(var x=0;x<dataCraft.tool.length;x++){
				if(dataCraft.tool[x][0]!="empty"){
					toolMatch = false;
				}
			}
			console.log(JSON.stringify(dataCraft));
			if(!toolMatch) continue;
			return CRAFTS[r];
		}
	}
	return null;
}
