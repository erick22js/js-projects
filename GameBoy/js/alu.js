
/**
	IMMEDIATE SIGN CONVERTION
*/

function alu_s8(data){
	return data>0x7f?data-0x100:data;
}

function alu_s16(data){
	return data>0x7fff?data-0x10000:data;
}


/**
	INCREMENTS/DECREMENTS OPERATIONS
*/

function alu_inc8(data){
	data++;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH((data&0xf)==0x0);
	return data;
}

function alu_dec8(data){
	data--;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(1);
	cpu_setFlagH((data&0xf)==0xf);
	return data;
}

function alu_inc16(data){
	cpu_cycles++;
	data++;
	return data;
}

function alu_dec16(data){
	cpu_cycles++;
	data--;
	return data;
}


/**
	DECIMAL ADJUST OPERATION
*/

function alu_da8(data){
	var adjust = 0;
	var flag_n = cpu_getFlagN();
	var flag_h = cpu_getFlagH();
	var flag_c = cpu_getFlagCY();
	
	if(flag_h||((!flag_n)&&((data&0x0f)>0x09))){
		adjust += 0x06;
	}
	if(flag_c||((!flag_n)&&(data>0x99))){
		adjust += 0x60;
		cpu_setFlagCY(1);
	}
	
	data += flag_n?-adjust:adjust;
	
	cpu_updFlagZ(data&0xff);
	cpu_setFlagH(0);
	
	return data;
}


/**
	ADDS OPERATIONS
*/

function alu_add8(data, adder){
	var old_data = data;
	data += adder;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH(((old_data&0xf)+(adder&0xf))>0xf);
	cpu_setFlagCY((old_data+adder)>0xff);
	return data;
}

function alu_adc8(data, adder){
	var old_data = data;
	var cy = cpu_getFlagCY();
	data += adder+cy;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH(((old_data&0xf)+(adder&0xf)+cy)>0xf);
	cpu_setFlagCY((old_data+adder+cy)>0xff);
	return data;
}

function alu_sub8(data, subber){
	var old_data = data;
	data -= subber;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(1);
	cpu_setFlagH(((old_data&0xf)-(subber&0xf))<0x0);
	cpu_setFlagCY((old_data-subber)<0x0);
	return data;
}

function alu_sbc8(data, subber){
	var old_data = data;
	var cy = cpu_getFlagCY();
	data -= subber+cy;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(1);
	cpu_setFlagH(((old_data&0xf)-(subber&0xf)-cy)<0x0);
	cpu_setFlagCY((old_data-subber-cy)<0x0);
	return data;
}

function alu_and8(data, ander){
	var old_data = data;
	data &= ander;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH(1);
	cpu_setFlagCY(0);
	return data;
}

function alu_xor8(data, xorer){
	var old_data = data;
	data ^= xorer;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH(0);
	cpu_setFlagCY(0);
	return data;
}

function alu_or8(data, orer){
	var old_data = data;
	data |= orer;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(0);
	cpu_setFlagH(0);
	cpu_setFlagCY(0);
	return data;
}

function alu_cp8(data, comparator){
	var old_data = data;
	data -= comparator;
	cpu_updFlagZ(data&0xff);
	cpu_setFlagN(1);
	cpu_setFlagH(((old_data&0xf)-(comparator&0xf))<0x0);
	cpu_setFlagCY(old_data<comparator);
	return data;
}

function alu_add16(data, adder){
	cpu_cycles++;
	var old_data = data;
	data += adder;
	cpu_setFlagN(0);
	cpu_setFlagH(((old_data&0xfff)+(adder&0xfff))>0xfff);
	cpu_setFlagCY((old_data+adder)>0xffff);
	return data;
}


/**
	ROTATE/SHIFT OPERATIONS
*/

function alu_rlc8(data){
	var old_data = data;
	data <<= 1;
	data |= (old_data&0x80)>>7;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data>>7);
	return data;
}

function alu_rrc8(data){
	var old_data = data;
	data >>= 1;
	data |= (old_data&1)<<7;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data&1);
	return data;
}

function alu_rl8(data){
	var old_data = data;
	data <<= 1;
	data |= cpu_getFlagCY();
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data>>7);
	return data;
}

function alu_rr8(data){
	var old_data = data;
	data >>= 1;
	data |= cpu_getFlagCY()<<7;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data&1);
	return data;
}

function alu_sla8(data){
	var old_data = data;
	data <<= 1;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data>>7);
	return data;
}

function alu_sra8(data){
	var old_data = data;
	data >>= 1;
	data |= old_data&0x80;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data&1);
	return data;
}

function alu_srl8(data){
	var old_data = data;
	data >>= 1;
	cpu_clearFlags();
	cpu_updFlagZ(data&0xff);
	cpu_setFlagCY(old_data&1);
	return data;
}

function alu_swap(data){
	var new_data = 0;
	new_data |= (data>>4)&0xf;
	new_data |= (data<<4)&0xf0;
	cpu_clearFlags();
	cpu_updFlagZ(new_data&0xff);
	return new_data;
}

function alu_bit(data, bitn){
	var bit = (data>>bitn)&1;
	cpu_updFlagZ(bit);
	cpu_setFlagN(0);
	cpu_setFlagH(1);
}
