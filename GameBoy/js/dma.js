
/**
	OAM DMA FUNCTIONS
*/

/* 160 cycles */
function dma_execute(address){
	
	/*console.log("DMA Requested from address 0x"+address.toString(16));*/
	
	var src = address;
	var srcE = address+0xa0; /* and of source copying */
	var dest = 0x00;
	
	for(;src<srcE; src++, dest++){
		var data = bus_get(src);
		mem_oam[dest] = data;
	}
	
}
