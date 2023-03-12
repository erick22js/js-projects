
/**
	REGISTERS
*/

var regs8 = new Uint8Array(12);
var regs16 = new Uint16Array(regs8.buffer);

/* Names */
var _LITTLEENDIAN = true;

/* 8-bit */
const REG8_A = 0^_LITTLEENDIAN; const REG8_F = 1^_LITTLEENDIAN;
const REG8_B = 2^_LITTLEENDIAN; const REG8_C = 3^_LITTLEENDIAN;
const REG8_D = 4^_LITTLEENDIAN; const REG8_E = 5^_LITTLEENDIAN;
const REG8_H = 6^_LITTLEENDIAN; const REG8_L = 7^_LITTLEENDIAN;

/* 16-bit */
const REG16_AF = 0;
const REG16_BC = 1;
const REG16_DE = 2;
const REG16_HL = 3;
const REG16_SP = 4;
const REG16_PC = 5;


/**
	CONTROL VARIABLES
*/

var cpu_cycles = 0;
var cpu_running = false;
var cpu_halted = false;
var cpu_stopped = false;

var cpu_ime = false;
var cpu_ime_enabling = false;


/**
	CPU MEMORY ACCESS
*/

function cpu_getMem8(addr){
	cpu_cycles++;
	var data = bus_get(addr);
	return data;
}

function cpu_getMem16(addr){
	cpu_cycles += 2;
	var data = bus_get(addr)|(bus_get(addr+1)<<8);
	return data;
}

function cpu_setMem8(addr, data){
	cpu_cycles++;
	bus_set(addr, data);
}

function cpu_setMem16(addr, data){
	cpu_cycles += 2;
	bus_set(addr, data);
	bus_set(addr+1, data>>8);
}


/**
	CPU STACK ACCESS
*/

function cpu_pop8(){
	cpu_cycles++;
	var adr = regs16[REG16_SP];
	var data = bus_get(regs16[REG16_SP]);
	regs16[REG16_SP]++;
	return data;
}

function cpu_pop16(){
	cpu_cycles += 2;
	var adr = regs16[REG16_SP];
	var data = bus_get(regs16[REG16_SP]);
	regs16[REG16_SP]++;
	data |= bus_get(regs16[REG16_SP])<<8;
	regs16[REG16_SP]++;
	return data;
}

function cpu_push8(data){
	cpu_cycles++;
	regs16[REG16_SP]--;
	bus_set(regs16[REG16_SP], data);
	var adr = regs16[REG16_SP];
}

function cpu_push16(data){
	cpu_cycles += 2;
	regs16[REG16_SP]--;
	bus_set(regs16[REG16_SP], data>>8);
	regs16[REG16_SP]--;
	bus_set(regs16[REG16_SP], data);
	var adr = regs16[REG16_SP];
}


/**
	CPU PROGRAM ACCESS
*/

function cpu_fetch8(){
	cpu_cycles++;
	//if(regs16[REG16_PC]>)
	var data = bus_get(regs16[REG16_PC]);
	regs16[REG16_PC]++;
	return data;
}

function cpu_fetch16(){
	cpu_cycles += 2;
	var data = bus_get(regs16[REG16_PC]);
	regs16[REG16_PC]++;
	data |= bus_get(regs16[REG16_PC])<<8;
	regs16[REG16_PC]++;
	return data;
}

function cpu_getOperand(opr){
	if(opr<6){
		return regs8[2+(opr^_LITTLEENDIAN)];
	}
	else if(opr==6){
		return cpu_getMem8(regs16[REG16_HL]);
	}
	else{
		return regs8[REG8_A];
	}
}

function cpu_setOperand(opr, data){
	if(opr<6){
		regs8[2+(opr^_LITTLEENDIAN)] = data;
	}
	else if(opr==6){
		cpu_setMem8(regs16[REG16_HL], data);
	}
	else{
		regs8[REG8_A] = data;
	}
}


/**
	CPU FLAGS
*/

function cpu_updFlagZ(data){
	regs8[REG8_F] &= 0b01110000;
	regs8[REG8_F] |= ((data&0xff)==0)<<7;
}

function cpu_updFlagN(data){
	regs8[REG8_F] &= 0b10110000;
	regs8[REG8_F] |= (data!=0)<<6;
}

function cpu_setFlagZ(flag){
	regs8[REG8_F] &= 0b01110000;
	regs8[REG8_F] |= flag<<7;
}

function cpu_setFlagN(flag){
	regs8[REG8_F] &= 0b10110000;
	regs8[REG8_F] |= flag<<6;
}

function cpu_setFlagH(flag){
	regs8[REG8_F] &= 0b11010000;
	regs8[REG8_F] |= flag<<5;
}

function cpu_setFlagCY(flag){
	regs8[REG8_F] &= 0b11100000;
	regs8[REG8_F] |= flag<<4;
}

function cpu_getFlagZ(){
	return (regs8[REG8_F]>>7)&1;
}

function cpu_getFlagN(){
	return (regs8[REG8_F]>>6)&1;
}

function cpu_getFlagH(){
	return (regs8[REG8_F]>>5)&1;
}

function cpu_getFlagCY(){
	return (regs8[REG8_F]>>4)&1;
}

function cpu_clearFlags(){
	regs8[REG8_F] = 0;
}


/**
	CPU INTERRUPTION
*/

function cpu_interrupt(adr){
	cpu_push16(regs16[REG16_PC]);
	regs16[REG16_PC] = adr;
	cpu_halted = false;
	cpu_ime = false;
	cpu_cycles += 5;
}

function cpu_reti(){
	var address = cpu_pop16();
	cpu_jumpAbsolute(address);
	cpu_ime = true;
}


/**
	CPU EXECUTION
*/

function cpu_jumpAbsolute(address){
	regs16[REG16_PC] = address;
}

function cpu_jumpRelative(offset){
	regs16[REG16_PC] += offset;
}

function cpu_state2str(){
	return "[CPU STATE]\n\n"+
		"Registers:\n"+
		"A: 0x"+(regs8[REG8_A]<=0xf?"0":"")+regs8[REG8_A].toString(16)+";\n"+
		"B: 0x"+(regs8[REG8_B]<=0xf?"0":"")+regs8[REG8_B].toString(16)+";    C: 0x"+(regs8[REG8_C]<=0xf?"0":"")+regs8[REG8_C].toString(16)+";\n"+
		"D: 0x"+(regs8[REG8_D]<=0xf?"0":"")+regs8[REG8_D].toString(16)+";    E: 0x"+(regs8[REG8_E]<=0xf?"0":"")+regs8[REG8_E].toString(16)+";\n"+
		"H: 0x"+(regs8[REG8_H]<=0xf?"0":"")+regs8[REG8_H].toString(16)+";    L: 0x"+(regs8[REG8_L]<=0xf?"0":"")+regs8[REG8_L].toString(16)+";\n"+
		"SP: 0x"+(regs16[REG16_SP]<=0xf?"000":regs16[REG16_SP]<=0xff?"00":regs16[REG16_SP]<=0xfff?"0":"")+regs16[REG16_SP].toString(16)+";\n"+
		"PC: 0x"+(regs16[REG16_PC]<=0xf?"000":regs16[REG16_PC]<=0xff?"00":regs16[REG16_PC]<=0xfff?"0":"")+regs16[REG16_PC].toString(16)+";\n\n"+
		"Flags:\n"+
		"Z: "+cpu_getFlagZ()+";    N: "+cpu_getFlagN()+";    H: "+cpu_getFlagH()+";    CY: "+cpu_getFlagCY();
}

function cpu_trace(address, opcode){
	// TODO: Opcode tracing
	var table;
	var hadr = address;
	if(opcode==0xCB){
		hadr++;
		opcode = cpu_getMem8(hadr);
		table = OPCODES["cbprefixed"];
	}
	else{
		table = OPCODES["unprefixed"];
	}
	var opc = Object.entries(table)[opcode][1];
	
	var encoded = opc.mnemonic+" ";
	for(var ai=0; ai<opc.operands.length;){
		if(opc.operands[ai].name=="r8"){
			hadr++;
			var data = cpu_getMem8(hadr);
			encoded += "0x"+data.toString(16)+"[r8]";
		}
		else if(opc.operands[ai].name=="r16"){
			hadr++;
			var data = cpu_getMem16(hadr);
			encoded += "0x"+data.toString(16)+"[r16]";
		}
		else if(opc.operands[ai].name=="d8"){
			hadr++;
			var data = cpu_getMem8(hadr);
			encoded += "0x"+data.toString(16)+"[d8]";
		}
		else if(opc.operands[ai].name=="d16"){
			hadr++;
			var data = cpu_getMem16(hadr);
			encoded += "0x"+data.toString(16)+"[d16]";
		}
		else if(opc.operands[ai].name=="a8"){
			hadr++;
			var data = cpu_getMem8(hadr);
			encoded += "0x"+data.toString(16)+"[a8]";
		}
		else if(opc.operands[ai].name=="a16"){
			hadr++;
			var data = cpu_getMem16(hadr);
			encoded += "0x"+data.toString(16)+"[a16]";
		}
		else{
			encoded += opc.operands[ai].name;
		}
		ai++;
		if(ai!=opc.operands.length){
			encoded += ", ";
		}
	}
	
	console.log(
		"\x01\n\n0x"+(address<=0xf?"000":address<=0xff?"00":address<=0xfff?"0":"")+address.toString(16)+
		": 0x"+(opcode<=0xf?"0":"")+opcode.toString(16)+
		"::"+encoded+"\n\n\x01"
		);
	
	stdout.textContent = cpu_state2str();
	
}

function cpu_step(){
	if(cpu_halted){
		console.log("Is Halted, cannot execute!");
		return;
	}
	
	var address = regs16[REG16_PC];
	var opcode = cpu_fetch8();
	
	instruction_set[opcode]();
	
	cpu_trace(address, opcode);
	console.log(cpu_state2str());
	debug_update();
	debug_print();
	
	//cpu_cycles += instruction_cycle[opcode];
}

function cpu_run(){
	if(cpu_halted){
		return;
	}
	
	var opcode = cpu_fetch8();
	
	instruction_set[opcode]();
	debug_update();
	
	//cpu_cycles += instruction_cycle[opcode];
}
