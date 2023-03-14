var proj = new FepuProject("teste");
proj.loadProject();

var mainPicker = new Picker();
mainPicker.createTexture = function(way, path, callback){
	alert(path);
	var id = proj.generateID();
	IO.writeBinaryFile(proj.texturePath+"/"+id+".feputex", new Uint8Array([100, 100]));
	callback("teste.tt",{"src":id, "width":0, "height":0});
};
mainPicker.open(false, proj, OBJ_T.Texture);