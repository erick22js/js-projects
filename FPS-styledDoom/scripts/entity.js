
var WorldMatrix = {
	x:0
	,yEye:0
	,yBody:0
	, z: 0
	,rotation:-Math.PI*.5
	,fov:Math.PI/6
	,projD:null
	, camReach: 8192
	, projSize: 0
	, sectorAct: null
};

WorldMatrix.projD = WIDTH * .5 / Math.tan(WorldMatrix.fov);
WorldMatrix.projSize = 2 * (Math.sin(WorldMatrix.fov) * WorldMatrix.projD);

function detectColision(entity, moviment){
	//var ntXR = 
	for(var i=0;i<lineWalls.length;i++){
		for(var w = 0; w < lineWalls[i].length; w++){
			var col = intersection(entity.x, entity.z, entity.x + moviment[0], entity.z + moviment[1], 
				lineWalls[i][w].v1[0], lineWalls[i][w].v1[1],
				lineWalls[i][w].v2[0], lineWalls[i][w].v2[1]);
			if (col && (!lineWalls[i][w].sidedef ||coordInSector(entity.x + moviment[0], entity.z + moviment[1]).floorY > entity.yBody + 24)) {
				var pass = [0, 0];
				var inter1 = intersection(entity.x, entity.z,
					entity.x + moviment[0], entity.z, lineWalls[i][w].v1[0],
					lineWalls[i][w].v1[1], lineWalls[i][w].v2[0], lineWalls[i][w].v2[1]);
				
				pass[0] = !inter1 ? moviment[0] : 0;//inter1[0]-entity.x;

				var inter2 = intersection(entity.x, entity.z,
					entity.x, entity.z + moviment[1], lineWalls[i][w].v1[0],
					lineWalls[i][w].v1[1], lineWalls[i][w].v2[0], lineWalls[i][w].v2[1])
				pass[1] = !inter2 ? moviment[1] : 0;//inter2[1] - entity.z;

				for (var i = 0; i < lineWalls.length; i++){
					for (var sw = 0; sw < lineWalls[i].length; sw++){
						var col = intersection(entity.x, entity.z, entity.x + pass[0], entity.z + pass[1], lineWalls[i][sw].v1[0], lineWalls[i][sw].v1[1], lineWalls[i][sw].v2[0], lineWalls[i][sw].v2[1]);
						if (col) return [0, 0];
					}
				}
				return pass;
			}
		}
	}
	return moviment;
}


function pointInPolygon(pol, px, py){
  var collision = false;var next = 0;
  for(var current=0; current<pol.length; current++) {
    next = current+1;
    if (next == pol.length) next = 0;
    var vc = pol[current];var vn = pol[next];
    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&(px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x))collision = !collision;
  }
  return collision;
}
function coordInSector(x, y) {
	for (var i=0; i < actMap.sector.length; i++)
		if (pointInPolygon(actMap.sector[i].region, x, y))
			return actMap.sector[i];
	return {floorY:0};
}

function onFieldOfView(a1, a2){
	return null;//Math.abs(a2-a1)<Math.PI;
}
function insideAngle(angle, amin, amax){
	return (angle>=amin&&angle<=amax)||(angle<=amin&&angle>=amax);
}


function movePlayer(){
	var move = [0, 0];
	var playerSpeed = 10;

	WorldMatrix.sectorAct = coordInSector(WorldMatrix.x, WorldMatrix.z);
	WorldMatrix.yBody = WorldMatrix.sectorAct.floorY;
	WorldMatrix.yEye = WorldMatrix.yBody+36;

	if (inputs.foward) { move[0] += Math.cos(WorldMatrix.rotation) * playerSpeed; move[1] += Math.sin(WorldMatrix.rotation) * playerSpeed;}
	if (inputs.backward) { move[0] -= Math.cos(WorldMatrix.rotation) * playerSpeed; move[1] -= Math.sin(WorldMatrix.rotation) * playerSpeed;}
	if(inputs.leftL)WorldMatrix.rotation -= .1;
	if(inputs.rightL)WorldMatrix.rotation += .1;
	var col = detectColision(WorldMatrix, move);
	WorldMatrix.x += col[0];
	WorldMatrix.z += col[1];
}






var inputs = {leftL:false, rightL:false, foward:false, backward:false}

window.onkeydown = function(k){
	switch(k.key){
		case "ArrowUp":inputs.foward=true;break;
		case "ArrowDown":inputs.backward=true;break;
		case "ArrowLeft":inputs.leftL=true;break;
		case "ArrowRight": inputs.rightL = true; break;
		case "+": WorldMatrix.yBody++; break;
		case "-": WorldMatrix.yBody--; break;
		case "[": loadMap(JSON.parse(localStorage.getItem("$ExPoRtEd$&MaP:"+prompt("Insira o nome do mapa:")))); break;
	}
}
window.onkeyup = function(k){
	switch(k.key){
		case "ArrowUp":inputs.foward=false;break;
		case "ArrowDown":inputs.backward=false;break;
		case "ArrowLeft":inputs.leftL=false;break;
		case "ArrowRight":inputs.rightL=false;break;
	}
}