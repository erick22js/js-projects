
function AiNeuralCobra(game, bird){
	this.weight = new Float32Array(100);
	this.bird = bird;
	this.randomize = function(multiplier=1, base=null){
		if(base==null){
			for(var i=0; i<this.weight.length; i++)
				this.weight[i] = Math.random()*(multiplier*2)-multiplier;
		}else{
			for(var i=0; i<this.weight.length; i++)
				this.weight[i] = base[i]+(Math.random()*(multiplier*2)-multiplier);
		}
	}
	this.copyFrom = function(w2){
		for(var i=0; i<this.weight.length; i++)
			this.weight[i] = w2[i];
	}
	this.mutate = function(){
		
	}
	this.execute = function(){
		var mp = 1000;
		//Inputs
		var Inputs = [
			game.nextPipe.x-bird.x, //Distance to next pipe
			//game.nextPipe.y-bird.y, //Distance to center of next pipe
			game.nextPipe.y-100, //Top pipe
			game.nextPipe.y+100, //Bottom pipe
			bird.y,                 //Bird y position
			bird.my,                //Bird y motion
			2,                      //Game speed
		];
		
		var wi = 0;
		
		//First layer
		var NsG1 = new Array(Inputs.length);
		for(var n=0; n < NsG1.length; n++){
			var sum = 0;
			for(var c=0; c < Inputs.length; c++){
				sum += Inputs[c]*(this.weight[wi]*mp);
				wi++;
			}
			NsG1[n] = sum < 0 ? 0 : sum;
		}
		
		//First layer
		var NsG2 = new Array(Inputs.length);
		for(var n=0; n < NsG2.length; n++){
			var sum = 0;
			for(var c=0; c < NsG1.length; c++){
				sum += NsG1[c]*(this.weight[wi]*mp);
				wi++;
			}
			NsG2[n] = sum < 0 ? 0 : sum;
		}
		
		//Second Layer
		var NsG3 = new Array(2);
		for(var n=0; n < NsG3.length; n++){
			var sum = 0;
			for(var c=0; c < NsG2.length; c++){
				sum += NsG2[c]*(this.weight[wi]*mp);
				wi++;
			}
			NsG3[n] = sum < 0 ? 0 : sum;
		}
		
		//Output
		/* This IA can behave 2 actions: pulse or nothing
		*/
		if(NsG2[0] > NsG2[1]){
			bird.pulse();
		}else{
			//...do nothing ;-)
		}
		
	}
}
/*
function NeuralGameFP(game){
	this.birdsGeneration = 
}*/
