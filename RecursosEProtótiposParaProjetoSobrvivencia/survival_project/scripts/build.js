
function pickEqualPlant(player){
	for(var r=0;r<BUILDS.length;r++){
		var dataCraft = {material:JSON.parse(JSON.stringify(player.craftItems)), insert:JSON.parse(JSON.stringify(player.insertItem)), tool:JSON.parse(JSON.stringify(player.toolItems))}
		if(BUILDS[r].shaped){
			var materialMatch = false;
			for(var yi=0;yi<4-BUILDS[r].material.length;yi++){
				for(var xi=0;xi<4-BUILDS[r].material[0].length;xi++){
					var itemMatch = true;
					for(var y=0;y<BUILDS[r].material.length;y++){
						for(var x=0;x<BUILDS[r].material[y].length;x++){
							if(dataCraft.material[y+yi][x+xi][0]!=BUILDS[r].material[y][x]){
								itemMatch = false;
								break;
							}
						}
						if(!itemMatch) break;
					}
					if(!itemMatch) continue;
					else{
						for(var y=0;y<BUILDS[r].material.length;y++){
							for(var x=0;x<BUILDS[r].material[y].length;x++){
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
			if(BUILDS[r].insert)
				for(var y=0;y<dataCraft.insert.length;y++){
					for(var x=0;x<dataCraft.insert[y].length;x++){
						if(dataCraft.insert[y][x][0]!=BUILDS[r].insert[y][x]){
							insertMatch = false;
						}
					}
				}
			if(!insertMatch) continue;
			if(BUILDS[r].tool)
				if(!(dataCraft.tool[0][0]==BUILDS[r].tool[0]&&dataCraft.tool[1][0]==BUILDS[r].tool[1])) continue;
			return BUILDS[r];
		}else{
			var materialMatch = false;
			for(var m=0;m<BUILDS[r].material.length; m++){
				var itemMatch = false;
				for(var y=0;y<dataCraft.material.length;y++){
					for(var x=0;x<dataCraft.material[y].length;x++){
						if(dataCraft.material[y][x][0]==BUILDS[r].material[m]){
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
			if(BUILDS[r].insert){
				var itemMatch = false;
				for(var m=0;m<CRAFTS[r].material.length; m++){
					for(var y=0;y<dataCraft.insert.length;y++){
						for(var x=0;x<dataCraft.insert[y].length;x++){
							if(dataCraft.insert[y][x][0]==BUILDS[r].insert[m]){
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
			if(!insertMatch) continue;
			///Ferramentas
			var toolMatch = true;
			if(BUILDS[r].tool){
				for(var m=0;m<BUILDS[r].tool.length; m++){
					var itemMatch = false;
					for(var x=0;x<dataCraft.tool.length;x++){
						if(dataCraft.tool[x][0]==BUILDS[r].tool[m]){
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
			if(!toolMatch) continue;
			return BUILDS[r];
		}
	}
	return null;
}