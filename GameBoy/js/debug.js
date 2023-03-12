
//var symbols = [0x30, 0x33, 0x2d, 0x6f, 0x70, 0x20, 0x73, 0x70, 0x2c, 0x68, 0x6c, 0x0a, 0x0a, 0xff, 0x50, 0x61, 0x73, 0x73, 0x65, 0x64, 0x0a]

var msg = "";

function debug_update(){
	
	if(mem_registers[0x02]==0x81){
		msg += String.fromCharCode(mem_registers[0x01]);
		mem_registers[0x02] = 0x0;
	}
	
}

function debug_print(){
	
	if(bus_adrW!=0){
		console.log("Data LSB=(0x"+bus_get(bus_adrW).toString(16)+") MSB=(0x"+bus_get(bus_adrW+1).toString(16)+") written at 0x"+(bus_adrW.toString(16))+".");
		bus_adrW = 0;
	}
	if(msg!=""){
		console.log("DEBUG: "+msg);
	}
	
}
