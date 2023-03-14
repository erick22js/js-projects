
var mainExplorer = new Xplorer();
IO.writeTextFile("/sdcard/teste1.txt", "ola");
IO.writeTextFile("/sdcard/teste2.txt", "ola");
IO.writeTextFile("/sdcard/teste3.txt", "ola");
IO.writeTextFile("/sdcard/teste4.txt", "ola");
mainExplorer.onSelect = function(dir, files){
	alert(files);
}
mainExplorer.open(true, null, false);