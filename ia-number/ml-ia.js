
function MlTemplate(inputs_len, layers, outputs_len){
	var self = this;
	
	self.inputs_len = inputs_len;
	self.layers = layers;
	self.outputs_len = outputs_len;
}


function Ml(template){
	var self = this;
	
	self.input = new Array(template.inputs_len);
	self.layers = new Array(template.layers.length);
	self.output = new Array(template.outputs_len);
	
	for(var i=0; i<self.layers.length; i++){
		self.layers[i] = new Array(template.layers[i]);
	}
	
	self.randomize = function(round, set=false){
		for(var i=0; i<self.layers.length; i++){
			for(var ni=0; ni<self.layers[i].length; ni++){
				if(set){
					self.layers[i][ni] = (Math.random()*2)-1;
				}
				else{
					self.layers[i][ni] += Math.random()*round;
				}
				if(self.layers[i][ni]>1){
					self.layers[i][ni] -= self.layers[i][ni]+1;
				}
				if(self.layers[i][ni]<-1){
					self.layers[i][ni] += -1-self.layers[i][ni];
				}
			}
		}
	}
	
	self.copyFrom = function(oml){
		for(var i=0; i<self.layers.length; i++){
			for(var ni=0; ni<self.layers[i].length; ni++){
				oml.layers[i][ni] = oml.layers[i][ni];
			}
		}
	}
	
	self.process = function(){
		var llayer = self.input;
		for(var i=0; i<=self.layers.length; i++){
			var actlayer = (i==self.layers.length)?self.output:new Array(self.layers[i].length);
			
			for(var ni=0; ni<actlayer.length; ni++){
				actlayer[ni] = 0;
				
				for(var lni=0; lni<llayer.length; lni++){
					actlayer[ni] += llayer[lni];
				}
				
				if(i!=self.layers.length){
					actlayer[ni] *= self.layers[i][ni];
				}
			}
			
			llayer = actlayer;
		}
	}
}
