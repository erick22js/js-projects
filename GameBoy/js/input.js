
var istc = 0;

var save = [0, 0, 0, 0];

window.onkeydown = function(ev){
	if(ev.key=="1"){
		var times = Number(prompt("How much instructions step to advance?"));
		for(var i=0; i<times; i++){
			cpu_run();
		}
		cpu_step();
	}
	if(ev.key=="2"){
		istc++;
		for(var i=0; i<127; i++){
			cpu_run();
		}
		cpu_step();
	}
	if(ev.key=="3"){
		istc++;
		cpu_step();
	}
	if(ev.key=="4"){
		cpu_step();
		cpu_step();
		cpu_step();
		cpu_step();
	}
	if(ev.key=="5"){
		control_step();
		console.log("Control Stepped!");
	}
	if(ev.key=="6"){
		var run_until = Number(prompt("RUN UNTIL:\n\n1 - PC is Equal\n2 - MEMORY Read access\n3 - MEMORY Write access\n4 - MEMORY Write data access"));
		switch(run_until){
			case 1:{
				var offset = Number(prompt("Say the address:", save[0]));
				save[0] = offset;
				do{
					cpu_run();
				}while(regs16[REG16_PC]!=offset);
				console.log("Cpu reached!");
				debug_print();
			}
			break;
			case 2:{
				var offset = Number(prompt("Say the address:", save[0]));
				save[0] = offset;
				do{
					cpu_run();
				}while((bus_adrR!=offset));
				console.log("Cpu reached!");
				debug_print();
			}
			break;
			case 3:{
				var offset = Number(prompt("Say the address:", save[0]));
				save[0] = offset;
				do{
					cpu_run();
				}while((bus_adrW!=offset));
				console.log("Cpu reached!");
				debug_print();
			}
			break;
			case 4:{
				var offset = Number(prompt("Say the address:", save[0]));
				var data = Number(prompt("Say the data:", save[1]));
				save[0] = offset;
				save[1] = data;
				do{
					cpu_run();
				}while(!((bus_adrW==offset)&&(data==bus_get(bus_adrW))));
				console.log("Cpu reached!");
				debug_print();
			}
			break;
		}
		console.log(cpu_state2str());
		stdout.textContent = cpu_state2str();
	}
	/* Executes a 10,000,000 instruction */
	if(ev.key=="7"){
		{
			var lt = control_wp.now();
			for(var i=0; i<10000000/16; i++) control_step();
			debug_print();
			stdout.textContent = cpu_state2str();
			console.log("Executed "+((~~(10000000/16))*16)+" instructions for "+(((control_wp.now()-lt)/1000).toFixed(3))+" seconds!");
		}
	}
	/* Executes a frame (until V-Blank Trigger) */
	if(ev.key=="9"){
		var dif = 0;
		while(true){
			control_step();
			if((mem_registers[REGC_LY]-dif)<0){
				break;
			}
			dif = mem_registers[REGC_LY];
		}
		debug_print();
		console.log("Executed Frame!");
	}
	if(ev.key=="0"){
		
		// Fill the buffer
		
		for(var ti=0; ti<288; ti++){
			var pairs = [];
			for(var li=0; li<16; li+=2){
				pairs.push([cpu_getMem8(0x8000+ti*16+li), cpu_getMem8(0x8000+ti*16+li+1)]);
			}
			var y = (ti>>4)<<3;
			for(var li=0; li<8; li++){
				var x = (ti&0xf)<<3;
				var offy = li;
				for(var offx = 0; offx<8; offx++){
					var pair = pairs[li];
					var b1 = (pair[0]>>(7-offx))&1;
					var b2 = (pair[1]>>(7-offx))&1;
					var index = (b1+(b2<<1));
					var color = index==0?0xffffffff:index==1?0xffaaaaaa:index==2?0xff555555:index==3?0xff000000:0xff0000ff;
					VBUFFER32[(y+offy)*DWIDTH+x+offx] = color;
				}
			}
		}
		
		display.updateV();
	}
	if(ev.key=="Enter"){
		if(control_running){
			control_running = false;
			stdoutc.textContent = "Enter for start running; Backspace for stop";
		}
		else{
			control_init();
		}
	}
	if(ev.key=="Backspace"){
		control_running = false;
		stdoutc.textContent = "Enter for start running; Backspace for stop";
	}
	if(ev.key=="b"&&ev.ctrlKey){
		var file_i = document.createElement("input");
		file_i.type = "file";
		file_i.onchange = function(v){
			var reader = new FileReader();
			reader.onload = function(dt){
				var res = dt.target.result;
				var bytes = new Uint8Array(res);
				sys_loadCart(bytes);
				sys_start();
			}
			console.log(v.target.files);
			console.log(reader);
			reader.readAsArrayBuffer(v.target.files[0]);
			stdoutc.textContent = "Enter for start running; Backspace for stop";
		}
		document.body.appendChild(file_i);
		file_i.click();
		document.body.removeChild(file_i);
	}
	if(ev.key=="m"&&ev.ctrlKey){
		var dump = new Uint8Array(0x10000);
		for(var bi=0; bi<0x10000; bi++){
			dump[bi] = bus_get(bi);
		}
		var blob = new Blob([dump], {type: "application/octet-stream"});
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		var fileName = "memory-dump.bin";
		link.download = fileName;
		link.click();
	}
	//return false;
}

window.onkeyup = function(ev){
	
}
