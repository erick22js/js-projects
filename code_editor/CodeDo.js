
function CodeDo(data){
	var self = this;
	
	data = data||{};
	
	data.numberStyle = data.numberStyle||{};
	
	var testName = /[A-Za-z_]+[A-Za-z0-9_]*/g;
	var testGroup = /[\d]+|[0x][A-Fa-f0-9]+|[0b][01]+|([A-Za-z_]+[A-Za-z0-9_]*)|(\s+)|(\n)|([^\w\s\n])/g;
	var testNumber = /([\d]+|[0x][A-Fa-f0-9]+|[0b][01]+)/g;
	
	//Create editor frames and setup
	var ed_editor = document.createElement("textarea");
	var ed_color = document.createElement("div");
	var editor = document.createElement("div");
	editor.appendChild(ed_editor);
	editor.appendChild(ed_color);
	
	//Setup style and functions
	ed_editor.style.position = ed_color.style.position = "relative";
	ed_editor.style.width = ed_color.style.width = "100%";
	ed_editor.style.height = ed_color.style.height = "100%";
	ed_color.style.top = "-102%";
	ed_color.style.paddingLeft = "3px";
	//ed_color.style.top = "-1px";
	
	//Setup font
	ed_color.style.fontFamily = ed_editor.style.fontFamily = data.fontFamily||"monospace";
	ed_color.style.fontSize = ed_editor.style.fontSize = (data.fontSize||15)+"px";
	
	//ed_editor.style.color = "rgba(0,0,0,0)";
	ed_editor.style.backgroundColor = data.backgroundColor||"white";
	ed_editor.style.caretColor = "blue";
	ed_color.style.color = "black";
	ed_color.style.pointerEvents = "none";
	ed_color.style.userSelect = "none";
	ed_color.style.overflow = ed_editor.style.overflow = "scroll";
	ed_editor.style.whiteSpace = "pre";
	ed_color.style.whiteSpace = "pre";
	ed_editor.contentEditable = "true";
	
	editor.style.border = "1px solid black";
	editor.style.width = "340px";
	editor.style.height = "400px";
	editor.style.overflow = "hidden";
	
	//Append editor on body
	document.body.appendChild(editor);
	
	var bankKeywords = data.keywords||[];
	var styleKeywords = data.style||[];
	
	ed_editor.oninput = function(e){
		//ed_color.innerHTML = 
		formatText(ed_color, this.value);
		window.setTimeout(function(){
			//debug.innerHTML = self.getCursorOffset(ed_editor).start;
		},1);
		//console.log(self.getCursorPosition());
	}
	ed_editor.onclick = function(){
		//debug.innerHTML = self.getCursorOffset(ed_editor).start;
		ed_color.scrollTop = ed_editor.scrollTop;
		ed_color.scrollLeft = ed_editor.scrollLeft;
	}
	ed_editor.onscroll = function(){
		//debug.innerHTML = self.getCursorOffset(ed_editor).start;
		ed_color.scrollTop = ed_editor.scrollTop;
		ed_color.scrollLeft = ed_editor.scrollLeft;
	}
	
	this.getCursorOffset = function(input) {
		if ("selectionStart" in input && document.activeElement == input) {
			return {
				start: input.selectionStart,
				end: input.selectionEnd
			};
		}
		else if (input.createTextRange) {
			var sel = document.selection.createRange();
			if (sel.parentElement() === input) {
				var rng = input.createTextRange();
				rng.moveToBookmark(sel.getBookmark());
				for (var len = 0;rng.compareEndPoints("EndToStart", rng) > 0;rng.moveEnd("character", -1)) {
					len++;
				}
				rng.setEndPoint("StartToStart", input.createTextRange());
				for (var pos = { start: 0, end: len };
				rng.compareEndPoints("EndToStart", rng) > 0;
				rng.moveEnd("character", -1)) {
				pos.start++;
				pos.end++;
				}
			return pos;
			}
		}
		return -1;
	}
	
	this.getValue = function(){
		return ed_editor.innerText;
	}
	
	function formatText(elem, text){
		elem.innerHTML = "";
		var count = 0;
		debug.textContent = "";
		text = text.replace(testGroup, function(e){
			var tag = document.createElement("t");
			for(var g=0; g<bankKeywords.length; g++)
				if(bankKeywords[g].includes(e)){
					var style = styleKeywords[g];
					tag.style.color = style.color;
				}
			tag.innerText = e;
			//count += 1;
			//console.log(e);
			elem.appendChild(tag);
			return e;
		});
		debug.textContent = count;
		text = text.replace(/\n/g, "<br>");
		return text;
	}
	
}