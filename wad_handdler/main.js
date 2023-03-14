const lumpsList = document.getElementById("lumpslist");
const saveWad = document.getElementById("saveWad");
var wad;

var mode = "";

function hiddenTools(){
	hexWindow.hidden = true;
	palWindow.hidden = true;
}
hiddenTools();

const icoDataUri = {
	file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAADXUAAA11AFeZeUIAAAAbUlEQVRYhe3XuwrAIBQD0NtSyP9/bqa6uLbGYnBosgo3Bx+DVX/PMVi/TXN1AEm5FUCRLAAy4pSnT6Sjpd2zAGYQNoCKsAIUxLW6sF9AOUsBTy/mDWU/glECCCCAAAIIIIAAAtgOcP0Nv3TtSQPcbxv5EZzLWgAAAABJRU5ErkJggg==",
	playpal: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAADXUAAA11AFeZeUIAAACsElEQVRYhe2WP2hTQRzHP5EiBaG1Im0pIVsQnJRGEBxKIFPAseubFAezxFklFAudnLpIBuFRW+IbKwGhkKlQ8NVFEEqKg2RIgthiWohFiMPl3rv33t1LmlQc9Avl0nvfu+/397vf/YH/+MtIDMnr/aF5BxJ7AB9eQiY9gJm0oGGLSe8Pb8RE8IRBiLv1vomkxdnrMwCOd2vMllpRIwANWxqJNWE04Iln/chIWrQfvOfqvSzHuzWPvHd0yt2ZK0Ez/YwMyoaus6dGHkA/eim+d3Qa+LxQOAlmC/+3KRtGA+EJVLh1SL2Z80wsFE70hhX+nSfDGdBHr6yr+r9bsz2Kx5dciYbP0WVhQu85NJGzKtpl0by6lcJpllkuPgXg0bsX3phnb8vesM2NLpWiHbuDLpk/QXvJAmeV9vqB+FuycGu2EJ9/iNMs4zTL5DJzAVG1za/s49ZHMdCw+VrK0V4/YLZww+tOlXZY22rhNMsBulsXYyrFaTY3unQ6h3Q6hwFOb1s0ap95Cejv/1IOSjtCZF6Ekk/D2laLx4szwQFJi0wSKkwL3so+1eeLsUtgLEJpwIuO+P5MVtRMd6rK5I+8+F6Lrn+4EGPPAVUsFkmL7lSViWuiKH99F0U5+flbgAOQuG0HdLU10N+zQDR6dTIVYXGA7s3rPqFhB7akxFB3gUTkbGjYXvQqPn76CcDlL52RliBiRJpRJ5MnpMxQJi0i1opHb8qhDQTMGO8IxZSENlsaA7EHURiyNjwhTS2o4nEHkMR5MiChzYRpq0YEx1iCiAlVRLn3CRuU5nQ34rmWIAxNihNAQt3G0ogpI6MaiIjoznnwTZoeJGNlICwiTfS2/YiV15AWY9WAFIjDoDfh2Blw69FacOtCWEm7MdBRMwChU1KF6f130Qa0Zi543n8AvwGl8Q/XYkyr6QAAAABJRU5ErkJggg==",
	colormap: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAADXUAAA11AFeZeUIAAABMUlEQVRYhe1WO07DQBCdYFOgpKBwkQ7JcAr7PqncIOUYkUjhi3AI+wp0lihpUKIkkD8UvFcwrNcuvGgRnuatZ1c7b97Ojlekt/9uA+0oiuLDZcA0Tb/FDE2LkiRxErwsyx8+IwERkaqqOg0ex7HRX0tARCTP806CZ1lWO2clICIye3z4GozhuAOOgLdinsf3dH5v3f+iiYBra1Tg+YDBFrgG8q68AgPgEHhsR8B/BSpmsgNSAfqpABW5BL63I+C/Ai8nDPZAZsaMV0DWwBXw3I6A/wo86cyXwDe1cK387BOBWM1/BZY8S10LrAEqw1RUnwiv7fv7r8CCCvDe1ylA45ljffTnFdgwU9aA7vFUhKmoPhE17O+/AjcT+//cKQHbS8Y5gbo33K8QML1ee+vNlX0Ca3FH+7PLY50AAAAASUVORK5CYII=",
	
}


function clearList(){
	lumpsList.innerHTML = "";
}
function addItemList(lumpname, lumpindex, lumptype){
	var item = document.createElement("div");
	item.indexLump = lumpindex;
	item.style.backgroundColor = "#ddd";
	item.style.border = "1px solid black";
	item.style.height = "8%";
	item.innerHTML = "<img style='position:relative; top:20%; left:0%' src='"+icoDataUri[lumptype]+"'></img><h4 style='position:relative; top:-80%; left:25%'>"+lumpname+"</h4>";
	item.index = lumpindex;
	item.lumptype = lumptype;
	item.onclick = pickIdealLumpTool;
	lumpsList.appendChild(item);
}

function pickIdealLumpTool(){
	var type = this.lumptype;
	//alert(type);
	mode = type;
	if(type=="file"){
		loadBytesHexadecimal(wad.lumpsData[this.index], this.index);
	}else if(type=="playpal"){
		loadPalette();
	}
}

function save(){
	switch(mode){
		case "playpal":
			savePalette();
			break;
		case "file":
			saveBytesHexadecimal();
			break;
	}
}

document.getElementById("pickWad").onclick = function(){
	pickFile(function(bytes){
		console.log(bytes.length);
		wad = new WAD(bytes);
		console.log(wad);
		clearList();
		for(var l=0; l<wad.lumpsName.length; l++){
			var name = wad.lumpsName[l];
			var type = name=="PLAYPAL"?"playpal":name=="COLORMAP"?"colormap":"file";
			addItemList(name, l, type);
		}
		window.onready();
	});
}

saveWad.onclick = function(){
	saveFile("arquivo.wad", wad.compile())
}
window.onready = function(){}



