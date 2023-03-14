
function FepuExpression(){
	const nameT = /[0-9a-zA-Z_.]+/g;
	const operations = [
		"==",">=","<=",
		"!=",">","<",
		"+","-","*","/",
		",",
		"&","|"
	];
	function splitAndCombine(txt){
		//split
		var mntks = txt.split(/([^0-9a-zA-Z_.])/g);
		var tokens = [];
		//combine
		var tk = "";
		var inString = null;
		console.log(mntks);
		combineL: for(var i=0; i<mntks.length; i++){
			var mnt = mntks[i];
			var nmnt = mntks[i+1];
			if(mnt==""){
				mntks.splice(i,1);
				i--;
				continue;
			}
			console.log(mnt);
			if(inString!=null){
				tk+=mnt;
				if(inString==mnt){
					tokens.push(tk);
					tk = "";
					inString = null;
				}
				continue combineL;
			}
			if(mnt=="'"||mnt=='"'){
				inString = mnt;
				tk += inString;
			}else{
				//console.log("=>    "+mnt);
				tokens.push(mnt);
			}
		}
		console.log(tokens);
		return tokens;
	}
	this.compileStr = function(str){
		var tokens = splitAndCombine(str);
		debug.textContent = tokens;
	}
}

var expr = new FepuExpression();
expr.compileStr(
'"Teste de teste oi"+67&&objetp.rr'
);
