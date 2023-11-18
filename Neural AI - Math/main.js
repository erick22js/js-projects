
//		indices		  0    1    2    3    4    5    6    7    8    9    a    b    c    d    e    f
const 	symbols = 	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '=', ' '];

function PROG_toSymbols(code){
	var str = "";
	for(var i=0; i<7; i++){
		str += symbols[code&0xf];
		code >>= 4;
	}
	return str;
}

function PROG_toSymbolsIdcode(code, list){
	for(var i=0; i<7; i++){
		list[i] = code&0xf;
		code >>= 4;
	}
	return list;
}

function PROG_toCode(str){
	var code = 0;
	for(var ci=0; ci<7; ci++){
		var chr = str[ci];
		for(var i=0; i<16; i++){
			if(symbols[i]==chr){
				code |= i<<(4*ci);
				break;
			}
			else if(i==15){
				code |= 0xf<<(4*ci);
			}
		}
	}
	return code;
}

function PROG_toCodeIdcode(list){
	var code = 0;
	for(var ci=0; ci<7; ci++){
		var ccode = list[ci]&0xf;
		if(ccode){
			code |= (ccode&0xf)<<(4*ci);
		}
		else{
			code |= 0xf<<(4*ci);
		}
	}
	return code;
}

function PROG_toIdcodeCode(code, list){
	for(var ci=0; ci<7; ci++){
		list[ci] = code&0xf;
		code >>= 4;
	}
	return list;
}

function PROG_genRandomExp(maxopr1=100, maxopr2=100){
	var opr1 = Math.floor(Math.random()*maxopr1);
	var opr2 = Math.floor(Math.random()*maxopr2);
	var opr = symbols[10+Math.floor(Math.random()*3)];
	var str = ""+opr1+""+opr+""+opr2;
	return str;
}


var exps = [];
var picked = 0;
var better_did = null;
var generation = 1;
var neurals = new Array(1000);

for(var i=0; i<1000; i++){
	neurals[i] = createNeural(7, 7, 25, 25, 16);
	neurals[i].randomize(1);
	neurals[i].points = 0;
	neurals[i].disable = false;
	neurals[i].rescode = [];
	neurals[i].id = i;
}

var delimiter = 1;

function run_section(){
	if(better_did!=null){
		for(var i=0; i<1000; i++){
			if(neurals[i]==better_did)
				continue;
			better_did.clone(neurals[i]);
		}
		for(var i=0; i<1000; i++){
			neurals[i].points = 0;
			for(var pin=0; pin<7; pin++){
				neurals[i].input[pin] = 0;
			}
			neurals[i].randomize(delimiter);
		}
		delimiter *= 0.999;
		generation++;
	}
	for(var exi=0; exi<20; exi++){
		exps[exi] = PROG_genRandomExp();
		var result = eval(exps[exi]);
		var idcode = [];
		PROG_toIdcodeCode(PROG_toCode(exps[exi]), idcode);
		var best_points = -Infinity;
		var best_elected = null;
		for(var i=0; i<1000; i++){
			for(var pin=0; pin<7; pin++){
				neurals[i].input[pin] = idcode[pin];
			}
			neurals[i].execute();
			neurals[i].rescode[exi] = PROG_toCodeIdcode(neurals[i].output);
			var symbol = PROG_toSymbols(neurals[i].rescode[exi]);
			//Eval point for the result
			try{
				var evres = eval(symbol);
				if(evres==result){
					neurals[i].points += 1000;
				}
				else{
					var dif = Math.abs(evres-result);
					neurals[i].points -=
						dif>5?10:
						dif>50?50:
						dif>1000?100:
						500;
				}
			}catch(e){
				neurals[i].points -= 5000;
			}
			if((neurals[i].points>best_points)&&(!isNaN(neurals[i].points))){
				best_points = neurals[i].points;
				best_elected = neurals[i];
			}
		}
		better_did = best_elected;
	}
	picked = better_did.id;
}

function MAIN_updUI(){
	//Update operations
	for(var i=1; i<=20; i++){
		var res = "";
		try{
			res = eval(PROG_toSymbols(neurals[picked].rescode[i-1]));
		}catch(err){
			res = "[Invalid!]";
		}
		window["outt_opr"+i].innerText = exps[i-1] + ";	real => "+(eval(exps[i-1])) + "____________=> " + PROG_toSymbols(neurals[picked].rescode[i-1])+"; real => "+res;
	}
	outt_points.innerText = "id: "+picked+"; points: "+neurals[picked].points+"; delimiter: "+delimiter+"; generation: "+generation;
}


run_section();
MAIN_updUI();

function MAIN_run(){
	run_section();
	MAIN_updUI();
	requestAnimationFrame(MAIN_run);
}

window.onkeydown = function(k){
	console.log(k);
	if(k.key=="u"){
		run_section();
		MAIN_updUI();
		alert("Updated!");
	};
	if(k.key=="r"){
		MAIN_run();
	}
	if(k.key=="a"){
		picked--;
		picked = picked<0?999:picked;
		MAIN_updUI();
	}
	if(k.key=="d"){
		picked++;
		picked = picked>999?0:picked;
		MAIN_updUI();
	}
}
