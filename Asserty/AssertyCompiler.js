
/* Sintaxe de Asserty

- cada rotina é definida por uma tag e dois pontos
main:
- a rotina é indicada por dois pontos, o programa 
  sempre se inicia por "main"
- os sub-comandos devem sempre estar dentro de uma 
  sub-rotina, eles devem ser identados
- cada programa possuí n registradores, estes devem
  ser utilizados para realizar operações


*/

const dbg = document.getElementById("dbg");

function compileAsr(code){
	function isSpace(code){
		return ([9, 10, 11, 32]).includes(code);
	}
	function isName(code){
		return (code>=48&&code<=57)||(code>=65&&code<=90)||(code>=97&&code<=122)||code==95;
	}
	function endOfLine(entity){
		return entity=="\n"||entity==null;
	}
	var words = [];
	var lines = [0];
	{
		var longword = "";
		for(var i=0; i<code.length; i++){
			var car = code.charAt(i);
			if(car == "\n")
				lines.push(lines.length);
			if(!isName(code.charCodeAt(i))){
				if(longword!="")
					words.push(longword);
				words.push(car);
				longword = "";
			}else{
				longword += car;
			}
			if(i==code.length-1){
				if(longword!="")
					words.push(longword);
				break;
			}
		}
	}
	{
		var nwords = [];
		var nlines = [];
		var string = "";
		var inString = null;
		var ammountBr = 0;
		var linen = 0;
		for(var w=0; w<words.length; w++){
			var word = words[w];
			if(word=="\n"){
				if(w==0)
					continue;
				if(inString!=null){
					string+=word;
					continue;
				}
				if(ammountBr==0){
					nwords.push("\n");
					nlines.push(lines[linen]);
				}
				ammountBr++;
				linen++;
			}else{
				ammountBr = 0;
				if(inString!=null){
					if(word==inString){
						nwords.push(string);
						nwords.push(inString);
						inString = null
					}
					else
						string+=word;
				}else{
					string = "";
					if(word==" "||word=="\t")
						continue;
					if(word=='"'||word=="'"){
						inString = word;
						nwords.push(word);
					}else{
						nwords.push(word);
					}
				}
			}
		}
		words = nwords;
		lines = nlines;
	}
	{
		var nwords = [];
		var comment = null;
		for(var i=0; i<words.length; i++){
			var act = words[i];
			if(comment==null){
				if(act==";"){
					comment = act;
				}else{
					nwords.push(act);
				}
			}else if(comment==";"){
				if(act=="\n"){
					comment = null
					nwords.push(act);
				}
			}
		}
		words = nwords;
	}
	var map = {"Error":null};
	var insts = [];
	var p = -1;
	var linei = -1;
	var ended = ()=>{return p>=words.length};
	var fetch = ()=>{p++; return words[p]};
	var parseError = (type)=>{map.Error = "Error at line "+lines[linei]+": "+(type)};
	function getType(val){
		if(!isNaN(val)){
			return "lit";
		}if(val=="&"){
			return "ptr";
		}if(val in bank.registers){
			return "reg";
		}else{
			return "tag";
		}
	}
	parseloop: while(true){
		p++;
		linei++;
		var inst = {};
		if(p>=words.length)
			break;
		var word = words[p];
		if(word=="\n"){
			continue;
		}
		if(word in bank.keywords){
			switch(word){
				case "define":{
						var nxt = fetch();
						if(getType(nxt)=="tag"){
							var lit = fetch();
							var along = fetch();
							if(getType(lit)=="lit"){
								inst = {
									type:"const",
									id:nxt,
									value:Number(lit),
								}
							}else{
								parseError("Expected a literal.");
								break parseloop;
							}
							if(!endOfLine(along)){
								parseError("Expected end of line.");
								break parseloop;
							}
						}else{
							parseError("Cannot set name '"+nxt+"' for constant.");
						}
					}
					break;
				case "dl8":
				case "dl32":
				case "dl":{
						inst.b = word=="dl"?0:word=="dl8"?2:4;
						var nxt = fetch();
						var data = [];
						inst.type = "datalist";
						if(endOfLine(nxt)||nxt!="&"){
							parseError("Expected memory pointer value.");
							break parseloop;
						}
						var nnxt = fetch();
						var typ = getType(nnxt);
						var acess_mode = 0;
						inst.pointertype = "mem";
						inst.pointer = nnxt;
						inst.size = 1 + 4 + 2;
						if(typ=="lit"){
						}else if(typ=="tag"){
							inst.pointertype = "tag";
						}else if(typ=="reg"){
							inst.pointertype = "ptr";
							acess_mode = 1;
							inst.size = 1 + 1 + 2;
						}
						if(endOfLine(nnxt)){
							parseError("Unexpected end of line.");
							break parseloop;
						}
						//Now detect next data
						var st = fetch();
						if(st!=","){
							parseError("Expected separator.");
							break parseloop;
						}
						var st = fetch();
						if(st=='"'){
							var str = fetch();
							if(str==null){
								parseError("Must define string content");
								break parseloop;
							}
							for(var c=0; c<str.length; c++){
								data.push(str.charCodeAt(c));
							}
							inst.size += data.length;
							if(fetch()!='"'){
								parseError("Invalid string closing");
								break parseloop;
							}
						}else if(st=="["){
							var last = "init"; //number or separator
							while(true){
								var val = fetch();
								var ty = getType(val);
								if(last=="init"||last=="separator"){
									if(endOfLine(val)){
										continue;
									}else if(val=="]"){
										break;
									}else if(ty=="lit"){
										data.push(Number(val));
										last = "number";
									}else if(ty=="tag"){
										data.push(val);
										last = "number";
									}else{
										parseError("Unexpected entity '"+val+"'");
										break parseloop;
									}
								}else if(last=="number"){
									if(endOfLine(val)){
										continue;
									}else if(val=="]"){
										break;
									}else if(val==","){
										last = "separator";
									}else{
										parseError("Unexpected entity '"+val+"'");
										break parseloop;
									}
								}
							}
						}else{
							parseError("Unexpected entity '"+st+"'");
							break parseloop;
						}
						if(data.length>256){
							parseError("Data list out of bounds.\nMax is 256, but list contain "+data.length+" elements.");
							break parseloop;
						}
						st = fetch()
						if(!endOfLine(st)){
							parseError("Expected end of line.");
							break parseloop;
						}
						inst.size += data.length*2;
						inst.data = data;
					}
			}
		}else if(word in bank.registers){
			parseError("Unexpected register '"+word+"'");
			break parseloop;
		}else if(word in bank.instructions){
			var type = bank.instructions[word];
			inst.type = "instruction";
			inst.family = word;
			var args = [];
			//First check if is a empty command
			for(var i in type.subsets){
				if(type.subsets[i][0].size==1){
					var nnt = fetch();
					if(endOfLine(nnt)){
						inst.code = type.subsets[i][1];
						inst.size = type.subsets[i][0].size;
						insts.push(inst);
						continue parseloop;
					}else if(type.subsets.length==1){
						parseError("Unexpected entity '"+nnt+"'");
						break parseloop;
					}
				}
			}
			var args_name = "";
			while(true){
				var fetc = fetch();
				if(endOfLine(fetc)||ended())
					break;
				if(fetc==","){
					args_name += "_";
					continue;
				}
				//args.push(args);
				if(getType(fetc)=="ptr"){
					var nnt = fetch();
					if(getType(nnt)=="lit"){
						args.push(["mem", nnt]);
						args_name += "mem";
					}else if(getType(nnt)=="reg"){
						args.push(["ptr", nnt]);
						args_name += "ptr";
					}else if(getType(nnt)=="tag"){
						args.push(["mem", nnt, "isTag"]);
						args_name += "mem";
					}
				}else{
					var typ = getType(fetc);
					if(typ=="tag"){
						args.push(["lit", fetc, "isTag"]);
						args_name += "lit";//"lit";
					}else{
						args.push([typ, fetc]);
						args_name += typ;
					}
					//args.push([getType(fetc), fetc]);
					//args_name += getType(fetc);
				}
			}
			//Now confirm args list
			var confirmed = false;
			for(var i in type.subsets){
				if(type.subsets[i][0].name==args_name){
					inst.code = type.subsets[i][1];
					inst.size = type.subsets[i][0].size;
					confirmed = true;
				}
			}
			if(!confirmed){
				parseError("Invalid set of arguments '"+args_name+"'");
				break parseloop;
			}
			inst.argsNames = args_name;
			inst.args = args;
		}else{
			var nxt = fetch();
			console.log(word);
			switch(nxt){
				case ":":
					var sonxt = fetch();
					if(endOfLine(sonxt)){
						inst = {
							type:"tag",
							id:word
						}
					}else{
						parseError("Unexpected entity '"+sonxt+"'");
						break parseloop;
					}
					break;
				default:
					parseError("Unexpected entity '"+word+"'");
					break parseloop;
			}
		}
		insts.push(inst);
	}
	map.instructions = insts;
	map.lines = lines;
	map.words = words;
	
	//To byte code
	var bytecode = [];
	compilescope: {
		var insts = map.instructions;
		var tags = {};
		var offset = 0;
		//Generate tags
		for(var i=0; i<insts.length; i++){
			if(insts[i].type=="tag"){
				if(tags[insts[i].id]!=null){
					map.Error = "Error: cannot duplicate const '"+insts[i].id+"' declaration";
					break compilescope;
				}
				tags[insts[i].id] = offset;
			}
			else if(insts[i].type=="const"){
				if(tags[insts[i].id]!=null){
					map.Error = "Error: cannot duplicate const '"+insts[i].id+"' declaration";
					break compilescope;
				}
				tags[insts[i].id] = insts[i].value;
			}
			else if(insts[i].type=="instruction"){
				offset += insts[i].size;
			}
			else if(insts[i].type=="datalist"){
				offset += insts[i].size;
			}
			//offset++;
		}
		map.tags = tags;
		//To byte code
		for(var i=0; i<insts.length; i++){
			if(insts[i].type=="instruction"){
				bytecode.push(insts[i].code);
				var args = insts[i].args;
				if(args==null)
					continue;
				for(var a=0; a<args.length; a++){
					switch(args[a][0]){
						case "lit":{
								var lit;
								if(args[a][2]==null)
									lit = Number(args[a][1]);
								else
									lit = tags[args[a][1]];
								bytecode.push((lit)&0xff);
								bytecode.push((lit>>8)&0xff);
							}
							break;
						case "reg":{
								var reg = bank.registers[args[a][1]];
								bytecode.push((reg)&0xff);
							}
							break;
						case "ptr":{
								var reg = bank.registers[args[a][1]];
								bytecode.push((reg)&0xff);
							}
							break;
						case "mem":{
								var lit;
								if(args[a][2]==null)
									lit = Number(args[a][1]);
								else
									lit = tags[args[a][1]];
								bytecode.push((lit)&0xff);
								bytecode.push((lit>>8)&0xff);
								bytecode.push((lit>>16)&0xff);
								bytecode.push((lit>>24)&0xff);
							}
							break;
					}
				}
			}else if(insts[i].type=="datalist"){
				bytecode.push(0x60+(insts[i].pointertype=="ptr")+insts[i].b);
				if(insts[i].pointertype=="mem"){
					var lit = Number(insts[i].pointer);
					bytecode.push( lit     &0xff);
					bytecode.push((lit>>8 )&0xff);
					bytecode.push((lit>>16)&0xff);
					bytecode.push((lit>>24)&0xff);
				}else if(insts[i].pointertype=="tag"){
					var lit = tags[insts[i].pointer];
					bytecode.push( lit     &0xff);
					bytecode.push((lit>>8 )&0xff);
					bytecode.push((lit>>16)&0xff);
					bytecode.push((lit>>24)&0xff);
				}else{
					bytecode.push(bank.registers[insts[i].pointer]);
				}
				var size = insts[i].data.length;
				bytecode.push( size    &0xff);
				bytecode.push((size>>8)&0xff);
				
				for(var l=0; l<size; l++){
					var lit = insts[i].data[l];
					lit = isNaN(lit)?tags[lit]:lit;
					bytecode.push( lit    &0xff);
					if(insts[i].b==0||insts[i].b==4)bytecode.push((lit>>8)&0xff);
					if(insts[i].b==4)bytecode.push((lit>>16)&0xff);
					if(insts[i].b==4)bytecode.push((lit>>24)&0xff);
				}
			}
		}
	}
	dbg.innerHTML = "Status => "+(map.Error?"<t style='color:#a00'>"+map.Error+"</t>":"<t style='color:#0a0'>no Errors</t>");
	output.value = JSON.stringify(map, null, 2);
	output.value = JSON.stringify(bytecode)+"\n\n"+output.value;
	return new Uint8Array(bytecode);
}


const bank = new function(){
	this.keywords = {
		"define":null,
		"dl":null,
		"dl8":null,
		"dl32":null,
	}
	this.registers = {
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
	/*
	reg = 1
	lit = 2
	ptr = 1
	mem = 4
	size => 1+arg1+arg2
	*/
	var subs = {
		lit_reg:{size: 4, name:"lit_reg"},
		reg_reg:{size: 3, name:"reg_reg"},
		reg_lit:{size: 4, name:"reg_lit"},
		lit_lit:{size: 5, name:"lit_lit"},
		lit_ptr:{size: 4, name:"lit_ptr"},
		ptr_lit:{size: 4, name:"ptr_lit"},
		reg_ptr:{size: 3, name:"reg_ptr"},
		ptr_reg:{size: 3, name:"ptr_reg"},
		ptr_ptr:{size: 3, name:"ptr_ptr"},
		lit_mem:{size: 7, name:"lit_mem"},
		mem_lit:{size: 7, name:"mem_lit"},
		reg_mem:{size: 6, name:"reg_mem"},
		mem_reg:{size: 6, name:"mem_reg"},
		mem_mem:{size: 9, name:"mem_mem"},
		ptr_mem:{size: 6, name:"ptr_mem"},
		mem_ptr:{size: 6, name:"mem_ptr"},
		lit    :{size: 3, name:"lit"},
		reg    :{size: 2, name:"reg"},
		ptr    :{size: 2, name:"ptr"},
		mem    :{size: 5, name:"mem"},
		noArg  :{size: 1, name:""},
	}
	this.instructions = {
		mov:{
			subsets:[
				[subs.lit_reg, 0x10],
				[subs.reg_reg, 0x11],
				[subs.reg_mem, 0x12],
				[subs.mem_reg, 0x13],
				[subs.lit_mem, 0x14],
				[subs.reg_ptr, 0x15],
				[subs.ptr_reg, 0x16],
				[subs.lit_ptr, 0x17],
			]
		},
		mov8:{
			subsets:[
				[subs.mem_reg, 0x18],
				[subs.ptr_reg, 0x19],
			]
		},
		mov32:{
			subsets:[
				[subs.mem_reg, 0x1e],
				[subs.ptr_reg, 0x1f],
			]
		},
		psh:{
			subsets:[
				[subs.lit, 0x1a],
				[subs.reg, 0x1b],
				[subs.mem, 0x1c]
			]
		},
		pop:{
			subsets:[
				[subs.reg, 0x1d]
			]
		}, //Aritmética
		add:{
			subsets:[
				[subs.lit_reg, 0x20],
				[subs.reg_reg, 0x21],
			]
		},
		sub:{
			subsets:[
				[subs.lit_reg, 0x22],
				[subs.reg_reg, 0x23],
			]
		},
		mul:{
			subsets:[
				[subs.lit_reg, 0x24],
				[subs.reg_reg, 0x25],
			]
		},
		div:{
			subsets:[
				[subs.lit_reg, 0x28],
				[subs.reg_reg, 0x29],
			]
		},
		odiv:{
			subsets:[
				[subs.lit_reg, 0x2a],
				[subs.reg_reg, 0x2b],
			]
		},
		inc:{
			subsets:[
				[subs.reg, 0x2c]
			]
		},
		dec:{
			subsets:[
				[subs.reg, 0x2d]
			]
		}, //Operadores a bit
		lsf:{
			subsets:[
				[subs.reg_lit, 0x30],
				[subs.reg_reg, 0x31],
			]
		},
		rsf:{
			subsets:[
				[subs.reg_lit, 0x32],
				[subs.reg_reg, 0x33],
			]
		},
		and:{
			subsets:[
				[subs.reg_lit, 0x34],
				[subs.reg_reg, 0x35],
			]
		},
		or:{
			subsets:[
				[subs.reg_lit, 0x36],
				[subs.reg_reg, 0x37],
			]
		},
		xor:{
			subsets:[
				[subs.reg_lit, 0x38],
				[subs.reg_reg, 0x39],
			]
		},
		not:{
			subsets:[
				[subs.reg, 0x3a]
			]
		}, //Jump instructions
		jmp:{
			subsets:[
				[subs.mem, 0x40],
				[subs.ptr, 0x41]
			]
		},
		jet:{
			subsets:[
				[subs.reg_mem, 0x42],
				[subs.reg_ptr, 0x43]
			]
		},
		jne:{
			subsets:[
				[subs.reg_mem, 0x44],
				[subs.reg_ptr, 0x45]
			]
		},
		jgt:{
			subsets:[
				[subs.reg_mem, 0x46],
				[subs.reg_ptr, 0x47]
			]
		},
		jlt:{
			subsets:[
				[subs.reg_mem, 0x48],
				[subs.reg_ptr, 0x49]
			]
		},
		jge:{
			subsets:[
				[subs.reg_mem, 0x4a],
				[subs.reg_ptr, 0x4b]
			]
		},
		jle:{
			subsets:[
				[subs.reg_mem, 0x4c],
				[subs.reg_ptr, 0x4d]
			]
		}, //Call functions
		call:{
			subsets:[
				[subs.mem, 0x50],
				[subs.ptr, 0x51]
			]
		},
		ret:{
			subsets:[
				[subs.noArg, 0x5a]
			]
		},
		"int":{
			subsets:[
				[subs.lit, 0x7f]
			]
		}
	}
	this.instructions_subsets = {
	//Instructions
	//Mov
	mov_lit_reg  : 0x10,
	mov_reg_reg  : 0x11,
	mov_reg_mem  : 0x12,
	mov_mem_reg  : 0x13,
	mov_lit_mem  : 0x14,
	mov_reg_ptr  : 0x15,
	mov_ptr_reg  : 0x16,
	mov_lit_ptr  : 0x17,
	
	//Stack instructions
	psh_lit      : 0x1a,
	psh_reg      : 0x1b,
	psh_mem      : 0x1c,
	pop_reg      : 0x1d,
	
	//Arithmetic Operations
	add_lit_reg  : 0x20,
	add_reg_reg  : 0x21,
	sub_lit_reg  : 0x22,
	sub_reg_reg  : 0x23,
	mul_lit_reg  : 0x24,
	mul_reg_reg  : 0x25,
	div_lit_reg  : 0x28,
	div_reg_reg  : 0x29,
	odiv_lit_reg : 0x2a,
	odiv_reg_reg : 0x2b,
	inc_reg      : 0x2c,
	dec_reg      : 0x2d,
	
	//Bit operations
	lsf_reg_lit  : 0x30,
	lsf_reg_reg  : 0x31,
	rsf_reg_lit  : 0x32,
	rsf_reg_reg  : 0x33,
	and_reg_lit  : 0x34,
	and_reg_reg  : 0x35,
	or_reg_lit   : 0x36,
	or_reg_reg   : 0x37,
	xor_reg_lit  : 0x38,
	xor_reg_lit  : 0x39,
	not_reg      : 0x3a,
	
	//Jump instructions
	jmp_lit      : 0x40, //directly jump
	jmp_ptr      : 0x41, //directly jump
	jet_reg_lit  : 0x42, //if equal
	jet_reg_ptr  : 0x43, //if equal
	jne_reg_lit  : 0x44, //if not equal
	jne_reg_ptr  : 0x45, //if not equal
	jgt_reg_lit  : 0x46, //if great than
	jgt_reg_ptr  : 0x47, //if great than
	jlt_reg_lit  : 0x48, //if less than
	jlt_reg_ptr  : 0x49, //if less than
	jge_reg_lit  : 0x4a, //if great than
	jge_reg_ptr  : 0x4b, //if great than
	jle_reg_lit  : 0x4c, //if less than
	jle_reg_ptr  : 0x4d, //if less than
	
	//Calls and sub-rotines with state saving
	call_lit     : 0x50,
	call_ptr     : 0x51,
	ret          : 0x5a, //restore last state (return)
	
	}
}
