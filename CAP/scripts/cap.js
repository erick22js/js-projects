
const Cap = (new function(){
	var cap = this;
	
	function BitStream(dt=[]){
		var self = this;
		var buffer = dt;
		var data = 0;
		var bi_seek = 0;
		var by_seek = 0;
		var bi_hold = 0;
		
		function getByte(index){
			return index >= buffer.length || index < 0? 0: buffer[index];
		}
		
		function gatherbits(count){
			while(count>0){
				data |= ((getByte(by_seek)>>bi_seek)&1)<<bi_hold;
				bi_seek++;
				if(bi_seek>=8){
					bi_seek = 0;
					by_seek++;
				}
				bi_hold++;
				count--;
			}
		}
		function readbits(count){
			var bits = data & ((1<<count)-1);
			data >>>= count;
			bi_hold -= count;
			return bits;
		}
		self.fetchBits = function(count){
			if(count>bi_hold){
				var bicount = count-bi_hold;
				gatherbits(bicount);
			}
			return readbits(count);
		}
		
		self.eof = function(){
			return by_seek >= buffer.length || by_seek < 0;
		}
		
		self.seekSet = function(bi_i, by_i=0){
			data = 0;
			bi_hold = 0;
			by_index = by_i;
			bi_index = bi_i;
		}
		self.seekCur = function(bi_i, by_i=0){
			data = 0;
			bi_hold = 0;
			
			// Seek the bit
			by_i += ~~(bi_i/8);
			bi_i %= 8;
			bi_index += bi_i;
			if(bi_index < 0){
				by_index -= 1;
				bi_index += 8;
			}
			else if(bi_index >= 8){
				by_index += 1;
				bi_index -= 8;
			}
			
			// Seek the byte
			by_index += by_i;
		}
		self.tell = function(){
			return [bi_seek, by_seek];
		}
		self.tellBytes = function(){
			return by_seek;
		}
		self.tellBits = function(){
			return bi_seek;
		}
		self.tellAllBits = function(){
			return by_seek*8 + bi_seek;
		}
	}
	
	cap.test = function(file){
		var bs = new BitStream(file.getBuffer());
		
		while(!bs.eof()){
			console.log((bs.fetchBits(8)).toString(2));
		}
		
		console.log(file.size());
	}
});
