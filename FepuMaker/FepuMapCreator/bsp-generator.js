
/*	@Math
*/
Math.roundC = 16;
Math.roundA = 512;
Math.RPI = Math.round(Math.PI*Math.roundA)/Math.roundA;
Math.DPI = Math.RPI*2;
Math.distance = function(v1, v2){
	return Math.sqrt(((v2.x-v1.x)*(v2.x-v1.x))+((v2.y-v1.y)*(v2.y-v1.y)));
}
Math.distanceDiag = function(v1, v2){
	return (x2-x1)+(y2-y1);
}
Math.angle = function(v1, v2){
	return Math.atan2((v2.y-v1.y),(v2.x-v1.x));
}
Math.normalizeAngle = function(a){
	return a>Math.RPI?a-Math.DPI:
		a<-Math.RPI?a+Math.DPI:
		a;
}
Math.intersection = function(l1, l2){
	var a1 = (l1.v2.y-l1.v1.y)/(l1.v2.x-l1.v1.x);
	var a2 = (l2.v2.y-l2.v1.y)/(l2.v2.x-l2.v1.x);
	var py = l2.v1.y+(l2.v1.x-l1.v1.x)*a2;
	var addx = (l1.v1.y-py)/(a2-a1);
	return [l1.v1.x+addx, l1.v1.y+addx*a1];
};
Math.intersectionLine = function(l1, l2){
	var a1 = (l1.v2.y-l1.v1.y)/(l1.v2.x-l1.v1.x);
	var a2 = (l2.v2.y-l2.v1.y)/(l2.v2.x-l2.v1.x);
	if(l2.v1.x==l2.v2.x){
		var x = l2.v1.x;
		var xadd = x-l1.v1.x;
		var y = l1.v1.y+(xadd*a1);
		//x = (~~(x*Math.roundC))/Math.roundC;
		//y = (~~(y*Math.roundC))/Math.roundC;
		var i1 = (x>=l1.v1.x&&x<=l1.v2.x)||(x>=l1.v2.x&&x<=l1.v1.x);
		return [x, y, i1, i1, true, xadd];
	}else if(l1.v1.x==l1.v2.x){
		var x = l1.v1.x;
		var xadd = x-l2.v1.x;
		var y = l2.v1.y+(xadd*a2);
		//x = (~~(x*Math.roundC))/Math.roundC;
		//y = (~~(y*Math.roundC))/Math.roundC;
		var i2 = (x>=l2.v1.x&&x<=l2.v2.x)||(x>=l2.v2.x&&x<=l2.v1.x);
		return [x, y, i2, true, i2, xadd];
	}
	var y2 = l2.v1.y-(l2.v1.x-l1.v1.x)*a2;
	var xadd = (l1.v1.y-y2)/(-a1+a2);
	var x = l1.v1.x+xadd;
	var y = l1.v1.y+(xadd*a1);
	//x = (~~(x*Math.roundC))/Math.roundC;
	//y = (~~(y*Math.roundC))/Math.roundC;
	var i1 = (x>=l1.v1.x&&x<=l1.v2.x)||(x>=l1.v2.x&&x<=l1.v1.x);
	var i2 = (x>=l2.v1.x&&x<=l2.v2.x)||(x>=l2.v2.x&&x<=l2.v1.x);
	return [x, y, i1&&i2, i1, i2];
}

/*	@BSP Builder
*/
function Vertex(x=0, y=0){
	this.class = "vertices";
	this.x = x;
	this.y = y;
	this.rlines = [];
	this.lines = null;
	this.rsectors = [];
	var self = this;
}

function Line(v1=new Vertex(), v2=new Vertex()){
	this.class = "lines";
	this.v1 = v1;
	this.v2 = v2;
	v1.rlines.push(this);
	v2.rlines.push(this);
	var self = this;
	this.length = function(){
		return Math.distance(self.v1, self.v2);
	}
	this.direction = function(){
		return Math.angle(self.v1, self.v2);
	}
}

function SubLine(line){
	this.class = "sublines";
	this.v1 = line.v1;
	this.v2 = line.v2;
	this.used = false;
	line.x = (~~(line.x*Math.roundC))/Math.roundC;
	line.y = (~~(line.y*Math.roundC))/Math.roundC;
	if(line.class=="lines")
		this.line = line;
	else if(line.class=="sublines")
		this.line = line.line;
	var self = this;
}
function validadeSubSector(lines, ssector){
	//Extract each vertex
	var vs = []
	for(var li=0; li<lines.length; li++){
		vs.push(lines[li].v1, lines[li].v2);
	}
	/*console.log(vs);
	var media = medianSector(vs);
	console.log(media);
	ssector.sector = pickSector(media);
	return lines.length>=3 && (ssector.sector!=null);*/
	ssector.center = medianSector(vs);
	ssector.sector =  pickSector([ssector.center.x,ssector.center.y])
	return lines.length>=3&&ssector.sector!=null;
}
function validadeSubLine(line){
	return true;
}

var nodesL = [];

function splitTree(lines, splitter, rastrer){
	try{
	if((rastrer.length/3)>10){
		return null;
		throw new Error("Reached max stack of 50\nTrace: "+rastrer);
	}
	/*
	 * Readjust and remove extra lines
	*/
	var relines = [];
	for(var ci=0; ci<lines.length; ci++){
		var actLine = lines[ci];
		var push = true;
		for(var ai=ci+1; ai<lines.length; ai++){
			var anaLine = lines[ai];
			if(isEqualLines(actLine, anaLine))
				push = false;
		}
		if(isEqualVertexes(actLine.v1, actLine.v2))
			push = false;
		if(push)
			relines.push(actLine);
	}
	lines = relines;
	
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
				ang = Math.round(ang*Math.roundA)/(Math.roundA);
				ang = Math.abs(ang)==Math.RPI?0:ang;
				if(ang>0)
					right++;
				else if(ang<0)
					left++;
			}
		}
		//Check for the less side
		var min = Math.min(left, right);
		//Do here a filter for the best line splitter
		if(min>best_minSides){
			best_minSides = min;
			best_lineSplitter = lineSplit;
		}
		//console.log(lineSplit);
		//console.log(min);
	}
	//Now, check if was picked some line for spliting
	if(best_minSides==0||best_lineSplitter==null){
		var node = {
			"subsector":true,
			"lines": lines,
			"address": rastrer,
		};
		if(validadeSubSector(lines, node)){
			return node;
		}else{
			return null;
		}
	}
	else{
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
			var sbline = new SubLine(line);
			var ang1 = Math.normalizeAngle(Math.angle(v1, line.v1)-angS);
			var ang2 = Math.normalizeAngle(Math.angle(v1, line.v2)-angS);
			//console.log(line);
			//console.log([ang1, ang2]);
			ang1 = Math.round(ang1*Math.roundA)/(Math.roundA);
			ang2 = Math.round(ang2*Math.roundA)/(Math.roundA);
			ang1 = Math.abs(ang1)==Math.RPI||(line.v1==v1||line.v1==v2)?0:ang1;
			ang2 = Math.abs(ang2)==Math.RPI||(line.v2==v1||line.v2==v2)?0:ang2;
			if(ang1==0){
				if(!intersections.includes(line.v1))
					intersections.push(line.v1)
			}
			if(ang2==0){
				if(!intersections.includes(line.v2))
					intersections.push(line.v2)
			}
			if(line!=lineSplit){
				{
					var inter = Math.intersectionLine(lineSplit, line);
					var vInt = new Vertex(inter[0], inter[1]);
					if(ang1==0&&ang2==0){
						sbline.used = true;
						splitters.push(sbline);
					}else{
						if(ang1>=0&&ang2>=0){
							right_lines.push(sbline);
						}
						else if(ang1<=0&&ang2<=0){
							left_lines.push(sbline);
						}
						else{
							var sub1 = new SubLine(new Line(line.v1, vInt));
							var sub2 = new SubLine(new Line(line.v2, vInt));
							sub1.used = line.used;
							sub2.used = line.used;
							intersections.push(vInt)
							if(ang1>0){
								right_lines.push(sub1);
								left_lines.push(sub2);
							}else if(ang2>0){
								right_lines.push(sub2);
								left_lines.push(sub1);
							}
						}
					}
				}
			}else{
				continue;
			}
		}
		var subSplitter = new SubLine(lineSplit);
		subSplitter.used = true;
		splitters.push(subSplitter);
		
		//And, analyse each intersection getted, generate or re-use existents lines for create a huge map splitter
		intersections = intersections.sort(function(v1, v2){
			if(v1.x!=v2.x){
				return v1.x-v2.x;
			}else{
				return v1.y-v2.y;
			}
		});
		
		//Generate sub-lines
		subLsGen: for(var vi=0; vi<intersections.length-1; vi++){
			var ve1 = intersections[vi+0];
			var ve2 = intersections[vi+1];
			var sbLine = new SubLine(new Line(ve1, ve2));
			for(var si=0; si<splitters.length; si++){
				var spl = splitters[si];
				if(isEqualLines(sbLine, spl)){
					sbLine = spl;
					continue subLsGen;
				}
			}
			if(validadeSubLine(sbLine))
				splitters.push(sbLine);
		}
		for(var si=0; si<splitters.length; si++){
			var spl = splitters[si];
			//spl.used = true;
			left_lines.push(spl);
			right_lines.push(spl);
		}
		
		var n1 = splitTree(left_lines, null, rastrer+"_0l");
		var n2 = splitTree(right_lines, null, rastrer+"_1r");
		console.log([n1, n2]);
		if(n1==null&&n2==null){
			return null;
		}
		else if(n1==null){
			//nodesL.push(n2);
			n2.address = rastrer;
			return n2;
		}
		else if(n2==null){
			//nodesL.push(n1);
			n1.address = rastrer;
			return n1;
		}
		else{
			var node = {
				"subsector":false,
				"linesL": left_lines,
				"linesR": right_lines,
				"splitter": lineSplit,
				"inters": intersections,
				"subSplitters": splitters,
				"address": rastrer,
			};
			//if(n1.address.length>rastrer+3)
			//	throw new Error("Disorder, misplace address: "+rastrer+"\n and: "+n1.address);
			nodesL.splice(0,0,n1);
			nodesL.splice(0,0,n2);
			return node;
		}
	}
	}catch(erro){
		alert("Error execution: "+erro);
		console.error(erro);
		console.trace(erro);
	}
}

function buildBSPTree(lines){
	nodeList.innerHTML = "";
	//console.log(lines);
	nodesL = [];
	nodesL.splice(0, 0, splitTree(lines, null, ""));
	//console.log(nodesL);
	nodeList.innerHTML += '<option value="none">--None--</option>';
	for(var i=0; i<nodesL.length; i++){
		nodeList.innerHTML += '<option value="'+i+'">Node #'+i+''+nodesL[i].address+'</option>';
	}
	nodeList.value = "none";
	alert("BSP nodes build!");
	return nodesL;
}

nodeList.onchange = function(){
	console.log(nodesL[Number(this.value)]);
	if(nodeList.value=="none"){
		Objs.nodes = null;
	}else{
		Objs.nodes = nodesL[Number(this.value)];
	}
	redrawEditor();
}
