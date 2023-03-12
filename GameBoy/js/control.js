
/**
	SPECIAL REGISTERS
*/

const REGC_P1   = 0x00; // For reading joypad info
const REGC_SB   = 0x01; // Serial Transfer data
const REGC_SC   = 0x02; // SIO control
const REGC_DIV  = 0x04; // Divider Register
const REGC_TIMA = 0x05; // Timer counter
const REGC_TMA  = 0x06; // Timer Modulo
const REGC_TAC  = 0x07; // Timer Control
const REGC_IF   = 0x0F; // Interrupt Flag

const REGC_NR10 = 0x10; // Sound Mode 1 Register
const REGC_NR11 = 0x11; // Sound Mode 1, Length/Wave pattern
const REGC_NR12 = 0x12; // Sound Mode 1, Envelope
const REGC_NR13 = 0x13; // Sound Mode 1, Frequency Low
const REGC_NR14 = 0x14; // Sound Mode 1, Frequency High
const REGC_NR21 = 0x16; // Sound Mode 2, Length/Wave pattern
const REGC_NR22 = 0x17; // Sound Mode 2, Envelope
const REGC_NR23 = 0x18; // Sound Mode 2, Frequency Low
const REGC_NR24 = 0x19; // Sound Mode 2, Frequency High
const REGC_NR30 = 0x1A; // Sound Mode 3, Sound on/off
const REGC_NR31 = 0x1B; // Sound Mode 3, Sound length
const REGC_NR32 = 0x1C; // Sound Mode 3, Select output
const REGC_NR33 = 0x1D; // Sound Mode 3, Frequency Low
const REGC_NR34 = 0x1E; // Sound Mode 3, Frequency High
const REGC_NR41 = 0x20; // Sound Mode 4, Sound length
const REGC_NR42 = 0x21; // Sound Mode 4, Envelope
const REGC_NR43 = 0x22; // Sound Mode 4, Polynomial Counter
const REGC_NR44 = 0x23; // Sound Mode 4, Counter/Consecutive
const REGC_NR50 = 0x24; // Channel Control / ON-OFF / Volume
const REGC_NR51 = 0x25; // Selection of Sound output terminal
const REGC_NR52 = 0x26; // Sound on/off
/* 0x30 => 0x3F */ // Wave Pattern RAM

const REGC_LCDC = 0x40; // LCD Control
const REGC_STAT = 0x41; // LCDC Status
const REGC_SCY  = 0x42; // BG Scroll Y
const REGC_SCX  = 0x43; // BG Scroll X
const REGC_LY   = 0x44; // LCDC Y-Coordinate
const REGC_LYC  = 0x45; // LY Compare
const REGC_DMA  = 0x46; // DMA Transfer and Start Address
const REGC_BGP  = 0x47; // Background and Window Palette Data
const REGC_OBP0 = 0x48; // Object Palette 0 Data
const REGC_OBP1 = 0x49; // Object Palette 1 Data
const REGC_WY   = 0x4A; // Window Y Position
const REGC_WX   = 0x4A; // Window X Position
const REGC_VBK  = 0x4F; // Controls video RAM Bank;

const REGC_SVBK = 0x70; // Controls working RAM Bank;
const REGC_IE   = 0xFF; // Interrupt Flag


const CONTROL_INT_VBLANK = 0b00001;
const CONTROL_INT_LCDS   = 0b00010;
const CONTROL_INT_TIMER  = 0b00100;
const CONTROL_INT_SERIAL = 0b01000;
const CONTROL_INT_JOYPAD = 0b10000;


var control_running = false;

/**
	CONTROL FUNCTIONS
*/

function control_reg_in(reg){
	//console.log("Inputing from special register 0x"+reg.toString(16));
	//console.log("PC: 0x"+regs16[REG16_PC].toString(16));
	if(reg==REGC_DIV){
		
	}
	else if(reg==REGC_DMA){
		return 0;
	}
	else{
		
	}
	return mem_registers[reg];
}

function control_reg_out(reg, data){
	//console.log("Outputing to special register 0x"+reg.toString(16)+" data 0x"+data.toString(16));
	//console.log("PC: 0x"+regs16[REG16_PC].toString(16));
	if(reg==REGC_DIV){
		mem_registers[REGC_DIV] = 0;
		return;
	}
	else if(reg==REGC_BGP){
		video_4cpal(video_pal_bg, data);
	}
	else if(reg==REGC_OBP0){
		video_4cpal(video_pal_ob0, data);
	}
	else if(reg==REGC_OBP1){
		video_4cpal(video_pal_ob1, data);
	}
	else if(reg==REGC_DMA){
		dma_execute(data<<8);
	}
	else{
		
	}
	mem_registers[reg] = data;
}


/**
	CONTROL VARIABLES
*/

var control_wp = window.performance;
var control_time = 0; /* Microseconds Level */


/* Control Analytics */

function not_implemented(feature){
	throw new Error(feature+" not implemented!");
}


/* Request Interruption */

function control_interrupt(interrupt){
	mem_registers[REGC_IF] |= interrupt;
}


/* Process One Step Emulation */

function control_step(){
	
	control_time = control_wp.now()*1000;
	
	/* Execute cpu for a little while */
	if(!(cpu_halted)){
		for(var ci = 0; ci<32; ci++){
			cpu_run();
			timer_tick();
		}
	}
	else{
		for(var ci = 0; ci<32; ci++){
			cpu_cycles += 5;
			timer_tick();
		}
	}
	
	/* Tick Components */
	video_tick();
	
	/* Process Interruption Handling */
	if(cpu_ime){
		
		/* Process VBlank Interruption */
		if((mem_registers[REGC_IF]&0b00001)&&(mem_registers[REGC_IE]&0b00001)){
			mem_registers[REGC_IF] &= 0b11110;
			cpu_interrupt(0x40);
			return;
		}
		
		/* Process LCD STAT Interruption */
		if((mem_registers[REGC_IF]&0b00010)&&(mem_registers[REGC_IE]&0b00010)){
			mem_registers[REGC_IF] &= 0b11101;
			cpu_interrupt(0x48);
			return;
		}
		
		/* Process Timer Interruption */
		if((mem_registers[REGC_IF]&0b00100)&&(mem_registers[REGC_IE]&0b00100)){
			mem_registers[REGC_IF] &= 0b11011;
			cpu_interrupt(0x50);
			return;
		}
		
		/* Process Serial Interruption */
		if((mem_registers[REGC_IF]&0b01000)&&(mem_registers[REGC_IE]&0b01000)){
			mem_registers[REGC_IF] &= 0b10111;
			cpu_interrupt(0x58);
			return;
		}
		
		/* Process Joypad Interruption */
		if((mem_registers[REGC_IF]&0b10000)&&(mem_registers[REGC_IE]&0b10000)){
			mem_registers[REGC_IF] &= 0b01111;
			cpu_interrupt(0x60);
			return;
		}
		
		cpu_ime_enabling = false;
	}
	
	if(cpu_ime_enabling){
		cpu_ime = true;
	}
	
}

function control_frame(){
	var dif = 0;
	while(true){
		control_step();
		if((mem_registers[REGC_LY]-dif)<0){
			break;
		}
		dif = mem_registers[REGC_LY];
	}
}

var _control_lt = 0;
var _control_f = 0;

function _control_animate(at){
	control_frame();
	
	_control_f++;
	
	if((at-_control_lt)>1000){
		stdoutc.textContent = _control_f+" FPS";
		_control_f = 0;
		_control_lt = at;
	}
	
	//stdoutc.textContent = ((1/((at-_control_lt)/1000)).toFixed(2))+" FPS";
	//
	
	if(control_running){
		requestAnimationFrame(_control_animate);
	}
}

function control_init(){
	control_running = true;
	_control_animate();
}