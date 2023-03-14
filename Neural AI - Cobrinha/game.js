
const CELL_SIZE = 50;

function CobraGame(tela){
	const ctx = tela.getContext("2d");
	const WIDTH = Number(tela.width);
	const HEIGHT = Number(tela.height);
	
	var cobras = [];
	var running = false;
	var self = this;
	
	this.generation = 1;
	this.delimiterS = 1;
	
	this.addCobra = function(cobra){
		cobras.push(cobra);
	}
	this.clearCobra = function(){
		while(cobras.length > 0)
			cobras.pop();
	}
	this.redraw = function(delta){
		
		//Clear background
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		
		//Redraw cobras
		for(var i=0; i<cobras.length; i++){
			var cobra = cobras[i];
			
			//Redraw parts of the cobra
			ctx.fillStyle = i?"gray":"black";
			for(var pi=0; pi<cobra.parts.length; pi++){
				//ctx.fillStyle = pi?"black":"red";
				var part = cobra.parts[pi];
				ctx.fillRect(part[0]*CELL_SIZE, part[1]*CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
			
			//Redraw fruit
			ctx.fillStyle = "red";
			ctx.fillRect(cobra.fruit.x*CELL_SIZE, cobra.fruit.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}
		
		//Redraw UI
		ctx.fillStyle = "black";
		ctx.font = "17px arial";
		/*
		ctx.fillText("FPS: "+(1/delta).toFixed(2), 400, 40);
		ctx.fillText("Birds on stage: "+birds.length, 400, 60);
		ctx.fillText("Birds alive: "+this.birdsAlive, 400, 80);
		ctx.fillText("Actual score: "+this.bestScore, 400, 100);
		ctx.fillText("Last score: "+this.lastScore, 400, 120);
		ctx.fillText("Best score: "+this.mostHighScore, 400, 140);
		ctx.fillText("Delimiter: "+this.delimiterS, 400, 160);
		ctx.fillText("Generation: "+this.generation, 400, 180);
		*/
	}
	var acutime = 0;
	this.render = function(delta){
		
		//Update all the cobras
		acutime += delta;
		if(acutime>.2){
			acutime = 0;
		}
		for(var i=0; i<cobras.length; i++){
			var cobra = cobras[i];
			if(acutime==0){
				cobra.move();
			}
		}
		
		self.redraw();
	}
	this.onUpdate = function(delta){};
	this.begin = function(){
		Animate(0);
	}
	this.startGame = function(){
		running = true;
	}
	this.stopGame = function(){
		running = false;
	}
	this.resetGame = function(){
		
		self.redraw();
	}
	var lasttime = 0;
	function Animate(time){
		var delta = (time-lasttime)*0.001;
		lasttime = time;
		if(running){
			self.render(delta);
			self.onUpdate(delta);
		}
		requestAnimationFrame(Animate);
	}
	this.getCanvasRenderingContext2D = function(){
		return ctx;
	}
	this.resetGame();
}

function Cobra(color){
	
	var self = this;
	
	self.parts = [];
	self.score = 0;
	self.fruit = {
		x: 10,
		y: 10,
	};
	self.dir = 0;
	self.AI = null;
	
	self.lost = false;
	
	self.look = function(dir){
		// 0 => up
		// 1 => right
		// 2 => down
		// 3 => left
		if(self.dir&1){
			if((dir&1)^1){
				self.dir = dir;
			}
		}
		else{
			if(dir&1){
				self.dir = dir;
			}
		}
	}
	self.turn = function(dir){
		//1 => right
		//-1 =>left
		if(dir<0){
			if(self.dir==0){
				self.dir = 3;
			}
			else if(self.dir==1){
				self.dir = 0;
			}
			else if(self.dir==2){
				self.dir = 1;
			}
			else if(self.dir==3){
				self.dir = 2;
			}
		}
		if(dir>0){
			if(self.dir==0){
				self.dir = 1;
			}
			else if(self.dir==1){
				self.dir = 2;
			}
			else if(self.dir==2){
				self.dir = 3;
			}
			else if(self.dir==3){
				self.dir = 0;
			}
		}
	}
	self.move = function(){
		var lx = self.parts[self.parts.length-1][0];
		var ly = self.parts[self.parts.length-1][1];
		for(var pi=self.parts.length-1; pi>0; pi--){
			self.parts[pi][0] = self.parts[pi-1][0];
			self.parts[pi][1] = self.parts[pi-1][1];
		}
		if((self.parts[0][0]==self.fruit.x)&&(self.parts[0][1]==self.fruit.y)){
			self.parts.push([lx, ly]);
		}
		self.parts[0][0] += self.dir==1?1:self.dir==3?-1:0;
		self.parts[0][1] += self.dir==0?-1:self.dir==2?1:0;
	}
	//Push the initial parts of the Cobra
	self.parts.push(
		[5, 5]
	);
	self.parts.push(
		[5, 6]
	);
	self.parts.push(
		[5, 7]
	);
}
/*
function Bird(color){
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	this.my = 0;
	this.impulse = -9;
	this.radius = 25;
	this.score = 0;
	this.AI = null;
	this.isPlayer = false;
	
	//Apearance
	this.color = color;
	this.lost = false;
	
	this.pulse = function(){
		this.my = this.impulse;
	}
}
*/