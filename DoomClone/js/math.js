
function intersection(x1,y1, x2,y2,  x3,y3, x4,y4, db){
	db = db?db:1;
	var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	if (uA>=0&&uA<=db&&uB>=0&&uB<=db) {
		return [x1+(uA*(x2-x1)),y1+(uA*(y2-y1))];
	}
	return null;
}