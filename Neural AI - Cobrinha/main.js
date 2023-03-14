
const mgame = new CobraGame(tela);

for(var i=0; i<100; i++){
	/*
	var bird = new Bird("red");
	mgame.addBird(bird);
	bird.x = 100;
	bird.y = 300;
	var ai = new AiNeuralBird(mgame, bird);
	ai.randomize();
	birds.push(ai);
	bird.AI = ai;
	*/
}
/*
const pbid = new Cobra("blue");
mgame.addBird(pbid);
pbid.x = 100;
pbid.y = 300;
pbid.AI = new AiNeuralBird(mgame, bird);
pbid.AI.randomize();
pbid.isPlayer = true;

mgame.begin();
mgame.startGame();
var genDelimitter = 1;
var bestScore = 0;
var lastScore = 0;

mgame.onUpdate = function(dt){
	if(mgame.birdsAlive<=0){
		mgame.stopGame();
		console.log("Best AI: ");
		console.log(mgame.bestBird);
		//Now Propagate best weights for others
		var ratio = (lastScore==0?mgame.bestScore:lastScore)/mgame.bestScore;
		ratio = Math.pow(ratio, 5);
		bestScore = mgame.bestScore > bestScore? mgame.bestScore: bestScore;
		//genDelimitter *= ratio;
		genDelimitter *= .92;
		console.log("Actual Score: "+mgame.bestScore+"\nLast Score: "+lastScore+"\nBest Score: "+bestScore+"\nDelimiter: "+(genDelimitter).toFixed(4));
		var bkpai = new AiNeuralBird(mgame, pbid);
		bkpai.copyFrom(mgame.bestBird.AI.weight);
		for(var i=0; i<birds.length; i++){
			birds[i].randomize(genDelimitter, bkpai.weight);
		}
		lastScore = mgame.bestScore;
		mgame.delimiterS = genDelimitter;
		mgame.generation++;
		mgame.resetGame();
		mgame.startGame();
	}
	for(var i=0; i<birds.length; i++){
		birds[i].execute();
	}
}
*/

const pco = new Cobra("blue");
mgame.addCobra(pco);

mgame.begin();
mgame.startGame();

mgame.onUpdate = function(dt){
	
}

window.onkeydown = function(k){
	if(k.keyCode==32){
		pbid.pulse();
		//for(var i=0; i<birds.length; i++){
			//var bird = birds[i];
			//bird.pulse();
		//}
	}
	if(k.keyCode==87){ //W
		pco.look(0);
	}
	if(k.keyCode==65){ //A
		pco.look(3);
	}
	if(k.keyCode==83){ //S
		pco.look(2);
	}
	if(k.keyCode==68){ //D
		pco.look(1);
	}
	
	if(k.keyCode==81){ //Q
		pco.turn(-1);
	}
	if(k.keyCode==69){ //E
		pco.turn(1);
	}
	console.log(k);
}
