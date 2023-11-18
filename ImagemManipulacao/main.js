const prevImg = document.getElementById("preview");

var toCtx = result.getContext("2d");

function getImage(elem){
	var reader = new FileReader();
	reader.onload = function(e){
		alert("loaded!");
		prevImg.src = reader.result;
		prevImg.onload = function(){
			var data = getImageData(this);
			toCtx.canvas.width = this.width;
			toCtx.canvas.height = this.height;
			data.Cwidth = Number(this.width);
			data.Cheight = Number(this.height);
			programImage(data);
			toCtx.putImageData(data, 0, 0);
		}
	}
	reader.readAsDataURL(elem.files[0]);
}

function getImageData(img){
	var cv = document.createElement("canvas");
	cv.width = img.width;
	cv.height = img.height;
	var ctx = cv.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0, 0, Number(cv.width), Number(cv.height));
}


function programImage(imgdata){
	console.log(imgdata);
	for(var x=0; x<imgdata.Cwidth; x++){
		for(var y=0; y<imgdata.Cheight; y++){
			var color = SHADER_COLOR(imgdata, [x, y]); //R, G, B, A     0.0 -> 1.0
			var p = (y*imgdata.Cwidth+x)*4;
			imgdata.data[p+0] = (~~(color[0]*0xff))&0xff;
			imgdata.data[p+1] = (~~(color[1]*0xff))&0xff;
			imgdata.data[p+2] = (~~(color[2]*0xff))&0xff;
			imgdata.data[p+3] = (~~(color[3]*0xff))&0xff;
		}
	}
}
function getImagePixel(img, uv){
	if((/*uv[0]<0||*/uv[0]>=img.Cwidth)||(/*uv[1]<0||*/uv[1]>=img.Cheight))
		return [0,0,0,1];
	var p = (uv[1]*img.Cwidth+uv[0])*4;
	return [img.data[p]/0xff, img.data[p+1]/0xff, img.data[p+2]/0xff, img.data[p+3]/0xff];
}


/*********************************************
/         SHADERS PROGRAMS FUNCTIONS
/*********************************************/

function SHADER_COLOR(img, uv){
	var Uvi = [uv[0], uv[1]];
	var color = getImagePixel(img, Uvi);
	//var sum = (color[0]*1.05+color[1]*.45+color[2]*1.5)/3;
	return color;//[sum, sum, sum, color[3]];
}
