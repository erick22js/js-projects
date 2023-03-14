
/*Armazenamento de bloco em célula no mapa:
[
#0 id(nome do bloco), 
#1 estado(danos acomulados), 
#2 properties(geral),
#3 dados internos de bloco
]
*/
/*Armazenamento de item em slot
#0 id(nome do item),
#1 estado(dano por utilização),
#2 ammount(quantidade estocada),
#3 dados gerais do item
*/

function drawTile(xtile, ytile, xdraw, ydraw, lv){
	try{var blockW = WORLDMAP[lv][ytile][xtile];}catch(e){alert(ytile)}
	var block = BLOCKS[blockW[0]];
	ydraw = ydraw-(32*lv)-((blockW[2].ammount?blockW[2].ammount:1)*32)+64;
	if(block.texture!=0)
		gctx.drawImage(Tileset[block.texture], xdraw, ydraw, 32, 64);
	if(block.animation){
		blockW[2].actFrame+= getTiming()*block.animation.animationSpeed;
		blockW[2].actFrame = !(blockW[2].actFrame)||blockW[2].actFrame>=block.animation.animationLength?0:blockW[2].actFrame;
		gctx.drawImage(Tileanimated[block.animation.index][~~blockW[2].actFrame], xdraw, ydraw, 32, 64);
	}
	
	if(block.type=="plant")
		gctx.drawImage(Tileset[block.stages[blockW[3].stage][0]], xdraw, ydraw, 32, 64);
	if(block.raster)
		block.raster(blockW, xdraw, ydraw, lv);
}

function drawTexture(img, x, y, w, h){
	gctx.drawImage(img, x, y, w, h);
}

function drawItem(item, x, y, w, h){
	if(ITEMS[item[0]].texture!=0)
		gctx.drawImage(Itemset[ITEMS[item[0]].texture], x, y, w, h);
	if(ITEMS[item[0]].raster)
		ITEMS[item[0]].raster(item, x, y, w, h);
}