var screen = document.getElementById("screen");
var dbg = document.getElementById("dbg");
var ctx = screen.getContext("2d");


const SEED = "385147209716580342";
const slen = SEED.length;
var actNumber = SEED;
var seedI = 0;

function getNextRandom(){
	var part1 = actNumber.slice(0,10);
	var part2 = actNumber.slice(10,20);
	part1 = Number(part1)*Number(part1)*(Number((""+SEED).charAt(seedI))||1);
	part2 = Number(part2)*Number(part2)*(Number((""+SEED).charAt(seedI))||1);
	part1 += Number((""+SEED).charAt(seedI))+Number((""+SEED).charAt(0))*Math.pow(10,~~(SEED.length-2));
	part2 += Number((""+SEED).charAt(seedI))+Number((""+SEED).charAt(0))*Math.pow(10,~~(SEED.length-2));
	seedI++;
	seedI = seedI>=slen?0:seedI;
	actNumber = String(part2)+String(part1);
	var actNl = actNumber.length;
	actNumber = actNumber.slice(
		~~((actNl-slen)*.5)
		,~~((actNl-slen)*.5)+slen
		);
	return Number("0."+actNumber);
}

ctx.fillStyle = "red";
for(var i=0; i<2048*2048*.4;i++){
	ctx.fillRect(getNextRandom()*4096, getNextRandom()*4096, 1, 1);
}
ctx.fillStyle = "green";
for(var i=0; i<2048*2048;i++){
	ctx.fillRect(getNextRandom()*4096, getNextRandom()*4096, 1, 1);
}


for(var i=0;i<1000;i++){
	var n = getNextRandom();
	document.write(n+"<br>");
}

