
var timer_lcycles = 0;
var timer_ldcycles = 0;
var timer_ltime = 0;

const TIMER_DIV_TICK = 32;

const TIMER_INPUTCLOCKSELECT = [1024, 16, 64, 256];

function timer_tick(){
	
	mem_registers[REGC_DIV] += cpu_cycles-timer_ldcycles;
	timer_ldcycles = cpu_cycles;
	
	if(mem_registers[REGC_TAC]&0b00000100){
		if((cpu_cycles-timer_lcycles)>TIMER_INPUTCLOCKSELECT[mem_registers[REGC_TAC]&3]){
			timer_lcycles = cpu_cycles;
			
			if(mem_registers[REGC_TIMA]==0xff){
				mem_registers[REGC_TIMA] = mem_registers[REGC_TMA];
				control_interrupt(CONTROL_INT_TIMER);
				return;
			}
			
			mem_registers[REGC_TIMA]++;
		}
	}
}
