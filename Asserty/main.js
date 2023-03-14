
var machine = new AssertyMachine(0xffff+1, [
	{	//main memory
		offset:0,
		size:0x8000,
	},
	{	//stack memory state
		offset:0x8000,
		size:0x4000
	},
	{	//stack memory
		offset:0xc000,
		size:0x4000
	}
]);

editor.value = 
`; Asserty-1686

dl8 &0x0, [0x14, 0x28, 0x45, 0x88]

_main:
  mov &0x1, r1
`;
/*`;início do programa
;Bem-vindo ao compilador do Asserty
;  fortemente inspirado em Assembly 8086
;  o endereço de início é 0x0
;  para pular para endereços, deve-se utilizar o prefixo '&'
;  há os registros: stp, inp, acu, fmp, mbp, gs, e 'r's de 
;  1 á 12
;  constantes podem ser definidas indiretamente:
;    ex: escopo:
;  ou diretamente:
;    ex: define escopo 0x2a

define len 0x4

dl &0, [56]

start:
 mov len, r1
 jmp &test

loop:
 sub 0x1, r1
 jgt r1, &loop
 jet r1, &end

test:
 mov 0x5, r5
 jmp &loop

set8:
 mov 0x8, r8
 ret

end:
 mov 0x1, r2
 call &set8
 mov 0x7, r7


`;*/

var code = new Uint8Array(256*256);
var i=0;



code[i++] = Insts.add_lit_reg;
code[i++] = 0b01100110;
code[i++] = 0b00000000;
code[i++] = Regs.r1;

code[i++] = Insts.xor_reg_lit;
code[i++] = Regs.r1;
code[i++] = 0b01001011;
code[i++] = 0b00000000;

function doin(){
output.value = "";
for(var i=0; i<1024; i++)
	machine.cpu.step();
}