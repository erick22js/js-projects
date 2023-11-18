
cpButton.onclick = function(){
	var tks = new Lexer(codeinput.value).genTokens();
	var map = new Parser(tks).genMap();
	output.innerText = JSON.stringify(map, null, 4);
}
