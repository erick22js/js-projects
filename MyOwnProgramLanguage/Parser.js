
var PrioritySigns = [
	["PlusSign", "MinusSign"],
	["MultiplierSign", "DivideSign"],
];/*
var SetSigns
*/
function Parser(tokens){
	var Classes = [];
	var actTk = 0;
	/*	@Fetch tokens
	*/
	function fetchToken(){
		var tk = tokens[actTk];
		actTk++;
		return tk;
	}
	function fetchTokenSecurity(){
		return tokens[actTk];
	}
	function fetchValue(){
		
	}
	function fetchValueOfType(type="int"){
		
	}
	function fetchExpression(){
		var dataExp = {};
		var expression = [];
		var clss = "int";
		
		while(true){
			
		}
		
		data.class = clss;
		dataExp.expression = expression;
		return dataExp;
	}
	/*
						@MAIN FUCTIONS AND SUB-OPERATIONS
	*/
	function genMap(){
		var l = []
		while(!endOfTokens()){
			l.push(fetchExpression());
		}
		return l;
	}
	function endOfTokens(){
		return actTk>=tokens.length;
	}
	this.genMap = genMap;
}
