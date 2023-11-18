const inp = document.getElementById("input");
const outp = document.getElementById("output");
const min = document.getElementById("minify");

min.onclick = function(){
	outp.value = minify(inp.value);
}

const keywords = {
	"function":{
		needSpace: true
	},
	"var":{
		needSpace: true
	},
	"const":{
		needSpace: true
	},
	"let":{
		needSpace: true
	},
	"new":{
		needSpace: true
	},
	"else":{
		needSpace: true
	},
	"case":{
		needSpace: true
	},
	"throw":{
		needSpace: true
	},
	"break":{
		needSpace: true
	},
	"continue":{
		needSpace: true
	},
	"return":{
		needSpace: true
	},
}

function minify(script){
	var minifyed = "";
	var instring = "";
	var latestword = "";
	var latesttrulychar = "";
	var latestchar = "";
	var nextchar = "";
	var breakline = null; //"single" ou "multi"
	scriptloop: for(var c=0; c<script.length; c++){
		latestchar = String.fromCharCode(script.charCodeAt(c-1));
		nextchar = String.fromCharCode(script.charCodeAt(c+1));
		var chr = script.charCodeAt(c);
		var cha = String.fromCharCode(chr);
		
		if(cha+nextchar=="//")
			breakline = "single";
		else if(cha+nextchar=="/*")
			breakline = "multi";
		if((breakline=="single"&&chr==10)||(breakline=="multi"&&(latestchar+cha=="*/"))){
			breakline = null;
			continue scriptloop;
		}/*else(breakline=="multi"){
			
		}*/
		
		if(breakline!=null)
			continue scriptloop;
		if(validCharForName(chr))
			latestword += cha;
		if(chr==32||chr==09||chr==10){ //space
			console.error(latestword);
			if(allowSpace(latestword)){
				latestword = "";
				minifyed += " ";
			}
			if(chr==10&&latesttrulychar!=";")
				minifyed += ";";
			continue scriptloop;
		}
		if(chr!=32&&chr!=09&&chr!=10){
			latesttrulychar = cha;
		}
		if(!validCharForName(chr)&&(cha!="{"&&cha!=";"))
			latestword = ""
		console.log(latestword);
		
		switch(chr){
			//case 11:
			case 09: //tab
			case 10: //breakline
				continue scriptloop;
			default:
				minifyed += cha;
		}
	}
	return minifyed;
}

function validCharForName(code){
	return (code>=48&&code<=57)||(code>=65&&code<=90)||(code==95)||(code>=97&&code<=122);
}
function allowSpace(keyword){
	return keywords[keyword]?(keywords[keyword].needSpace==true):false;
}
