var code = new EmunatMemory(1024*1024);

// mov.s r8, 0x80000000:d32
code.add8(0x42);
code.add8(0x18);
code.add32(0x80000000);

// st64 [0x70], r8
code.add8(0x5B);
code.add8(0x08);
code.add64(0x70);

// ld64 r3, [0x70]
code.add8(0x53);
code.add8(0x03);
code.add64(0x70);

var vm = new EmunatVM(code);

