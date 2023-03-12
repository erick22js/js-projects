/*
var memory = new Uint8Array(
	[
		0x0F,
		0x01, 0x25, 0x10,
		0x00,
		0x00,
		0x00,
		0x00,
	]
);
*/

var mem_rom_cart;
var mem_wram = new Uint8Array(1024*32); // 32 KB
var mem_hram = new Uint8Array(1024*16); // 16 KB
var mem_vram = new Uint8Array(1024*16); // 16 KB
var mem_oam = new Uint8Array(160); //160 B
var mem_registers = new Uint8Array(256); // 128 B


var bus_adrW = 0;
var bus_adrR = 0;

function bus_get(addr){
	
	bus_adrR = addr;
	
	/* ROM Bank 0 */ /* 0x0000 => 0x3fff */
	if(addr<0x4000){
		return mem_rom_cart[addr];
	}
	/* external ROM Bank (switchable) */ /* 0x4000 => 0x7FFF */
	else if(addr<0x8000){
		return mem_rom_cart[addr]; /* TODO */
	}
	/* Video RAM */ /* 0x8000 => 0x9fff */
	else if(addr<0xA000){
		return mem_vram[addr-0x8000];
	}
	/* external RAM Bank (switchable) */ /* 0xA000 => 0xBFFF */
	else if(addr<0xC000){
		return 0; /* TODO */
		not_implemented("Access to address 0x"+addr.toString(16));
	}
	/* working RAM Fixed Bank 0 */ /* 0xC000 => 0xCFFF */
	else if(addr<0xD000){
		return mem_wram[addr-0xC000];
	}
	/* working RAM Switchable */ /* 0xD000 => 0xDFFF */
	else if(addr<0xE000){
		// var bank = (mem_registers[REGC_SVBK]&0b111)||1;
		// return mem_wram[(addr-0xD000)+(bank<<12)];
		return mem_wram[addr-0xC000];
	}
	/* 0xE000 => 0xFFFF */
	else{
		/* Interrupt Enable Register */ /* 0xFFFF */
		if(addr==0xFFFF){
			return mem_registers[REGC_IE];
		}
		/* Working & Stack RAM */ /* 0xFF80 => 0xFFFE */
		else if(addr>=0xFF80){
			return mem_hram[addr-0xFF80];
		}
		/* Ports/Mode Registers, Control Registers, Sound Registers */ /* 0xFF00 => 0xFF7F */
		else if(addr>=0xFF00){
			var reg = addr-0xFF00;
			return control_reg_in(reg);
		}
		/* Sprite Attrib Memory */ /* 0xFE00 => 0xFE9F */
		else if((addr>=0xFE00)&&(addr<0xFEA0)){
			return mem_oam[addr-0xFE00];
		}
	}
	
	return 0;
}

function bus_set(addr, data){
	
	bus_adrW = addr;
	
	/* ROM Bank 0 */ /* 0x0000 => 0x3fff */
	if(addr<0x4000){
		/* READ-ONLY */
	}
	/* external ROM Bank (switchable) */ /* 0x4000 => 0x7FFF */
	else if(addr<0x8000){
		/* READ-ONLY */
	}
	/* Video RAM */ /* 0x8000 => 0x9fff */
	else if(addr<0xA000){
		mem_vram[addr-0x8000] = data;
	}
	/* external RAM Bank (switchable) */ /* 0xA000 => 0xBFFF */
	else if(addr<0xC000){
		not_implemented("Access to address 0x"+addr.toString(16));
		/* TODO */
	}
	/* working RAM Fixed Bank 0 */ /* 0xC000 => 0xCFFF */
	else if(addr<0xD000){
		mem_wram[addr-0xC000] = data;
	}
	/* working RAM Switchable */ /* 0xD000 => 0xDFFF */
	else if(addr<0xE000){
		// var bank = (mem_registers[REGC_SVBK]&0b111)||1;
		// mem_wram[(addr-0xD000)+(bank<<12)] = data;
		mem_wram[addr-0xC000] = data;
	}
	/* 0xE000 => 0xFFFF */
	else{
		/* Interrupt Enable Register */ /* 0xFFFF */
		if(addr==0xFFFF){
			mem_registers[REGC_IE] = data;
		}
		/* Working & Stack RAM */ /* 0xFF80 => 0xFFFE */
		else if(addr>=0xFF80){
			mem_hram[addr-0xFF80] = data;
		}
		/* Ports/Mode Registers, Control Registers, Sound Registers */ /* 0xFF00 => 0xFF7F */
		else if(addr>=0xFF00){
			var reg = addr-0xFF00;
			control_reg_out(reg, data);
		}
		/* Sprite Attrib Memory */ /* 0xFE00 => 0xFE9F */
		else if((addr>=0xFE00)&&(addr<0xFEA0)){
			mem_oam[addr-0xFE00] = data;
		}
	}
}
