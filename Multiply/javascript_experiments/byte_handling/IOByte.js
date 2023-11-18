
const IOByte = new function(){
	var ByteIO = Uint8Array;
	function _createByteArray(value){
		return new ByteIO(value);
	}
	function _extractBytesFrom(src, begin, length){
		var size = begin+length>src.length?src.length-begin:length;
		var bytes = new ByteIO(size);
		for(var b=0; b<size; b++){
			bytes[b] = src[begin+b]
		}
		return bytes;
	}
	
	this.createByteArray = _createByteArray;
	this.extractBytesFrom = _extractBytesFrom;
}
