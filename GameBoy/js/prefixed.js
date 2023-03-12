
const prefixed_data = [
	
];

const prefixed_set = [
	
	/**
		RLC
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_rlc8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		RRC
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_rrc8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		RL
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_rl8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		RR
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_rr8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		SLA
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_sla8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		SRA
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_sra8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		SWAP
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_swap(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		SRL
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data = alu_srl8(data);
		cpu_setOperand(opr, data);
	},
	
	/**
		BIT 0
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 0);
	},
	
	/**
		BIT 1
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 1);
	},
	
	/**
		BIT 2
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 2);
	},
	
	/**
		BIT 3
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 3);
	},
	
	/**
		BIT 4
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 4);
	},
	
	/**
		BIT 5
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 5);
	},
	
	/**
		BIT 6
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 6);
	},
	
	/**
		BIT 7
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		alu_bit(data, 7);
	},
	
	/**
		RES 0
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11111110;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 1
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11111101;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 2
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11111011;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 3
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11110111;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 4
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11101111;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 5
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b11011111;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 6
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b10111111;
		cpu_setOperand(opr, data);
	},
	
	/**
		RES 7
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data &= 0b01111111;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 0
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00000001;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 1
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00000010;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 2
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00000100;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 3
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00001000;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 4
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00010000;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 5
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b00100000;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 6
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b01000000;
		cpu_setOperand(opr, data);
	},
	
	/**
		SET 7
	*/
	function(opr){
		var data = cpu_getOperand(opr);
		data |= 0b10000000;
		cpu_setOperand(opr, data);
	},
	
];
