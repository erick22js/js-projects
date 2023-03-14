
/* Quick Reference
	values threads:
	  8bits -> registers
	  16bits-> literal numbers for operations
	  32bits-> address numbers in memory
*/

function AssertyMachine(memsize, memmapper){
	var self = this;
	this.memory = new Memory(memsize, memmapper||{
		"main":{
			offset:0,
			size:memsize
		}
	});
	this.cpu = new Cpu(this.memory);
}

function Cpu(mem){
	var self = this;
	var regs16 = new Uint16Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
	var regs32 = new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
	var memory = mem;
	var rom = new Uint8Array([]);
	var dbg = [];
	
	this.loadRom = function(romData){
		rom = romData;
	}
	this.reset = function(startAddress){
		for(var i=0; i<regs16.length; i++){
			regs16[i] = regs32[i] = 0;
		}
		regs16[Regs.stp] = regs32[Regs.stp] = memory.map[2].size-2;
		regs16[Regs.fmp] = regs32[Regs.fmp] = memory.map[1].size-6;
		memory.reset();
		jumpTo(startAddress||0x0);
	}
	this.stop = function(){} //Useless for now
	this.debug = function(){
		//for(var i in dbg)
		//	output.value += "0x"+dbg[i]+"  ";
		output.value += "\nstp 0x"+(regs32[Regs.stp]).toString(16);
		output.value += "\ninp 0x"+(regs32[Regs.inp]).toString(16);
		output.value += "\nacu 0x"+(regs32[Regs.acu]).toString(16);
		output.value += "\nfmp 0x"+(regs32[Regs.fmp]).toString(16);
		output.value += "\nmbp 0x"+(regs32[Regs.mbp]).toString(16);
		output.value += "\nr1 0x"+(regs32[Regs.r1]).toString(16);
		output.value += "\nr2 0x"+(regs32[Regs.r2]).toString(16);
		output.value += "\nr3 0x"+(regs32[Regs.r3]).toString(16);
		output.value += "\nr4 0x"+(regs32[Regs.r4]).toString(16);
		output.value += "\nr5 0x"+(regs32[Regs.r5]).toString(16);
		output.value += "\nr6 0x"+(regs32[Regs.r6]).toString(16);
		output.value += "\nr7 0x"+(regs32[Regs.r7]).toString(16);
		output.value += "\nr8 0x"+(regs32[Regs.r8]).toString(16);
		//output.value += "\n"+memory.getm();
		dbg = [];
		output.value += "\n\n\n";
	}
	
	this.fetch8 = function(){
		var value = rom[getRegister(Regs.inp, 32)]; //rom[registers[Regs.cs]];
		dbg.push(value);//.toString(16));
		incRegister(Regs.inp);
		return value;
	}
	this.fetch16 = function(){
		var value = 
			(rom[getRegister(Regs.inp, 32)+1]<<8)+
			rom[getRegister(Regs.inp, 32)];
		dbg.push(value);
		addRegister(Regs.inp, 2);
		return value;
	}
	this.fetch24 = function(){
		var value = 
			(rom[getRegister(Regs.inp, 32)+2]<<16)
			+(rom[getRegister(Regs.inp, 32)+1]<<8)
			+rom[getRegister(Regs.inp, 32)];
		dbg.push(value);
		addRegister(Regs.inp, 3);
		return value;
	}
	this.fetch32 = function(){
		var value = 
			(rom[getRegister(Regs.inp, 32)+3]<<24)
			+(rom[getRegister(Regs.inp, 32)+2]<<16)
			+(rom[getRegister(Regs.inp, 32)+1]<<8)
			+rom[getRegister(Regs.inp, 32)];
		dbg.push(value);
		addRegister(Regs.inp, 4);
		return value;
	}
	
	const getRegister = function(reg, size){
		return size!=32?regs16[reg]:regs32[reg];
	}
	const setRegister = function(reg, value){
		regs16[reg] = regs32[reg] = value;
	}
	const addRegister = function(reg, value){
		regs16[reg] += value;
		regs32[reg] += value;
	}
	const subRegister = function(reg, value){
		regs16[reg] -= value;
		regs32[reg] -= value;
	}
	const mulRegister = function(reg, value){
		regs16[reg] *= value;
		regs32[reg] *= value;
	}
	const divRegister = function(reg, value){
		regs16[reg] /= value;
		regs32[reg] /= value;
	}
	const modRegister = function(reg, value){
		regs16[reg] %= value;
		regs32[reg] %= value;
	}
	const incRegister = function(reg, value){
		regs16[reg]++;
		regs32[reg]++;
	}
	const decRegister = function(reg, value){
		regs16[reg]--;
		regs32[reg]--;
	}
	const andRegister = function(reg, value){
		regs16[reg] &= value;
		regs32[reg] &= value;
	}
	const orRegister = function(reg, value){
		regs16[reg] |= value;
		regs32[reg] |= value;
	}
	const xorRegister = function(reg, value){
		regs16[reg] ^= value;
		regs32[reg] ^= value;
	}
	const slRegister = function(reg, value){
		regs16[reg] <<= value;
		regs32[reg] <<= value;
	}
	const srRegister = function(reg, value){
		regs16[reg] >>= value;
		regs32[reg] >>= value;
	}
	const notRegister = function(reg){
		regs16[reg] = regs32[reg] = ~regs32[reg];
	}
	
	const jumpTo = function(address){
		regs16[Regs.inp] = regs32[Regs.inp] = address;
	}
	//00 00 00 00   00 00 00 00   00 00 00 00   00
	//00 00 00 00   00 00 00 00   01 00 00 00   00
	//00 00 00 00   af 01 00 00   01 00 00 00   00
	const push = function(state){
		memory.set32(1, regs32[Regs.fmp], state);
		console.log(state);
		subRegister(Regs.fmp, 4);
	}
	const pop = function(){
		addRegister(Regs.fmp, 4);
		return memory.get32(1, regs32[Regs.fmp]);
	}
	const pushFrameState = function(){
		for(var r=0; r<regs16.length; r++){
			var v = regs32[r];
			push(regs32[r]);
		}
	}
	const popFrameState = function(){
		for(var r=regs16.length-1; r>-1; r--){
			var po = pop();
			regs16[r] = regs32[r] = po;
		}
	}
	
	this.step = function(){
		var operation = self.fetch8();
		if(operation==0||operation==null)
			return 1;//throw new Error("Out of ROM");
		
		
		switch(operation){
			//Move value
			case Insts.mov_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					setRegister(reg, lit);
				}
				break;
			case Insts.mov_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					setRegister(reg2, getRegister(reg1));
				}
				break;
			case Insts.mov_reg_mem:{
					var reg = self.fetch8();
					var mem = self.fetch32();
					memory.set16(getRegister(Regs.mbp)%memory.map.length, mem, getRegister(reg));
				}
				break;
			case Insts.mov_mem_reg:{
					var mem = self.fetch32();
					var reg = self.fetch8();
					setRegister(reg, memory.get16(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			case Insts.mov_lit_mem:{
					var lit = self.fetch16();
					var mem = self.fetch32();
					memory.set16(getRegister(Regs.mbp)%memory.map.length, mem, lit);
				}
				break;
			case Insts.mov_reg_ptr:{
					var reg = self.fetch8();
					var mem = getRegister(self.fetch8(), 32);//self.fetch32();
					memory.set16(getRegister(Regs.mbp)%memory.map.length, mem, getRegister(reg));
				}
				break;
			case Insts.mov_ptr_reg:{
					var mem = getRegister(self.fetch8(), 32);
					var reg = self.fetch8();
					setRegister(reg, memory.get16(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			case Insts.mov_lit_ptr:{
					var lit = self.fetch16();
					var mem = getRegister(self.fetch8(), 32);
					memory.set16(getRegister(Regs.mbp)%memory.map.length, mem, lit);
				}
				break;
			case Insts.mov8_mem_reg:{
					var mem = self.fetch32();
					var reg = self.fetch8();
					setRegister(reg, memory.get8(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			case Insts.mov8_ptr_reg:{
					var mem = getRegister(self.fetch8(), 32);
					var reg = self.fetch8();
					setRegister(reg, memory.get8(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			case Insts.mov32_mem_reg:{
					var mem = self.fetch32();
					var reg = self.fetch8();
					setRegister(reg, memory.get32(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			case Insts.mov32_ptr_reg:{
					var mem = getRegister(self.fetch8(), 32);
					var reg = self.fetch8();
					setRegister(reg, memory.get32(getRegister(Regs.mbp)%memory.map.length, mem));
				}
				break;
			
			//Push and pop
			case Insts.psh_lit:{
					subRegister(Regs.stp, 4);
					var mem = getRegister(Regs.stp, 32);
					var lit = self.fetch16();
					memory.set16(2, mem, lit);
				}
				break;
			case Insts.psh_reg:{
					subRegister(Regs.stp, 4);
					var mem = getRegister(Regs.stp, 32);
					var reg = self.fetch8();
					memory.set16(2, mem, getRegister(reg));
				}
				break;
			case Insts.psh_mem:{
					subRegister(Regs.stp, 4);
					var mem = getRegister(Regs.stp, 32);
					var memv = self.fetch32();
					memory.set16(2, mem, memory.get16(2, memv));
				}
				break;
			case Insts.pop_reg:{
					var mem = getRegister(Regs.stp, 32);
					var reg = self.fetch8();
					setRegister(reg, memory.get16(2, mem));
					addRegister(Regs.stp, 4);
				}
				break;
			
			//Arithmetic
			case Insts.add_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					addRegister(reg, lit);
				}
				break;
			case Insts.add_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					addRegister(reg2, getRegister(reg1))
				}
				break;
			case Insts.sub_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					subRegister(reg, lit);
				}
				break;
			case Insts.sub_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					subRegister(reg2, getRegister(reg1))
				}
				break;
			case Insts.mul_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					mulRegister(reg, lit);
				}
				break;
			case Insts.mul_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					mulRegister(reg2, getRegister(reg1))
				}
				break;
			case Insts.div_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					divRegister(reg, lit);
				}
				break;
			case Insts.div_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					divRegister(reg2, getRegister(reg1))
				}
				break;
			case Insts.odiv_lit_reg:{
					var lit = self.fetch16();
					var reg = self.fetch8();
					modRegister(reg, lit);
				}
				break;
			case Insts.odiv_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = self.fetch8();
					modRegister(reg2, getRegister(reg1))
				}
				break;
			case Insts.inc_reg:{
					var reg = self.fetch8();
					incRegister(reg);
				}
				break;
			case Insts.dec_reg:{
					var reg = self.fetch8();
					decRegister(reg);
				}
				break;
			
			//Bit operations
			case Insts.lsf_reg_lit:{
					var reg = self.fetch8();
					var lit = self.fetch16();
					slRegister(reg, lit);
				}
				break;
			case Insts.lsf_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = getRegister(self.fetch8(), 32);
					slRegister(reg1, reg2);
				}
				break;
			case Insts.rsf_reg_lit:{
					var reg = self.fetch8();
					var lit = self.fetch16();
					srRegister(reg, lit);
				}
				break;
			case Insts.rsf_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = getRegister(self.fetch8(), 32);
					srRegister(reg1, reg2);
				}
				break;
			case Insts.and_reg_lit:{
					var reg = self.fetch8();
					var lit = self.fetch16();
					andRegister(reg, lit);
				}
				break;
			case Insts.and_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = getRegister(self.fetch8(), 32);
					andRegister(reg1, reg2);
				}
				break;
			case Insts.or_reg_lit:{
					var reg = self.fetch8();
					var lit = self.fetch16();
					orRegister(reg, lit);
				}
				break;
			case Insts.or_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = getRegister(self.fetch8(), 32);
					orRegister(reg1, reg2);
				}
				break;
			case Insts.xor_reg_lit:{
					var reg = self.fetch8();
					var lit = self.fetch16();
					xorRegister(reg, lit);
				}
				break;
			case Insts.xor_reg_reg:{
					var reg1 = self.fetch8();
					var reg2 = getRegister(self.fetch8(), 32);
					xorRegister(reg1, reg2);
				}
				break;
			case Insts.not_reg:{
					var reg = self.fetch8();
					notRegister(reg);
				}
				break;
			
			//Jump operations
			case Insts.jmp_mem:{
					var lit = self.fetch32();
					jumpTo(lit);
				}
				break;
			case Insts.jmp_ptr:{
					var lit = getRegister(self.fetch8(), 32);
					jumpTo(lit);
				}
				break;
			case Insts.jet_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg==getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jet_reg_ptr:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg==getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jne_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg!=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jne_reg_ptr:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg!=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jgt_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg>getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jgt_reg_ptr:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg>getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jlt_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg<getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jlt_reg_ptr:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg<getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jge_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg>=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jge_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg>=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jle_reg_mem:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = self.fetch32();
					if(reg<=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.jle_reg_ptr:{
					var reg = getRegister(self.fetch8(), 32);
					var lit = getRegister(self.fetch8(), 32);
					if(reg<=getRegister(Regs.acu, 32))
						jumpTo(lit);
				}
				break;
			case Insts.call_mem:{
					var lit = self.fetch32();
					pushFrameState();
					jumpTo(lit);
				}
				break;
			case Insts.call_ptr:{
					var lit = getRegister(self.fetch8(), 32);
					pushFrameState();
					jumpTo(lit);
				}
				break;
			case Insts.ret:{
					popFrameState();
				}
				break;
			
			case Insts.dl_mem_lits:{
					var mem = self.fetch32();
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set16(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i*2, self.fetch16());
					}
				}
				break;
			case Insts.dl_ptr_lits:{
					var mem = getRegister(self.fetch8(), 32);
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set16(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i*2, self.fetch16());
					}
				}
				break;
			case Insts.dl8_mem_lits:{
					var mem = self.fetch32();
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set8(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i, self.fetch8());
					}
				}
				break;
			case Insts.dl8_ptr_lits:{
					var mem = getRegister(self.fetch8(), 32);
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set8(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i, self.fetch8());
					}
				}
				break;
			case Insts.dl32_mem_lits:{
					var mem = self.fetch32();
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set32(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i*4, self.fetch32());
					}
				}
				break;
			case Insts.dl32_ptr_lits:{
					var mem = getRegister(self.fetch8(), 32);
					var length = self.fetch16();
					for(var i=0; i<length; i++){
						memory.set32(
							getRegister(Regs.mbp)%memory.map.length, 
							mem+i*4, self.fetch32());
					}
				}
				break;
			case Insts.int_lit:{
					var inst = self.fetch8();
					
				}
				break;
			default:
				alert("Non recognized instruction: "+operation+"\nat address: "+regs32[Regs.inp]);
		}
		self.debug();
	}
	this.run = function(){
		
	}
	
}

function Memory(size, mapper={"main":{"offset":0, "size":size}}){
	var self = this;
	var memory = new Uint8Array(size);
	this.size = size;
	this.map = mapper;
	this.reset = function(){
		for(var i=0; i<memory.length; i++){
			memory[i] = 0;
		}
	}
	const getOffset = function(address, region){
		return self.map[region].offset+(address%self.map[region].size);
	}
	this.set8 = function(region, ind, value){
		memory[getOffset(ind, region)] = value;
	}
	this.set16 = function(region, ind, value){
		memory[getOffset(ind++, region)] = value&0xff;
		memory[getOffset(ind, region)] = value>>8;
	}
	this.set32 = function(region, ind, value){
		memory[getOffset(ind++, region)] = value&0xff;
		memory[getOffset(ind++, region)] = value>>8;
		memory[getOffset(ind++, region)] = value>>16;
		memory[getOffset(ind, region)] = value>>24;
	}
	this.get8 = function(region, ind){
		var value = 
			memory[getOffset(ind, region)];
		return value;
	}
	this.get16 = function(region, ind){
		var value = 
			(memory[getOffset(ind++, region)])+
			(memory[getOffset(ind, region)]<<8);
		return value;
	}
	this.get32 = function(region, ind){
		var value = 
			(memory[getOffset(ind++, region)])+
			(memory[getOffset(ind++, region)]<<8)+
			(memory[getOffset(ind++, region)]<<16)+
			(memory[getOffset(ind, region)]<<24);
		return value;
	}
	this.getm = function(){
		return memory;
	}
	self.reset();
}

const Regs = {
	stp: 0x0,  //Stack pointer
	inp: 0x1,  //Code pointer for fetch
	acu: 0x2,  //Used for comparision operations
	fmp: 0x3,  //Frame pointer
	mbp: 0x4,  //Bank memory pointer
	gs:  0x5,  //..extra
	r1:  0x6,
	r2:  0x7,
	r3:  0x8,
	r4:  0x9,
	r5:  0xa,
	r6:  0xb,
	r7:  0xc,
	r8:  0xd,
	r9:  0xe,
	r10: 0xf,
	r11: 0x10,
	r12: 0x11,
	ax:  0x12,
	bx:  0x13,
	cx:  0x14,
	dx:  0x15,
};
const Insts = {
	//Instructions
	//Mov
	mov_lit_reg    : 0x10,
	mov_reg_reg    : 0x11,
	mov_reg_mem    : 0x12,
	mov_mem_reg    : 0x13,
	mov_lit_mem    : 0x14,
	mov_reg_ptr    : 0x15,
	mov_ptr_reg    : 0x16,
	mov_lit_ptr    : 0x17,
	mov8_mem_reg   : 0x18,
	mov8_ptr_reg   : 0x19,
	mov32_mem_reg  : 0x1e,
	mov32_ptr_reg  : 0x1f,
	
	//Stack instructions
	psh_lit        : 0x1a,
	psh_reg        : 0x1b,
	psh_mem        : 0x1c,
	pop_reg        : 0x1d,
	
	//Arithmetic Operations
	add_lit_reg    : 0x20,
	add_reg_reg    : 0x21,
	sub_lit_reg    : 0x22,
	sub_reg_reg    : 0x23,
	mul_lit_reg    : 0x24,
	mul_reg_reg    : 0x25,
	div_lit_reg    : 0x28,
	div_reg_reg    : 0x29,
	odiv_lit_reg   : 0x2a,
	odiv_reg_reg   : 0x2b,
	inc_reg        : 0x2c,
	dec_reg        : 0x2d,
	
	//Bit operations
	lsf_reg_lit    : 0x30,
	lsf_reg_reg    : 0x31,
	rsf_reg_lit    : 0x32,
	rsf_reg_reg    : 0x33,
	and_reg_lit    : 0x34,
	and_reg_reg    : 0x35,
	or_reg_lit     : 0x36,
	or_reg_reg     : 0x37,
	xor_reg_lit    : 0x38,
	xor_reg_lit    : 0x39,
	not_reg        : 0x3a,
	
	//Jump instructions
	jmp_mem        : 0x40, //directly jump
	jmp_ptr        : 0x41, //directly jump
	jet_reg_mem    : 0x42, //if equal
	jet_reg_ptr    : 0x43, //if equal
	jne_reg_mem    : 0x44, //if not equal
	jne_reg_ptr    : 0x45, //if not equal
	jgt_reg_mem    : 0x46, //if great than
	jgt_reg_ptr    : 0x47, //if great than
	jlt_reg_mem    : 0x48, //if less than
	jlt_reg_ptr    : 0x49, //if less than
	jge_reg_mem    : 0x4a, //if great than
	jge_reg_ptr    : 0x4b, //if great than
	jle_reg_mem    : 0x4c, //if less than
	jle_reg_ptr    : 0x4d, //if less than
	
	//Calls and sub-rotines with state saving
	call_mem       : 0x50,
	call_ptr       : 0x51,
	ret            : 0x5a, //restore last state (return)
	
	//Handling list of values
	dl_mem_lits    : 0x60,
	dl_ptr_lits    : 0x61,
	dl8_mem_lits   : 0x62,
	dl8_ptr_lits   : 0x63,
	dl32_mem_lits  : 0x64,
	dl32_ptr_lits  : 0x65,
	
	//Special instructions
	int_lit          : 0x7f,
	
}

