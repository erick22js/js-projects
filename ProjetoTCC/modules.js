
/*
	Uma gota tem em média 0.5ml de água
	Cada metro corresponde a 150 pixels (metade do canvas)
	Cada linha horizontal de 150 pixels contém 20/3 Litros de água
*/

const LITER_FOR_DROP = 0.001*0.5;
const DROP_FOR_DROPS = 9;
const LITER_FOR_BKL = 6.6666666;
const BKL_FOR_LITER = 1/LITER_FOR_BKL;


const SOIL_PERMEABILITY = 1/2;

/*
	
*/

const DB = {}; /* Database */

var scenario = { /* Scene objects */
	"arduinos": [],
	"rain": [],
	"time": [12, 0, 0], //Hours, Minutes, Seconds
	"advance": 30, // In seconds
	"waittime": 5, // In Hours
	"raintime": 0, // In Hours
	"extra": 0,
};

/* Entry Point Functions */

(function(){
	/* Setup Scenario */
	// Lake
	scenario.lake = rdrAddRect("#04f", null, 0, height*.65, width, height*.25);
	scenario.lake.grow = function(liters){
		var grow = BKL_FOR_LITER*liters;
		if(scenario.lake.size[1]>(150-scenario.underlake.size[1])){
			grow *= .5;
		}
		scenario.lake.position[1] -= grow;
		scenario.lake.size[1] += grow;
	}
	// Underlake
	scenario.underlake = rdrAddRect("#b40", null, 0, height*.9, width*.5, height*.1);
	// Land
	scenario.land = rdrAddRect("#0d5", null, width*.5, height*.5, width*.5, height*.5);
	// Cage
	scenario.cage = rdrAddRect(null, "black", width*.8, height*.5-height/20, width/20, height/20);
	scenario.cage.dots = 0;
	
	// Rain
	for(var r=0; r<200; r++){
		var robj = rdrAddRect("#359", null, 100, 100, 1.5, 16);
		//robj.rotation = -.3; // Experimental
		robj.position[0] = Math.random()*width;
		robj.position[1] = -Math.random()*height;
		scenario["rain"].push(robj);
	}
})();

proto_app.update = function(dt){
	clearScreen((scenario.time[0]<6)||(scenario.time[0]>18)?"#245":(scenario.time[0]<7)?"#689":(scenario.time[0]>16)?"#ba5":"#aef");
	
	/* Process the weather */
	scenario.time[2] += scenario.advance;
	while(scenario.time[2]>=60){
		scenario.time[2] -= 60;
		scenario.time[1]++;
	}
	while(scenario.time[1]>=60){
		scenario.time[1] -= 60;
		scenario.time[0]++;
	}
	while(scenario.time[0]>=24){
		scenario.time[0] -= 24;
	}
	if(scenario.waittime>0){
		scenario.waittime -= scenario.advance/(60*60);
		scenario.extra += 240*dt;
		if(scenario.waittime<=0){
			scenario.raintime = 2+(Math.random()*8);
		}
	}
	else if(scenario.raintime>0){
		scenario.extra = 0;
		scenario.raintime -= scenario.advance/(60*60);
		if(scenario.raintime<=0){
			scenario.waittime = 12+(Math.random()*12);
		}
	}
	for(var ri=0; ri<scenario["rain"].length; ri++){
		var robj = scenario["rain"][ri];
		
		/* Process physic */
		if((scenario.raintime>0)||((robj.position[1]+robj.size[1])>0)){
			robj.position[1] += 750*dt;
		}
		
		/* Deal with collisions with scenario */
		/* Land */
		/*
		Uma gota tem velocidade de 18km/h em média
		Seria equivalente a 750 p/s se cada metro corresponder a 150 pixels
		*/
		{
			var col = robj.col_rect(scenario.land);
			if((col.bottom>0)&&(col.has)){
				robj.position[0] = Math.random()*width;
				robj.position[1] -= height+scenario.extra;
				scenario.lake.grow(LITER_FOR_DROP*DROP_FOR_DROPS*scenario.advance*SOIL_PERMEABILITY);
			}
		}
		/* Lake */
		{
			var col = robj.col_rect(scenario.lake);
			col.bottom -= 5;
			if((col.bottom>0)&&(col.has)){
				robj.position[0] = Math.random()*width;
				robj.position[1] -= height+scenario.extra;
				scenario.lake.grow(LITER_FOR_DROP*DROP_FOR_DROPS*scenario.advance*(SOIL_PERMEABILITY**2));
			}
		}
		/* Underlake */
		{
			var col = robj.col_rect(scenario.underlake);
			if((col.bottom>0)&&(col.has)){
				robj.position[0] = Math.random()*width;
				robj.position[1] -= height+scenario.extra;
				scenario.lake.grow(LITER_FOR_DROP*DROP_FOR_DROPS*scenario.advance*SOIL_PERMEABILITY);
			}
		}
		/* Cage */
		{
			var col = robj.col_rect(scenario.cage);
			if((col.bottom>0)&&(col.has)){
				robj.position[0] = Math.random()*width;
				robj.position[1] -= height+scenario.extra;
				scenario.cage.dots++;
			}
		}
	}
	
	/* Process the enviorment */
	if(scenario.lake.size[1]>(height*.2)){
		scenario.lake.grow(-LITER_FOR_BKL*SOIL_PERMEABILITY*(scenario.advance/3600));
	}
	
	/* Process the arduinos */
	for(var ai=0; ai<scenario["arduinos"].length; ai++){
		var ar = scenario["arduinos"][ai];
		
		ar.process(dt);
		
		/* Process physic */
		ar.obj.position[1] += 200*dt;
		
		/* Deal with collisions with scenario */
		/* Land */
		{
			var col = ar.obj.col_rect(scenario.land);
			if((col.bottom>0)&&(col.has)){
				ar.obj.position[1] -= col.bottom;
			}
		}
		/* Lake */
		{
			var col = ar.obj.col_rect(scenario.lake);
			col.bottom -= 5;
			if((col.bottom>0)&&(col.has)){
				ar.obj.position[1] -= col.bottom;
			}
		}
		/* Underlake */
		{
			var col = ar.obj.col_rect(scenario.underlake);
			if((col.bottom>0)&&(col.has)){
				ar.obj.position[1] -= col.bottom;
			}
		}
		
		/* Process the functions */
		if(ar.halt<=0){
			if(ar.started){
				ar.software.loop(ar.software);
			}
			else{
				ar.software.start(ar.software);
				ar.started = true;
			}
		}
		else{
			ar.halt--;
		}
	}
	
	dbgTxt.innerHTML = "time: "+scenario.time[0]+":"+scenario.time[1]+":"+scenario.time[2]+"<br/>"+JSON.stringify(DB);
}

/**
	ARDUINOS
*/

/* Basic template for arduino */
function Arduino(start_func, loop_func){
	var self_ = this;
	scenario["arduinos"].push(self_);
	
	// Creates a physical object
	self_.obj = rdrAddRect("#555", "black", 0, 0, width/15, height/15, -width/30, -height/30);
	
	/* Physical and working properties */
	self_.started = false;
	self.halt = 0;
	self.pins = 0x0000;
	self.pinsModes = 0x0000; // 1=output, 0=input
	
	self_.processes = [];
	self_.process = function(dt){
		// Nothing here :-)
		// Embedding dependency
		for(var i=0; i<self_.processes.length; i++){
			self_.processes[i](dt);
		}
	}
	
	/* Software description */
	self_.software = new function(){
		const self = this;
		
		/* Arduino Constants */
		self.id = Date.now();
		
		/* Arduino Objects */
		self.TimeNow = function(){
			var obj = {};
			obj.Hour = scenario.time[0];
			obj.Minute = scenario.time[1];
			obj.Second = scenario.time[2];
			return obj;
		}
		self.delay = function(minutes){
			self_.halt = ~~minutes;
		}
		self.getPin = function(pin){
			return (self_.pins>>pin)&1;
		}
		self.setPin = function(pin, v){
			self_.pins = (self_.pins&(~(1<<pin)))|((v!=0)<<pin);
		}
		
		self.start = start_func;
		self.loop = loop_func;
	}
	
}

/* Arduino with Wireless Conection feature */
function ArduinoWC(start_func, loop_func){
	var self_ = this;
	
	// Arduino Inheritance
	Arduino.call(this, start_func, loop_func);
	
	self_.Benabled = false;
	self_.Bvisible = false;
	self_.Bserial = 0;
	self_.Brecepted = false;
	self_.Bcon = null;
	
	/* API */
	self_.software.Geolocation = new function(){
		this.altitude = function(){
			return self_.obj.position[1];
		}
	}
	
	self_.processes.push(function(){
		
	});
	
	
	self_.software.BsetEnabled = function(b){
		self_.Benabled = b;
	}
	self_.software.BsetVisible = function(b){
		self_.Bvisible = b;
	}
	self_.software.Bfork = function(){
		for(var ai=0; ai<scenario["arduinos"].length; ai++){
			var ar = scenario["arduinos"][ai];
			if(ar.Benabled&&ar.Bvisible){
				ar.Bcon = self_;
				self_.Bcon = ar;
				ar.Bvisible = false;
			}
		}
	}
	self_.software.BreadSerial = function(){
		return self_.Bserial;
	}
	self_.software.BwriteSerial = function(serial){
		if(self_.Bcon){
			self_.Bcon.Bserial = serial;
			self_.Bcon.Brecepted = true;
			return true;
		}
		else{
			return false;
		}
	}
	self_.software.BhasSerial = function(){
		return self_.Brecepted;
	}
	self_.software.sendDB = function(key, value){
		DB[key] = value;
	}
}

/* Arduino with Pluviometer properties */
function ArduinoP(start_func, loop_func){
	var self_ = this;
	
	// ArduinoWC Inheritance
	ArduinoWC.call(this, start_func, loop_func);
	
	/* API */
	self_.processes.push(function(){
		if(scenario.cage.dots>0){
			scenario.cage.dots--;
			self_.software.setPin(1, 1);
		}
		else{
			self_.software.setPin(1, 0);
		}
	});
	
}

