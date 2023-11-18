
var PrioritySigns = [
	["PlusSign", "MinusSign"],
	["MultiplierSign", "DivideSign"],
];

function Value(type=null, classe=null, value=null, instance=null, address=[]){
	return {
		"type": type,
		"value": value,
		"class": classe,
		"instance": instance,
		"address": address,
	};
}

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
	function fetchAdvance(){
		actTk++;
	}
	function fetchValue(){
		var tk = fetchToken();
		switch(tk.type){
			case "number":
				return Value("number", tk.extra_args.type, tk.value, "constant", []);
				break;
			case "keyword":
				throw UnexpectedTokenError(tk, tk.pointer);
				break;
			default:
				return Value("sign", null, tk.type);
		}
	}
	function fetchValueOfType(type="int"){
		
	}
	function matchExpression(){
		
	}
	function fetchExpression(){
		var dataExp = {};
		var expression = [];
		var clss = "int";
		
		while(true){
			break;
		}
		
		dataExp.class = clss;
		dataExp.expression = expression;
		dataExp.token = fetchToken();
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
