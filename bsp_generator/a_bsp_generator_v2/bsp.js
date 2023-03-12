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
	this.lines = [];
	var self = this;
}
function isEqualVertexes(v1, v2){
	var size = 1000;
	return (~~(v1.x*size))==(~~(v2.x*size))&&(~~(v1.y*size))==(~~(v2.y*size));
}

function Line(v1=new Vertex(), v2=new Vertex()){
	this.v1 = v1;
	this.v2 = v2;
	v1.lines.push(this);
	v2.lines.push(this);
	var self = this;
	this.length = function(){
		return Math.distance(self.v1, self.v2);
	}
	this.direction = function(){
		return Math.angle(self.v1, self.v2);
	}
}
function isEqualLines(l1, l2){
	return (isEqualVertexes(l1.v1, l2.v1)&&isEqualVertexes(l1.v2, l2.v2))||(isEqualVertexes(l1.v1, l2.v2)&&isEqualVertexes(l1.v2, l2.v1));
}

function SubLine(line){
	this.v1 = line.v1;
	this.v2 = line.v2;
	if(line instanceof Line)
		this.line = line;
	else if(line instanceof SubLine)
		this.line = line.line;
	var self = this;
	this.length = function(){
		return Math.distance(self.v1, self.v2);
	}
	this.direction = function(){
		return Math.angle(self.v1, self.v2);
	}
}
var pal = ["red", "orange", "yellow", "lime", "green", "cyan", "blue", "purple", "pink"];
var pali = 0;
var nodesL = [];
function splitTree(lines, splitter, rastrer){
	if((rastrer.length/3)>50)
		throw new Error("Reached max stack of 50\nTrace: "+rastrer);
	/* 
	 * First Test for best line to split
	*/
	var best_minSides = 0;
	var best_lineSplitter = null;
	var vertices = [];
	for(var li=0; li<lines.length; li++){
		if(!vertices.includes(lines[li].v1))
			vertices.push(lines[li].v1);
		if(!vertices.includes(lines[li].v2))
			vertices.push(lines[li].v2);
	}
	//console.log(vertices);
	for(var si=0; si<lines.length; si++){
		var lineSplit = lines[si];
		var left = 0;
		var right = 0;
		var v1 = lineSplit.v1;
		var v2 = lineSplit.v2;
		if(lineSplit.used==true)
			continue;
		var angSplit = Math.angle(v1, v2);
		for(var vi=0; vi<vertices.length; vi++){
			var vert = vertices[vi];
			//Check if line contain the actual vertex
			if(vert!=v1&&vert!=v2){
				var ang = Math.normalizeAngle(Math.angle(v1, vert)-angSplit);
				/*if(ang==0||ang==Math.PI||ang==-Math.PI){
					right++;
					left++;
					continue;
				}*/
				if(ang>0&&ang!=Math.PI&&ang!=-Math.PI)
					right++;
				else if(ang<0&&ang!=Math.PI&&ang!=-Math.PI)
					left++;
			}
		}
		//Check for the less side
		var min = Math.min(left, right);
		//console.log(lineSplit);
		//console.log(min);
		//Do here a filter for the best line splitter
		if(min>best_minSides){
			best_minSides = min;
			best_lineSplitter = lineSplit;
		}
	}
	
	//Now, check if was picked some line for spliting
	if(best_minSides==0||best_lineSplitter==null){
		nodesL.push({
			"lines": lines,
			"splitter": splitter,
			"address": rastrer,
		});
		pali++;
		pali = pali%pal.length;
		return null;
	}
	
	//Then, with splitter in hands, check for each line 
	var right_lines = [];
	var left_lines = [];
	var intersections = [];
	var splitters = [];
	//var debug
	var lineSplit = best_lineSplitter;
	var v1 = lineSplit.v1;
	var v2 = lineSplit.v2;
	var angS = Math.angle(v1, v2);
	intersections.push(v1, v2);
	for(var li=0; li<lines.length; li++){
		var line = lines[li];
		var ang1 = Math.normalizeAngle(Math.angle(v1, line.v1)-angS);
		var ang2 = Math.normalizeAngle(Math.angle(v1, line.v2)-angS);
		if(line!=lineSplit){
			{
				var inter = Math.intersectionLine(lineSplit, line);
				var vInt = new Vertex(inter[0], inter[1]);
				
				if(ang1==0||ang1==Math.PI||ang1==-Math.PI||isEqualVertexes(vInt, line.v1)){
					if(!intersections.includes(line.v1))
						intersections.push(line.v1);
					if(ang2>0&&ang2!=0&&ang2!=Math.PI&&ang2!=-Math.PI){
						//renderLine(line, "blue");
						right_lines.push(line);
					}
					else if(ang2<0&&ang2!=0&&ang2!=Math.PI&&ang2!=-Math.PI){
						//renderLine(line, "red");
						left_lines.push(line);
					}
					else{
						//renderLine(line, "green");
						if(!intersections.includes(line.v2))
							intersections.push(line.v2);
						splitters.push(new SubLine(line));
					}
				}else if(ang2==0||ang2==Math.PI||ang2==-Math.PI||isEqualVertexes(vInt, line.v2)){
					if(!intersections.includes(line.v2))
						intersections.push(line.v2);
					if(ang1>0&&ang1!=0&&ang1!=Math.PI&&ang1!=-Math.PI){
						//renderLine(line, "blue");
						right_lines.push(line);
					}
					else if(ang1<0&&ang1!=0&&ang1!=Math.PI&&ang1!=-Math.PI){
						//renderLine(line, "red");
						left_lines.push(line);
					}
					else{
						//renderLine(line, "green");
						if(!intersections.includes(line.v1))
							intersections.push(line.v1);
						splitters.push(new SubLine(line));
					}
				}else{
					if(ang1>0&&ang2>0){
						//renderLine(line, "blue");
						right_lines.push(line);
					}
					else if(ang1<0&&ang2<0){
						//renderLine(line, "red");
						left_lines.push(line);
					}
					else if(ang1>0&&ang2<0){
						//renderLine(new Line(line.v1, vInt), "blue");
						//renderLine(new Line(line.v2, vInt), "red");
						var sub1 = new SubLine(new Line(line.v1, vInt));
						var sub2 = new SubLine(new Line(line.v2, vInt));
						sub1.used = sub2.used = lineSplit.used;
						right_lines.push(sub1);
						left_lines.push(sub2);
						if(!intersections.includes(vInt))
							intersections.push(vInt)
					}
					else if(ang1<0&&ang2>0){
						//renderLine(new Line(line.v1, vInt), "red");
						//renderLine(new Line(line.v2, vInt), "blue");
						var sub1 = new SubLine(new Line(line.v1, vInt));
						var sub2 = new SubLine(new Line(line.v2, vInt));
						sub1.used = sub2.used = lineSplit.used;
						left_lines.push(sub1);
						right_lines.push(sub2);
						if(!intersections.includes(vInt))
							intersections.push(vInt)
					}
				}
			}
		}else{
			continue;
		}
	}
	var subSplitter = new SubLine(lineSplit);
	//subSplitter.used = true;
	splitters.push(subSplitter);
	//Generate sub-lines
	subLsGen: for(var vi=0; vi<intersections.length-1; vi++){
		var ve1 = intersections[vi+0];
		var ve2 = intersections[vi+1];
		var sbLine = new SubLine(new Line(ve1, ve2));
		//sbLine.used = true;
		//console.log(ve1, ve2);
		for(var si=0; si<splitters.length; si++){
			var spl = splitters[si];
			if(isEqualLines(sbLine, spl)){
				sbLine = spl;
				continue subLsGen;
			}
		}
		splitters.push(sbLine);
	}
	for(var si=0; si<splitters.length; si++){
		var spl = splitters[si];
		spl.used = true;
		left_lines.push(spl);
		right_lines.push(spl);
	}
	
	//And, analyse each intersection getted, generate or re-use existents lines for create a huge map splitter
	intersections = intersections.sort(function(v1, v2){
		if(v1.x!=v2.x){
			return v1.x-v2.x;
		}else{
			return v1.y-v2.y;
		}
	});
	
	nodesL.push({
		"linesL": left_lines,
		"linesR": right_lines,
		"splitter": lineSplit,
		"inters": intersections,
		"subSplitters": splitters,
		"address": rastrer,
	});
	splitTree(left_lines, subSplitter, rastrer+"_0l");
	splitTree(right_lines, subSplitter, rastrer+"_1r");
}

/*
 *	Math functions
 */

Math.intersectionLine = function(l1, l2){
	var a1 = (l1.v2.y-l1.v1.y)/(l1.v2.x-l1.v1.x);
	var a2 = (l2.v2.y-l2.v1.y)/(l2.v2.x-l2.v1.x);
	if(l2.v1.x==l2.v2.x){
		var x = l2.v1.x;
		var xadd = x-l1.v1.x;
		var y = l1.v1.y+(xadd*a1);
		var i1 = (x>=l1.v1.x&&x<=l1.v2.x)||(x>=l1.v2.x&&x<=l1.v1.x);
		return [x, y, i1, i1, true, xadd];
	}else if(l1.v1.x==l1.v2.x){
		var x = l1.v1.x;
		var xadd = x-l2.v1.x;
		var y = l2.v1.y+(xadd*a2);
		var i2 = (x>=l2.v1.x&&x<=l2.v2.x)||(x>=l2.v2.x&&x<=l2.v1.x);
		return [x, y, i2, true, i2, xadd];
	}
	var y2 = l2.v1.y-(l2.v1.x-l1.v1.x)*a2;
	var xadd = (l1.v1.y-y2)/(-a1+a2);
	var x = l1.v1.x+xadd;
	var y = l1.v1.y+(xadd*a1);
	var i1 = (x>=l1.v1.x&&x<=l1.v2.x)||(x>=l1.v2.x&&x<=l1.v1.x);
	var i2 = (x>=l2.v1.x&&x<=l2.v2.x)||(x>=l2.v2.x&&x<=l2.v1.x);
	return [x, y, i1&&i2, i1, i2];
}