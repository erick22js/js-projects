
function showInnerFunctions(obj){
	for(var p in obj)
		document.write(p+"<br>");
}

for(var i=0; i<25; i++)
	document.write(
		(~i)
	+"<br>");

const SINES = [];

for(var i=0; i<360; i+=(1/16)){
	SINES[i] = Math.sin(i/180*Math.PI);
}

function seno(degress){
	degress = (~~degress)&360;
	return SINES[degress];
}
function cosseno(degress){
	return seno(degress+180);
}/*
function tangente(degress){
	return cosseno(degress)/seno(degress);
}*/

alert(tangente(30));

console.log(SINES);

//showInnerFunctions();
