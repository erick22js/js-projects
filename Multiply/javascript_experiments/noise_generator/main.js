const cv = document.getElementById("tela");
const ctx = cv.getContext("2d");

var table = [];
for(var w=0; w<340; w++){
	var line = [];
	for(var h=0; h<170; h++){
		line.push(0);
	}
	table.push(line);
}

var noise = new Noise({
	
});

generateNoisesInTable(table, noise);

for(var w=0; w<340; w++){
	for(var h=0; h<170; h++){
		var inten = ~~(table[w][h]*256);
		ctx.fillStyle = "rgb("+(inten)+","+(inten)+","+(inten)+")";
		ctx.fillRect(w, h, 1, 1);
	}
}
