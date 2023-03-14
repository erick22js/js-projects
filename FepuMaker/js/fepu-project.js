
const MAINPATH = "/sdcard/FepuProjects/Projects/";

const FepuProject = function(identifier){
	
	this.projectPath = MAINPATH+identifier;
	this.texturePath = this.projectPath+"/Textures";
	this.thingPath = this.projectPath+"/Things";
	this.mapPath = this.projectPath+"/Maps";
	this.samplePath = this.projectPath+"/Samples";
	this.musicPath = this.projectPath+"/Musics";
	
	//var idproc = 1000000000;
	
	var Paths = {
		"Texture":null,
		"Thing":null,
		"Map":null,
		"Sample":null,
		"Music":null,
	}
	var Sets = null;
	
	function generateProjectSettings(opts){
		var settings = {
			"name": opts.name||"Project",
			"package": opts.package||"com.fepu.project",
			"id": new Date().getTime(),
			"version":{
				"code": opts.versionCode||1,
				"name": opts.versionName||"1.0",
			},
			"idprocedural": 999999999,
			"description": opts.description||"A Fepu project template",
		};
		Sets = settings;
		return settings;
	}
	this.createProject = function(opts={}){
		IO.makeDirectories(this.projectPath);
		IO.makeDirectories(this.texturePath);
		IO.makeDirectories(this.thingPath);
		IO.makeDirectories(this.mapPath);
		IO.makeDirectories(this.samplePath);
		IO.makeDirectories(this.musicPath);
		//Create Lists
		IO.writeTextFile(this.texturePath+"/Textures.json",'{"folder":{"testeChu":{}}}');
		IO.writeTextFile(this.thingPath+"/Things.json",'{"folder":{}}');
		IO.writeTextFile(this.mapPath+"/Maps.json",'{"folder":{}}');
		IO.writeTextFile(this.samplePath+"/Samples.json",'{"folder":{}}');
		IO.writeTextFile(this.musicPath+"/Musics.json",'{"folder":{}}');
		
		IO.writeTextFile(this.projectPath+"/project.json", JSON.stringify(generateProjectSettings(opts)))
	}
	this.saveProject = function(){
		//for(var i in Paths)
		//	this.savePaths
		this.saveSettings();
	}
	this.loadProject = function(){
		var sets = JSON.parse(IO.readTextFile(this.projectPath+"/project.json"));
		Sets = sets;
		this.loadPaths();
	}
	this.removeProject = function(){
		
	}
	
	this.loadPaths = function(){
		for(var i in Paths){
			Paths[i] = JSON.parse(IO.readTextFile(this.projectPath+"/"+i+"s/"+i+"s.json"))
		}
		return Paths;
	}
	this.savePaths = function(Pway, name){
		Paths[name] = Pway;
		IO.writeTextFile(this.projectPath+"/"+name+"s/"+name+"s.json", JSON.stringify(Paths[name]));
	}
	this.saveSettings = function(){
		IO.writeTextFile(this.projectPath+"/project.json", JSON.stringify(Sets));
	}
	this.generateID = function(){
		Sets.idprocedural++;
		this.saveSettings();
		return Sets.idprocedural;
	}
	this.cacheTexturesThumbs = function(){
		
	}
	
}