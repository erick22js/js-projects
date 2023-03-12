
function drawFragment(fragment){
	var d = WorldMatrix.fov/(WIDTH*.5);
	var sx = 0;
	/*
	for (var i = 0; i < fragment.length; i++) {
		var wall = fragment[i];

		var inter = wall[3];
		var a1 = wall[8]; var a2 = wall[9];
		var d1 = wall[6]; var d2 = wall[7];
		var xs = WorldMatrix.projD * Math.tan(wall[8]);
		var xe = WorldMatrix.projD * Math.tan(wall[9]);
		var hs = (WorldMatrix.projD / (d1 * Math.cos(a1))) * 32;
		var he = (WorldMatrix.projD / (d2 * Math.cos(a2))) * 32;
		//dbg.innerHTML = "s: " + wall[8] + "<br>e: " + wall[9];
		var xdif = xe - xs; var addx = xdif / Math.abs(xdif);
		dbg.innerHTML = "Ponto A: " + inter[0] + "<br>Ponto B: " + inter[1] +
			"<br>Ponto A: " + xs + "<br>Ponto B: " + xe;
		;

		//if (wall[8] > Math.PI * .5 || wall[8] < -Math.PI * .5 || wall[9] > Math.PI * .5 || wall[9] < -Math.PI * .5)

		gl.drawWall(128 + xs, 128 + xe, wall[8], wall[9], wall[10], wall[11], hs, he)
	}*/

	for (var c = -WorldMatrix.fov; c < WorldMatrix.fov; c += d){
		// id de setor, o mais baixo possivel para desenhar, o mais acima possivel para desenhar, o mais baixo possivel desenhar, id velho
		var screenBuffer = [/**/WorldMatrix.sectorAct.index/*coordInSector(WorldMatrix.x, WorldMatrix.z).index*//**/, HEIGHT, -1];
		var actLine = [WorldMatrix.x, WorldMatrix.z, 
				WorldMatrix.x+Math.cos(WorldMatrix.rotation+c)*WorldMatrix.camReach
				,WorldMatrix.z+Math.sin(WorldMatrix.rotation+c)*WorldMatrix.camReach
				];
		var dist = Infinity;
		var inter = null;
		var ind = null;
		for (var i = 0; i < fragment.length; i++){
			var wall = fragment[i];
			var inte = intersection(actLine[0],actLine[1],actLine[2],actLine[3],
				fragment[i].v1[0], fragment[i].v1[1], fragment[i].v2[0], fragment[i].v2[1]);
			if (inte) {
				//in projection, replace "dist" by "(dist * Math.cos(c))" for remove "fish eye"
				var dis = distance(WorldMatrix.x, WorldMatrix.z, inte[0], inte[1]);
				dist = dis;
				inter = inte;
				ind = i;
				var widT = gl.TextureSize[0];
				var Ux = distance(inter[0], inter[1], fragment[ind].v1[0], fragment[ind].v1[1])*2 / widT;
				var wallY = actMap.sector[wall.sector[0]].floorY;
				var ceilY = actMap.sector[wall.sector[0]].ceilY;
				var wallH = ceilY - wallY;

				var bottom = (WorldMatrix.projD / (dist * Math.cos(c))) * (WorldMatrix.yEye - wallY) + 80;
				var hei = (WorldMatrix.projD / (dist * Math.cos(c))) * wallH;
				var upper = bottom - hei;

				var dbg = screenBuffer[0];
				

				if (!wall.sidedef) {//Não é um sidedef

					if (wall.textureM == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, upper, bottom);
					} else {
						//console.log(wall);
						gl.bindTexture(textureDataWall[wall.textureM]);
						gl.drawStrip(sx, upper, Ux, hei, -dist, wallH, screenBuffer[0]);
					}
					//Draw floor and ceil
					gl.bindTexture(texturesSTored[1]);
					if (actMap.sector[screenBuffer[0]].textureD == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, bottom, screenBuffer[1]);
					} else {
						gl.bindTexture(textureDataCeil[actMap.sector[screenBuffer[0]].textureD]);
						gl.drawFloorStrip(sx, bottom, -dist, screenBuffer[0], WorldMatrix.yEye - wallY, c, screenBuffer[1]);
					}//ceil
					if (actMap.sector[screenBuffer[0]].textureU == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, screenBuffer[2], upper);
					} else {
						gl.bindTexture(textureDataCeil[actMap.sector[screenBuffer[0]].textureU]);
						gl.drawCeilStrip(sx, upper, -dist, screenBuffer[0],
							ceilY - WorldMatrix.yEye
							, c, screenBuffer[2]);
					}
					
					screenBuffer[1] = upper;
					screenBuffer[2] = bottom;
					screenBuffer[0] = wall.sector[0];
				}
				else { //É um sidedef
					var wallY2 = actMap.sector[wall.sector[1]].floorY;
					var ceilY2 = actMap.sector[wall.sector[1]].ceilY;
					var middleSize = Math.abs(wallY2 - wallY);
					var topSize = Math.abs(ceilY2 - ceilY);

					var middle = (WorldMatrix.projD / (dist * Math.cos(c))) * middleSize;
					var top = (WorldMatrix.projD / (dist * Math.cos(c))) * topSize;
					//Quando renderizar o chão abaixo da "parede invisivel"(sidedef)
					//Deve-se renderizar o chão do setor onde o jogador se encontra
					//***Ainda em Análise***
					//Depois, subsequentemente, renderizar os chãos de outros setores
					//que possuem sidedef com as opções restantes
					var nxtSector = screenBuffer[0] == wall.sector[0] ? wall.sector[1] : wall.sector[0];
					var lv1 = actMap.sector[screenBuffer[0]].floorY;
					var lv2 = actMap.sector[nxtSector].floorY;
					var up1 = actMap.sector[screenBuffer[0]].ceilY;
					var up2 = actMap.sector[nxtSector].ceilY;
					//Desenhar partes de parede
					//superior
					if (wall.textureD == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, upper, bottom);
					} else {
						gl.bindTexture(textureDataWall[wall.textureD]);
						gl.drawStrip(sx,
							bottom - middle * (lv1 < lv2 ? (wall.sector[0] == screenBuffer[0] ? 1 : 0) : 0)
							, Ux, middle, -dist, middleSize, screenBuffer[0]);
					}
					//inferior
					if (wall.textureU == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, upper, bottom);
					} else if (up1 > up2) {
						gl.bindTexture(textureDataWall[wall.textureU]);
						gl.drawStrip(sx,
							upper + top * (up1 < up2 ? (wall.sector[0] == screenBuffer[0] ? -1 : 0) : (wall.sector[0] == screenBuffer[0] ? 0 : -1))
							, Ux, top, -dist, topSize, screenBuffer[0]);
					}


					//Desenhar chão e teto
					gl.bindTexture(texturesSTored[1]);
					if (actMap.sector[screenBuffer[0]].textureD == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, bottom, screenBuffer[1]);
					} else {
						gl.bindTexture(textureDataCeil[actMap.sector[screenBuffer[0]].textureD]);
						gl.drawFloorStrip(sx,
							bottom - middle * (lv1 < lv2 ? (wall.sector[0] == screenBuffer[0] ? 0 : -1) : (wall.sector[0] == screenBuffer[0] ? 0 : 1))
							, -dist, screenBuffer[0],
							WorldMatrix.yEye - lv1
							, c, screenBuffer[1]);
					}//teto
					if (actMap.sector[screenBuffer[0]].textureU == -1) {
						gl.bindTexture(texturesSky[0]);
						gl.drawBackStrip(sx, screenBuffer[2], upper);
					} else {
						gl.bindTexture(textureDataCeil[actMap.sector[screenBuffer[0]].textureU]);
						gl.drawCeilStrip(sx,
							upper + top * (up1 < up2 ? (wall.sector[0] == screenBuffer[0] ? 0 : 1) : (wall.sector[0] == screenBuffer[0] ? 0 : -1))
							, -dist, screenBuffer[0],
							up1 - WorldMatrix.yEye
							, c, screenBuffer[2]);
					}

					screenBuffer[1] = bottom;
					screenBuffer[2] = upper;
					screenBuffer[0] = nxtSector;
				}
			}

		}
		sx++;
	}
}

function renderVisiblesSector(){
	var inFieldSectors = [];
	WorldMatrix.sectorAct = coordInSector(WorldMatrix.x, WorldMatrix.z);
	for(var se=0;se<actMap.sector.length;se++){
		if(sectorIsInView(se))inFieldSectors.push(se);
	}
	var inFieldWalls = [];
	for(var a=0;a<inFieldSectors.length;a++){
		for (var w = 0; w < lineWalls[inFieldSectors[a]].length; w++){
			var wall = lineWalls[inFieldSectors[a]][w];
			var d1 = distance(WorldMatrix.x, WorldMatrix.z, wall.v1[0], wall.v1[1]);
			var a1 = angle(WorldMatrix.x, WorldMatrix.z, wall.v1[0], wall.v1[1])-WorldMatrix.rotation;
			var d2 = distance(WorldMatrix.x, WorldMatrix.z, wall.v2[0], wall.v2[1]);
			var a2 = angle(WorldMatrix.x, WorldMatrix.z, wall.v2[0], wall.v2[1])-WorldMatrix.rotation;
			ctxp.strokeStyle = "red";
			//sectorIsInView(lineWalls[i][2]) ?"red":"black";
			var inters = lineInsideAngle(d1, d2, -WorldMatrix.fov, WorldMatrix.fov, toAngle(a1), toAngle(a2));
			if (inters) {
				ctxp.strokeStyle = lineWalls[inFieldSectors[a]][w].sidedef ? "darkred" : "red";
				ctxp.beginPath();
				ctxp.moveTo(Math.cos(a1)*d1
					,Math.sin(a1)*d1
				);ctxp.lineTo(
					Math.cos(a2)*d2
					,Math.sin(a2)*d2
				); ctxp.stroke();
				if (!(inters[0] || inters[1])) inters = [null, null];
				else {
					if (inters[0]) {
						d1 = distance(0, 0, inters[0][0], inters[0][1]);
						a1 = angle(0, 0, inters[0][0], inters[0][1]);
					} if (inters[1]) {
						d2 = distance(0, 0, inters[1][0], inters[1][1]);
						a2 = angle(0, 0, inters[1][0], inters[1][1]);
					}
				}
				var sen1 = Math.sin(a1) * d1; var sen2 = Math.sin(a2) * d1;
				var cos1 = Math.cos(a1) * d1; var cos2 = Math.cos(a2) * d2;
				wall.inters = inters;
				wall.cos = (cos1 + cos2) * .5;//cos1 <= cos2 ? cos1 : cos2;
				wall.d1 = d1; wall.d2 = d2; wall.a1 = toAngle(a1); wall.a2 = toAngle(a2); wall.cos1 = cos1; wall.cos2 = cos2;
				inFieldWalls.push(wall);
			}	
		}
	}
	var orderedWalls = [];
	if(inFieldWalls.length>0){
		orderedWalls = [inFieldWalls[0]];
		inFieldWalls.splice(0,1);
	}
	while(inFieldWalls.length>0){
		//alert(inFieldWalls.length);
		for(var w=0;w<orderedWalls.length;w++){
			if(orderedWalls[w].cos>=inFieldWalls[0].cos){
				orderedWalls.splice(w,0,inFieldWalls[0]);
				break;
			}
			if(w==orderedWalls.length-1){
				orderedWalls.push(inFieldWalls[0]);
				break;
			}
		}
		inFieldWalls.splice(0,1);
	}
	/*for (var i = 0; i < orderedWalls.length - 1; i++) {
		if (orderedWalls[i].sidedef)
			orderedWalls.splice(i + 1, 1);
	}*/
	drawFragment(orderedWalls);
}

function sectorIsInView(s){
	var vertex = [actMap.sector[s].minX, actMap.sector[s].minY,  actMap.sector[s].maxX, actMap.sector[s].maxY];
	//x1, y1, x2, y2
	//var vertex = [0, 0, 256, 256];
	var d1 = distance(WorldMatrix.x, WorldMatrix.z, vertex[0], vertex[1]);
	var a1 = toAngle(angle(WorldMatrix.x, WorldMatrix.z, vertex[0], vertex[1])-WorldMatrix.rotation);
	var d2 = distance(WorldMatrix.x, WorldMatrix.z, vertex[0], vertex[3]);
	var a2 = toAngle(angle(WorldMatrix.x, WorldMatrix.z, vertex[0], vertex[3])-WorldMatrix.rotation);
	var d3 = distance(WorldMatrix.x, WorldMatrix.z, vertex[2], vertex[1]);
	var a3 = toAngle(angle(WorldMatrix.x, WorldMatrix.z, vertex[2], vertex[1])-WorldMatrix.rotation);
	var d4 = distance(WorldMatrix.x, WorldMatrix.z, vertex[2], vertex[3]);
	var a4 = toAngle(angle(WorldMatrix.x, WorldMatrix.z, vertex[2], vertex[3])-WorldMatrix.rotation);
	/*if(s==1) dbg.innerHTML = 
	d1+"<br>"+a1+"<br>"+d2+"<br>"+a2+"<br>"+d3+"<br>"+a3+"<br>"+d4+"<br>"+a4+"<br>";*/
	var inter1 = lineInsideAngle(d1, d2, -WorldMatrix.fov, WorldMatrix.fov, a1, a2);
	var inter2 = lineInsideAngle(d1, d3, -WorldMatrix.fov, WorldMatrix.fov, a1, a3);
	var inter3 = lineInsideAngle(d2, d4, -WorldMatrix.fov, WorldMatrix.fov, a2, a4);
	var inter4 = lineInsideAngle(d3, d4, -WorldMatrix.fov, WorldMatrix.fov, a3, a4);
	return inter1||inter2||inter3||inter4;
}
