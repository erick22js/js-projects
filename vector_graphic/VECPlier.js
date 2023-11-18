
var VECPlier = function(cv){
	var ctx = cv.getContext("2d");
	function setColor(fill=fill||"black", stroke=stroke||"black"){
		ctx.fillStyle = fill;
		ctx.strokeStyle = stroke;
	}
	this.drawLine = function(v2s=[0,0], v2e=[0,0], wid=1, style="black"){
		setColor(null,style);
	}
}

var Vec = function(){
	this.createVec2 = function(x=0, y=0){
		return [x, y];
	}
	this.createVec3 = function(x=0, y=0, z=0){
		return [x, y, z];
	}
}
