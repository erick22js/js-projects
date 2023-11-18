
function docgenGenFromFile(docs, file_name, node){
	// Clear all children of the given node
	node.innerHTML = "";
	
	docs._global = true;
	
	// Retrieves the file by name
	var file = docs[file_name];
	
	const TS_VARIABLE = 0;
	const TS_FUNCTION = 1;
	const TS_TYPEDEF = 2;
	
	function genSection(scope, class_mode=true, node){
		var el_section = node;
		var first = true;
		
		// Topic Class
		if(class_mode){
			var el_class_link = document.createElement("a");
			el_class_link.id = getScopeLink(scope);
			el_section.appendChild(el_class_link);
			var el_class_name = document.createElement("class-name");
			el_class_name.textContent = scope.name;
			el_section.appendChild(el_class_name);
			
			// Setting inheritance labels
			if(scope.inheritance && scope.inheritance.length){
				scope.inheritance.parent = scope;
				var el_inherit_text = document.createElement("inherit-text");
				el_inherit_text.textContent = "Inherits from: ";
				for(var i=0; i<scope.inheritance.length; i++){
					var el_class = document.createElement("a");
					el_class.textContent = scope.inheritance[i] + (i==(scope.inheritance.length-1)?"":", ");
					var type = getType(scope.inheritance[i], scope);
					if(type){
						el_class.href = '#'+getScopeLink(type[1]);
					}
					el_inherit_text.appendChild(el_class);
				}
				el_section.appendChild(el_inherit_text);
			}
			
			var el_description = document.createElement("description");
			el_description.textContent = scope.description;
			el_section.appendChild(el_description);
			first = false;
		}
		
		// Setting typedef
		if(scope.typedefs && scope.typedefs.length){
			scope.typedefs.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Typedefs";
			el_section.appendChild(el_topic);
			
			genSymbols(scope.typedefs, el_section, TS_TYPEDEF);
			first = false;
		}
		
		// Setting structs
		if(scope.structs && scope.structs.length){
			scope.structs.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Structs";
			el_section.appendChild(el_topic);
			
			genScopes(scope.structs, el_section);
			first = false;
		}
		
		// Setting classes
		if(scope.classes && scope.classes.length){
			scope.classes.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Classes";
			el_section.appendChild(el_topic);
			
			genScopes(scope.classes, el_section);
			first = false;
		}
		
		// Setting static variables
		if(scope.static_variables && scope.static_variables.length){
			scope.static_variables.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Static Variables";
			el_section.appendChild(el_topic);
			
			genSymbols(scope.static_variables, el_section);
			first = false;
		}
		
		// Setting properties
		if(scope.properties && scope.properties.length){
			scope.properties.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Properties";
			el_section.appendChild(el_topic);
			
			genSymbols(scope.properties, el_section);
			first = false;
		}
		
		// Setting static functions
		if(scope.static_functions && scope.static_functions.length){
			scope.static_functions.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Static Functions";
			el_section.appendChild(el_topic);
			
			genSymbols(scope.static_functions, el_section, TS_FUNCTION);
			first = false;
		}
		
		// Setting methods
		if(scope.methods && scope.methods.length){
			scope.methods.parent = scope;
			if(!first){
				var el_split = document.createElement("split");
				el_section.appendChild(el_split);
			}
			var el_topic = document.createElement("topic");
			el_topic.textContent = "Methods";
			el_section.appendChild(el_topic);
			
			genSymbols(scope.methods, el_section, TS_FUNCTION);
			first = false;
		}
	}
	
	function getScopeLink(scope){
		var names = [];
		var sc = scope;
		while(sc._global != true){
			if(sc.name){
				names.unshift(sc.name);
			}
			sc = sc.parent;
		}
		return "_CLASS_"+names.join('.');
	}
	
	function hasType(name, scope){
		var names = name.split(".");
		
		if(scope.typedefs){
			var res = null;
			scope.typedefs.forEach(function(sym){
				if(sym.name==name){
					res = sym;
				}
			});
			if(res){
				return ["typedef", res];
			}
		}
		if(scope.classes){
			var res = null;
			scope.classes.forEach(function(sym){
				if(sym.name==names[0]){
					res = sym;
				}
			})
			if(res){
				if(res.name==name){
					return ["class", res];
				}
				else{
					return hasType(name.split('.').slice(1).join('.'), res);
				}
			}
		}
		if(scope.structs){
			var res = null;
			scope.structs.forEach(function(sym){
				if(sym.name==names[0]){
					res = sym;
				}
			})
			if(res){
				if(res.name==name){
					return ["class", res];
				}
				else{
					return hasType(name.split('.').slice(1).join('.'), res);
				}
			}
		}
	}
	
	function getType(name, item){
		var global = item;
		while(global._global != true){
			if(global.name){
				var item = hasType(name, global);
				if(item){
					return item;
				}
			}
			global = global.parent;
		}
		for(var f in global){
			var item = hasType(name, global[f]);
			if(item){
				return item;
			}
		}
		return null;
	}
	
	function genType(name, item){
		var type = getType(name, item);
		if(type && type[0]=='typedef'){
			var el_type = document.createElement("typedef");
		}
		else if(type){
			var el_type = document.createElement("class");
			var el_link = document.createElement("a");
			el_link.href = "#"+getScopeLink(type[1]);
			el_link.textContent = name;
			el_type.appendChild(el_link);
			return el_type;
		}
		else{
			var el_type = document.createElement("type");
		}
		el_type.textContent = name;
		return el_type;
	}
	
	function genScopes(list, node){
		for(var si=0; si<list.length; si++){
			list[si].parent = list;
			var el_section = document.createElement("section");
			genSection(list[si], true, el_section);
			node.appendChild(el_section);
		}
	}
	
	function genSymbols(list, node, type=TS_VARIABLE){
		for(var si=0; si<list.length; si++){
			list[si].parent = list;
			var el_symbol = document.createElement("symbol");
			el_symbol.appendChild(genType(list[si].type, list[si]));
			var el_name = document.createElement(type == TS_TYPEDEF ? "typedef": "name");
			el_name.textContent = list[si].name;
			if(type == TS_VARIABLE){
				if(typeof(list[si].value) !== 'undefined'){
					var el_value = document.createElement("value");
					el_value.textContent = " = " + list[si].value;
					el_name.appendChild(el_value);
				}
			}
			else if(type==TS_FUNCTION){
				el_name.textContent += "(";
				if(list[si].parameters && list[si].parameters.length){
					for(var pi=0; pi<list[si].parameters.length; pi++){
						var parameter = list[si].parameters[pi];
						el_name.textContent += parameter.name;
						if(pi != (list[si].parameters.length-1)){
							el_name.textContent += ", ";
						}
					}
				}
				el_name.textContent += ")";
			}
			el_symbol.appendChild(el_name);
			
			node.appendChild(el_symbol);
			if(type==TS_FUNCTION && list[si].parameters && list[si].parameters.length){
				for(var pi=0; pi<list[si].parameters.length; pi++){
					var parameter = list[si].parameters[pi];
					var el_parameter = document.createElement("parameter");
					el_parameter.appendChild(genType(parameter.type, list[si]));
					var el_name = document.createElement("name");
					el_name.textContent = parameter.name;
					el_parameter.appendChild(el_name);
					if(typeof(parameter.value) !== 'undefined'){
						var el_value = document.createElement("value");
						el_value.textContent = " = " + parameter.value;
						el_name.appendChild(el_value);
					}
					var el_description = document.createElement("description");
					el_description.textContent = parameter.description;
					el_parameter.appendChild(el_description);
					node.appendChild(el_parameter);
				}
			}
			var el_description = document.createElement("description");
			el_description.textContent = list[si].description;
			node.appendChild(el_description);
		}
	}
	
	file.parent = docs;
	genSection(file, false, node);
}

function docgenGenAllFiles(docs, node){
	// Generating files summary
	var el_center = document.createElement("center");
	el_center.textContent = "Files";
	node.appendChild(el_center);
	{
		var el_list = document.createElement("ul");
		for(var file in docs){
			var el_item = document.createElement("li");
			el_list.appendChild(el_item);
			var el_link = document.createElement("a");
			el_link.href = "#_FILE_"+file;
			el_link.textContent = file;
			el_item.appendChild(el_link);
		}
		node.appendChild(el_list);
	}
	
	for(var i=0; i<4; i++){
		node.appendChild(document.createElement("br"));
	}
	
	// Generating classes summary
	var el_center = document.createElement("center");
	el_center.textContent = "Classes";
	node.appendChild(el_center);
	var classes = [];
	for(var file in docs){
		if(docs[file].structs){
			for(var i=0; i<docs[file].structs.length; i++){
				classes.push(docs[file].structs[i].name);
			}
		}
		if(docs[file].classes){
			for(var i=0; i<docs[file].classes.length; i++){
				classes.push(docs[file].classes[i].name);
			}
		}
	}
	{
		var el_list = document.createElement("ul");
		for(var i=0; i<classes.length; i++){
			var el_item = document.createElement("li");
			el_list.appendChild(el_item);
			var el_link = document.createElement("a");
			el_link.href = "#_CLASS_"+classes[i];
			el_link.textContent = classes[i];
			el_item.appendChild(el_link);
		}
		node.appendChild(el_list);
	}
	
	// Generating docs
	for(var file in docs){
		var el_separator = document.createElement("separator");
		node.appendChild(el_separator);
		var el_link = document.createElement("a");
		el_link.id = "_FILE_"+file;
		node.appendChild(el_link);
		var el_center = document.createElement("center");
		el_center.textContent = file;
		node.appendChild(el_center);
		var el_part = document.createElement("file");
		node.appendChild(el_part);
		docgenGenFromFile(docs, file, el_part);
		var el_back = document.createElement("a");
		el_back.href = "#";
		el_back.textContent = "[Header]";
		node.appendChild(el_back);
	}
}


