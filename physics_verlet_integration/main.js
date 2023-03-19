var g_scl = 1;

const g_acc = new Vector(0, 200);


function Point(x=0, y=0, vx=0, vy=0, mass=1, pinned=false){
	var self = this;
	self.pos = new Vector(x, y);
	self.old_pos = new Vector(x-vx, y-vy);
	self.mass = mass;
	
	self.pinned = pinned;
	
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
		drawCircle("blue", self.pos.x*g_scl, self.pos.y*g_scl, 10*g_scl);
	}
}

function Line(p1, p2, width){
	var self = this;
	self.p1 = p1;
	self.p2 = p2;
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


const points = [
	new Point(100, 100, 1, 0, 4),
	new Point(200, 100, -1, 0, 4, true),
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


App.start = function(){
	
}

App.update = function(dt){
	clearScreen();
	
	/* Updates the points on screen */
	for(var i=0; i<points.length; i++){
		points[i].update(dt);
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

window.onkeydown = function(ev){
	if(ev.key=="Escape"){
		App.running = false;
	}
}
