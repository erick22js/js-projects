const acCv = document.getElementById("ascciCanvas");
const prevImg = document.getElementById("preview");

var charPal = 
String.fromCharCode(
	0x2588,
	0x2589,
	0x258a,
	0x258b,
	0x258c,
	0x258d,
	0x258e
);
//"$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"+'"'+"^`'. ";
//[' ', '.', ',', ';', '*', 'Q', 'A', 'B', 'M', '#'];

function getImage(elem){
	var reader = new FileReader();
	reader.onload = function(e){
		alert("loaded!");
		prevImg.src = reader.result;
		prevImg.onload = function(){
			ascciImage(this);
		}
	}
	reader.readAsDataURL(elem.files[0]);
}

function ascciImage(img){
	var data = getImageData(img);
	wid = Number(img.width);
	var mono = imageDataToMonocolor(data);
	var ascci = monoToAscci(mono, wid);
	acCv.value = ascci;
}

function getImageData(img){
	var cv = document.createElement("canvas");
	cv.width = img.width;
	cv.height = img.height;
	var ctx = cv.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0, 0, Number(cv.width), Number(cv.height));
}

function imageDataToMonocolor(data){
	var mono = [];
	for(var i=0; i<data.data.length; i+=4){
		var r = data.data[i];
		var g = data.data[i+1];
		var b = data.data[i+2];
		var m = (r+g+b)/3;
		mono.push(m);
	}
	return mono;
}

function monoToAscci(mono, width){
	var ascci = "";
	for(var y=0; y<mono.length/width; y++){
		for(var x=0; x<width; x++){
			var s = mono[x+y*width];
			s /= 255.1;
			s *= charPal.length;
			s = ~~s;
			ascci += charPal.charAt(s);
		}
		ascci += "\n";
	}
	return ascci;
}

function drawAscciImage(wid, hei){
	for(var yl=0; yl<hei; yl++){
		for(var xl=0; xl<wid; xl++)
			acCv.value += "#";
			//acCv.value += " ";
		acCv.value += "\n";
	}
}

drawAscciImage(60,40);
