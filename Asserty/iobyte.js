
const IOByte = new function(){
	var self = this;
	this.createArrayBytes = function(data){
		return new Uint8Array(data);
	}
	this.extractBytes = function(src, dest, init, length){
		var size = init+length>src.length? src.length-init: length;
		dest = dest || new Uint8Array(size);
		for(var b=0; b<size; b++){
			dest[b] = src[b+init];
		}
		return dest;
	}
	this.bytesAsString = function(bytes){
		var str = "";
		for(var i=0; i<bytes.length; i++)
			str += String.fromCharCode(bytes[i]);
		return str;
	}
	this.littleEndian_bytesToUint = function(bytes){
		var value = 0;
		for(var i=0; i<bytes.length; i++)
			value += bytes[i] * Math.pow(256, i);
		return value;
	}
	this.littleEndian_uintToBytes = function(value){
		var bytes = [];
		do{
			var val = value%256;
			value -= val;
			value /= 256;
			bytes.push(val);
		}while(value>0);
		return self.createArrayBytes(bytes);
	}
}

function pickFile(onreaded){
	var filei = document.createElement("input");
	filei.type = "file";
	filei.click();
	console.log(filei);
	filei.onchange = function(v){
		var reader = new FileReader();
		reader.onload = function(dt){
			var res = dt.target.result;
			var bytes = new Uint8Array(res);
			onreaded(bytes);
		}
		console.log(v.target.files);
		console.log(reader);
		reader.readAsArrayBuffer(v.target.files[0]);
	}
}


function saveFile(name, bytes){
	var blob, url;
	blob = new Blob([bytes], {
		type: 'application/octet-stream'
	});
	url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
}


