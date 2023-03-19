const ctx = tela.getContext("2d");
const width = Number(tela.width);
const height = Number(tela.height);



/*
	GRAPHICAL UTILITIES
*/

function clearScreen(color="white"){
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

function drawCircle(color="black", x, y, radius){
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	ctx.fill();
	ctx.closePath();
}

function drawLine(color="black", x1, y1, x2, y2){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}


/*
	VECTOR UTILITIES
*/

function Vector(x=0, y=0){
	var self = this;
	self.x = x;
	self.y = y;
	
	self.set = function(x, y=0){
		if(x instanceof(Vector)){
			self.x = x.x;
			self.y = x.y;
		}
		else{
			self.x = x;
			self.y = y;
		}
		return self;
	}
	self.notnull = function(){
		self.x = self.x||0;
		self.y = self.y||0;
	}
	self.clone = function(){
		return new Vector(self.x, self.y);
	}
	
	self.add = function(x, y=0){
		if(x instanceof(Vector)){
			self.x += x.x;
			self.y += x.y;
		}
		else{
			self.x += x;
			self.y += y;
		}
		return self;
	}
	self.sub = function(x, y=0){
		if(x instanceof(Vector)){
			self.x -= x.x;
			self.y -= x.y;
		}
		else{
			self.x -= x;
			self.y -= y;
		}
		return self;
	}
	self.mul = function(x, y=0){
		if(x instanceof(Vector)){
			self.x *= x.x;
			self.y *= x.y;
		}
		else{
			self.x *= x;
			self.y *= y;
		}
		return self;
	}
	self.div = function(x, y=0){
		if(x instanceof(Vector)){
			self.x /= x.x;
			self.y /= x.y;
		}
		else{
			self.x /= x;
			self.y /= y;
		}
		return self;
	}
	self.scl = function(v){
		self.x *= v;
		self.y *= v;
		return self;
	}
	self.rdc = function(v){
		self.x /= v;
		self.y /= v;
		return self;
	}
	self.sqrt = function(){
		self.x = Math.sqrt(self.x);
		self.y = Math.sqrt(self.y);
		return self;
	}
	self.distance = function(x, y=0){
		if(x instanceof(Vector)){
			var dx = x.x-self.x;
			var dy = x.y-self.y;
			return Math.sqrt(dx*dx + dy*dy);
		}
		else{
			var dx = x-self.x;
			var dy = y-self.y;
			return Math.sqrt(dx*dx + dy*dy);
		}
	}
	self.ownDistance = function(){
		return self.x*self.x + self.y*self.y;
	}
	self.angle = function(x, y=0){
		if(x instanceof(Vector)){
			var dx = x.x-self.x;
			var dy = x.y-self.y;
			return Math.atan2(dy, dx);
		}
		else{
			var dx = x-self.x;
			var dy = y-self.y;
			return Math.atan2(dy, dx);
		}
	}
	self.ownAngle = function(){
		return Math.atan2(self.x, self.y);
	}
	self.dotProduct = function(x, y=0){
		if(x instanceof(Vector)){
			return self.x*x.x + self.y*x.y;
		}
		else{
			return self.x*x + self.y*y;
		}
	}
}


/*
	EXECUTION
*/

const App = {
	start: function(){},
	update: function(dt){},
	running: false
};

function _Animate(lt=0){
	App.update(1/60);
	//requestAnimationFrame(_Animate);
	if(App.running){
		setTimeout(_Animate, 1/60);
	}
}

window.onload = function(){
	App.running = true;
	App.start();
	_Animate(0);
}
