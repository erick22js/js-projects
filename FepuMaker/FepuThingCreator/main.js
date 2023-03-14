
const Data = {
	"__valuetype__": "dict",
	"__nondeletable__": true,
	"__extensible__":true,
	"Properties":{
		"__valuetype__": "dict",
		"__nondeletable__": true,
		"name": {"__valuetype__":"text","__nondeletable__": true,"__value__":"player"},
		"id": {"__valuetype__":"text","__nondeletable__": true,"__value__":"player"},
		"family": {"__valuetype__":"multiselect","__nondeletable__": true,"__value__":[]},
		"hate": {"__valuetype__":"multiselect","__nondeletable__": true,"__value__":[]},
	},
	"Values":{
		"__valuetype__": "dict",
		"__nondeletable__": true,
		"speed": {"__valuetype__":"number","__nondeletable__": true,"__value__":20},
		"health": {"__valuetype__":"number","__nondeletable__": true,"__value__":20},
		"painChance": {"__valuetype__":"number","__nondeletable__": true,"__value__":50},
		"meeleAtack": {"__valuetype__":"number","__nondeletable__": true,"__value__":0},
		"rangeAtack": {"__valuetype__":"number","__nondeletable__": true,"__value__":0},
	},
	"States":{
		"__valuetype__": "dict",
		"__nondeletable__": true,
		"idleState": {"__valuetype__":"select","__nondeletable__": true,"__value__":null},
		"moveState": {"__valuetype__":"select","__nondeletable__": true,"__value__":null},
		"painState": {"__valuetype__":"select","__nondeletable__": true,"__value__":null},
		"deathState": {"__valuetype__":"select","__nondeletable__": true,"__value__":null},
		"rangeState": {"__valuetype__":"multiselect","__nondeletable__": true,"__value__":null},
		"meeleState": {"__valuetype__":"multiselect","__nondeletable__": true,"__value__":null},
	},
	"Idle":{
		"__valuetype__": "list",
		"__length__":2,
		"0":{
			"duration":{"__valuetype__":"number","__value__":100},
		},
		"1":{
			"duration":{"__valuetype__":"number","__value__":50},
		},
	}
}
const textReplaces = {
	"Properties": "Propriedades",
	"Thing": "Objeto",
}
//Data.Parado[0].__closed__ = true;

function translateName(text){
	if(textReplaces[text]==null)
		return text;
	return textReplaces[text];
}

var propP = null;

function reloadList(){
	windowList.innerHTML = "";
	var top = 0;
	var desc;
	function addSection(pad=0, name, ref, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "blue";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = (100-pad)+"%";
		it.style.height = "10%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflowY = "hidden";
		top += 12;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = translateName(name)||"--null--";
		desc.style.position = "absolute";
		desc.style.left = "8%";
		desc.style.top = "-20%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		//Create pop list
		pp = document.createElement("div");
		pp.refDt = ref; pp.fatherDt = father; pp.attribName = name;
		pp.style.position = "absolute";
		pp.style.left = (pp.refDt.__closed__?2:1)+"%";
		pp.style.top = (pp.refDt.__closed__?0:25)+"%";
		pp.style.width = "0%";
		pp.style.height = "0%";
		pp.style.border = "solid "+(winBox.height/20)+"px";
		pp.style.borderColor = 
			pp.refDt.__closed__?"transparent transparent transparent white"
			:"white transparent transparent transparent";
		pp.onclick = function(){
			//console.log(this.fatherDt);//JSON.stringify(this.fatherDt));
			//this.fatherDt[this.attribName].__closed__ = !this.father[this.attribName].__closed__;
			this.refDt.__closed__ = !this.refDt.__closed__;
			//if(!this.refDt.__closed__)
				this.scrollIntoView(this)
			reloadList();
		}
		it.appendChild(pp);
		//Create delete icon
		pp = document.createElement("b");
		pp.refDt = ref; pp.fatherDt = father; pp.attribName = name;
		pp.textContent = "×";
		pp.style.position = "absolute";
		pp.style.color = "#e34";
		pp.style.top = "-25%";
		pp.style.left = "95%";
		pp.style.fontSize = "300%";
		pp.onclick = function(){
			if(!confirm("Deseja apagar o estado '"+this.attribName+"'?"))
				return;
			delete this.fatherDt[this.attribName];
			reloadList();
		}
		if((ref.__nondeletable__)!=true)
			it.appendChild(pp);
		windowList.appendChild(it);
	}
	function addFrame(pad=0, frame=0, ref, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "#555";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = (100-pad)+"%";
		it.style.height = "10%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflowY = "hidden";
		top += 12;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = "Frame "+frame;
		desc.style.position = "absolute";
		desc.style.left = "8%";
		desc.style.top = "-20%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		//Create pop list
		pp = document.createElement("div");
		pp.refDt = ref; pp.fatherDt = father; pp.attribIndex = frame;
		pp.style.position = "absolute";
		pp.style.left = (pp.refDt.__closed__?2:1)+"%";
		pp.style.top = (pp.refDt.__closed__?0:25)+"%";
		pp.style.width = "0%";
		pp.style.height = "0%";
		pp.style.border = "solid "+(winBox.height/20)+"px";
		pp.style.borderColor = 
			pp.refDt.__closed__?"transparent transparent transparent white"
			:"white transparent transparent transparent";
		pp.onclick = function(){
			//console.log(this.fatherDt);//JSON.stringify(this.fatherDt));
			//this.fatherDt[this.attribName].__closed__ = !this.father[this.attribName].__closed__;
			this.refDt.__closed__ = !this.refDt.__closed__;
			//if(!this.refDt.__closed__)
				this.scrollIntoView(this)
			reloadList();
		}
		it.appendChild(pp);
		//Create delete icon
		pp = document.createElement("b");
		pp.refDt = ref; pp.fatherDt = father; pp.frameDt = frame;
		pp.textContent = "×";
		pp.style.position = "absolute";
		pp.style.color = "#e34";
		pp.style.top = "-25%";
		pp.style.left = "95%";
		pp.style.fontSize = "300%";
		pp.onclick = function(){
			if(!confirm("Deseja apagar o frame "+this.frameDt+"?"))
				return;
			console.log(JSON.stringify(this.fatherDt));
			//delete this.refDt[this.frameDt];
			for(var i=Number(this.frameDt)+1; i<this.fatherDt.__length__; i++){
				this.fatherDt[""+(i-1)] = this.fatherDt[""+i];
			}
			delete this.fatherDt[""+(this.fatherDt.__length__-1)];
			this.fatherDt.__length__--;
			console.log(JSON.stringify(this.fatherDt));
			reloadList();
		}
		it.appendChild(pp);
		windowList.appendChild(it);
	}
	function addItem(pad=0, type, name, ref, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "white";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = (100-pad)+"%";
		it.style.height = "14%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflow = "hidden";
		top += 16;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = translateName(name)||"--null--";
		desc.style.position = "absolute";
		desc.style.left = "5%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		//Set entry
		if(ref.__valuetype__=="text"||ref.__valuetype__=="number"){
			desc = document.createElement("input");
			desc.attribName = name; desc.father = father;
			desc.value = ref.__value__;
			desc.textContent = "Item";
			desc.style.position = "absolute";
			desc.style.left = "35%";
			desc.style.width = "70%";
			desc.style.height = "100%";
			it.appendChild(desc);
		}
		
		//Create delete icon
		pp = document.createElement("b");
		pp.refDt = ref; pp.fatherDt = father; pp.attribName = name;
		pp.textContent = "×";
		pp.style.position = "absolute";
		pp.style.color = "#e34";
		pp.style.top = "-15%";
		pp.style.left = "95%";
		pp.style.fontSize = "300%";
		pp.onclick = function(){
			if(!confirm("Deseja apagar a propriedade '"+this.attribName+"'?"))
				return;
			delete this.fatherDt[this.attribName];
			reloadList();
		}
		if((ref.__nondeletable__)!=true)
			it.appendChild(pp);
		windowList.appendChild(it);
	}
	
	function addSectionAdder(pad=0, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "#8bf";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = "95%";
		it.style.height = "11%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflow = "hidden";
		top += 13;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = "+ Add state";
		desc.style.position = "absolute";
		desc.style.left = "5%";
		desc.style.top = "-10%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		it.attribName = name; it.father = father;
		it.onclick = function(){
			console.log(JSON.stringify(this.father));
			while(true){
				var name = prompt("Insira um nome para o estado:");
				if(name==null)
					return;
				if(this.father[name]!=null){
					alert("Já existe, dê-lhe outro nome");
					continue;
				}
				break;
			}
			this.father[name] = {
				"__valuetype__": "list",
				"__length__": 0,
			};
			reloadList();
		}
		windowList.appendChild(it);
	}
	
	function addFrameAdder(pad=0, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "#ccc";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = "95%";
		it.style.height = "11%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflow = "hidden";
		top += 13;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = "+ Add frame";
		desc.style.position = "absolute";
		desc.style.left = "5%";
		desc.style.top = "-10%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		it.attribName = name; it.father = father;
		it.onclick = function(){
			console.log(JSON.stringify(this.father));
			this.father[""+this.father.__length__] = {
				duration: {
					__valuetype__:"number",
					__value__:20,
				},
			};
			this.father.__length__++;
			reloadList();
		}
		windowList.appendChild(it);
	}
	
	function addPropertyAdder(pad=0, father){
		var it = document.createElement("div");
		it.style.backgroundColor = "#c99";
		it.style.border = "1px solid black";
		it.style.position = "absolute";
		it.style.width = "95%";
		it.style.height = "11%";
		it.style.left = pad+"%";
		it.style.top = (top)+"%";
		it.style.overflow = "hidden";
		top += 13;
		//Set description and entry
		desc = document.createElement("h4");
		desc.textContent = "+ Add property";
		desc.style.position = "absolute";
		desc.style.left = "5%";
		desc.style.top = "-10%";
		desc.style.width = "30%";
		desc.style.height = "100%";
		it.appendChild(desc);
		it.father = father;
		it.onclick = function(){
			console.log(JSON.stringify(this.father));
			propP = this.father;
			propertiesWindow.style.left = "0%";
			reloadList();
		}
		windowList.appendChild(it);
	}
	
	
	
	function analyseItem(pad, item, name, father){
		//Filter for properties
		if(["__closed__", "__valuetype__", "__nondeletable__", "__extensible__"].includes(name))
			return;
		
		//Check for item
		if(item.__valuetype__=="list"){
			addSection(pad, name, item, father);
			if(!item.__closed__){
				for(var i=0; i<item.__length__; i++){
					addFrame(pad+5, i, item[i], item);
					if(!item[i].__closed__){
						for(var sl in item[i])
							analyseItem(pad+10, item[i][sl], sl, item[i]);
						addPropertyAdder(pad+10, item[i]);
					}
				}
				addFrameAdder(pad+5, item);
			}
		}else if(item.__valuetype__=="dict"){
			addSection(pad, name, item, father);
			if(!item.__closed__){
				for(var i in item)
					analyseItem(pad+5, item[i], i, item);
				if(item.__extensible__)
					addSectionAdder(pad+5, item);
			}
		}else{
			addItem(pad, "text", name, item, father);
		}
	}
	analyseItem(0, Data, "Thing", window);
}

var winBox = windowList.getBoundingClientRect();

window.onload = function(){
	
	reloadList();
}