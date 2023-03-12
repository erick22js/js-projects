
function sys_loadCart(buffer){
	mem_rom_cart = new Uint8Array(buffer);
}

function sys_start(){
	
	/* Init Cpu State */
	
	regs16[REG16_PC] = 0x100;
	
	regs16[REG16_SP] = 0xfffe;
	regs16[REG16_AF] = 0x1180;
	regs16[REG16_BC] = 0x0000;
	regs16[REG16_DE] = 0xff56;
	regs16[REG16_HL] = 0x000d;
	
	cpu_ime = false;
	mem_registers[REGC_IE] = 0x0;
	mem_registers[REGC_IF] = 0x0;
	
	
	/* Init Special Registers */
	
	mem_registers[REGC_LCDC] = 0x91;
	mem_registers[REGC_SCY] = 0x00;
	mem_registers[REGC_SCX] = 0x00;
	mem_registers[REGC_LY] = 0x00;
	mem_registers[REGC_LYC] = 0x00;
	mem_registers[REGC_BGP] = 0xFC;
	mem_registers[REGC_OBP0] = 0xFF;
	mem_registers[REGC_OBP1] = 0xFF;
	mem_registers[REGC_WY] = 0x00;
	mem_registers[REGC_WX] = 0x00;
	
}
