
const instruction_data = [
	
];
/*
const instruction_cycle = [
	4, 3, 2, 2, 1, 1, 2, 1, 5, 2, 2, 2, 1, 1, 2, 1,
	1, 3, 2, 2, 1, 1, 2, 1, 3, 2, 2, 2, 1, 1, 2, 1,
	3, 3, 2, 2, 1, 1, 2, 1, 1, 3, 2, 2, 1, 1, 1, 1,
	3, 3, 2, 2, 3, 3, 3, 1, 3, 3, 2, 2, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
*/
const instruction_set = [
	/**
		0x00: NOP
	*/
	function(){
		
	},
	
	/**
		0x01: LD BC, d16
	*/
	function(){
		regs16[REG16_BC] = cpu_fetch16();
	},
	
	/**
		0x02: LD (BC), A
	*/
	function(){
		cpu_setMem8(regs16[REG16_BC], regs8[REG8_A]);
	},
	
	/**
		0x03: INC BC
	*/
	function(){
		regs16[REG16_BC] = alu_inc16(regs16[REG16_BC]);
	},
	
	/**
		0x04: INC B
	*/
	function(){
		regs8[REG8_B] = alu_inc8(regs8[REG8_B]);
	},
	
	/**
		0x05: DEC B
	*/
	function(){
		regs8[REG8_B] = alu_dec8(regs8[REG8_B]);
	},
	
	/**
		0x06: LD B, d8
	*/
	function(){
		regs8[REG8_B] = cpu_fetch8();
	},
	
	/**
		0x07: RLCA
	*/
	function(){
		regs8[REG8_A] = alu_rlc8(regs8[REG8_A]);
		cpu_setFlagZ(0);
	},
	
	/**
		0x08: LD (a16), SP
	*/
	function(){
		cpu_setMem16(cpu_fetch16(), regs16[REG16_SP]);
	},
	
	/**
		0x09: ADD HL, BC
	*/
	function(){
		regs16[REG16_HL] = alu_add16(regs16[REG16_HL], regs16[REG16_BC]);
	},
	
	/**
		0x0A: LD A, (BC)
	*/
	function(){
		regs8[REG8_A] = cpu_getMem8(regs16[REG16_BC]);
	},
	
	/**
		0x0B: DEC BC
	*/
	function(){
		regs16[REG16_BC] = alu_dec16(regs16[REG16_BC]);
	},
	
	/**
		0x0C: INC C
	*/
	function(){
		regs8[REG8_C] = alu_inc8(regs8[REG8_C]);
	},
	
	/**
		0x0D: DEC C
	*/
	function(){
		regs8[REG8_C] = alu_dec8(regs8[REG8_C]);
	},
	
	/**
		0x0E: LD C, d8
	*/
	function(){
		regs8[REG8_C] = cpu_fetch8();
	},
	
	/**
		0x0F: RRCA
	*/
	function(){
		regs8[REG8_A] = alu_rrc8(regs8[REG8_A]);
		cpu_setFlagZ(0);
	},
	
	/**
		0x10: STOP
	*/
	function(){
		cpu_fetch8();
		cpu_stopped = true;
		console.log("!!!STOPPED!!!");
		//not_implemented("cpu pause");
	},
	
	/**
		0x11: LD DE, d16
	*/
	function(){
		regs16[REG16_DE] = cpu_fetch16();
	},
	
	/**
		0x12: LD (DE), A
	*/
	function(){
		cpu_setMem8(regs16[REG16_DE], regs8[REG8_A]);
	},
	
	/**
		0x13: INC DE
	*/
	function(){
		regs16[REG16_DE] = alu_inc16(regs16[REG16_DE]);
	},
	
	/**
		0x14: INC D
	*/
	function(){
		regs8[REG8_D] = alu_inc8(regs8[REG8_D]);
	},
	
	/**
		0x15: DEC D
	*/
	function(){
		regs8[REG8_D] = alu_dec8(regs8[REG8_D]);
	},
	
	/**
		0x16: LD D, d8
	*/
	function(){
		regs8[REG8_D] = cpu_fetch8();
	},
	
	/**
		0x17: RLA
	*/
	function(){
		regs8[REG8_A] = alu_rl8(regs8[REG8_A]);
		cpu_setFlagZ(0);
	},
	
	/**
		0x18: JR r8
	*/
	function(){
		cpu_jumpRelative(alu_s8(cpu_fetch8()));
	},
	
	/**
		0x19: ADD HL, DE
	*/
	function(){
		regs16[REG16_HL] = alu_add16(regs16[REG16_HL], regs16[REG16_DE]);
	},
	
	/**
		0x1A: LD A, (DE)
	*/
	function(){
		regs8[REG8_A] = cpu_getMem8(regs16[REG16_DE]);
	},
	
	/**
		0x1B: DEC DE
	*/
	function(){
		regs16[REG16_DE] = alu_dec16(regs16[REG16_DE]);
	},
	
	/**
		0x1C: INC E
	*/
	function(){
		regs8[REG8_E] = alu_inc8(regs8[REG8_E]);
	},
	
	/**
		0x1D: DEC E
	*/
	function(){
		regs8[REG8_E] = alu_dec8(regs8[REG8_E]);
	},
	
	/**
		0x1E: LD E, d8
	*/
	function(){
		regs8[REG8_E] = cpu_fetch8();
	},
	
	/**
		0x1F: RRA
	*/
	function(){
		regs8[REG8_A] = alu_rr8(regs8[REG8_A]);
		cpu_setFlagZ(0);
	},
	
	/**
		0x20: JR NZ, r8
	*/
	function(){
		var offset = alu_s8(cpu_fetch8());
		if(cpu_getFlagZ()==0){
			cpu_jumpRelative(offset);
		}
	},
	
	/**
		0x21: LD HL, d16
	*/
	function(){
		regs16[REG16_HL] = cpu_fetch16();
	},
	
	/**
		0x22: LD (HL+), A
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_A]);
		regs16[REG16_HL]++;
	},
	
	/**
		0x23: INC HL
	*/
	function(){
		regs16[REG16_HL] = alu_inc16(regs16[REG16_HL]);
	},
	
	/**
		0x24: INC H
	*/
	function(){
		regs8[REG8_H] = alu_inc8(regs8[REG8_H]);
	},
	
	/**
		0x25: DEC H
	*/
	function(){
		regs8[REG8_H] = alu_dec8(regs8[REG8_H]);
	},
	
	/**
		0x26: LD H, d8
	*/
	function(){
		regs8[REG8_H] = cpu_fetch8();
	},
	
	/**
		0x27: DAA
	*/
	function(){
		regs8[REG8_A] = alu_da8(regs8[REG8_A]);
	},
	
	/**
		0x28: JR Z, r8
	*/
	function(){
		var offset = alu_s8(cpu_fetch8());
		if(cpu_getFlagZ()==1){
			cpu_jumpRelative(offset);
		}
	},
	
	/**
		0x29: ADD HL, HL
	*/
	function(){
		regs16[REG16_HL] = alu_add16(regs16[REG16_HL], regs16[REG16_HL]);
	},
	
	/**
		0x2A: LD A, (HL+)
	*/
	function(){
		regs8[REG8_A] = cpu_getMem8(regs16[REG16_HL]);
		regs16[REG16_HL]++;
	},
	
	/**
		0x2B: DEC HL
	*/
	function(){
		regs16[REG16_HL] = alu_dec16(regs16[REG16_HL]);
	},
	
	/**
		0x2C: INC L
	*/
	function(){
		regs8[REG8_L] = alu_inc8(regs8[REG8_L]);
	},
	
	/**
		0x2D: DEC L
	*/
	function(){
		regs8[REG8_L] = alu_dec8(regs8[REG8_L]);
	},
	
	/**
		0x2E: LD L, d8
	*/
	function(){
		regs8[REG8_L] = cpu_fetch8();
	},
	
	/**
		0x2F: CPL
	*/
	function(){
		var data = ~regs8[REG8_A];
		regs8[REG8_A] = data;
		cpu_setFlagN(1);
		cpu_setFlagH(1);
	},
	
	/**
		0x30: JR NC, r8
	*/
	function(){
		var offset = alu_s8(cpu_fetch8());
		if(cpu_getFlagCY()==0){
			cpu_jumpRelative(offset);
		}
	},
	
	/**
		0x31: LD SP, d16
	*/
	function(){
		regs16[REG16_SP] = cpu_fetch16();
	},
	
	/**
		0x32: LD (HL-), A
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_A]);
		regs16[REG16_HL]--;
	},
	
	/**
		0x33: INC SP
	*/
	function(){
		regs16[REG16_SP] = alu_inc16(regs16[REG16_SP]);
	},
	
	/**
		0x34: INC (HL)
	*/
	function(){
		var data = cpu_getMem8(regs16[REG16_HL]);
		data = alu_inc8(data);
		cpu_setMem8(regs16[REG16_HL], data);
	},
	
	/**
		0x35: DEC (HL)
	*/
	function(){
		var data = cpu_getMem8(regs16[REG16_HL]);
		data = alu_dec8(data);
		cpu_setMem8(regs16[REG16_HL], data);
	},
	
	/**
		0x36: LD (HL), d8
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], cpu_fetch8());
	},
	
	/**
		0x37: SCF
	*/
	function(){
		cpu_setFlagN(0);
		cpu_setFlagH(0);
		cpu_setFlagCY(1);
	},
	
	/**
		0x38: JR C, r8
	*/
	function(){
		var offset = alu_s8(cpu_fetch8());
		if(cpu_getFlagCY()==1){
			cpu_jumpRelative(offset);
		}
	},
	
	/**
		0x39: ADD HL, SP
	*/
	function(){
		regs16[REG16_HL] = alu_add16(regs16[REG16_HL], regs16[REG16_SP]);
	},
	
	/**
		0x3A: LD A, (HL-)
	*/
	function(){
		regs8[REG8_A] = cpu_getMem8(regs16[REG16_HL]);
		regs16[REG16_HL]--;
	},
	
	/**
		0x3B: DEC SP
	*/
	function(){
		regs16[REG16_SP] = alu_dec16(regs16[REG16_SP]);
	},
	
	/**
		0x3C: INC A
	*/
	function(){
		regs8[REG8_A] = alu_inc8(regs8[REG8_A]);
	},
	
	/**
		0x3D: DEC A
	*/
	function(){
		regs8[REG8_A] = alu_dec8(regs8[REG8_A]);
	},
	
	/**
		0x3E: LD A, d8
	*/
	function(){
		regs8[REG8_A] = cpu_fetch8();
	},
	
	/**
		0x3F: CCF
	*/
	function(){
		cpu_setFlagN(0);
		cpu_setFlagH(0);
		cpu_setFlagCY(cpu_getFlagCY()^1);
	},
	
	/**
		0x40: LD B, B
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_B];
	},
	
	/**
		0x41: LD B, C
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_C];
	},
	
	/**
		0x42: LD B, D
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_D];
	},
	
	/**
		0x43: LD B, E
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_E];
	},
	
	/**
		0x44: LD B, H
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_H];
	},
	
	/**
		0x45: LD B, L
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_L];
	},
	
	/**
		0x46: LD B, (HL)
	*/
	function(){
		regs8[REG8_B] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x47: LD B, A
	*/
	function(){
		regs8[REG8_B] = regs8[REG8_A];
	},
	
	/**
		0x48: LD C, B
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_B];
	},
	
	/**
		0x49: LD C, C
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_C];
	},
	
	/**
		0x4A: LD C, D
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_D];
	},
	
	/**
		0x4B: LD C, E
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_E];
	},
	
	/**
		0x4C: LD C, H
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_H];
	},
	
	/**
		0x4D: LD C, L
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_L];
	},
	
	/**
		0x4E: LD C, (HL)
	*/
	function(){
		regs8[REG8_C] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x4F: LD C, A
	*/
	function(){
		regs8[REG8_C] = regs8[REG8_A];
	},
	
	/**
		0x50: LD D, B
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_B];
	},
	
	/**
		0x51: LD D, C
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_C];
	},
	
	/**
		0x52: LD D, D
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_D];
	},
	
	/**
		0x53: LD D, E
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_E];
	},
	
	/**
		0x54: LD D, H
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_H];
	},
	
	/**
		0x55: LD D, L
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_L];
	},
	
	/**
		0x56: LD D, (HL)
	*/
	function(){
		regs8[REG8_D] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x57: LD D, A
	*/
	function(){
		regs8[REG8_D] = regs8[REG8_A];
	},
	
	/**
		0x58: LD E, B
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_B];
	},
	
	/**
		0x59: LD E, C
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_C];
	},
	
	/**
		0x5A: LD E, D
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_D];
	},
	
	/**
		0x5B: LD E, E
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_E];
	},
	
	/**
		0x5C: LD E, H
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_H];
	},
	
	/**
		0x5D: LD E, L
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_L];
	},
	
	/**
		0x5E: LD E, (HL)
	*/
	function(){
		regs8[REG8_E] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x5F: LD E, A
	*/
	function(){
		regs8[REG8_E] = regs8[REG8_A];
	},
	
	/**
		0x60: LD H, B
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_B];
	},
	
	/**
		0x61: LD H, C
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_C];
	},
	
	/**
		0x62: LD H, D
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_D];
	},
	
	/**
		0x63: LD H, E
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_E];
	},
	
	/**
		0x64: LD H, H
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_H];
	},
	
	/**
		0x65: LD H, L
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_L];
	},
	
	/**
		0x66: LD H, (HL)
	*/
	function(){
		regs8[REG8_H] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x67: LD H, A
	*/
	function(){
		regs8[REG8_H] = regs8[REG8_A];
	},
	
	/**
		0x68: LD L, B
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_B];
	},
	
	/**
		0x69: LD L, C
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_C];
	},
	
	/**
		0x6A: LD L, D
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_D];
	},
	
	/**
		0x6B: LD L, E
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_E];
	},
	
	/**
		0x6C: LD L, H
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_H];
	},
	
	/**
		0x6D: LD L, L
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_L];
	},
	
	/**
		0x6E: LD L, (HL)
	*/
	function(){
		regs8[REG8_L] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x6F: LD L, A
	*/
	function(){
		regs8[REG8_L] = regs8[REG8_A];
	},
	
	/**
		0x70: LD (HL), B
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_B]);
	},
	
	/**
		0x71: LD (HL), C
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_C]);
	},
	
	/**
		0x72: LD (HL), D
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_D]);
	},
	
	/**
		0x73: LD (HL), E
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_E]);
	},
	
	/**
		0x74: LD (HL), H
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_H]);
	},
	
	/**
		0x75: LD (HL), L
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_L]);
	},
	
	/**
		0x76: HALT
	*/
	function(){
		cpu_halted = true;
		/*console.log("!!!HALTED!!!");*/
	},
	
	/**
		0x77: LD (HL), A
	*/
	function(){
		cpu_setMem8(regs16[REG16_HL], regs8[REG8_A]);
	},
	
	/**
		0x78: LD A, B
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_B];
	},
	
	/**
		0x79: LD A, C
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_C];
	},
	
	/**
		0x7A: LD A, D
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_D];
	},
	
	/**
		0x7B: LD A, E
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_E];
	},
	
	/**
		0x7C: LD A, H
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_H];
	},
	
	/**
		0x7D: LD A, L
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_L];
	},
	
	/**
		0x7E: LD A, (HL)
	*/
	function(){
		regs8[REG8_A] = cpu_getMem8(regs16[REG16_HL]);
	},
	
	/**
		0x7F: LD A, A
	*/
	function(){
		regs8[REG8_A] = regs8[REG8_A];
	},
	
	/**
		0x80: ADD A, B
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0x81: ADD A, C
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0x82: ADD A, D
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0x83: ADD A, E
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0x84: ADD A, H
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0x85: ADD A, L
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0x86: ADD A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0x87: ADD A, A
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0x88: ADC A, B
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0x89: ADC A, C
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0x8A: ADC A, D
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0x8B: ADC A, E
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0x8C: ADC A, H
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0x8D: ADC A, L
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0x8E: ADC A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0x8F: ADC A, A
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0x90: SUB A, B
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0x91: SUB A, C
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0x92: SUB A, D
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0x93: SUB A, E
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0x94: SUB A, H
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0x95: SUB A, L
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0x96: SUB A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0x97: SUB A, A
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0x98: SBC A, B
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0x99: SBC A, C
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0x9A: SBC A, D
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0x9B: SBC A, E
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0x9C: SBC A, H
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0x9D: SBC A, L
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0x9E: SBC A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0x9F: SBC A, A
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0xA0: AND A, B
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0xA1: AND A, C
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0xA2: AND A, D
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0xA3: AND A, E
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0xA4: AND A, H
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0xA5: AND A, L
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0xA6: AND A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0xA7: AND A, A
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0xA8: XOR A, B
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0xA9: XOR A, C
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0xAA: XOR A, D
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0xAB: XOR A, E
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0xAC: XOR A, H
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0xAD: XOR A, L
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0xAE: XOR A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0xAF: XOR A, A
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0xB0: OR A, B
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0xB1: OR A, C
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0xB2: OR A, D
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0xB3: OR A, E
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0xB4: OR A, H
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0xB5: OR A, L
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0xB6: OR A, (HL)
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0xB7: OR A, A
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0xB8: CP A, B
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_B]);
	},
	
	/**
		0xB9: CP A, C
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_C]);
	},
	
	/**
		0xBA: CP A, D
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_D]);
	},
	
	/**
		0xBB: CP A, E
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_E]);
	},
	
	/**
		0xBC: CP A, H
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_H]);
	},
	
	/**
		0xBD: CP A, L
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_L]);
	},
	
	/**
		0xBE: CP A, (HL)
	*/
	function(){
		alu_cp8(regs8[REG8_A], cpu_getMem8(regs16[REG16_HL]));
	},
	
	/**
		0xBF: CP A, A
	*/
	function(){
		alu_cp8(regs8[REG8_A], regs8[REG8_A]);
	},
	
	/**
		0xC0: RET NZ
	*/
	function(){
		if(cpu_getFlagZ()==0){
			var address = cpu_pop16();
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xC1: POP BC
	*/
	function(){
		regs16[REG16_BC] = cpu_pop16();
	},
	
	/**
		0xC2: JP NZ, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagZ()==0){
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xC3: JP a16
	*/
	function(){
		var address = cpu_fetch16();
		cpu_jumpAbsolute(address);
	},
	
	/**
		0xC4: CALL NZ, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagZ()==0){
			cpu_push16(regs16[REG16_PC]);
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xC5: PUSH BC
	*/
	function(){
		cpu_push16(regs16[REG16_BC]);
	},
	
	/**
		0xC6: ADD A, d8
	*/
	function(){
		regs8[REG8_A] = alu_add8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xC7: RST 00H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x00);
	},
	
	/**
		0xC8: RET Z
	*/
	function(){
		if(cpu_getFlagZ()==1){
			var address = cpu_pop16();
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xC9: RET
	*/
	function(){
		var address = cpu_pop16();
		cpu_jumpAbsolute(address);
	},
	
	/**
		0xCA: JP Z, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagZ()==1){
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xCB: PREFIX
	*/
	function(){
		/**/cpu_cycles++;
		var prefixed = cpu_fetch8();
		prefixed_set[prefixed>>3](prefixed&0b111);
	},
	
	/**
		0xCC: CALL Z, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagZ()==1){
			cpu_push16(regs16[REG16_PC]);
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xCD: CALL a16
	*/
	function(){
		var address = cpu_fetch16();
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(address);
	},
	
	/**
		0xCE: ADC A, d8
	*/
	function(){
		regs8[REG8_A] = alu_adc8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xCF: RST 08H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x08);
	},
	
	/**
		0xD0: RET NC
	*/
	function(){
		if(cpu_getFlagCY()==0){
			var address = cpu_pop16();
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xD1: POP DE
	*/
	function(){
		regs16[REG16_DE] = cpu_pop16();
	},
	
	/**
		0xD2: JP NC, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagCY()==0){
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xD3:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xD4: CALL NC, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagCY()==0){
			cpu_push16(regs16[REG16_PC]);
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xD5: PUSH DE
	*/
	function(){
		cpu_push16(regs16[REG16_DE]);
	},
	
	/**
		0xD6: SUB d8
	*/
	function(){
		regs8[REG8_A] = alu_sub8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xD7: RST 10H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x10);
	},
	
	/**
		0xD8: RET C
	*/
	function(){
		if(cpu_getFlagCY()==1){
			var address = cpu_pop16();
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xD9: RETI
	*/
	function(){
		cpu_reti();
	},
	
	/**
		0xDA: JP C, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagCY()==1){
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xDB:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xDC: CALL C, a16
	*/
	function(){
		var address = cpu_fetch16();
		if(cpu_getFlagCY()==1){
			cpu_push16(regs16[REG16_PC]);
			cpu_jumpAbsolute(address);
		}
	},
	
	/**
		0xDD:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xDE: SBC A, d8
	*/
	function(){
		regs8[REG8_A] = alu_sbc8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xDF: RST 18H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x18);
	},
	
	/**
		0xE0: LDH (a8), A
	*/
	function(){
		var address = 0xff00+cpu_fetch8();
		cpu_setMem8(address, regs8[REG8_A]);
	},
	
	/**
		0xE1: POP HL
	*/
	function(){
		regs16[REG16_HL] = cpu_pop16();
	},
	
	/**
		0xE2: LD (C), A
	*/
	function(){
		var address = 0xff00+regs8[REG8_C];
		cpu_setMem8(address, regs8[REG8_A]);
	},
	
	/**
		0xE3:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xE4:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xE5: PUSH HL
	*/
	function(){
		cpu_push16(regs16[REG16_HL]);
	},
	
	/**
		0xE6: AND d8
	*/
	function(){
		regs8[REG8_A] = alu_and8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xE7: RST 20H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x20);
	},
	
	/**
		0xE8: ADD SP, r8
	*/
	function(){
		cpu_cycles += 2;
		var old_data = regs16[REG16_SP];
		var adder = alu_s8(cpu_fetch8());
		regs16[REG16_SP] = regs16[REG16_SP]+adder;
		cpu_setFlagZ(0);
		cpu_setFlagN(0);
		cpu_setFlagH(((old_data&0xf)+(adder&0xf))>0xf);
		cpu_setFlagCY(((old_data&0xff)+(adder&0xff))>0xff);
	},
	
	/**
		0xE9: JP HL
	*/
	function(){
		var address = regs16[REG16_HL];
		cpu_jumpAbsolute(address);
	},
	
	/**
		0xEA: LD (a16), A
	*/
	function(){
		var address = cpu_fetch16();
		cpu_setMem8(address, regs8[REG8_A]);
	},
	
	/**
		0xEB:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xEC:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xED:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xEE: XOR d8
	*/
	function(){
		regs8[REG8_A] = alu_xor8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xEF: RST 28H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x28);
	},
	
	/**
		0xF0: LDH A, (a8)
	*/
	function(){
		var address = 0xff00+cpu_fetch8();
		regs8[REG8_A] = cpu_getMem8(address);
	},
	
	/**
		0xF1: POP AF
	*/
	function(){
		regs16[REG16_AF] = cpu_pop16()&0xfff0;
	},
	
	/**
		0xF2: LD A, (C)
	*/
	function(){
		var address = 0xff00+regs8[REG8_C];
		regs8[REG8_A] = cpu_getMem8(address);
	},
	
	/**
		0xF3: DI
	*/
	function(){
		cpu_ime = false;
	},
	
	/**
		0xF4:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xF5: PUSH AF
	*/
	function(){
		cpu_push16(regs16[REG16_AF]);
	},
	
	/**
		0xF6: OR d8
	*/
	function(){
		regs8[REG8_A] = alu_or8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xF7: RST 30H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x30);
	},
	
	/**
		0xF8: LD HL, SP + r8
	*/
	function(){
		cpu_cycles++;
		var data = regs16[REG16_SP];
		var adder = alu_s8(cpu_fetch8());
		regs16[REG16_HL] = data+adder;
		cpu_setFlagZ(0);
		cpu_setFlagN(0);
		cpu_setFlagH(((data&0xf)+(adder&0xf))>0xf);
		cpu_setFlagCY(((data&0xff)+(adder&0xff))>0xff);
	},
	
	/**
		0xF9: LD SP, HL
	*/
	function(){
		regs16[REG16_SP] = regs16[REG16_HL];
	},
	
	/**
		0xFA: LD A, (a16)
	*/
	function(){
		var address = cpu_fetch16();
		regs8[REG8_A] = cpu_getMem8(address);
	},
	
	/**
		0xFB: EI
	*/
	function(){
		cpu_ime_enabling = true;
	},
	
	/**
		0xFC:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xFD:
	*/
	function(){
		/* [No Instruction] */
	},
	
	/**
		0xFE: CP d8
	*/
	function(){
		alu_cp8(regs8[REG8_A], cpu_fetch8());
	},
	
	/**
		0xFF: RST 38H
	*/
	function(){
		cpu_push16(regs16[REG16_PC]);
		cpu_jumpAbsolute(0x38);
	},
];
