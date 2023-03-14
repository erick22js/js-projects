const palWindow = document.getElementById("paletteeditor");

var palForEditing = [];

function loadPalette(){
	hiddenTools();
	palWindow.hidden = null;
	var areadivd = 100/16;
	//var 
	palWindow.innerHTML = "";
	palForEditing = [];
	var pal = wad.lumpsData[wad.getFirstLumpByName("PLAYPAL",0)];
	for(var i=0; i<256; i++){
		var p = i*3;
		var panel = document.createElement("div");
		panel.style.border = "1px solid black";
		var p1 = IOByte.intToHex(pal[p]);
		p1 = p1.length==1?"0"+p1:p1;
		var p2 = IOByte.intToHex(pal[p+1]);
		p2 = p2.length==1?"0"+p2:p2;
		var p3 = IOByte.intToHex(pal[p+2]);
		p3 = p3.length==1?"0"+p3:p3;
		panel.color = "#"+p1+""+p2+""+p3;
		panel.style.backgroundColor = "#"+p1+""+p2+""+p3;
		panel.style.position = "absolute";
		panel.style.width = areadivd*.9+"%";
		panel.style.height = areadivd*.8+"%";
		panel.style.textAnchor = "center";
		panel.style.left = ((i%16)*areadivd+areadivd*.1)+"%";
		panel.style.top = (i-i%16)/16*areadivd+areadivd*.1+"%";
		panel.onclick = function(){
			var c = document.createElement("input");
			c.type = "color";
			console.log(this.color);
			c.value = this.color;
			c.click();
			c.parent = this;
			c.onchange = function(){
				//alert(this.value);
				this.parent.style.backgroundColor = this.value;
			}
		}
		palForEditing.push(panel); 
		palWindow.appendChild(panel);
	}
}

function savePalette(){
	var pal = wad.lumpsData[wad.getFirstLumpByName("PLAYPAL",0)];
	for(var i=0; i<256; i++){
		var b = i*3;
		var elem = palForEditing[i];
		var t = elem.style.backgroundColor.substring(4, elem.style.backgroundColor.length-1);
		t = t.split(",");
		pal[b] = Number(t[0]);
		pal[b+1] = Number(t[1]);
		pal[b+2] = Number(t[2]);
	}
	alert("lump saved!");
}
