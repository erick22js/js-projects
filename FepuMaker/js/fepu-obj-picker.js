const Picker = function(){
	const win = document.createElement("div");
	const ctn = document.createElement("div");
	var delB;
	var creB;
	var impB;
	var canB;
	var actDir = [];
	var sNames = [];
	var Paths = {};
	var objTyp = null;
	var selectMode = false;
	var deleteMode = false;
	var VIEWM = LModes.GRID;
	var self = this;
	var proj = null;
	win.appendChild(ctn);
	document.body.appendChild(win);
	this.createTexture = function(){};
	this.createThing = function(){};
	this.createMap = function(){};
	this.createMusic = function(){};
	var self = this;
	//Inicialização de Janela
	{
		win.style.backgroundColor = "#474";
		win.style.position = "absolute";
		win.style.left = "-101%";
		win.style.top = "0%";
		win.style.width = "100%";
		win.style.height = "100%";
		
		//Conteiner com objetos listados
		ctn.style.border = "1px solid black";
		ctn.style.position = "absolute";
		ctn.style.left = "2%";
		ctn.style.top = "12%";
		ctn.style.width = "95%";
		ctn.style.height = "84%";
		ctn.style.overflowY = "scroll";
		ctn.style.overflowX = "scroll";
		
		//Botões práticos
		//apagar objeto
		delB = document.createElement("button");
		btn = delB;
		btn.style.position = "absolute";
		btn.style.top = "2%";
		btn.style.left = "2%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Deletar objeto(s)";
		btn.onclick = function(){
			deleteMode = !deleteMode;
			if(deleteMode){
				creB.style.top = "-101%";
				impB.style.top = "-101%";
				this.textContent = "Cancelar";
			}else{
				creB.style.top = "2%";
				impB.style.top = "2%";
				this.textContent = "Deletar objeto(s)";
			}
		}
		win.appendChild(btn);
		//Criar objeto
		creB = document.createElement("button");
		btn = creB;
		btn.style.position = "absolute";
		btn.style.top = "2%";
		btn.style.left = "29%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Criar objeto";
		win.appendChild(btn);
		//Criar opt
		btn = document.createElement("select");
		btn.style.position = "absolute";
		btn.style.top = "0%";
		btn.style.left = "0%";
		btn.style.width = "100%";
		btn.style.height = "100%";
		btn.innerHTML += "<option value='texture'>Texture</option>";
		btn.innerHTML += "<option value='folder'>Folder</option>";
		btn.style.opacity = "0";
		btn.onclick = function(){
			this.value = null;
		}
		btn.onchange = function(){
			var path = getPath();
			if(this.value=="texture"){
				self.createTexture(actDir, path, function(name, data){
					createItem(path, name, data);
					reloadFiles();
				});
			}else if(this.value=="thing"){
				self.createThing(actDir, path, function(name, data){
					createItem(path, name, data);
					reloadFiles();
				});
			}else if(this.value=="map"){
				self.createMap(actDir, path, function(name, data){
					createItem(path, name, data);
					reloadFiles();
				});
			}else if(this.value=="music"){
				self.createMusic(actDir, path, function(name, data){
					createItem(path, name, data);
					reloadFiles();
				});
			}else if(this.value=="folder"){
				var name = prompt("Insert a name for folder");
				if(name==null||name==""||testPath(name)==null)
					return;
				path[name] = {folder:{}};
			}
			proj.savePaths(Paths, objTyp);
			reloadFiles();
			this.value = null;
		}
		creB.appendChild(btn);
		//Importar objeto
		impB = document.createElement("button");
		btn = impB;
		btn.style.position = "absolute";
		btn.style.top = "2%";
		btn.style.left = "51%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Importar objeto";
		win.appendChild(btn);
		//Cancelar
		canB = document.createElement("button");
		btn = canB;
		btn.style.position = "absolute";
		btn.style.top = "2%";
		btn.style.left = "78%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Voltar";
		btn.onclick = function(){
			self.onCancelSelect();
			win.style.left = "-101%";
			reloadFiles();
		}
		win.appendChild(btn);
	}
	function createItem(path, name, data){
		path[name] = data;
	}
	function openFolder(folder){
		if(folder!="..")
			actDir.push(folder);
		else
			actDir.pop();
		reloadFiles();
	}
	function getSubDir(folder, i){
		i++;
		if(i>=actDir.length)
			return folder;
		return getSubDir(folder[actDir[i]].folder, i)
	}
	function getPath(){
		return getSubDir(Paths.folder, -1);
	}
	function deleteItem(folder, name){
		delete folder[name];
		proj.savePaths(Paths, objTyp);
		reloadFiles();
		//alert("Foi apagado o item "+name);
	}
	function reloadFiles(){
		ctn.innerHTML = "";
		var folder = getPath();
		var names = [];
		for(var i in folder)
			names.push(i);
		if(actDir.length>0){
			names.push("..");
			folder[".."] = {
				folder: [],
			}
		}
		names.sort(function(a, b){
			var dic_a = folder[a].folder!=null;
			var dic_b = folder[b].folder!=null;
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
				("../img/"+(folder[names[i]].folder==null?"file":"folder")+".png");
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
			ctnItem.path = folder;
			
			if(folder[names[i]].folder!=null){
				ctnItem.onclick = function(){
					if(deleteMode){
						if(confirm("Deseja excluir '"+this.item+"'?")){
							deleteItem(this.path, this.item);
						}
					}else
						openFolder(this.item);
				}
			}
			else
				ctnItem.onclick = function(){
					if(deleteMode){
						if(confirm("Deseja excluir '"+this.item+"'?")){
							deleteItem(this.path, this.item);
						}
					}else{
						self.onSelect(this.path[this.item], this.path, this.item);
						win.style.left = "-101%";
						reloadFiles();
					}
				}
			ctn.appendChild(ctnItem);
		}
		delete folder[".."];
	}
	this.onSelect = function(){}
	this.onCancelSelect = function(){}
	this.open = function(selectionmode=false, project, objtype=OBJ_T.Texture){
		objTyp = objtype;
		selectMode = selectionmode;
		proj = project;
		Paths = project.loadPaths()[objtype];
		if(selectionmode){
			win.style.left = "2%";
			win.style.width = "92%";
			win.style.top = "1%";
			win.style.height = "93%";
			win.style.border = "8px solid black";
			delB.style.top = "-101%";
			creB.style.top = "-101%";
			impB.style.top = "-101%";
		}
		else{
			win.style.left = "0%";
			win.style.width = "100%";
			win.style.top = "0%";
			win.style.height = "100%";
			win.style.border = "0px solid black";
			delB.style.top = "2%";
			creB.style.top = "2%";
			impB.style.top = "2%";
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

const OBJ_T = {
	Texture: "Texture",
	Thing: "Thing",
	Map: "Map",
	Sample: "Sample",
	Music: "Music",
}