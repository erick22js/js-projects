
/* Creation of some arduinos */
/* Lake arduino */
var ar1 = new ArduinoWC(
function(self){
	//self.TimeNow();
},
function(self){
	
});


/* Land arduino */
var ar2 = new ArduinoWC(
function(self){
	
},
function(self){
	
});


/* Pluvi Meter arduino */
var ar3 = new ArduinoP(
function(self){
	
},
function(self){
	
});


/* Positioning the arduinos */
ar1.obj["position"][0] = width*.35;
ar1.obj["position"][1] = height*.3;

ar2.obj["position"][0] = width*.65;
ar2.obj["position"][1] = height*.3;

ar3.obj["position"][0] = width*.9;
ar3.obj["position"][1] = height*.3;


