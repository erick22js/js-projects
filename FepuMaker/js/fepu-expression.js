
alert(("teste") instanceof string);

function FepuExpression(){
	const nameT = /[0-9a-zA-Z_.]+/g;
	const operations = [
		"==",">=","<=",
		"!=",">","<",
		"+","-","*","/",
		",",
		"&","|"
	];
	this.banTokens = operations;
	var funcs = {};
	function splitAndCombine(txt){
		//split
		var mntks = txt.split(/([^0-9a-zA-Z_.])/g);
		var filter = [
			"", ";", "{", "}", "[", "]", 
			"var", "const", "let",
			"new", "if", "else",
			"do", "while", "break",
			"function", "return", "class",
			"Object"
			];
		var tokens = [];
		//combine
		var tk = "";
		var inString = null;
		//console.log(mntks);
		combineL: for(var i=0; i<mntks.length; i++){
			var pmnt = mntks[i-1];
			var mnt = mntks[i];
			var nmnt = mntks[i+1];
			if(filter.includes(mnt)){
				mntks.splice(i,1);
				i--;
				if(mnt!="")
					throw new Error("Unexpected token "+mnt);
				continue;
			}
			if(filter.includes(nmnt)){
				mntks.splice(i+1,1);
				i--;
				if(nmnt!="")
					throw new Error("Unexpected token "+nmnt);
				continue;
			}
			if(mnt=="="&&(
				!operations.includes(mnt+nmnt)&&
				!operations.includes(pmnt+mnt)
			)){
				continue;
			}
			//console.log(mnt);
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
				tokens.push(mnt);
			}
		}
		//console.log(tokens);
		return tokens;
	}
	function injectFunctions(){
		var injections = "";
		/*for(var i=0; i<funcs.length; i++){
			injections 
		}*/
		injections = funcs.join(";");
		injections += ";";
		return injections;
	}
	function cleanBadReferences(){
		var injections = "";
		for(var i in window){
			injections += "var "+i+"=null;";
		}
		injections += 
			"var window = null;"+
			"var document = null;"+
			"var navigator = null;"+
			"var Screen = null;"+
			"var Math = null;"+
			"var eval = null;";
		return injections;
	}
	function test(restr){
		var result;
		result = eval(injectFunctions()+cleanBadReferences()+restr);
		if(result==null||(result instanceof Function)||(result instanceof Object))
			throw new Error("Expected a output value");
		return result;
	}
	this.compileStr = function(str, onError=function(){}, onSuccess=function(){}){
		var result;
		try{
			var compiled = splitAndCombine(str).join("");
			result = test(compiled);
			console.log(result);
			onSuccess(compiled, result);
		}catch(error){
			console.log(error);
			onError(error);
		}
	}
	this.implemmentMethods = function(obj_funcs){
		funcs = obj_funcs;
	}
}