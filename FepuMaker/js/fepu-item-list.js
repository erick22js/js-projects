
const Xplorer = function(){
	const win = document.createElement("div");
	const ctn = document.createElement("div");
	const adr = document.createElement("input");
	var actDir = "/sdcard";
	win.appendChild(ctn);
	win.appendChild(adr);
	document.body.appendChild(win);
	//Inicialização de Janela
	{
		win.style.backgroundColor = "#474";
		win.style.position = "absolute";
		win.style.left = "0%";
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
		btn = document.createElement("button");
		btn.style.position = "absolute";
		btn.style.top = "3%";
		btn.style.left = "78%";
		btn.style.width = "20%";
		btn.style.height = "8%";
		btn.textContent = "Selecionar arquivos";
		win.appendChild(btn);
		//Cancelar
		var btn = document.createElement("button");
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
			actDir += "/"+folder;
		else
			actDir = actDir.substr(0, actDir.lastIndexOf("/"));
		reloadFiles();
	}
	function openPath(path){
		actDir = path;
		reloadFiles();
	}
	function reloadFiles(){
		adr.value = actDir;
		ctn.innerHTML = "";
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
			
			//Gerando Conteiner para item
			var ctnItem = document.createElement("div");
			ctnItem.style.position = "absolute";
			ctnItem.style.border = "1px solid black";
			ctnItem.style.left = "0%";
			ctnItem.style.top = (i*20)+"%";
			ctnItem.style.width = "100%";
			ctnItem.style.height = "20%";
			ctnItem.style.overflow = "hidden";
			
			//Gerando etiqueta com nome de item
			var label = document.createElement("h3");
			label.style.position = "absolute";
			label.style.fontSize = "100%";
			label.style.top = "20%";
			label.style.left = "12%";
			label.style.width = "100%";
			label.style.height = "50%";
			label.textContent = names[i];
			ctnItem.appendChild(label);
			
			//Gerar ícone de item
			var ic = document.createElement("img");
			ic.src = "../img/"+(details[names[i]].isFile?"file":"folder")+".png";
			ic.style.position = "absolute";
			ic.style.imageRendering = "pixelated";
			ic.style.top = "2%";
			ic.style.left = "1%";
			ic.style.width = "10%";
			ic.style.height = "94%";
			ctnItem.appendChild(ic)
			
			ctnItem.item = names[i];
			
			if(!details[names[i]].isFile){
				ctnItem.onclick = function(){
					openFolder(this.item);
				}
			}
			
			ctn.appendChild(ctnItem);
		}
	}
	
	reloadFiles();
}



