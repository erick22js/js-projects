const hexWindow = document.getElementById("hexadecimaleditor");

var lumpIndex = 0;
var bytesForEditing = [];

function loadBytesHexadecimal(bytes, index){
	hiddenTools();
	hexWindow.hidden = null;
	lumpIndex = index;
	hexWindow.innerHTML = "";
	bytesForEditing = [];
	for(var b=0; b<bytes.length; b++){
		var panel = document.createElement("div");
		panel.innerText = bytes[b]+"";
		panel.contentEditable = "true";
		panel.style.border = "1px solid black";
		panel.style.backgroundColor = "#fff";
		panel.style.position = "absolute";
		panel.style.width = "8%";
		panel.style.height = "5%";
		panel.style.textAnchor = "center";
		panel.style.left = ((b%10)*10+1)+"%";
		panel.style.top = (b-b%10)/10*7+1+"%";
		bytesForEditing.push(panel); 
		hexWindow.appendChild(panel);
	}
}

function saveBytesHexadecimal(){
	for(var b=0; b<bytesForEditing.length; b++){
		var panel = bytesForEditing[b];
		wad.lumpsData[lumpIndex][b] = Number(panel.innerText)||0;
	}
	alert("lump saved!");
}

//loadBytesHexadecimal([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);