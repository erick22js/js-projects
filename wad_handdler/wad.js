
const WAD = function(bytes){
	this.header = IOByte.bytesAsString(IOByte.extractBytes(bytes, null, 0, 4));
	this.numLumps = IOByte.littleEndian_bytesToUint(IOByte.extractBytes(bytes, null, 4, 4));
	this.pointersStart = IOByte.littleEndian_bytesToUint(IOByte.extractBytes(bytes, null, 8, 4));
	this.lumpsData = [];
	this.lumpsName = [];
	var self = this;
	function loadLumps(){
		var pointer = self.pointersStart;
		for(var l=0; l<self.numLumps; l++){
			var position = IOByte.littleEndian_bytesToUint(IOByte.extractBytes(bytes, null, pointer, 4));
			var size = IOByte.littleEndian_bytesToUint(IOByte.extractBytes(bytes, null, pointer+4, 4));
			var name = IOByte.bytesAsString(IOByte.extractBytes(bytes, null, pointer+8, 8));
			self.lumpsData.push(IOByte.extractBytes(bytes, null, position, size));
			self.lumpsName.push(name);
			pointer+=16;
		}
	}
	loadLumps();
	function get_wad_lumps_size() {
		var data_size = 0;
		for(var i=0; i<self.numLumps; i++)
			data_size += self.lumpsData[i].length;
		return data_size;
	}
	function get_wad_total_size() {
		//First, get all bytes data size
		var data_size = 0;
		data_size += get_wad_lumps_size();
		//Add pointers references lumps sizes
		data_size += self.numLumps*16;
		//Add header file
		data_size += 12;
		return data_size;
	}
	this.getFirstLumpByName = function(name, index){
		for(var i=index||0; i<self.lumpsName.length; i++){
			if(self.lumpsName[i]==name)
				return i;
		}
		return -1;
	}
	this.compile = function(){
		var bytes = IOByte.createArrayBytes(get_wad_total_size());
		//Define header wad
		IOByte.putBytes(IOByte.stringAsBytes(self.header), bytes, 0);
		IOByte.putBytes(IOByte.littleEndian_uintToBytes(self.numLumps), bytes, 4);
		var references_start = get_wad_lumps_size()+12;
		IOByte.putBytes(IOByte.littleEndian_uintToBytes(references_start, 4), bytes, 8);
		var pointer_ref = 12;
		
		for(var i=0; i<self.numLumps; i++) {
			var pointer = IOByte.createArrayBytes(16);
			IOByte.putBytes(IOByte.littleEndian_uintToBytes(pointer_ref, 4), pointer, 0);
			IOByte.putBytes(IOByte.littleEndian_uintToBytes(self.lumpsData[i].length, 4), pointer, 4);
			IOByte.putBytes(IOByte.stringAsBytes(self.lumpsName[i]), pointer, 8);
			
			IOByte.putBytes(self.lumpsData[i], bytes, pointer_ref);
			IOByte.putBytes(pointer, bytes, references_start+i*16);
			pointer_ref += self.lumpsData[i].length;
		}
		//IOByte.bytesToFile(bytes, outFilePath);
		console.log(bytes);
		return bytes;
	}
}
