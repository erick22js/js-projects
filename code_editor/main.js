
var debug = document.getElementById("debug");

var editor = new CodeDo({
	fontSize: 20,
	fontFamily: "monospace",
	backgroundColor: "#eee",
	
	keywords:[
		[
			"function", "return",
			"while", "do", "for",
			"continue", "break",
			"in",
			"var", "const", "let",
		],
		[
			"+", "-", "*", "/", "="
		],
		[
			"(", ")", "[", "]", "{", "}",
			"<", ">", ";",
		]
	],
	style:[
		{
			color:"red"
		},{
			color:"green"
		},{
			color:"yellow"
		}
	]
});

