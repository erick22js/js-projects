
var Pseudorandom = new function(){
	this.SEED = "1452471097";
	this.slen = this.SEED.length;
	this.actNumber = Number(this.SEED);
	this.seedI = 0;
}
function getNextRandom(){
	Pseudorandom.actNumber = (Pseudorandom.actNumber*Pseudorandom.actNumber)*
		(Number((""+Pseudorandom.SEED).charAt(0))||1);
	Pseudorandom.actNumber += Number((""+Pseudorandom.SEED).charAt(0));
	Pseudorandom.actNumber += Number((""+Pseudorandom.SEED).charAt(0))*Math.pow(10,~~(Pseudorandom.SEED.length*.5));
	//actNumber = (""+actNumber).replace("0","");
	var actNl = (""+Pseudorandom.actNumber).length;
	Pseudorandom.actNumber = (""+Pseudorandom.actNumber).slice(
		~~((actNl-Pseudorandom.slen)*.5)
		,~~((actNl-Pseudorandom.slen)*.5)+Pseudorandom.slen
		);
	Pseudorandom.actNumber = Number(Pseudorandom.actNumber);
	Pseudorandom.seedI++;
	Pseudorandom.seedI = Pseudorandom.seedI>=Pseudorandom.slen?0:Pseudorandom.seedI;
	return (Pseudorandom.actNumber*Math.pow(10,-Pseudorandom.slen))*10/9;
}


