Math.DPI = Math.PI*2;
Math.angle = function(v1, v2){
	return Math.atan2(v2.y-v1.y, v2.x-v1.x);
}
Math.normalizeAngle = function(a){
	return a>Math.PI?a-Math.DPI:
		a<-Math.PI?a+Math.DPI:
		a;
}
Math.distance = function(v1, v2){
	return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y));
}

const Angle = new function(){
	this.solveAngle = function(angle){
		return angle>Math.PI?angle-2*Math.PI:angle<-Math.PI?angle+2*Math.PI:angle;
	}
	this.between = function(angle, start, end, clockwise=true){
		if(clockwise){
			angle = start>end&&angle>start?angle-Math.PI*2:angle;
			start = start>end?start-Math.PI*2:start;
			return angle>=start&&angle<=end;
		}else{
			angle = end>start&&angle>end?angle-Math.PI*2:angle;
			end = end>start?end-Math.PI*2:end;
			return angle<=start&&angle>=end;
		}
	}
}

function Vertex(x=0, y=0){
	this.x = x;
	this.y = y;
}
function isEqualVertexes(v1, v2){
	var size = 1000;
	return (~~(v1.x*size))==(~~(v2.x*size))&&(~~(v1.y*size))==(~~(v2.y*size));
}

function Line(v1=new Vertex(), v2=new Vertex()){
	this.v1 = v1;
	this.v2 = v2;
	var self = this;
	this.length = function(){
		return Math.distance(self.v1, self.v2);
	}
	this.direction = function(){
		return Math.angle(self.v1, self.v2);
	}
}

function SubLine(v1=new Vertex(), v2=new Vertex(), line){
	this.v1 = v1;
	this.v2 = v2;
	this.line = line;
	var self = this;
	this.length = function(){
		return Math.distance(self.v1, self.v2);
	}
	this.direction = function(){
		return Math.angle(self.v1, self.v2);
	}
}
var pal = [