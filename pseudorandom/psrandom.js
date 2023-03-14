
function randByTime(){
	var milis = (new Date()).getMilliseconds();
	milis *= 0.001;
	return milis;
}

function randByOne(v){
	v = Math.sin(v);
	var val1 = (v+2.8547)*3.84;
	var val2 = (.5*v+2.8547)*(v*8.7426);
	var soma = Math.abs(val1+val2);
	return soma-(~~soma);
}

function randByTwo(v1, v2){
	v1 = Math.sin(v1);
	v2 = Math.cos(v2);
	var mod1 = (v1+1.1527)*2.75;
	var mod2 = (v2/(v1||1)+v2*7.5141)*7.52;
	var soma = Math.abs(mod1+mod2);
	return soma-(~~soma);
}

function randByThree(v1, v2, v3){
	v1 = Math.sin(v1);
	v2 = Math.cos(v2);
	v3 = Math.sin(v3);
	var mod1 = (v1+v3*8.762)*2.75;
	var mod2 = (v2/(v1||1)+v2*(v3-3.7856))*9.84;
	var soma = Math.abs(mod1+mod2+v3*1.2345);
	return soma-(~~soma);
}

function twoRandByTwo(v1, v2){
	v1 = Math.cos(v1);
	v2 = Math.sin(v2);
	var val1 = (v1*v2+4.5678)*(v1*3.2736+.9856);
	val1 = Math.abs(val1);
	var val2 = (v2/(v1||1.1)+3.7654)*(v2+v1*1.05)+2.6534;
	val2 = Math.abs(val2);
	return [val1-(~~val1), val2-(~~val2)];
}

function PseudorandomGenerator(){
	
}
