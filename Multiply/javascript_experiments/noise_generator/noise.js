function Noise(){
	this.min = 0;
	this.max = 1;
	this.deffectX = .9;
	this.varyDefX = [-.2, .2];
	this.deffectY = .9;
	this.varyDefY = [-.2, .2];
	this.fphs = 1; //Frequency per hundred squares
}

function generateNoisesInTable(table, noise){
	var count = (table.length*table[0].length)/100*noise.fphs;
	for(var i=count; i>=0; i--){
		var x = ~~(Math.random()*table.length);
		var y = ~~(Math.random()*table[0].length);
		table[x][y] = noise.min+(noise.max-noise.min)*Math.random();
	}
	
	for(var w=0; w<table.length; w++){
		for(var h=0; h<table[w].length; h++){
			if(w!=0){
				var deffect = table[w-1][h];
				deffect *= noise.deffectX+((noise.varyDefX[1]-noise.varyDefX[0])*Math.random()+noise.varyDefX[0]);
				if(table[w][h]<deffect)
					table[w][h] = deffect;
			}
		}
	}
	for(var w=table.length-1; w>-1; w--){
		for(var h=0; h<table[w].length; h++){
			if(w!=table.length-1){
				var deffect = table[w+1][h];
				deffect *= noise.deffectX+((noise.varyDefX[1]-noise.varyDefX[0])*Math.random()+noise.varyDefX[0]);
				if(table[w][h]<deffect)
					table[w][h] = deffect;
			}
		}
	}
	for(var w=0; w<table.length; w++){
		for(var h=0; h<table[w].length; h++){
			if(h!=0){
				var deffect = table[w][h-1];
				deffect *= noise.deffectY+((noise.varyDefY[1]-noise.varyDefY[0])*Math.random()+noise.varyDefY[0]);
				if(table[w][h]<deffect)
					table[w][h] = deffect;
			}
		}
	}
	for(var w=0; w<table.length; w++){
		for(var h=table[w].length-1; h>-1; h--){
			if(h!=table[w].length-1){
				var deffect = table[w][h+1];
				deffect *= noise.deffectY+((noise.varyDefY[1]-noise.varyDefY[0])*Math.random()+noise.varyDefY[0]);
				if(table[w][h]<deffect)
					table[w][h] = deffect;
			}
		}
	}
}