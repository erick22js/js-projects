
function FlappyBirdGame(tela){
	const ctx = tela.getContext("2d");
	const WIDTH = Number(tela.width);
	const HEIGHT = Number(tela.height);
	const limit_birds_draw = 64;
	const Gravity = 45;
	const PipesR = 40;
	const PipesRD = 100;
	var game_speed = 2;
	
	var birds = [];
	var pipes = [];
	var running = false;
	var self = this;
	var birdsLosed = 0;
	
	this.nextPipe = null;
	this.birdsAlive = 0;
	this.bestScore = 0;
	this.lastScore = 0;
	this.mostHighScore = 0;
	this.bestBird = null;
	this.generation = 1;
	this.delimiterS = 1;
	
	function randomizePipeY(i){
		return 100+Math.random()*400;
	}
	
	this.addBird = function(bird){
		birds.push(bird);
	}
	this.clearBird = function(){
		while(birds.length > 0)
			birds.pop();
	}
	/*this.getNextPipe = function(){
		
	}*/
	this.redraw = function(delta){
		
		//Clear background
		ctx.fillStyle = "#1af";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		
		//Redraw birds
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		var drawedbirds = limit_birds_draw;
		
		for(var i=0; i<birds.length; i++){
			var bird = birds[i];
			if(!bird.isPlayer)
				if(drawedbirds<=0||bird.lost)
					continue;
			ctx.save();
			ctx.translate(bird.x, bird.y);
			ctx.rotate(bird.angle);
			ctx.fillStyle = bird.color;
			ctx.fillRect(-25, -25, 50, 50);
			ctx.strokeRect(-25, -25, 50, 50);
			ctx.fillStyle = "yellow";
			ctx.fillRect(10, -10, 40, 20);
			ctx.strokeRect(10, -10, 40, 20);
			ctx.restore();
			if(!bird.lost)
				drawedbirds--;
		}
		
		//Redraw pipes
		ctx.lineWidth = 8;
		for(var i=0; i<pipes.length; i++){
			var pipe = pipes[i];
			ctx.save();
			ctx.translate(pipe.x, 0);
			ctx.fillStyle = "darkgreen";
			ctx.strokeStyle = "black";
			ctx.fillRect(-PipesR, 0, 2*PipesR, pipe.y-PipesRD);
			ctx.fillRect(-PipesR, pipe.y+PipesRD, 2*PipesR, 600-(pipe.y+PipesRD));
			ctx.strokeRect(-PipesR, 0, 2*PipesR, pipe.y-PipesRD);
			ctx.strokeRect(-PipesR, pipe.y+PipesRD, 2*PipesR, 600-(pipe.y+PipesRD));
			ctx.restore();
		}
		//Highlight next Pipe
		if(this.nextPipe){
			var pipe = this.nextPipe;
			ctx.save();
			ctx.translate(pipe.x, 0);
			ctx.fillStyle = "green";
			ctx.fillRect(-PipesR, 0, 2*PipesR, pipe.y-PipesRD);
			ctx.fillRect(-PipesR, pipe.y+PipesRD, 2*PipesR, 600-(pipe.y+PipesRD));
			ctx.restore();
		}
		
		//Redraw UI
		ctx.fillStyle = "black";
		ctx.font = "17px arial";
		ctx.fillText("FPS: "+(1/delta).toFixed(2), 400, 40);
		ctx.fillText("Birds on stage: "+birds.length, 400, 60);
		ctx.fillText("Birds alive: "+this.birdsAlive, 400, 80);
		ctx.fillText("Actual score: "+this.bestScore, 400, 100);
		ctx.fillText("Last score: "+this.lastScore, 400, 120);
		ctx.fillText("Best score: "+this.mostHighScore, 400, 140);
		ctx.fillText("Delimiter: "+this.delimiterS, 400, 160);
		ctx.fillText("Generation: "+this.generation, 400, 180);
	}
	this.render = function(delta){
		//Update pipes
		for(var i=0; i<pipes.length; i++){
			var pipe = pipes[i];
			pipe.x -= game_speed;
			if(pipe.x<-300){
				pipe.x += 2150;
				pipe.y = randomizePipeY(i);
			}
		}
		//Update next pipe
		var xref = 100-PipesR-25;
		var lesser = Infinity;
		var pickedPipe = null;
		for(var i=0; i<pipes.length; i++){
			var len = pipes[i].x-xref;
			if(len>0){
				if(len < lesser){
					lesser = len;
					pickedPipe = pipes[i];
				}
			}
		}
		this.nextPipe = pickedPipe;
		//Update birds
		this.birdsAlive = (birds.length-birdsLosed);
		birdl: for(var i=0; i<birds.length; i++){
			var bird = birds[i];
			if(bird.lost){
				bird.x -= game_speed;
				continue birdl;
			}
			bird.score++;
			if(bird.score > this.bestScore && !bird.isPlayer){
				this.bestScore = bird.score;
				this.bestBird = bird;
			}
			if(bird.my<26)
				bird.my += Gravity*0.008;
			bird.y += bird.my;
			bird.angle = bird.my/9;
			if(bird.angle>1)
				bird.angle = 1;
			{
				var pipe = this.nextPipe;
				if(((bird.x+bird.radius)>=(pipe.x-PipesR)&&(bird.x+bird.radius)<=(pipe.x+PipesR))||
				((bird.x-bird.radius)>=(pipe.x-PipesR)&&(bird.x-bird.radius)<=(pipe.x+PipesR)))
					if((bird.y-bird.radius)<=(pipe.y-PipesRD) || (bird.y+bird.radius)>=(pipe.y+PipesRD))
						bird.lost = true;
			}
			if(bird.y > 650 || bird.y < -50)
				bird.lost = true;
			if(bird.lost)
				birdsLosed++;
		}
		this.redraw(delta);
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
		for(var i=0; i<birds.length; i++){
			var bird = birds[i];
			bird.lost = false;
			bird.x = 100;
			bird.y = 300;
			bird.my = 0;
			bird.score = 0;
		}
		birdsLosed = 0;
		this.birdsAlive = birds.length;
		pipes = [];
		for(var i=0; i<6; i++){
			pipes.push({
				x: 800+i*350,
				y: randomizePipeY(i),
			});
		}
		this.lastScore = this.bestScore;
		this.mostHighScore = this.bestScore>this.mostHighScore?this.bestScore:this.mostHighScore;
		this.bestScore = 0;
		this.bestBird = null;
		this.redraw();
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
