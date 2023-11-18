
//@Separator types
const ST = {
	"\n":"EndOfLine",
	" ":"Space",
	"\t":"Tab",
}
//@Tokens types
const TT = {
	"(":"BeginTuple",
	")":"EndTuple",
	"[":"BeginList",
	"]":"EndList",
	"{":"BeginStruct",
	"}":"EndStruct",
	'"':"StringMarker",
	"'":"CharMarker",
	".":"Separator",
	";":"EndCommand",
	"<":"LessThan",
	">":"GreateThan",
	"!":"Negate",
	"&":"AndLogic",
	"|":"OrLogic",
	"^":"XorLogic",
	"~":"NotLogic",
	"+":"PlusSign",
	"-":"MinusSign",
	"*":"MultiplierSign",
	"/":"DivideSign",
	"%":"ModuleSign",
	"=":"SetSign",
	":":"AttribSign",
	"\\":"LiteralSign",
}
//@Compose Tokens types
const CTT = {
	"/*":"BeginComment",
	"*/":"EndComment",
	"//":"UniComment",
	"&&":"AndBool",
	"||":"OrBool",
	"<=":"LesserEqual",
	">=":"GreaterEqual",
	"==":"Equal",
	"!=":"NotEqual",
	"++":"Increment",
	"--":"Decrement",
	"**":"PowerToken",
	"+=":"PlusSet",
	"-=":"MinusSet",
	"*=":"MultiplySet",
	"/=":"DivideSet",
	"%=":"ModuleSet",
}
//@Possible Composer Tokens types
const PCT = "/*&|<>=!+-%";

//@Numeration types
const NUMT = {
	"binary":['0', '1'],//"01",
	"octal":['0', '1', '2', '3', '4', '5', '6', '7'],//"01234567",
	"decimal":['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],//"0123456789",
	"hexadecimal":['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'],//"0123456789abcdefABCDEF",
}

//@Keyword list
const KEYW = {
	//Pre-defined values
	"true":{},
	"false":{},
	"null":{},
	
	//Modules
	"include":{},
	"define":{},
	"class":{},
	"extends":{},
	"throw":{},
	
	//Primitive values
	"void":{},
	"int":{},
	"float":{},
	"byte":{},
	"bool":{},
	"vec2":{},
	"vec3":{},
	"vec4":{},
	
	//Modifier names
	"public":{},
	"private":{},
	"static":{},
	"final":{},
	
	//Statement control
	"if":{},
	"else":{},
	"while":{},
	"for":{},
	"do":{},
	"switch":{},
	"break":{},
	"continue":{},
	"default":{},
	
	//Extra statements
	"new":{},
	"in":{},
}

const NAMEC = /^[0-9a-zA-Z_]+$/g;
function TokenIsName(token){
	return token.match(NAMEC)!=null;
}


//@Token class
function Token(type, value=null, pointer={line:null, row:null, index:null}, extra_args={}){
	this.type = type;
	this.value = value;
	this.pointer = pointer;
	this.extra_args = extra_args;
}

//@Main Lexer class
function Lexer(code){
	code += " ";
	/*
						@POINTER
	*/
	
	var P = { //pointer
		line: 0,
		row: 0,
		index: 0
	}
	var Pl = { //pointer
		line: 0,
		row: 0,
		index: 0
	}
	function clonePointer(){
		return {
			line: P.line,
			row: P.row,
			index: P.index
		};
	}
	
	var tokens = [];
	
	/*
						@FETCHING OPERATIONS IN LEXER
	*/
	
	//@Main fetcher
	function fetchChar(){
			//#ONLY FOR DEBUG PURPOSES
			//if(P.index>100000)
			//	throw new Error("Overflow loop")
		var c = code.charAt(P.index);
		//First Backup pointer
		Pl.index = P.index;
		Pl.line = P.line;
		Pl.row = P.row;
		//Also, continues
		P.index++;
		if(c=="\n"){
			P.line++;
			P.row = 0;
		}else
			P.row++;
		return c;
	}
	//@Fetcher without backup pointer
	function fetchUnsafeChar(){
		var c = code.charAt(P.index);
		P.index++;
		if(c=="\n"){
			P.line++;
			P.row = 0;
		}else
			P.row++;
		return c;
	}
	//@Store backup fetch
	function storeFetch(){
		Pl.index = P.index;
		Pl.line = P.line;
		Pl.row = P.row;
	}
	//@Restore backup fetch
	function restoreFetch(){
		P.index = Pl.index;
		P.line = Pl.line;
		P.row = Pl.row;
	}
	
	/*
						@FETCHING AND ANALYZING
	*/
	
	//@Fetch and analyse next token
	function fetchForAnalyse(){
		/*
			First analyse, also, continues if tangeable
		*/
		var p = clonePointer();
		var chac = fetchChar();
		if(TokenIsName(chac)){
			/*
				Can be a number, name or keyword
			*/
			var name = chac;
			var token;
			
			//@Do if is a number
			if(!isNaN(name)){
				fetchNumber(chac, p);
			}else{
				name += fetchName();
				//@Do if is a keyword
				if(name in KEYW){
					token = new Token("keyword", name, p);
					tokens.push(token);
				}
				
				//@Do if is a name
				else{
					token = new Token("name", name, p);
					tokens.push(token);
				}
			}
			
		}else{
			if(chac in ST)
				return;
			fetchSignal(chac, p);
		}
	}
	//@Fetch name
	function fetchName(){
		var name = "";
		while(!endOfCode()){
			var chac = fetchChar();
			if(TokenIsName(chac)){
				/*
					Can be a number, name or keyword
				*/
				name += chac;
			}else{
				restoreFetch();
				break;
			}
		}
		return name;
	}
	//@Fetch number
	function fetchNumber(base, p, asDecimal=false){
		var number = base;
		var decimal = asDecimal;
		var allowDecimal = true;
		var chac = fetchChar();
		var lchac = chac;
		//alert(chac)
		var listNT = NUMT.decimal;
		var continues = true;
		if(base=="0"){
			if(chac=="x"){ //Hex
				listNT = NUMT.hexadecimal;
				var allowDecimal = false;
				number += "x";
				chac = fetchChar();
			}else if(chac=="b"){ //Binary
				listNT = NUMT.binary;
				var allowDecimal = false;
				number += "b";
				chac = fetchChar();
			}else if(chac=="o"){ //Octal
				listNT = NUMT.octal;
				var allowDecimal = false;
				number += "o";
				chac = fetchChar();
			}else if(NUMT.decimal.includes(chac)){ //Decimal
				
			}else if(chac=="."){
				decimal = true;
				number += ".";
				chac = fetchChar();
			}else{
				restoreFetch();
				number = "0";
				continues = false;
			}
		}
		if(continues)
		while(!endOfCode()){
			if(listNT.includes(chac)){
				number += chac;
			}else if(allowDecimal&&!decimal&&chac=="."){
				decimal = true;
				number += ".";
			}
			else{
				if(["x","o","b"].includes(lchac))
					number = "0";
				restoreFetch();
				break;
			}
			lchac = chac;
			chac = fetchChar();
		}
		token = new Token("number", Number(number), p, {type:decimal?"float":"int"});
		tokens.push(token);
		//return number;
	}
	//@Fetch signal
	function fetchSignal(base, pointer){
		storeFetch();
		var nchat = fetchUnsafeChar();
		var type = "none";
		var value = null;
		var args = null;
		/*
			First check if can previous other sign
		*/
		if(PCT.indexOf(base)>-1&&((base+nchat) in CTT)){
			type = CTT[(base+nchat)];
			//alert(type);
			if(type==CTT["//"]){
				while(fetchChar()!="\n"&&!endOfCode()){}
				return;
			}
			if(type==CTT["/*"]){
				var pchat = fetchChar();
				var nchat;
				while(!endOfCode()){
					nchat = fetchChar();
					if((pchat+nchat)=="*/"){
						break;
					}
					pchat = nchat;
				}
				return;
			}
		}
		/*
			Else continues normal
		*/
		else{
			restoreFetch();
			if(base=="."){
				var bchat = fetchUnsafeChar();
				if(NUMT.decimal.includes(bchat)){
					fetchNumber("0."+bchat, pointer, true);
					return;
				}else{
					restoreFetch();
				}
			}
			type = TT[base];
			if(type==TT['"']){
				type = "string";
				value = fetchString();
			}
			if(type==TT["'"]){
				type = "char";
				value = fetchChat();
			}
		}
		tokens.push(
			args?new Token(type, value, pointer, args):new Token(type, value, pointer)
		);
	}
	//@Fetch String
	function fetchString(){
		var str = "";
		while(!endOfCode()){
			var chat = fetchChar();
			if(chat=='\\'){
				chat = fetchChar();
				switch(chat){
					case "n":
						chat = '\n';
						break;
					case "t":
						chat = '\t';
						break;
				}
			}else{
				if(chat=='"')
					break;
			}
			str += chat;
		}
		return str;
	}
	
	//@Fetch Character
	function fetchChat(){
		var chat = fetchChar();
		if(chat=="'")
			throw UnexpectedError("'", clonePointer());
		var chat2 = fetchChar();
		if(chat2!="'")
			throw ExpectedError("'", clonePointer());
		return chat;
	}
	
	/*
						@MAIN FUCTIONS AND SUB-OPERATIONS
	*/
	
	//@Main parse function
	function genTokens(){
		while(!endOfCode()){
			fetchForAnalyse();
		}
		return tokens;
	}
	
	function endOfCode(){
		return P.index >= code.length;
	}
	
	//@Export function
	this.genTokens = genTokens;
}
