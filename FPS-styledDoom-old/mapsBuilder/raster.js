
function distance(x1, y1, x2, y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
function angle(x1, y1, x2, y2){
	return Math.atan2(y2-y1, x2-x1);
}

function isBetweenValue(value, min, max){
	return value>=min&&value<=max;
}

function lineInsideAngle(d1, d2, mina, maxa, a1, a2){
	//a1 = toAngle(a1); a2 = toAngle(a2);
	var inter1 = intersection(0, 0, Math.cos(mina)*2048,  Math.sin(mina)*2048,
		Math.cos(a1)*d1, Math.sin(a1)*d1, Math.cos(a2)*d2, Math.sin(a2)*d2);
	var inter2 = intersection(0, 0, Math.cos(maxa)*2048,  Math.sin(maxa)*2048,
		Math.cos(a1)*d1, Math.sin(a1)*d1, Math.cos(a2)*d2, Math.sin(a2)*d2);
	return isBetweenValue(a1, mina, maxa)||isBetweenValue(a2, mina, maxa)||(inter1||inter2);
}

function toAngle(angle){
	return angle>Math.PI?angle-Math.PI*2:angle<-Math.PI?angle+Math.PI*2:angle;
}

function range(s, e){
	var list = [s];
	var add = (e-s)/Math.abs(e-s);
	for(var i=~~s;i!=~~e+add;i+=add)list.push(i)
	return list;
}

function intersection(x1, y1, x2, y2, x3, y3, x4, y4, db){
	db = db?db:1;
	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	if (uA>=0&&uA<=db&&uB>=0&&uB<=db) {
		return [x1+(uA*(x2-x1)),y1+(uA*(y2-y1))];
	}
	return null;
}
