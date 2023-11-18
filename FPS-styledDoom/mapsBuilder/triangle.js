
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var polygon = [];

canvas.onmousedown = function(ev){
	var x = ev.clientX;
	var y = ev.clientY;
	polygon.push({x: ~~(x/32)*32, y: ~~(y/32)*32});
	ctx.fillStyle = ctx.strokeStyle = "black";
	clear();
	drawlist(polygon);
}


function drawlist(polygon, f, fill){
	var last = null;
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	if(f){
		ctx.fillStyle = "red";
		//ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(polygon[0].x, polygon[0].y);
	}
	for(var i in polygon){
		var act = polygon[i];
		ctx.fillRect(act.x-4, act.y-4, 8, 8);
		if(last!=null){
			if(!f){
				ctx.beginPath();
				ctx.moveTo(last.x, last.y);
			}
			ctx.lineTo(act.x, act.y);
			if(!f)ctx.stroke();
		}
		last = act;
	}
	if(f){
		ctx.fill();
		ctx.stroke();
	}
	if(f==true){
		ctx.fillStyle = "blue";
		var center = get_triangle_centroid(polygon[0], polygon[1], polygon[2]);
		ctx.fillRect(center.x-5, center.y-5, 10, 10);
	}
}

function reconvex(){
	var lp = tri_gen_mesh(polygon);
	ctx.fillStyle = ctx.strokeStyle = "red";
	for(p in lp){
		drawlist(lp[p], true);
	}
}

function tri_gen_mesh(polygon){
function print(s){
	console.log(s);
}

function clear(){
	ctx.clearRect(0,0,1000,1000);
}


function copyPolygon(polygon){
	var np = [];
	for(var i in polygon){
		np.push({x:polygon[i].x, y:polygon[i].y});
	}
	console.log(np)
	return np;
}
function triangling(polygon){
	var triangles = [];
	var actual_triangle = [];
	var actual_index = 0;
	var v1 = -1;
	var v2 = 0;
	var v3 = 1;
	var flag = false;
	var dfPolygon = copyPolygon(polygon);
	main:while(polygon.length>2){
		//if(flag && actual_index==0) break;
		//actual_index = actual_index>=polygon.length?actual_index-polygon.length:actual_index;
		var bf = actual_index<=0?polygon.length+actual_index-1:actual_index-1;
		//print(polygon.length);
		var af = actual_index+1>=polygon.length? (actual_index+1)-polygon.length: actual_index+1;
		//print("indices: "+bf+" "+actual_index+" "+af);
		if(actual_index>=polygon.length){
			print(actual_index);
			break main;
		}
		var actual_triangle = [polygon[bf], polygon[actual_index], polygon[af]];
		//var an = angleBetweenTwoLines(actual_triangle[0], actual_triangle[1], actual_triangle[2], actual_triangle[1]);
		//print(an);
		var center = get_triangle_centroid(actual_triangle[0],actual_triangle[1],actual_triangle[2])
		
		
		if(!pointInPolygon(polygon, center)){
			actual_index++;
			//print("has point interceted!")
			continue;
		}
		for(var i=0; i<polygon.length; i++){
			if(i!=bf && i!=actual_index && i!=af){
				if(pointInPolygon(actual_triangle, polygon[i])){
					actual_index++;
					continue main;
				}
			}
		}
		
		
		//print(actual_triangle);
		triangles.push(actual_triangle);
		polygon.splice(actual_index, 1);
		actual_index = 0;
		//print(polygon);
		//flag = false;
	}
	//console.log(triangles);
	return triangles;
}

function getArrayIndex(arr, i){
	if(i>=arr.length){
		return arr[i-arr.length];
	}else if(i<0){
		return arr[arr.length+i];
	}
	else{
		return arr[i];
	}
}

function angleBetweenTwoLines(a1, a2, b1, b2){
	var ang1 = angle(a1, a2)+Math.PI;
	var ang2 = angle(b1, b2)+Math.PI;
	var difang = Math.abs(ang2-ang1);
	return difang;
}

















function get_triangle_centroid(p1, p2, p3){
	return {
		"x": (p1.x+p2.x+p3.x)/3,
		"y": (p1.y+p2.y+p3.y)/3
	}
}
function linesCrosses(a1, a2, list){
	for(var l=1; l<=list; l++){
		if(intersection(a1.x, a1.y, a2.x, a2.y, list[i-1].x, list[i-1].y, list[i].x, list[i].y))
			return true;
	}
	return false;
}
function angle(p1, p2){
	return Math.atan2(p2.y-p1.y, p2.x-p1.x);
}
function hasAngleAnomally(p1, p2, p3, p4){
	return isAngleClockWise(p1, p2, p3)!=isAngleClockWise(p2, p3, p4);
}
function isAngleClockWise(p1, p2, p3){
	return angle(p2, p3)>=angle(p1, p2);
}
function intersection(x1, y1, x2, y2, x3, y3, x4, y4, db){
	db = db?db:.1;
	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	if (uA>=0&&uA<=db&&uB>=0&&uB<=db) {
		return [x1+(uA*(x2-x1)),y1+(uA*(y2-y1))];
	}
	return null;
}
function pointInPolygon(vertices, p) {
	var collision = false;
	var next = 0;
	var px = p.x;
	var py = p.y;
	for (var current = 0; current < vertices.length; current++) {
		next = current + 1;
		if (next == vertices.length) next = 0;
		var vc = vertices[current];
		var vn = vertices[next];
		if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
			(px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x))
		{
			collision = !collision;
		}
	}
	return collision;
}

return triangling(copyPolygon(polygon));
}
console.log("loaded!");