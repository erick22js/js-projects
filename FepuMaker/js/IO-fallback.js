//localStorage.removeItem("*paths");
var IO = IO!=null?IO:(new function(){
	var Paths = localStorage.getItem("*paths")||'{"/":{}}';
	Paths = JSON.parse(Paths);
	
	const InvalidChars = /[\*|\\|\/|\"|\:|\?|\||\<|\>]/g;
	this.InvalidChars = InvalidChars;
	
	function testPath(path){
		var directories = path.split("/");
		for(var i=0; i<directories.length; i++){
			directories[i] = directories[i].toLowerCase();
			if((directories[i]).match(InvalidChars))
				return null;
		}
		return directories;
	}
	function savePath(){
		localStorage.setItem("*paths", JSON.stringify(Paths));
	}
	this.writeTextFile = function(path, content){
		var way = testPath(path);
		if(way==null)
			return false;
		if(!this.existPath(path))
			this.createNewFile(path);
		if(!this.existPath(path))
			return false;
		var file = this.getFile(path);
		localStorage.setItem(path, content);
		file.lastTime = new Date().getTime();
		savePath();
		return true;
	}
	this.writeBinaryFile = function(path, bytes){
		this.writeTextFile(path, eval("String.fromCharCode("+(new Array(bytes).join())+")"));
	}
	/*
	@JavascriptInterface
	public boolean writeImagePixels(String path, int[] pixels){
	File file = new File(path);
	try{
	//ImageDecoder.Source src = 
	}catch(IOException erro){
	
	}
	}*/
	this.readTextFile = function(path){
		var way = testPath(path);
		if(way==null)
			return way;
		if(!this.existPath(path))
			return null;
		return localStorage.getItem(path);
	}
	this.readBinaryFile = function(path){
		var src = this.readTextFile(path);
		//alert(src);
		var bytes = new Uint8Array(src.length);
		for(var i=0; i<bytes.length; i++){
			bytes[i] = src.charCodeAt(i);
		};
		return bytes;
	}
	/*
	}@JavascriptInterface
	public void writeImagePixels(String path, byte[] colors, int width, int height){
	File file = new File(path);
	try{
	FileOutputStream fos = new FileOutputStream(file);
	Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
	int i=0;
	for(int y=0; y<height; y++){
	for(int x=0; x<width; x++){
	//0xAARRGGBB
	bmp.setPixel(x, y,
	//0xff000000+
	((colors[i+3]&0xff)*0x1000000)+
	((colors[i]&0xff)*0x10000)+
	((colors[i+1]&0xff)*0x100)+
	((colors[i+2]&0xff))
	);
	i+=4;
	}
	}
	bmp.compress(Bitmap.CompressFormat.PNG, 100, fos);
	fos.close();
	}catch(Exception error){
	Log.d("Error saving bitmap", "because: "+error);
	error.printStackTrace();
	//return pixels;
	}
	}
	@JavascriptInterface
	public String readImagePixels(String path){
	File file = new File(path);
	int[] pixels = new int[0];
	//try{
	//ImageDecoder.Source src = ImageDecoder.createSource(file);
	Bitmap bmp = BitmapFactory.decodeFile(path);
	
	//ImageDecoder.decodeBitmap(src);
	
	//pixels = new int[bmp.getWidth()*bmp.getHeight()];
	JSONArray pixs = new JSONArray();
	//for(int i=0; i<pixels.length; i++)
	//	pixs.put(pixels[i]);
	int i=0; 
	for(int y=0; y<bmp.getHeight(); y++){
	int[] row = new int[bmp.getWidth()];
	//bmp.getPi
	bmp.getPixels(row, 0, row.length, 0, y, row.length, 1);
	for(int x=0; x<row.length; x++){
	pixs.put(row[x]);
	//pixs.put(bmp.getPixel(x, y));
	//bmp.get
	//i++;
	}
	}
	return pixs.toString();//""+bmp.getWidth();
	//}
	/*catch(Exception error){
	return "[]";
	}*//*
	}
	@JavascriptInterface
	public String readImageThumb(String path, int size){
	Bitmap bmp = ThumbnailUtils.extractThumbnail(
	BitmapFactory.decodeFile(path),
	size, size);
	ByteArrayOutputStream bos = new ByteArrayOutputStream();
	bmp.compress(Bitmap.CompressFormat.PNG, 100, bos);
	byte[] bytes = bos.toByteArray();
	return Base64.encodeToString(bytes, Base64.DEFAULT);
	}
	@JavascriptInterface
	public boolean copyFile(String pfrom, String pto){
	/*try{
	Path pf = Paths.get(pfrom);
	Path pt = Paths.get(pto);
	Files.copy(pf, pt);
	return true;
	}catch(Exception e){*/
	//return false;
	//}
	//}/*
	/*@JavascriptInterface
	public boolean moveFile(String pfrom, String pto){
	/*try{
	Path pf = Paths.get(pfrom);
	Path pt = Paths.get(pto);
	Files.move(pf, pt);
	return true;
	}catch(Exception e){*/
	//return false;
	//}
	/*}
	*/
	this.createNewFile = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		for(var i=0; i<way.length; i++){
			var parent = (way.slice(1, i).join("/"));
			if(i<(way.length-1)){
				if(!this.existPath("/"+parent))
					return false;
			}else{
				if(!this.existPath("/"+parent))
					return false;
				Paths["/"+parent][way[way.length-1]] = {
					"type": "file",
					"parentPath": "/"+(way.slice(1, i-1).join("/")),
					"absolutePath": "/"+parent,
					"lastTime": new Date().getTime(),
				};
			}
		}
		return true;
	}
	this.makeDirectories = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		for(var i=0; i<way.length; i++){
			var parent = (way.slice(1, i+1).join("/"));
			if(!this.existPath("/"+parent))
				this.makeDirectory("/"+parent);
		}
	}
	this.makeDirectory = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		for(var i=0; i<way.length; i++){
			var parent = (way.slice(1, i).join("/"));
			if(i<(way.length-1)){
				//if(!this.existPath("/"+parent))
				//	return false;
			}else{
				if(!this.existPath("/"+parent))
					return false;
				//alert("/"+parent);
				Paths["/"+parent+(i>1?"/":"")+way[way.length-1]] = {};
				Paths["/"+parent][way[way.length-1]] = {
					"type": "folder",
					"parentPath": "/"+(way.slice(1, i-1).join("/")),
					"absolutePath": "/"+parent,
					"lastTime": new Date().getTime(),
				};
			}
		}
		savePath();
		return true;
	}
	this.isFile = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		return this.getFile(path).type=="file";
	}
	this.isDirectory = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		return this.getFile(path).type=="folder";
	}
	this.isHidden = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		return way[way.length-1].charAt(0)==".";
	}
	this.deletePath = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		localStorage.removeItem(path);
		var parent = (way.slice(0, way.length-1).join("/"));
		parent = parent==""?"/":parent;
		var file = this.getFile(path);
		if(file.type=="folder"){
			for(var i in Paths[path]){
				//alert(path+"/"+i);
				this.deletePath(path+"/"+i);
			}
		}
		//alert(parent);
		if(this.existPath(path))
			delete Paths[parent][way[way.length-1]];
		delete Paths[path];
		savePath();
		return true;
	}
	this.existPath = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		if(Paths[path]!=null){
			return true;
		}
		var parent = (way.slice(0, way.length-1).join("/"));
		//alert(parent);
		try{
			if(Paths[parent][way[way.length-1]]!=null)
				return true;
		}catch(e){}
		return false;
	}
	this.itemsInPath = function(path){
		var way = testPath(path);
		if(way==null)
			return way;
		var list = [];
		for(var i in Paths[path]){
			list.push(i);
		}
		return JSON.stringify(list);
	}
	this.itemsPropertiesInPath = function(path){
		var way = testPath(path);
		if(way==null)
			return way;
		var list = {};
		for(var i in Paths[path]){
			var file = this.getFile(path+"/"+i)
			var fi = {
				"isFile": file.type=="file",
				"size": this.fileSize(path+"/"+i),
				"lastTime": file.lastTime,
				"isHidden": this.isHidden(path+"/"+i),
				"path": file.absolutePath,
			};
			list[i] = fi;
		}
		return JSON.stringify(list);
	}
	this.fileSize = function(path){
		var way = testPath(path);
		if(way==null)
			return 0;
		var file = this.getFile(path);
		if(file.type=="folder"){
			var ammount = 0;
			for(var i in Paths[path]){
				ammount += this.fileSize(path+"/"+i);
			}
			return ammount;
		}else{
			return (this.readTextFile(path)||"").length; 
		}
	}
	this.lastTimeModified = function(path){
		var way = testPath(path);
		if(way==null)
			return false;
		return this.getFile(path).lastTime;
	}
	this.getFile = function(path){
		var way = testPath(path);
		if(way==null)
			return null;
		var parent = (way.slice(0, way.length-1).join("/"));
		parent = parent==""?"/":parent;
		//alert(parent);
		if(this.existPath(path))
			return (Paths[parent][way[way.length-1]]);
		return path;
	}
	this.Paths = Paths;
});
const testPath = function(path){
	if(path.match(/[\*|\\|\/|\"|\:|\?|\||\<|\>]/g))
		return null;
	return path;
}