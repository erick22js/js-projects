

const CJ = (new function(){
	var self = this;
	
	const EOF = -1;
	
	//
	//	Stream Class
	//
	
	function Stream(source, context){
		var self = this;
		self.src = source;
		self.ctx = context;
		self.seek = 0;
		
		self.getc = function(){
			if(self.seek >= self.src.length){
				return EOF;
			}
			else{
				var chr = self.src.charAt(self.seek);
				self.seek++;
				return chr;
			}
		}
		self.unget = function(){
			self.seek--;
			if(self.seek >= 0){
				var chr = self.src.charAt(self.seek);
				return chr;
			}
			else{
				return 0;
			}
		}
		self.eof = function(){
			return self.seek >= self.src.length;
		}
	}
	
	//
	//	Runner Class
	//
	
	function Runner(){
		
	}
	
	//
	// Compiler Function
	//
	
	self.compile = function(source, context={}){
		var stream = new Stream(source, context);
		while(!stream.eof()){
			
		}
	}
});

