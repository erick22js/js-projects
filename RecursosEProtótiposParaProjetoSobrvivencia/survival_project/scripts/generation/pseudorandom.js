
const Pseudorandom = new function(){
	this.SEED = "385947209716580342";
	this.slen = this.SEED.length;
	this.actNumber = this.SEED;
	this.seedI = 0;
}
function getNextRandom(){
	var part1 = Pseudorandom.actNumber.slice(0,10);
	var part2 = Pseudorandom.actNumber.slice(10,20);
	part1 = Number(part1)*Number(part1)*(Number((""+Pseudorandom.SEED).charAt(Pseudorandom.seedI))||1);
	part2 = Number(part2)*Number(part2)*(Number((""+Pseudorandom.SEED).charAt(Pseudorandom.seedI))||1);
	part1 += Number((""+Pseudorandom.SEED).charAt(Pseudorandom.seedI))+Number((""+Pseudorandom.SEED).charAt(0))*Math.pow(10,~~(Pseudorandom.SEED.length-2));
	part2 += Number((""+Pseudorandom.SEED).charAt(Pseudorandom.seedI))+Number((""+Pseudorandom.SEED).charAt(0))*Math.pow(10,~~(Pseudorandom.SEED.length-2));
	Pseudorandom.seedI++;
	Pseudorandom.seedI = Pseudorandom.seedI>=Pseudorandom.slen?0:Pseudorandom.seedI;
	Pseudorandom.actNumber = String(part2)+String(part1);
	var actNl = Pseudorandom.actNumber.length;
	Pseudorandom.actNumber = Pseudorandom.actNumber.slice(
		~~((actNl-Pseudorandom.slen)*.5)
		,~~((actNl-Pseudorandom.slen)*.5)+Pseudorandom.slen
		);
	return Number("0."+Pseudorandom.actNumber);
}



