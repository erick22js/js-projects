
/**
	CART PROPERTIES CONSTANTS
*/





/**
	CART FUNCTIONS
*/

/* Loads the cartdrige info */

function cart_load(byte_buffer){
	
	var cart = {
		"buffer": byte_buffer,
		"title": "",
		"manufaturer": [],
		"cgbflag": "",
		"cgbflag_code": 0,
		"newlicense": "",
		"newlicense_code": 0,
		"sgbflag": "",
		"sgbflag_code": 0,
		"type": "",
		"type_code": 0,
		"romsize": "",
		"romsize_code": 0,
		"rombanks": 0,
		"ramsize": "",
		"ramsize_code": 0,
		"rambanks": 0,
	};
	
	
	/* Nintendo Logo */ /* 0x104 => 0x133 */
	
	{
		/* TODO */
	}
	
	
	/* Title */ /* 0x134 => 0x143 */
	
	{
		var title = "";
		
		for(var i=0x134; i<=0x143; i++){
			var chr = byte_buffer[i];
			if(chr==0){
				break;
			}
			chr += String.fromCharCode(chr);
		}
		
		cart["title"] = title;
	}
	
	
	/* Manufaturer Code */ /* 0x13F => 0x142 */
	
	{
		var manucode = [];
		
		for(var i=0x13f; i<=0x142; i++){
			manucode.push(byte_buffer[i]);
		}
		
		cart["manufaturer"] = manucode;
	}
	
	
	/* CGB Flag */ /* 0x143 */
	
	{
		var code = byte_buffer[0x143];
		
		cart["cgbflag_code"] = code;
		
		var cgbflag;
		if(code==0x80){
			cgbflag = "CGB Backwards Compatible";
		}
		else{
			cgbflag = "CGB Only";
		}
		
		cart["cgbflag"] = cgbflag;
	}
	
	
	/* New License Code */ /* 0x144, 0x145 */
	
	{
		var code = byte_buffer[0x144]|(byte_buffer[0x145]<<8);
		
		cart["newlicense_code"] = code;
		
		var license;
		switch(license){
			case 0x00:{
				license = "None";
			}
			break;
			case 0x01:{
				license = "Nintendo";
			}
			break;
			case 0x08:{
				license = "Capcom";
			}
			break;
			case 0x13:{
				license = "Eletronic Arts";
			}
			break;
			case 0x18:{
				license = "Hudson Soft";
			}
			break;
			case 0x19:{
				license = "b-ai";
			}
			break;
			case 0x20:{
				license = "kss";
			}
			break;
			case 0x21:{
				license = "pow";
			}
			break;
			case 0x24:{
				license = "PCM Complete";
			}
			break;
			case 0x25:{
				license = "san-x";
			}
			break;
			case 0x28:{
				license = "Kemco Japan";
			}
			break;
			case 0x29:{
				license = "seta";
			}
			break;
			case 0x30:{
				license = "Viacom";
			}
			break;
			case 0x31:{
				license = "Nintendo";
			}
			break;
			case 0x32:{
				license = "Bandai";
			}
			break;
			case 0x33:{
				license = "Ocean/Acclaim";
			}
			break;
			case 0x34:{
				license = "Konami";
			}
			break;
			case 0x35:{
				license = "Hector";
			}
			break;
			case 0x37:{
				license = "Taito";
			}
			break;
			case 0x38:{
				license = "Hudson";
			}
			break;
			case 0x39:{
				license = "Banpresto";
			}
			break;
			case 0x41:{
				license = "Ubi Soft";
			}
			break;
			case 0x42:{
				license = "Atlus";
			}
			break;
			case 0x44:{
				license = "Malibu";
			}
			break;
			case 0x46:{
				license = "angel";
			}
			break;
			case 0x47:{
				license = "Bullet-Proof";
			}
			break;
			case 0x49:{
				license = "irem";
			}
			break;
			case 0x50:{
				license = "Absolute";
			}
			break;
			case 0x51:{
				license = "Acclaim";
			}
			break;
			case 0x52:{
				license = "Activision";
			}
			break;
			case 0x53:{
				license = "American sammy";
			}
			break;
			case 0x54:{
				license = "Konami";
			}
			break;
			case 0x55:{
				license = "Hi tech entertainment";
			}
			break;
			case 0x56:{
				license = "LJN";
			}
			break;
			case 0x57:{
				license = "Matchbox";
			}
			break;
			case 0x58:{
				license = "Mattel";
			}
			break;
			case 0x59:{
				license = "Milton Bradley";
			}
			break;
			case 0x60:{
				license = "Titus";
			}
			break;
			case 0x61:{
				license = "Virgin";
			}
			break;
			case 0x64:{
				license = "LucasArts";
			}
			break;
			case 0x67:{
				license = "Ocean";
			}
			break;
			case 0x69:{
				license = "Electronic Arts";
			}
			break;
			case 0x70:{
				license = "Infogrames";
			}
			break;
			case 0x71:{
				license = "Interplay";
			}
			break;
			case 0x72:{
				license = "Broderbund";
			}
			break;
			case 0x73:{
				license = "sculptured";
			}
			break;
			case 0x75:{
				license = "sci";
			}
			break;
			case 0x78:{
				license = "THQ";
			}
			break;
			case 0x79:{
				license = "Accolade";
			}
			break;
			case 0x80:{
				license = "misawa";
			}
			break;
			case 0x83:{
				license = "lozc";
			}
			break;
			case 0x86:{
				license = "Tokuma Shoten Intermedia";
			}
			break;
			case 0x87:{
				license = "Tsukuda Original";
			}
			break;
			case 0x91:{
				license = "Chunsoft";
			}
			break;
			case 0x92:{
				license = "Video system";
			}
			break;
			case 0x93:{
				license = "Ocean/Acclaim";
			}
			break;
			case 0x95:{
				license = "Varie";
			}
			break;
			case 0x96:{
				license = "Yonezawa/s’pal";
			}
			break;
			case 0x97:{
				license = "Kaneko";
			}
			break;
			case 0x99:{
				license = "Pack in soft";
			}
			break;
			case 0xA4:{
				license = "Konami (Yu-Gi-Oh!)";
			}
			break;
			default:{
				license = "<Undefined>";
			}
		}
		
		cart["newlicense"] = license;
	}
	
	
	/* SGB Flag */ /*  0x146 */
	
	{
		var code = byte_buffer[0x146];
		
		cart["sgbflag_code"] = code;
		
		var sgbflag;
		if(code==0x03){
			sgbflag = "Supports SGB Functions";
		}
		else{
			sgbflag = "Does not support SGB Functions";
		}
		
		cart["sgbflag"] = sgbflag;
	}
	
	
	/* Cartidrige type */ /* 0x147 */
	
	{
		var code = byte_buffer[0x147];
		
		cart["type_code"] = code;
		
		var type;
		switch(code){
			case 0x00:{
				type = "ROM ONLY";
			}
			break;
			case 0x01:{
				type = "MBC1";
			}
			break;
			case 0x02:{
				type = "MBC1+RAM";
			}
			break;
			case 0x03:{
				type = "MBC1+RAM+BATTERY";
			}
			break;
			case 0x05:{
				type = "MBC2";
			}
			break;
			case 0x06:{
				type = "MBC2+BATTERY";
			}
			break;
			case 0x08:{
				type = "ROM+RAM";
			}
			break;
			case 0x09:{
				type = "ROM+RAM+BATTERY";
			}
			break;
			case 0x0B:{
				type = "MMM01";
			}
			break;
			case 0x0C:{
				type = "MMM01+RAM";
			}
			break;
			case 0x0D:{
				type = "MMM01+RAM+BATTERY";
			}
			break;
			case 0x0F:{
				type = "MBC3+TIMER+BATTERY";
			}
			break;
			case 0x10:{
				type = "MBC3+TIMER+RAM+BATTERY";
			}
			break;
			case 0x11:{
				type = "MBC3";
			}
			break;
			case 0x12:{
				type = "MBC3+RAM";
			}
			break;
			case 0x13:{
				type = "MBC3+RAM+BATTERY";
			}
			break;
			case 0x19:{
				type = "MBC5";
			}
			break;
			case 0x1A:{
				type = "MBC5+RAM";
			}
			break;
			case 0x1B:{
				type = "MBC5+RAM+BATTERY";
			}
			break;
			case 0x1C:{
				type = "MBC5+RUMBLE";
			}
			break;
			case 0x1D:{
				type = "MBC5+RUMBLE+RAM";
			}
			break;
			case 0x1E:{
				type = "MBC5+RUMBLE+RAM+BATTERY";
			}
			break;
			case 0x20:{
				type = "MBC6";
			}
			break;
			case 0x22:{
				type = "MBC7+SENSOR+RUMBLE+RAM+BATTERY";
			}
			break;
			case 0xFC:{
				type = "POCKET CAMERA";
			}
			break;
			case 0xFD:{
				type = "BANDAI TAMA5";
			}
			break;
			case 0xFE:{
				type = "HuC3";
			}
			break;
			case 0xFF:{
				type = "HuC1+RAM+BATTERY";
			}
			break;
			default:{
				type = "<Undefined>";
			}
		}
		
		cart["type"] = type;
	}
	
	
	/* ROM Size */ /* 0x148 */
	
	{
		var code = byte_buffer[0x148];
		
		cart["romsize_code"] = code;
		
		var romsize;
		var banks = 0;
		switch(code){
			case 0x00:{
				romsize = "32 KiB (no banking)";
				banks = 2;
			}
			break;
			case 0x01:{
				romsize = "64 KiB";
				banks = 4;
			}
			break;
			case 0x02:{
				romsize = "128 KiB";
				banks = 8;
			}
			break;
			case 0x03:{
				romsize = "256 KiB";
				banks = 16;
			}
			break;
			case 0x04:{
				romsize = "512 KiB";
				banks = 32;
			}
			break;
			case 0x05:{
				romsize = "1 MiB";
				banks = 64;
			}
			break;
			case 0x06:{
				romsize = "2 MiB";
				banks = 128;
			}
			break;
			case 0x07:{
				romsize = "4 MiB";
				banks = 256;
			}
			break;
			case 0x08:{
				romsize = "8 MiB";
				banks = 512;
			}
			break;
			case 0x52:{
				romsize = "1.1 MiB";
				banks = 72;
			}
			break;
			case 0x53:{
				romsize = "1.2 MiB";
				banks = 80;
			}
			break;
			case 0x54:{
				romsize = "1.5 MiB";
				banks = 96;
			}
			break;
			default:{
				romsize = "<Undefined>";
				banks = 2;
			}
		}
		
		cart["romsize"] = romsize;
		cart["rombanks"] = banks;
	}
	
	
	/* RAM Size */ /* 0x149 */
	
	{
		var code = byte_buffer[0x149];
		
		cart["ramsize_code"] = code;
		
		var ramsize;
		var banks = 0;
		switch(code){
			case 0x00:{
				ramsize = "No RAM";
				banks = 0;
			}
			break;
			case 0x02:{
				ramsize = "8 KiB";
				banks = 1;
			}
			break;
			case 0x03:{
				ramsize = "32 KiB";
				banks = 4;
			}
			break;
			case 0x04:{
				ramsize = "128 KiB";
				banks = 16;
			}
			break;
			case 0x05:{
				ramsize = "64 KiB";
				banks = 8;
			}
			break;
			default:{
				ramsize = "<Undefined>";
			}
		}
		
		cart["ramsize"] = ramsize;
		cart["rambanks"] = banks;
	}
	
	
	/* Destination Code */ /* 0x14A */
	
	{
		var code = byte_buffer[0x14A];
		
		cart["destination_code"] = code;
		
		var destination;
		if(code==0x00){
			destination = "Japan";
		}
		else if(code==0x01){
			destination = "Overseas";
		}
		else{
			destination = "<Undefined>";
		}
		
		cart["destination"] = destination;
	}
	
	
	/* Old License Code */
	
	{
		/* TODO */
	}
	
	
	/* ROM Version Number */
	
	{
		/* TODO */
	}
	
	
	/* Header Checksum */
	
	{
		/* TODO */
	}
	
	
	/* Global Checksum */
	
	{
		/* TODO */
	}
	
	return cart;
}

