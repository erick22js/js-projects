
const Xplorer = function(){
	const win = document.createElement("div");
	const ctn = document.createElement("div");
	const adr = document.createElement("input");
	var canB;
	var picB;
	var actDir = "/sdcard";
	var VIEWM = LModes.GRID;
	win.appendChild(ctn);
	win.appendChild(adr);
	document.body.appendChild(win);
	var sNames = [];
	var multiS = false;
	//Inicialização de Janela
	{
		win.style.backgroundColor = "#474";
		win.style.position = "absolute";
		win.style.left = "-101%";
		win.style.top = "0%";
		win.style.width = "100%";
		win.style.height = "100%";
		
		//Conteiner com arquivos listados
		ctn.style.border = "1px solid black";
		ctn.style.position = "absolute";
		ctn.style.left = "2%";
		ctn.style.top = "22%";
		ctn.style.width = "95%";
		ctn.style.height = "74%";
		ctn.style.overflowY = "scroll";
		ctn.style.overflowX = "scroll";
		
		//Endereço de diretório no topo
		adr.value = actDir;
		adr.onclick = function(){
			var npath = prompt("Caminho de arquivo", this.value);
			if(npath!=null){
				openPath(npath);
			}
		}
		adr.readonly = "readonly";
		adr.style.fontSize = "120%";
		adr.style.position = "absolute";
		adr.style.left = "2%";
		adr.style.top = "2%";
		adr.style.width = "70%";
		adr.style.height = "8%";
		
		//Botões práticos
		//Criar arquivo
		var btn = document.createElement("button");
		btn.style.position = "absolute";
		btn.style.top = "13%";
		btn.style.left = "2%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Criar arquivo";
		win.appendChild(btn);
		//Criar pasta
		btn = document.createElement("button");
		btn.style.position = "absolute";
		btn.style.top = "13%";
		btn.style.left = "24%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Criar pasta";
		win.appendChild(btn);
		//Importar arquivo
		btn = document.createElement("button");
		btn.style.position = "absolute";
		btn.style.top = "13%";
		btn.style.left = "46%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Importar arquivo";
		win.appendChild(btn);
		//Selecionar
		picB = document.createElement("button");
		btn = picB;
		btn.style.position = "absolute";
		btn.style.top = "3%";
		btn.style.left = "78%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Selecionar arquivos";
		win.appendChild(btn);
		//Cancelar
		canB = document.createElement("button");
		btn = canB;
		btn.style.position = "absolute";
		btn.style.top = "13%";
		btn.style.left = "78%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Cancelar";
		win.appendChild(btn);
	}
	function openFolder(folder){
		//actDir += "/"+folder;
		if(folder!="..")
			actDir = actDir=="/"?"/"+folder
				:actDir+"/"+folder;
		else
			actDir = 
				actDir.lastIndexOf("/")==0?"/"
				:actDir.substr(0, actDir.lastIndexOf("/"));
		reloadFiles();
	}
	function openPath(path){
		actDir = path;
		reloadFiles();
	}
	function reloadFiles(){
		adr.value = actDir;
		ctn.innerHTML = "";
		sNames = [];
		var names = JSON.parse(IO.itemsInPath(actDir));
		names.splice(0, 0, "..");
		var details = JSON.parse(IO.itemsPropertiesInPath(actDir));
		details[".."] = {
			isBack: true,
		}
		names.sort(function(a, b){
			var dic_a = !details[a].isFile;
			var dic_b = !details[b].isFile;
			if(dic_a!=dic_b){
				return dic_a?-1:
					dic_b?1:
					0;
			}
			for(var i=0; true; i++){
				if(i>=a.length){
					return -1;
				}
				else if(i>=b.length){
					return 1;
				}
				var ca = (a.toLowerCase()).charCodeAt(i);
				var cb = (b.toLowerCase()).charCodeAt(i);
				if((ca-cb)!=0)
					return ca-cb;
			}
			return 0;
		});
		
		for(var i=0; i<names.length; i++){
			
			var format = names[i].substr(names[i].lastIndexOf(".")+1, names[i].length);
			
			//Gerando Conteiner para item
			var ctnItem = document.createElement("div");
			ctnItem.style.position = "absolute";
			ctnItem.style.border = "1px solid black";
			if(VIEWM==LModes.LIST){
				ctnItem.style.left = "0%";
				ctnItem.style.top = (i*20)+"%";
				ctnItem.style.width = "100%";
				ctnItem.style.height = "20%";
			}else if(VIEWM==LModes.GRID){
				ctnItem.style.left = ((i%5)*20)+"%";
				ctnItem.style.top = ((~~(i/5))*40)+"%";//(i*20)+"%";
				ctnItem.style.width = "20%";
				ctnItem.style.height = "40%";
			}
			ctnItem.style.overflow = "hidden";
			
			//Gerando etiqueta com nome de item
			var label = document.createElement("h3");
			label.style.position = "absolute";
			label.style.fontSize = "100%";
			if(VIEWM==LModes.LIST){
				label.style.top = "20%";
				label.style.left = "12%";
				label.style.width = "100%";
				label.style.height = "50%";
			}else if(VIEWM==LModes.GRID){
				label.style.top = "70%";
				label.style.left = "20%";
				label.style.width = "100%";
				label.style.height = "20%";
			}
			label.textContent = names[i];
			ctnItem.appendChild(label);
			
			//Gerar ícone de item
			var ic = document.createElement("img");
			ic.src = ["png","gif","bmp","jpg","jpeg"].includes(format)?"data:image/png;base64,"+getThumbFile(details[names[i]].path):
				("../img/"+(details[names[i]].isFile?"file":"folder")+".png");
			ic.style.position = "absolute";
			ic.style.imageRendering = "pixelated";
			if(VIEWM==LModes.LIST){
				ic.style.top = "2%";
				ic.style.left = "1%";
				ic.style.width = "10%";
				ic.style.height = "94%";
			}else if(VIEWM==LModes.GRID){
				ic.style.top = "1%";
				ic.style.left = "10%";
				ic.style.width = "78%";
				ic.style.height = "78%";
			}
			ctnItem.appendChild(ic)
			
			ctnItem.item = names[i];
			ctnItem.isFile = details[names[i]].isFile;
			ctnItem.selected = false;
			
			if(!details[names[i]].isFile){
				ctnItem.onclick = function(){
					openFolder(this.item);
				}
			}else
				ctnItem.onclick = function(){
					this.selected = !this.selected;
					this.style.backgroundColor = this.selected?"yellow":"transparent";
					if(multiS){
						if(this.selected){
							sNames.push(this);
						}else{
							sNames.splice(sNames.indexOf(this), 1);
						}
					}else{
						if(this.selected){
							for(var i=0; i<sNames.length; i++){
								sNames[i].click();
							}
							sNames = [];
							sNames.push(this);
						}else{
							sNames.splice(0, 1);
						}
					}
				}
			ctn.appendChild(ctnItem);
		}
	}
	this.onSelect = function(){}
	this.onCancelSelect = function(){}
	this.open = function(selectionmode=false, extensions="*", multiselection=false){
		multiS = multiselection;
		if(selectionmode){
			win.style.left = "2%";
			win.style.width = "92%";
			win.style.top = "1%";
			win.style.height = "93%";
			win.style.border = "8px solid black";
			adr.style.width = "70%";
			canB.style.left = "78%";
			picB.style.left = "78%";
		}
		else{
			win.style.left = "0%";
			win.style.width = "100%";
			win.style.top = "0%";
			win.style.height = "100%";
			win.style.border = "0px solid black";
			adr.style.width = "94%";
			canB.style.left = "-100%";
			picB.style.left = "-100%";
		}
		picB.in = this;
		picB.onclick = function(){
			var namesList = [];
			for(var i=0; i<sNames.length; i++){
				namesList.push(sNames[i].item);
			}
			this.in.onSelect(actDir, namesList);
			win.style.left = "-101%";
			reloadFiles();
		}
		canB.in = this;
		canB.onclick = function(){
			this.in.onCancelSelect();
			win.style.left = "-101%";
			reloadFiles();
		}
		reloadFiles();
	}
}

function getThumbFile(path){
	try{
		var encoded = IO.readImageThumb(path, 128);
		return encoded;
		//alert(pixels);
	}catch(erro){
		alert("erro: "+erro);
	}
	return "#";
}

const LModes = {
	LIST:0,
	GRID:1,
}

var IO = IO||new function(){
	this.itemsInPath = function(){
		return "";//'["teste.png"]';
	}
	this.itemsPropertiesInPath = function(){
		return "";//'{"teste.png":{"path":"caminho..file"}}';
	}
};