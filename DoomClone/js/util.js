Math.DPI = Math.PI*2;
Math.HPI = Math.PI*.5;

Math.R2D = 180/Math.PI;
Math.D2R = Math.PI/180;

Math.angle = function(x1, y1, x2, y2){
	return Math.atan2(y2-y1, x2-x1);
}

Math.normalizeAngle = function(ang){
	return ang > Math.PI? ang-Math.DPI:
		ang <-Math.PI? ang+Math.DPI:
		ang;
}

Math.distance = function(x1, y1, x2, y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
