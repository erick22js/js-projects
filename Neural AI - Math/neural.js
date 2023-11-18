
function Neural(){
	
	var self = this;
	
	self.input = [];
	self.input_size = 0;
	self.output = [];
	self.output_size = 0;
	
	self.map = [];
	self.map_size = 0;
	
	self.layers_depth = 0;
	self.lay_length = 0;
	
	self.multiplier = 1;
	
	self.points = 0;
	self.disable = false;
	
	self.clone = function(oneural = new Neural()){
		oneural.input_size = self.input_size;
		oneural.input = new Array(oneural.input_size);
		for(var ni=0; ni<self.input_size; ni++){
			oneural.input[ni] = self.input[ni];
		}
		oneural.output_size = self.output_size;
		oneural.output = new Array(oneural.output_size);
		for(var ni=0; ni<self.output_size; ni++){
			oneural.output[ni] = self.output[ni];
		}
		oneural.map_size = self.map_size;
		oneural.map = new Array(oneural.map_size);
		for(var ni=0; ni<self.map_size; ni++){
			oneural.map[ni] = self.map[ni];
		}
		oneural.layers_depth = self.layers_depth;
		oneural.lay_length = self.lay_length;
		oneural.multiplier = self.multiplier;
		return oneural;
	}
	
	self.mutate = function(delimitation=1){
		for(var ni=0; ni<self.map_size; ni++){
			self.map[ni] += (Math.random()*2-1)*delimitation;
		}
	}
	
	self.randomize = function(delimitation=1){
		for(var ni=0; ni<self.map_size; ni++){
			self.map[ni] = (Math.random()*2-1)*delimitation;
		}
	}
	
	self.execute = function(){
		//Process input
		var process = [];
		for(var iv=0; iv<self.input_size; iv++){
			process.push(self.input[iv]);
		}
		
		var map_i = 0;
		
		//Process data operation
		for(var li=0; li<self.layers_depth; li++){
			var backed = [];
			for(var pi=0; pi<self.lay_length; pi++){
				var data = 0;
				for(var dti=0; dti<process.length; dti++){
					data += process[dti]*self.map[map_i];
					map_i++;
				}
				backed.push(data);
			}
			for(var dti=0; dti<process.length; dti++){
				process[dti] = backed[dti];
			}
		}
		
		//Process output
		{
			var backed = [];
			for(var pi=0; pi<self.output_size; pi++){
				var data = 0;
				for(var dti=0; dti<process.length; dti++){
					data += process[dti]*self.map[map_i];
					map_i++;
				}
				backed.push(data);
			}
			for(var dti=0; dti<self.output_size; dti++){
				self.output[dti] = backed[dti];
			}
		}
	}
	
}

function createNeural(in_size=1, out_size=1, lay_depth=1, lay_length=1, mul=1){
	var neural = new Neural();
	neural.input = new Array(in_size);
	neural.input_size = in_size;
	neural.output = new Array(out_size);
	neural.output_size = out_size;
	neural.layers_depth = lay_depth;
	neural.lay_length = lay_length;
	neural.multiplier = mul;
	
	var map_size = (in_size*lay_length*lay_depth)+(in_size*out_size);
	neural.map = new Array(map_size);
	neural.map_size = map_size;
	
	return neural;
}
