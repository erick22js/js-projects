//Scope definition
	/*obs: código nativos são implementados na linguagem de destino, se especificados (não sendo com null), sobrescreverão o escopo na compilacão
	  init variable = "VAR"
		arg: name, type, value
	  set variable = "VARSET"
	  	arg: name, value
	  define pointer = "DEF"
	  	arg: name, any value
	  init function = "FUNC"
	  	arg: name, type, isPublic, scope, native*
	  set function = "FUNCSET"
	    arg: name, type, scope, native*
	  init class = "CLSS"
	  	arg: name, isStatic, extend, scope
	  init enum = "ENUM"
	    arg: name, listNames
	  
	*/
//Basic scope
	/*
	  [
	  	father
	    type command
	    ...arguments
	  ]
	*/
const primitiveTypes = [
	["Object", []],
	["int", null],
	["float", null],
	["byte", null],
	["bool", null],
	["char", null],
	["String", []],
]
const JaTEmContext = [
	[
		//[null, "CLSS", "Object", "non-static", null, []],
	]
]

const JaTEmCtx = {
	definitions: {
		
	},
	comands: {
		"import":{
			
		},
		"class":{
			
		}
	},
	classes: {
		//Primitive classes
		"object":{
			"static":false,
		},
		"bool":{
			"static":false,
			extend:"object"
		},
		"byte":{
			"static":false,
			extend:"object"
		},
		"int":{
			"static":false,
			extend:"object"
		},
		"float":{
			"static":false,
			extend:"object"
		},
		"char":{
			"static":false,
			extend:"object"
		},
		"string":{
			"static":false,
			extend:"object"
		},
	},
	functions: {
		
	}
};
const JatEmOperations = {
	
};

function generateJatemMap(code){
	var Map = {};
	function isSpace(code){
		return ([9, 10, 11, 32]).includes(code);
	}
	function isName(code){
		return (code>=48&&code<=57)||(code>=65&&code<=90)||(code>=97&&code<=122)||code==95;
	}
	var ctx = deepClone(JaTEmCtx);
	//Código totalmente sub-dividido, por
	// caracteres especiais
	var words = [];
	{
		var longword = "";
		for(var i=0; i<code.length; i++){
			var car = code.charAt(i);
			if(!isName(code.charCodeAt(i))){
				if(longword!="")
					words.push(longword);
				words.push(car);
				longword = "";
			}else{
				longword += car;
			}
			if(i==code.length-1){
				if(longword!="")
					words.push(longword);
				break;
			}
		}
	}
	//Logo, o código deverá ser re-organizado, 
	// concatenando strings e limpando espaços em
	// branco.
	{
		var nwords = [];
		var string = "";
		var inString = null;
		var ammountBr = 0;
		for(var w=0; w<words.length; w++){
			var word = words[w];
			if(word=="\n"){
				if(w==0)
					continue;
				if(inString!=null){
					string+=word;
					continue;
				}
				if(ammountBr==0)
					nwords.push("\n");
				ammountBr++;
			}else{
				ammountBr = 0;
				if(inString!=null){
					if(word==inString){
						nwords.push(string);
						nwords.push(inString);
						inString = null
					}
					else
						string+=word;
				}else{
					string = "";
					if(word==" "||word=="\t")
						continue;
					if(word=='"'||word=="'"){
						inString = word;
						nwords.push(word);
					}else{
						nwords.push(word);
					}
				}
				//nwords.push(word);
			}
		}
		words = nwords;
	}
	//Então, comentários são removidos
	{
		var nwords = [];
		var comment = null;
		for(var i=0; i<words.length; i++){
			var act = words[i];
			var next = words[i+1];
			var overnext = words[i+2];
			var combine = act+next;
			if(comment==null){
				if(combine=="//"||combine=="/*"){
					comment = combine;
				}else{
					var number = "";
					if(!isNaN(act)){
						number+=act
						if(next=="."){
							number+=".";
							if(!isNaN(overnext)){
								number+=overnext;
								i++;
							}
							i++;
						}
					}
					else if(act=="."){
						number+="0.";
						if(!isNaN(next)){
							number+=next;
							i++;
						}
					}
					if(number!="")
						nwords.push(number);
					else
						nwords.push(act);
				}
			}else if(comment=="//"){
				if(act=="\n")
					comment = null
			}else if(comment=="/*"){
				if(combine=="*/"){
					comment = null;
					i++;
				}
			}
			//nwords.push(act);
		}
		words = nwords;
	}
	/*Código é passado por uma vistoria que
	// analisará cada componente, checará validez,
	// e gerará uma árvore de comandos*/
	{
		var pointer = 0;
		var location = "upper";
		/* upper (o mais alto)
		   class (dentro de definição de classe)
		   function (dentro de escopo de função)
		   expression (dentre de expressão)
		*/
		var scope = []
		/* Example
		 * ["class", 
		    "player", 
		      [["int","x","10"],
		       ["int","y","45"],
		       ["string","id","63vf5AbO"]
		      ]
		   ]
		    
		*/
		while(pointer<words.length){
			
			pointer++;
		}
	}
	Map.words = words;
	return Map;
}

//alert((typeof ({}))=="object");

function deepClone(obj){
	var nobj = {};
	for(var i in obj){
		var v = obj[i];
		console.log(v+": "+(typeof v));
		switch(typeof v){
			case "object":
				console.log(i);
				nobj[i] = deepClone(v);
				break;
			case "function":
				nobj[i] = v;
				break;
			default:
				nobj[i] = v;
				break;
		}
	}
	return nobj;
}

