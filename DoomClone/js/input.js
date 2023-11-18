
const Keys = {};

window.onkeydown = function(k){
	Keys[k.key] = true;
	//console.log(k);
}

window.onkeyup = function(k){
	Keys[k.key] = false;
	//console.log(k);
}
