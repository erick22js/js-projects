const ctx = tela.getContext("2d");

const Air = 0;
const Water = 1;
const Rock = 2;

const Dt = [];

for(var y=-1; y<51; y++){
	//var line = [];
	Dt[y] = [];
	for(var x=-1; x<51; x++)
		Dt[y][x] = {
			block: y>=49||y<=0||x>=49||x<=0?Rock:Air,
			ammount: 0,
			"x":x,
			"y":y,
		};
		/*line.push({
			block: y==49?Rock:Air,
			ammount: 0,
		});*/
	//Dt.push(line);
}
Dt[48][4].block = Rock;
Dt[37][5].block = Water;
Dt[37][5].ammount = 1;
Dt[35][5].block = Water;
Dt[35][5].ammount = 1;

function Redraw(){
	ctx.clearRect(0, 0, 500, 500);
	for(var y=0; y<50; y++){
		for(var x=0; x<50; x++)
			DrawBlock(Dt[y][x], x*10, y*10);
	}
}

function DrawBlock(block, x, y){
	ctx.fillStyle = 
		block.block==Air?"#fff":
		block.block==Water?"#3af":
		block.block==Rock?"#777":
		"#000";
	if(block.block==Water)
		drawWater(block, x, y)
	else
		ctx.fillRect(x, y, 10, 10);
	//console.log(block);
}
function drawWater(block, x, y){
	//console.log(block);
	//Begin by level
	ctx.beginPath();
	ctx.moveTo(x+5, y-(~~(block.ammount*10))+10);
	//alert(block.x);
	if(Dt[block.y][block.x+1].block==Water){
		ctx.lineTo(x+15, y-(~~(Dt[block.y][block.x+1].ammount*10))+10);
	}
	else{
		ctx.lineTo(x+10, y-(~~(block.ammount*(Dt[block.y][block.x+1].block==Rock?1:.8)*10))+10);
	}
	
	//if(Dt[block.y+1][block.x].block==Water){
	//	ctx.lineTo(x+5, y+10+(10-(~~(block.ammount*(Dt[block.y][block.x+1].block==Rock?1:.8)*10))));
	//	ctx.lineTo(x+5, y+10+(10-(~~(block.ammount*(Dt[block.y][block.x+1].block==Rock?1:.8)*10))));
	//}else{
		ctx.lineTo(x+10, y+10);
		ctx.lineTo(x, y+10);
	//}
	
	if(Dt[block.y][block.x-1].block==Water){
		ctx.lineTo(x-5, y-(~~(Dt[block.y][block.x-1].ammount*10))+10);
	}
	else{
		ctx.lineTo(x, y-(~~(block.ammount*(Dt[block.y][block.x-1].block==Rock?1:.8)*10))+10);
	}
	ctx.fill();
	//ctx.fillRect(x+10, y+10, -10, -(~~(block.ammount*10)));
}

function UpdateBlocks(){
	for(var y=49; y>-1; y--){
		for(var x=0; x<50; x++)
			UpdateBlock(Dt[y][x], x, y);
	}
}
function UpdateBlock(block, x, y){
	switch(block.block){
		case Water:{
			//Check for Free Fall
			if(Dt[y+1][x].block==Rock){
				//Check for Free Move
				if(Dt[y][x-1].block==Air&&Dt[y][x+1].block==Air){
					var esp = Dt[y][x].ammount/3;
					Dt[y][x].ammount = esp;
					Dt[y][x+1].block = Water;
					Dt[y][x+1].ammount = esp;
					Dt[y][x-1].block = Water;
					Dt[y][x-1].ammount = esp;
				}else if(Dt[y][x-1].block==Air){
					var gave = Dt[y][x].ammount*.6;
					Dt[y][x].ammount -= gave;
					Dt[y][x-1].block = Water;
					Dt[y][x-1].ammount = gave;
				}else if(Dt[y][x+1].block==Air){
					var gave = Dt[y][x].ammount*.6;
					Dt[y][x].ammount -= gave;
					Dt[y][x+1].block = Water;
					Dt[y][x+1].ammount = gave;
				}else{
					if(Dt[y][x-1].block==Water&&Dt[y][x+1].block==Water){
						if(Dt[y][x-1].ammount<Dt[y][x].ammount&&Dt[y][x+1].ammount<Dt[y][x].ammount){
							if(Dt[y][x-1].ammount<Dt[y][x+1].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x-1].ammount += gave;
							}else if(Dt[y][x-1].ammount>Dt[y][x+1].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x+1].ammount += gave;
							}
						}else if(Dt[y][x-1].ammount<Dt[y][x].ammount){
							var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
							Dt[y][x].ammount -= gave;
							Dt[y][x-1].ammount += gave;
						}else if(Dt[y][x+1].ammount<Dt[y][x].ammount){
							var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
							Dt[y][x].ammount -= gave;
							Dt[y][x+1].ammount += gave;
						}
					}
					else if(Dt[y][x-1].block==Water){
						if(Dt[y][x-1].ammount<Dt[y][x].ammount){
							var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
							Dt[y][x].ammount -= gave;
							Dt[y][x-1].ammount += gave;
						}
					}else if(Dt[y][x+1].block==Water){
						if(Dt[y][x+1].ammount<Dt[y][x].ammount){
							var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
							Dt[y][x].ammount -= gave;
							Dt[y][x+1].ammount += gave;
						}
					}
				}
			}else if(Dt[y+1][x].block==Air){
				Dt[y][x].block = Air;
				Dt[y+1][x].block = Water;
				Dt[y+1][x].ammount = Dt[y][x].ammount;
			}else if(Dt[y+1][x].block==Water){
				Dt[y+1][x].ammount += Dt[y][x].ammount;
				var rest = Dt[y+1][x].ammount-1;
				Dt[y+1][x].ammount = rest>=0?1:Dt[y+1][x].ammount;
				if(rest>0){
					Dt[y][x].ammount = rest;
					//Check for Free Move
					if(Dt[y][x-1].block==Air&&Dt[y][x+1].block==Air){
						var esp = Dt[y][x].ammount/3;
						Dt[y][x].ammount = esp;
						Dt[y][x+1].block = Water;
						Dt[y][x+1].ammount = esp;
						Dt[y][x-1].block = Water;
						Dt[y][x-1].ammount = esp;
					}else if(Dt[y][x-1].block==Air){
						var gave = Dt[y][x].ammount*.6;
						Dt[y][x].ammount -= gave;
						Dt[y][x-1].block = Water;
						Dt[y][x-1].ammount = gave;
					}else if(Dt[y][x+1].block==Air){
						var gave = Dt[y][x].ammount*.6;
						Dt[y][x].ammount -= gave;
						Dt[y][x+1].block = Water;
						Dt[y][x+1].ammount = gave;
					}else{
						if(Dt[y][x-1].block==Water&&Dt[y][x+1].block==Water){
							if(Dt[y][x-1].ammount<Dt[y][x].ammount&&Dt[y][x+1].ammount<Dt[y][x].ammount){
								if(Dt[y][x-1].ammount<Dt[y][x+1].ammount){
									var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
									Dt[y][x].ammount -= gave;
									Dt[y][x-1].ammount += gave;
								}else if(Dt[y][x-1].ammount>Dt[y][x+1].ammount){
									var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
									Dt[y][x].ammount -= gave;
									Dt[y][x+1].ammount += gave;
								}
							}else if(Dt[y][x-1].ammount<Dt[y][x].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x-1].ammount += gave;
							}else if(Dt[y][x+1].ammount<Dt[y][x].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x+1].ammount += gave;
							}
						}
						else if(Dt[y][x-1].block==Water){
							if(Dt[y][x-1].ammount<Dt[y][x].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x-1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x-1].ammount += gave;
							}
						}else if(Dt[y][x+1].block==Water){
							if(Dt[y][x+1].ammount<Dt[y][x].ammount){
								var gave = (Dt[y][x].ammount-Dt[y][x+1].ammount)*.6;
								Dt[y][x].ammount -= gave;
								Dt[y][x+1].ammount += gave;
							}
						}
					}
				}else{
					Dt[y][x].ammount = 0;
					Dt[y][x].block = Air;
				}
			}
		}
		break;
	}
	return;
}

var mousedown = false;

tela.onmousedown = function(m){
	mousedown = true;
	Dt[~~(m.offsetY/10)][~~(m.offsetX/10)].block = Water;
	Dt[~~(m.offsetY/10)][~~(m.offsetX/10)].ammount = 1;
}
window.onmousemove = function(m){
	if(mousedown){
		Dt[~~(m.offsetY/10)][~~(m.offsetX/10)].block = Water;
		Dt[~~(m.offsetY/10)][~~(m.offsetX/10)].ammount = 1;
	}
}
window.onmouseup = function(){
	mousedown = false;
}

function Update(){
	UpdateBlocks();
	Redraw();
	setTimeout(Update, 70);
}

window.onload = function(){
	Update();
}
