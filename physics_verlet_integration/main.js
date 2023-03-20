var g_scl = 1;

const g_acc = new Vector(0, 200);


function Point(x=0, y=0, vx=0, vy=0, mass=1, pinned=false){
	var self = this;
	self.pos = new Vector(x, y);
	self.old_pos = new Vector(x-vx, y-vy);
	self.mass = mass;
	
	self.pinned = pinned;
	
	self.lines = [];
	
	self.update = function(dt){
		if(!self.pinned){
			var acc = g_acc.clone().rdc(self.mass);
			
			var prev = self.pos.clone();
			
			self.pos.set(self.pos.scl(2).sub(self.old_pos).add(acc.scl(dt*dt)));
			
			self.old_pos.set(prev);
		}
	}
	
	self.constraint = function(){
		if(self.pos.y>height*g_scl){
			self.old_pos.y = height + (self.pos.y-self.old_pos.y);
			self.pos.y = height;
		}
		if(self.pos.y<0){
			self.old_pos.y = self.pos.y-self.old_pos.y;
			self.pos.y = 0;
		}
		if(self.pos.x>=width*g_scl){
			self.old_pos.x = width + (self.pos.x-self.old_pos.x);
			self.pos.x = width;
		}
		if(self.pos.x<0){
			self.old_pos.x = self.pos.x-self.old_pos.x;
			self.pos.x = 0;
		}
	}
	
	self.draw = function(){
		drawCircle("blue", self.pos.x*g_scl, self.pos.y*g_scl, 2*g_scl);
	}
}

function Line(p1, p2, width){
	var self = this;
	self.p1 = p1;
	p1.lines.push(self);
	self.p2 = p2;
	p2.lines.push(self);
	self.width = width;
	
	self.update = function(dt){
		var dist = self.p1.pos.distance(self.p2.pos);
		var dif = (dist-self.width)/2;
		var ang = self.p1.pos.angle(self.p2.pos);
		
		if(!self.p1.pinned){
			self.p1.pos.add(Math.cos(ang)*dif, Math.sin(ang)*dif);
		}
		if(!self.p2.pinned){
			self.p2.pos.sub(Math.cos(ang)*dif, Math.sin(ang)*dif);
		}
	}
	
	self.draw = function(){
		drawLine("black", self.p1.pos.x, self.p1.pos.y, self.p2.pos.x, self.p2.pos.y);
	}
}

/*
const points = [
	new Point(100, 100, 1, 0, 4),
	new Point(200, 100, -1, 0, 4),
	new Point(200, 200, 0, -2, 4),
	new Point(100, 200, 0, 1, 4),
];

const lines = [
	new Line(points[0], points[1], 100),
	new Line(points[1], points[2], 100),
	new Line(points[2], points[3], 100),
	new Line(points[3], points[0], 100),
	new Line(points[0], points[2], 100*Math.sqrt(2)),
];
*/

const points = [
	
];

for(var y=10; y<=250; y+=10){
	for(var x=10; x<=490; x+=10){
		points.push(new Point(x, y, 0, 0, 4, y==10));
	}
}

const lines = [
	
];
for(var vy=0; vy<25; vy++){
	for(var vx=0; vx<=47; vx++){
		lines.push(new Line(points[vx + (vy*49)], points[vx+1 + (vy*49)], 10));
	}
}

for(var vy=0; vy<24; vy++){
	for(var vx=0; vx<=48; vx++){
		var line = new Line(points[vx + (vy*49)], points[vx + ((vy+1)*49)], 10);
		lines.push(line);
	}
}


App.start = function(){
	
}

App.update = function(dt){
	clearScreen();
	
	/* Updates the points on screen */
	for(var i=0; i<points.length; i++){
		points[i].update(dt);
		
		if(points[i]==actual){
			points[i].pos.x = pos[0];
			points[i].pos.y = pos[1];
		}
	}
	
	/* Updates the lines on screen */
	for(var i=0; i<lines.length; i++){
		lines[i].update(dt);
	}
	
	/* Apply constraints to the points on screen */
	for(var i=0; i<points.length; i++){
		points[i].constraint();
	}
	
	/* Renders all the points on screen */
	for(var i=0; i<points.length; i++){
		points[i].draw();
	}
	
	/* Renders all the lines on screen */
	for(var i=0; i<lines.length; i++){
		lines[i].draw();
	}
	
}

function removePoint(p){
	for(var pi=0; pi<points.length; pi++){
		if(points[pi]==p){
			points.splice(pi, 1);
			break;
		}
	}
	for(var li=0; li<lines.length; li++){
		if(p.lines.includes(lines[li])){
			lines.splice(li, 1);
			li--;
		}
	}
}

window.onkeydown = function(ev){
	if(ev.key=="Escape"){
		App.running = false;
	}
}

var actual = null;
var pos = [0, 0];

var pressed = false;

window.onmousedown = function(ev){
	var x = ev.offsetX;
	var y = ev.offsetY;
	pressed = true;
	
	for(var pi=0; pi<points.length; pi++){
		if(points[pi].pos.distance(new Vector(x, y))<5){
			if(ev.ctrlKey){
				removePoint(points[pi]);
			}
			else{
				actual = points[pi];
			}
			break;
		}
	}
	
	pos[0] = x;
	pos[1] = y;
	
	console.log(ev);
	
}

window.onmousemove = function(ev){
	var x = ev.offsetX;
	var y = ev.offsetY;
	
	for(var pi=0; pi<points.length; pi++){
		if(points[pi].pos.distance(new Vector(x, y))<5){
			if(ev.ctrlKey&&pressed){
				removePoint(points[pi]);
			}
			break;
		}
	}
	
	pos[0] = x;
	pos[1] = y;
	
}

window.onmouseup = function(ev){
	var x = ev.offsetX;
	var y = ev.offsetY;
	pressed = false;
	
	if(actual){
		actual = null;
	}
}
