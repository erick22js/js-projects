
function EmunatMemory(size=(1024*1024*8)){
	var mem = this;
	
	var memory = new Uint8Array(size);
	
	/*
		Direct Memory Access
	*/
	
	mem.get8 = function(adr, be=false){
		return BigInt(memory[adr]);
	};
	
	mem.set8 = function(adr, data, be=false){
		data = BigInt(data);
		memory[adr] = Number(data & 0xFFn);
	};
	
	mem.get16 = function(adr, be=false){
		return (BigInt(memory[adr++])) | (BigInt(memory[adr++]) << 8n);
	};
	
	mem.set16 = function(adr, data, be=false){
		data = BigInt(data);
		memory[adr++] = Number(data & 0xFFn);
		memory[adr++] = Number((data >> 8n) & 0xFFn);
	};
	
	mem.get32 = function(adr, be=false){
		return (BigInt(memory[adr++])) | (BigInt(memory[adr++]) << 8n) | (BigInt(memory[adr++]) << 16n) | (BigInt(memory[adr++]) << 24n);
	};
	
	mem.set32 = function(adr, data, be=false){
		data = BigInt(data);
		memory[adr++] = Number(data & 0xFFn);
		memory[adr++] = Number((data >> 8n) & 0xFFn);
		memory[adr++] = Number((data >> 16n) & 0xFFn);
		memory[adr++] = Number((data >> 24n) & 0xFFn);
	};
	
	mem.get64 = function(adr, be=false){
		return (BigInt(memory[adr++])) | (BigInt(memory[adr++]) << 8n) | (BigInt(memory[adr++]) << 16n) | (BigInt(memory[adr++]) << 24n) |
			(BigInt(memory[adr++]) << 32n) | (BigInt(memory[adr++]) << 40n) | (BigInt(memory[adr++]) << 48n) | (BigInt(memory[adr++]) << 56n);
	};
	
	mem.set64 = function(adr, data, be=false){
		data = BigInt(data);
		memory[adr++] = Number(data & 0xFFn);
		memory[adr++] = Number((data >> 8n) & 0xFFn);
		memory[adr++] = Number((data >> 16n) & 0xFFn);
		memory[adr++] = Number((data >> 24n) & 0xFFn);
		memory[adr++] = Number((data >> 32n) & 0xFFn);
		memory[adr++] = Number((data >> 40n) & 0xFFn);
		memory[adr++] = Number((data >> 48n) & 0xFFn);
		memory[adr++] = Number((data >> 56n) & 0xFFn);
	};
	
	/*
		Pointer Memory Access
	*/
	var seek = 0;
	mem.add8 = function(data, be=false){
		mem.set8(seek, data, be);
		seek++;
	}
	mem.add16 = function(data, be=false){
		mem.set16(seek, data, be);
		seek += 2;
	}
	mem.add32 = function(data, be=false){
		mem.set32(seek, data, be);
		seek += 4;
	}
	mem.add64 = function(data, be=false){
		mem.set64(seek, data, be);
		seek += 8;
	}
}

function EmunatVM(code=null, data=null){
	var vm = this;
	
	var mem_code = code || (new EmunatMemory(1024*1024 * 8));
	var mem_data = data || (new EmunatMemory(1024*1024 * 8));
	
	/*
		Registers
	*/
	var regs = new BigUint64Array(32);
	var uregs = new BigUint64Array(32);
	var sregs = new BigUint64Array(32);
	
	const REG_R0 = 0; // - zero -
	const REG_0 = 0;
	const REG_R1 = 1;
	const REG_R2 = 2;
	const REG_R3 = 3;
	const REG_R4 = 4;
	const REG_R5 = 5;
	const REG_R6 = 6;
	const REG_R7 = 7;
	const REG_R8 = 8;
	const REG_R9 = 9;
	const REG_R10 = 10;
	const REG_R11 = 11;
	const REG_R12 = 12;
	const REG_R13 = 13; // SP
	const REG_SP = 13;
	const REG_R14 = 14; // FP
	const REG_FP = 14;
	const REG_R15 = 15; // PC
	const REG_PC = 15;
	const REG_LPC = 16; // Last PC
	// ST:
	//	* 0::1 => CS: Comparision Status
	//	* 2 => MZ: Main Operand is Zero
	//	* 16 => DO: 1=BigEndian Data; 0=LittleEndian Data
	const REG_ST = 17;
	
	/*
		Status Accesses
	*/
	
	// CS: Comparision Status
	vm.getStatusCS = function(){
		return vm.getReg(REG_ST) & 0x3n;
	};
	
	vm.setStatusCS = function(status){
		vm.setReg(REG_ST, (vm.getReg(REG_ST)&(~0x0000000000000003n)) | (BigInt(status)&0x3n));
	};
	
	// MZ: Main Operator Zero
	vm.getStatusMZ = function(){
		return (vm.getReg(REG_ST) >> 2n) & 0x1n;
	};
	
	vm.setStatusMZ = function(status){
		vm.setReg(REG_ST, (vm.getReg(REG_ST)&(~0x0000000000000004n)) | (status? 0x0000000000000004n: 0n));
	};
	
	// DO: Data Order
	vm.getStatusDO = function(){
		return (vm.getReg(REG_ST) >> 16n) & 0x1n;
	};
	
	vm.setStatusDO = function(status){
		vm.setReg(REG_ST, (vm.getReg(REG_ST)&(~0x0000000000010000n)) | (status? 0x0000000000010000n: 0n));
	};
	
	/*
		Data Accesses
	*/
	// Registers
	vm.getReg = function(name){
		if(name==REG_R0){
			return 0n;
		}
		return regs[name];
	};
	
	vm.setReg = function(name, data){
		if(name==REG_R0){
			return;
		}
		regs[name] = BigInt(data);
	};
	
	function updateLPC(){
		vm.setReg(REG_LPC, vm.getReg(REG_PC));
	};
	
	// Memory
	vm.getMem8 = function(adr){
		return mem_data.get8(adr, vm.getStatusDO());
	};
	
	vm.setMem8 = function(adr, data){
		mem_data.set8(adr, data, vm.getStatusDO());
	};
	
	vm.getMem16 = function(adr){
		return mem_data.get16(adr, vm.getStatusDO());
	};
	
	vm.setMem16 = function(adr, data){
		mem_data.set16(adr, data, vm.getStatusDO());
	};
	
	vm.getMem32 = function(adr){
		return mem_data.get32(adr, vm.getStatusDO());
	};
	
	vm.setMem32 = function(adr, data){
		mem_data.set32(adr, data, vm.getStatusDO());
	};
	
	vm.getMem64 = function(adr){
		return mem_data.get64(adr, vm.getStatusDO());
	};
	
	vm.setMem64 = function(adr, data){
		mem_data.set64(adr, data, vm.getStatusDO());
	};
	
	// Stack
	vm.pop8 = function(){
		var data = mem_data.get8(vm.getReg(REG_SP), vm.getStatusDO());
		vm.setReg(REG_SP, vm.getReg(REG_SP) + 1n);
		return data;
	};
	
	vm.push8 = function(data){
		vm.setReg(REG_SP, vm.getReg(REG_SP) - 1n);
		mem_data.set8(vm.getReg(REG_SP), data, vm.getStatusDO());
	};
	
	vm.pop16 = function(){
		var data = mem_data.get16(vm.getReg(REG_SP), vm.getStatusDO());
		vm.setReg(REG_SP, vm.getReg(REG_SP) + 2n);
		return data;
	};
	
	vm.push16 = function(data){
		vm.setReg(REG_SP, vm.getReg(REG_SP) - 2n);
		mem_data.set16(vm.getReg(REG_SP), data, vm.getStatusDO());
	};
	
	vm.pop32 = function(){
		var data = mem_data.get32(vm.getReg(REG_SP), vm.getStatusDO());
		vm.setReg(REG_SP, vm.getReg(REG_SP) + 4n);
		return data;
	};
	
	vm.push32 = function(data){
		vm.setReg(REG_SP, vm.getReg(REG_SP) - 4n);
		mem_data.set32(vm.getReg(REG_SP), data, vm.getStatusDO());
	};
	
	vm.pop64 = function(){
		var data = mem_data.get64(vm.getReg(REG_SP), vm.getStatusDO());
		vm.setReg(REG_SP, vm.getReg(REG_SP) + 8n);
		return data;
	};
	
	vm.push64 = function(data){
		vm.setReg(REG_SP, vm.getReg(REG_SP) - 8n);
		mem_data.set64(vm.getReg(REG_SP), data, vm.getStatusDO());
	};
	
	// Code
	vm.fetch8 = function(){
		var data = mem_code.get8(vm.getReg(REG_PC));
		vm.setReg(REG_PC, vm.getReg(REG_PC) + 1n);
		return data;
	};
	
	vm.fetch16 = function(){
		var data = mem_code.get16(vm.getReg(REG_PC));
		vm.setReg(REG_PC, vm.getReg(REG_PC) + 2n);
		return data;
	};
	
	vm.fetch32 = function(){
		var data = mem_code.get32(vm.getReg(REG_PC));
		vm.setReg(REG_PC, vm.getReg(REG_PC) + 4n);
		return data;
	};
	
	vm.fetch64 = function(){
		var data = mem_code.get64(vm.getReg(REG_PC));
		vm.setReg(REG_PC, vm.getReg(REG_PC) + 8n);
		return data;
	};
	
	/*
		Data Casts
	*/
	function S8ToS64(data){
		if(data >= 0x80n){
			return data - 0x100n;
		}
		return data;
	}
	function S16ToS64(data){
		if(data >= 0x8000n){
			return data - 0x10000n;
		}
		return data;
	}
	function S32ToS64(data){
		if(data >= 0x80000000n){
			return data - 0x100000000n;
		}
		return data;
	}
	
	/*
		Internal Functionallity
	*/
	
	/*
		Code Execution
	*/
	function execOpcode(){
		var opcode = vm.fetch8();
		switch(opcode){
			//
			//	NOP
			//	Don't do any operation
			//
			case 0x00n: {
				opcExecLog(opcode, "nop", true);
			}
			break;
			
			//
			//	MOV reg, imm8
			//	Moves a 8-bit immediate value to a register
			//
			case 0x40n: {
				opcExecLog(opcode, "mov reg, imm8", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch8();
				if(sufix & 0xF0n){
					data = S8ToS64(data);
				}
				vm.setReg(reg, data);
			}
			break;
			
			//
			//	MOV reg, imm16
			//	Moves a 16-bit immediate value to a register
			//
			case 0x41n: {
				opcExecLog(opcode, "mov reg, imm16", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch16();
				if(sufix & 0xF0n){
					data = S16ToS64(data);
				}
				vm.setReg(reg, data);
			}
			break;
			
			//
			//	MOV reg, imm32
			//	Moves a 32-bit immediate value to a register
			//
			case 0x42n: {
				opcExecLog(opcode, "mov reg, imm32", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch32();
				if(sufix & 0xF0n){
					data = S32ToS64(data);
				}
				vm.setReg(reg, data);
			}
			break;
			
			//
			//	MOV reg, d64
			//	Moves a 64-bit value to a register
			//
			case 0x43n: {
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				if(sufix & 0xF0n){
					opcExecLog(opcode, "mov reg, reg", true);
					var s_reg = (sufix >> 4n)&0xFn;
					vm.setReg(d_reg, vm.getReg(s_reg));
				}
				else{
					opcExecLog(opcode, "mov reg, imm64", true);
					var data = vm.fetch64();
					vm.setReg(d_reg, data);
				}
			}
			break;
			
			//
			//	LD8 reg, [imm64]
			//	Loads 8-bit data at memory address pointed by 64-bit immediate
			//
			case 0x50n: {
				opcExecLog(opcode, "ld8 reg, [imm64]", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setReg(reg, vm.getMem8(address));
			}
			break;
			
			//
			//	LD16 reg, [imm64]
			//	Loads 16-bit data at memory address pointed by 64-bit immediate
			//
			case 0x51n: {
				opcExecLog(opcode, "ld16 reg, [imm64]", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setReg(reg, vm.getMem16(address));
			}
			break;
			
			//
			//	LD32 reg, [imm64]
			//	Loads 32-bit data at memory address pointed by 64-bit immediate
			//
			case 0x52n: {
				opcExecLog(opcode, "ld32 reg, [imm64]", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setReg(reg, vm.getMem32(address));
			}
			break;
			
			//
			//	LD64 reg, [imm64]
			//	Loads 64-bit data at memory address pointed by 64-bit immediate
			//
			case 0x53n: {
				opcExecLog(opcode, "ld64 reg, [imm64]", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setReg(reg, vm.getMem64(address));
			}
			break;
			
			//
			//	LD8 regd, [regi]
			//	Loads 8-bit data at memory address pointed by register
			//
			case 0x54n: {
				opcExecLog(opcode, "ld8 regd, [regi]", true);
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				vm.setReg(d_reg, vm.getMem8(vm.getReg(i_reg)));
			}
			break;
			
			//
			//	LD16 regd, [regi]
			//	Loads 16-bit data at memory address pointed by register
			//
			case 0x55n: {
				opcExecLog(opcode, "ld16 regd, [regi]", true);
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				vm.setReg(d_reg, vm.getMem16(vm.getReg(i_reg)));
			}
			break;
			
			//
			//	LD32 regd, [regi]
			//	Loads 32-bit data at memory address pointed by register
			//
			case 0x56n: {
				opcExecLog(opcode, "ld32 regd, [regi]", true);
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				vm.setReg(d_reg, vm.getMem32(vm.getReg(i_reg)));
			}
			break;
			
			//
			//	LD64 regd, [regi]
			//	Loads 64-bit data at memory address pointed by register
			//
			case 0x57n: {
				opcExecLog(opcode, "ld64 regd, [regi]", true);
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				vm.setReg(d_reg, vm.getMem64(vm.getReg(i_reg)));
			}
			break;
			
			//
			//	ST8 [imm64], reg
			//	Stores register 8-bit data at memory address pointed by 64-bit immediate
			//
			case 0x58n: {
				opcExecLog(opcode, "st8 [imm64], reg", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setMem8(address, vm.getReg(reg));
			}
			break;
			
			//
			//	ST16 [imm64], reg
			//	Stores register 16-bit data at memory address pointed by 64-bit immediate
			//
			case 0x59n: {
				opcExecLog(opcode, "st16 [imm64], reg", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setMem16(address, vm.getReg(reg));
			}
			break;
			
			//
			//	ST32 [imm64], reg
			//	Stores register 32-bit data at memory address pointed by 64-bit immediate
			//
			case 0x5An: {
				opcExecLog(opcode, "st32 [imm64], reg", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setMem32(address, vm.getReg(reg));
			}
			break;
			
			//
			//	ST64 [imm64], reg
			//	Stores register 64-bit data at memory address pointed by 64-bit immediate
			//
			case 0x5Bn: {
				opcExecLog(opcode, "st64 [imm64], reg", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var address = vm.fetch64();
				vm.setMem64(address, vm.getReg(reg));
			}
			break;
			
			//
			//	ST8 [regi], regb
			//	Stores register 8-bit data at memory address pointed by register
			//
			case 0x5Cn: {
				opcExecLog(opcode, "st8 [regi], regb", true);
				var sufix = vm.fetch8();
				var b_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem8(address, vm.getReg(b_reg));
			}
			break;
			
			//
			//	ST16 [regi], regb
			//	Stores register 16-bit data at memory address pointed by register
			//
			case 0x5Dn: {
				opcExecLog(opcode, "st16 [regi], regb", true);
				var sufix = vm.fetch8();
				var b_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem16(address, vm.getReg(b_reg));
			}
			break;
			
			//
			//	ST32 [regi], regb
			//	Stores register 32-bit data at memory address pointed by register
			//
			case 0x5En: {
				opcExecLog(opcode, "st32 [regi], regb", true);
				var sufix = vm.fetch8();
				var b_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem32(address, vm.getReg(b_reg));
			}
			break;
			
			//
			//	ST64 [regi], regb
			//	Stores register 64-bit data at memory address pointed by register
			//
			case 0x5Fn: {
				opcExecLog(opcode, "st64 [regi], regb", true);
				var sufix = vm.fetch8();
				var b_reg = sufix&0xFn;
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem64(address, vm.getReg(b_reg));
			}
			break;
			
			//
			//	ST8 [regi], imm8
			//	Stores 8-bit immediate at memory address pointed by register
			//
			case 0x6Cn: {
				opcExecLog(opcode, "st8 [regi], regb", true);
				var sufix = vm.fetch8();
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem8(address, vm.fetch8());
			}
			break;
			
			//
			//	ST16 [regi], imm16
			//	Stores 16-bit immediate at memory address pointed by register
			//
			case 0x6Dn: {
				opcExecLog(opcode, "st16 [regi], regb", true);
				var sufix = vm.fetch8();
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem16(address, vm.fetch16());
			}
			break;
			
			//
			//	ST32 [regi], imm32
			//	Stores 32-bit immediate at memory address pointed by register
			//
			case 0x6En: {
				opcExecLog(opcode, "st32 [regi], regb", true);
				var sufix = vm.fetch8();
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem32(address, vm.fetch32());
			}
			break;
			
			//
			//	ST64 [regi], imm64
			//	Stores 64-bit immediate at memory address pointed by register
			//
			case 0x6Fn: {
				opcExecLog(opcode, "st64 [regi], regb", true);
				var sufix = vm.fetch8();
				var i_reg = (sufix >> 4n)&0xFn;
				var address = vm.getReg(i_reg);
				vm.setMem64(address, vm.fetch64());
			}
			break;
			
			//
			//	ADD reg, imm8
			//	Adds a 8-bit immediate value to a register
			//
			case 0x84n: {
				opcExecLog(opcode, "add reg, imm8", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch8();
				if(sufix & 0xF0n){
					data = S8ToS64(data);
				}
				vm.setReg(reg, vm.getReg(reg) + data);
			}
			break;
			
			//
			//	ADD reg, imm16
			//	Adds a 16-bit immediate value to a register
			//
			case 0x85n: {
				opcExecLog(opcode, "add reg, imm16", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch16();
				if(sufix & 0xF0n){
					data = S16ToS64(data);
				}
				vm.setReg(reg, vm.getReg(reg) + data);
			}
			break;
			
			//
			//	ADD reg, imm32
			//	Adds a 32-bit immediate value to a register
			//
			case 0x86n: {
				opcExecLog(opcode, "add reg, imm32", true);
				var sufix = vm.fetch8();
				var reg = sufix&0xFn;
				var data = vm.fetch32();
				if(sufix & 0xF0n){
					data = S32ToS64(data);
				}
				vm.setReg(reg, vm.getReg(reg) + data);
			}
			break;
			
			//
			//	ADD reg, d64
			//	Adds a 64-bit value to a register
			//
			case 0x87n: {
				var sufix = vm.fetch8();
				var d_reg = sufix&0xFn;
				if(sufix & 0xF0n){
					opcExecLog(opcode, "add reg, reg", true);
					var s_reg = (sufix >> 4n)&0xFn;
					vm.setReg(d_reg, vm.getReg(d_reg) + vm.getReg(s_reg));
				}
				else{
					opcExecLog(opcode, "add reg, imm64", true);
					var data = vm.fetch64();
					vm.setReg(reg, vm.getReg(reg) + data);
				}
			}
			break;
			
			default:{
				opcExecLog(opcode, "", false);
			}
		}
		debugLog();
	}
	
	vm.step = function(){
		updateLPC();
		execOpcode();
	}
	
	/*
		Debugger
	*/
	function opcExecLog(opcode, format, valid=true){
		console.log("## Opcode: 0x"+opcode.toString(16));
		if(valid){
			console.log("Format: "+format);
		}
		else{
			console.log("Invalid Opcode!");
		}
	}
	
	function debugLog(){
		console.log("## Registers");
		console.log("R1: 0x"+vm.getReg(1).toString(16));
		console.log("R2: 0x"+vm.getReg(2).toString(16));
		console.log("R3: 0x"+vm.getReg(3).toString(16));
		console.log("R4: 0x"+vm.getReg(4).toString(16));
		console.log("R5: 0x"+vm.getReg(5).toString(16));
		console.log("R6: 0x"+vm.getReg(6).toString(16));
		console.log("R7: 0x"+vm.getReg(7).toString(16));
		console.log("R8: 0x"+vm.getReg(8).toString(16));
		console.log("R9: 0x"+vm.getReg(9).toString(16));
		console.log("R10: 0x"+vm.getReg(10).toString(16));
		console.log("R11: 0x"+vm.getReg(11).toString(16));
		console.log("R12: 0x"+vm.getReg(12).toString(16));
		console.log("SP: 0x"+vm.getReg(13).toString(16));
		console.log("FP: 0x"+vm.getReg(14).toString(16));
		console.log("PC: 0x"+vm.getReg(15).toString(16));
		console.log("## Status");
		console.log("CS: "+vm.getStatusCS());
		console.log("MZ: "+vm.getStatusMZ());
		console.log("DO: "+vm.getStatusDO());
		console.log("");
	}
	
}
