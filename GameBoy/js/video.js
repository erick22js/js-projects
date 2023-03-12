
const VIDEO_MODE_HBLANK = 0;
const VIDEO_MODE_VBLANK = 1;
const VIDEO_MODE_OAM = 2;
const VIDEO_MODE_TRANSFER = 3;

const VIDEO_OAM_TOTAL = 40;
const VIDEO_OAM_LINELIMIT = 10;

var video_tdot = 0;
var video_mode = VIDEO_MODE_OAM;

const VIDEO_DOT_TICK = 30;

var video_pal_bg = new Uint32Array([0xffffffff, 0xffaaaaaa, 0xff555555, 0xff000000]);
var video_pal_ob0 = new Uint32Array([0xffffffff, 0xffaaaaaa, 0xff555555, 0xff000000]);
var video_pal_ob1 = new Uint32Array([0xffffffff, 0xffaaaaaa, 0xff555555, 0xff000000]);

const video_oamscan_order = new Array(VIDEO_OAM_LINELIMIT);
const video_oamscan_x = new Array(VIDEO_OAM_LINELIMIT);
const video_oamscan_y = new Array(VIDEO_OAM_LINELIMIT);
const video_oamscan_tile = new Array(VIDEO_OAM_LINELIMIT);
const video_oamscan_flags = new Array(VIDEO_OAM_LINELIMIT);
var video_oamscan_scanned = 0;


function video_4cpal(pal, code){
	for(var ci=0; ci<8; ci+=2){
		var ccode = (code>>ci)&3;
		pal[ci>>1] = ccode==0?0xffffffff:ccode==1?0xffaaaaaa:ccode==2?0xff555555:0xff000000;
	}
}

/* Increments LY Register */
function video_incly(){
	mem_registers[REGC_LY]++;
	if(mem_registers[REGC_LY]==mem_registers[REGC_LYC]){
		mem_registers[REGC_STAT] |= 0b00000100;
		if(mem_registers[REGC_STAT]&0b01000000){ /* LYC Selector */
			control_interrupt(CONTROL_INT_LCDS);
		}
	}
	else{
		mem_registers[REGC_STAT] &= 0b11111011;
	}
}

function video_oam(){
	if(video_tdot>=80){
		var ly = mem_registers[REGC_LY];
		
		video_oamscan_scanned = 0;
		
		var sprite_height = mem_registers[REGC_LCDC]&0x04?16:8;
		
		for(var oi=0; oi<VIDEO_OAM_TOTAL; oi++){
			var sprite_y = mem_oam[(oi<<2)]-16;
			var sprite_x = mem_oam[(oi<<2)|1]-8;
			var sprite_tile = mem_oam[(oi<<2)|2];
			var sprite_flags = mem_oam[(oi<<2)|3];
			
			if((sprite_y==sprite_x)&&(sprite_x==0)){
				continue;
			}
			
			/* Test Y Position */
			if((ly>=sprite_y)&&(ly<(sprite_y+sprite_height))){
				
				if(video_oamscan_scanned>=VIDEO_OAM_LINELIMIT){
					
					var index = -1;
					var longest_x = -8;
					
					/* Test X Position for lesser priorities replacing */
					for(var si=0; si<VIDEO_OAM_LINELIMIT; si++){
						if((video_oamscan_x[si]>sprite_x)&&(video_oamscan_x[si]>=longest_x)){
							longest_x = video_oamscan_x[si];
							index = si;
						}
					}
					
					if(index!=(-1)){
						video_oamscan_x[index] = sprite_x;
						video_oamscan_y[index] = sprite_y;
						video_oamscan_flags[index] = sprite_flags;
						video_oamscan_tile[index] = sprite_tile;
					}
					
				}
				else{
					video_oamscan_x[video_oamscan_scanned] = sprite_x;
					video_oamscan_y[video_oamscan_scanned] = sprite_y;
					video_oamscan_flags[video_oamscan_scanned] = sprite_flags;
					video_oamscan_tile[video_oamscan_scanned] = sprite_tile;
					video_oamscan_scanned++;
				}
				
			}
		}
		
		/* Sort sprites by X Position */
		/*
		for(var si=0; si<video_oamscan_scanned; si++){
			var lesser = DWIDTH+DWIDTH;
			var lesser_i = 0;
			
			for(var oi=0; oi<video_oamscan_scanned; oi++){
				if(video_oamscan_x[video_oamscan_scanned]<lesser){
					lesser = video_oamscan_x[video_oamscan_scanned];
					lesser_i = oi;
				}
			}
			
			video_oamscan_order[si] = lesser_i;
		}
		*/
		
		video_mode = VIDEO_MODE_TRANSFER;
		mem_registers[REGC_STAT] = (mem_registers[REGC_STAT]&0b11111100)|VIDEO_MODE_TRANSFER;
	}
}

function video_transfer(){
	if(video_tdot>=252){
		
		var ly = mem_registers[REGC_LY];
		var dbuffer_i = ly*DWIDTH;
		
		/* Setup base values */
		var bgw_tile_adr = mem_registers[REGC_LCDC]&0x10?0x8000:0x8800;
		var bg_map_adr = mem_registers[REGC_LCDC]&0x8?0x9C00:0x9800;
		var win_map_adr =  mem_registers[REGC_LCDC]&0x40?0x9C00:0x9800;
		var bank = 128;
		if(mem_registers[REGC_LCDC]&0x10){
			bank = 0;
		}
		
		var win_x = mem_registers[REGC_WX]; /* Windows X Position */
		var win_y = mem_registers[REGC_WY]; /* Windows Y Position */
		var win_enable = (win_y<DHEIGHT)&&(mem_registers[REGC_LCDC]&0x20); /* Window can valid be rendered in current line */
		
		/* Renders the entirely line of pixels */
		for(var px=0; px<DWIDTH; px++){
			
			var pixel = 0xff0000ff;
			
			/* Draws Background */
			if(mem_registers[REGC_LCDC]&0x01){ /* Background and Window Enabled */
				/*if(false){
					///* Retrieving Window Char *
					var winchar_offx = (px-win_x)&0b111;
					var winchar_offy = (ly)&0b111;
					var winchar_x = ((px-win_x)&0xff)>>3;
					var winchar_y = (ly)>>3;
					var winchar = bus_get(win_map_adr+(winchar_x)+(winchar_y<<5));
					
					///* Retrieving Char Pixel *
					var charil = (bus_get(bgw_tile_adr+(winchar<<4)+(winchar_offy<<1))>>(7-winchar_offx))&1;
					var charih = (bus_get(bgw_tile_adr+(winchar<<4)+(winchar_offy<<1)+1)>>(7-winchar_offx))&1;
					var chari = (charil+(charih<<1));
					
					pixel = 
						chari==0?0xffffffff:
						chari==1?0xffaaaaaa:
						chari==2?0xff555555:
						chari==3?0xff000000:0xff0000ff;
					pixel = 0xff0000ff;
				}
				else*/
				{
					/* Retrieving Background Char */
					var bgchar_offx = (px+mem_registers[REGC_SCX])&0b111;
					var bgchar_offy = (ly+mem_registers[REGC_SCY])&0b111;
					var bgchar_x = (px+mem_registers[REGC_SCX])>>3;
					var bgchar_y = (ly+mem_registers[REGC_SCY])>>3;
					var bgchar = (bus_get(bg_map_adr+(bgchar_x)+(bgchar_y<<5))+bank)&0xff;
					
					/* Retrieving Char Pixel */
					var charil = (bus_get(bgw_tile_adr+(bgchar<<4)+(bgchar_offy<<1))>>(7-bgchar_offx))&1;
					var charih = (bus_get(bgw_tile_adr+(bgchar<<4)+(bgchar_offy<<1)+1)>>(7-bgchar_offx))&1;
					var chari = (charil|(charih<<1));
					
					pixel = video_pal_bg[chari&3];
				}
				
			}
			
			if(mem_registers[REGC_LCDC]&0x02){ /* OBJ Enabled */
				
				objloop: for(var obji=0; obji<video_oamscan_scanned; obji++){
					var order = obji;//video_oamscan_order[obji];
					
					if((px>=video_oamscan_x[order])&&((px<(video_oamscan_x[order]+8)))){
						var oamchar_offx = (px-video_oamscan_x[order]);
						var oamchar_offy = (ly-video_oamscan_y[order]);
						var oamchar = video_oamscan_tile[order];
						
						oamchar_offx = ((video_oamscan_flags[order]&0x20)?~oamchar_offx:oamchar_offx)&0b111; /* X-Flip */
						oamchar_offy = ((video_oamscan_flags[order]&0x40)?~oamchar_offy:oamchar_offy)&0b1111; /* Y-Flip */
						
						/* Retrieving Char Pixel */
						var charil, charih, chari;
						if(mem_registers[REGC_LCDC]&0x04){ /* Mode 8x16 */
							if(oamchar_offy&0b1000){
								oamchar = (oamchar&0xfe)|1;
								oamchar_offy &= 0b111;
								charil = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy))>>(7-oamchar_offx))&1;
								charih = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy)+1)>>(7-oamchar_offx))&1;
								chari = (charil|(charih<<1));
							}
							else{
								oamchar = (oamchar&0xfe);
								oamchar_offy &= 0b111;
								charil = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy))>>(7-oamchar_offx))&1;
								charih = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy)+1)>>(7-oamchar_offx))&1;
								chari = (charil|(charih<<1));
							}
						}
						else{ /* Mode 8x8 */
							oamchar_offy &= 0b0111;
							charil = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy<<1))>>(7-oamchar_offx))&1;
							charih = (bus_get(0x8000+(oamchar<<4)+(oamchar_offy<<1)+1)>>(7-oamchar_offx))&1;
							chari = (charil|(charih<<1));
						}
						
						
						if(chari==0){
							continue objloop;
						}
						
						/* Non CGB Palette Color Picker */
						pixel = video_oamscan_flags[order]&0x10?video_pal_ob1[chari&3]:video_pal_ob0[chari&3];
						//pixel = 0xffff0000;
						
						break objloop;
					}
				}
				/*
				while((px>video_oamscan_x[oam_index])&&(oam_index<video_oamscan_scanned)){
					oam_index++;
				}
				
				if(oam_index<video_oamscan_scanned){
					pixel = 0xffff0000;
				}
				*/
				
			}
			
			if(mem_registers[REGC_LCDC]&0x80){ /* LCD Enabled/Active */
				DBUFFER32[dbuffer_i] = pixel;
			}
			else{
				DBUFFER32[dbuffer_i] = 0xff000000;
			}
			
			win_x++;
			dbuffer_i++;
		}
		
		if(mem_registers[REGC_STAT]&0b1000){ /* H-Blank Selector */
			control_interrupt(CONTROL_INT_LCDS);
		}
		
		video_pixel = 0;
		video_mode = VIDEO_MODE_HBLANK;
		mem_registers[REGC_STAT] = (mem_registers[REGC_STAT]&0b11111100)|VIDEO_MODE_HBLANK;
	}
}

function video_hblank(){
	if(video_tdot>=476){
		video_tdot = 0;
		
		video_incly();
		
		if(mem_registers[REGC_LY]>=DHEIGHT){
			video_mode = VIDEO_MODE_VBLANK;
			mem_registers[REGC_STAT] = (mem_registers[REGC_STAT]&0b11111100)|VIDEO_MODE_VBLANK;
			display.update();
			
			control_interrupt(CONTROL_INT_VBLANK);
			if(mem_registers[REGC_STAT]&0b10000){ /* V-Blank Selector */
				control_interrupt(CONTROL_INT_LCDS);
			}
		}
		else{
			//if(mem_registers[REGC_STAT]&0b100000){ /* OAM Selector */
			//	control_interrupt(CONTROL_INT_LCDS);
			//}
			video_mode = VIDEO_MODE_OAM;
			mem_registers[REGC_STAT] = (mem_registers[REGC_STAT]&0b11111100)|VIDEO_MODE_OAM;
		}
	}
}

function video_vblank(){
	if(video_tdot>=476){
		video_tdot = 0;
		
		video_incly();
		
		if(mem_registers[REGC_LY]>=154){
			//if(mem_registers[REGC_STAT]&0b100000){ /* OAM Selector */
			//	control_interrupt(CONTROL_INT_LCDS);
			//}
			mem_registers[REGC_LY] = 0;
			video_mode = VIDEO_MODE_OAM;
			mem_registers[REGC_STAT] = (mem_registers[REGC_STAT]&0b11111100)|VIDEO_MODE_OAM;
		}
	}
}

function video_tick(){
	/* Tick video dot */
	video_tdot += VIDEO_DOT_TICK;
	
	/* Execution */
	switch(video_mode){
		case VIDEO_MODE_VBLANK:{
			video_vblank();
		}
		break;
		case VIDEO_MODE_HBLANK:{
			video_hblank();
		}
		break;
		case VIDEO_MODE_TRANSFER:{
			video_transfer();
		}
		break;
		case VIDEO_MODE_OAM:{
			video_oam();
		}
		break;
	}
}
