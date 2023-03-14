
function pickColor(value, callback, dontShowOps=false){
	var hex = cssFuntionToHexColor(value);
	var inp = document.createElement("input");
	inp.type = "color";
	inp.value = hex;
	inp.oninput = function(){
		callback(inp.value);
	}
	if(!dontShowOps)
		inp.click();
	else{
		callback(inp.value);
	}
	//return inp.value;
}

function cssFuntionToHexColor(value){
	var sub = value.substr(4, value.length-5);
	sub = sub.split(",");
	var n1 = Number(sub[0]);
	var n2 = Number(sub[1]);
	var n3 = Number(sub[2]);
	var hex = "#"+(n1<16?"0":"")+(n1.toString(16))+(n2<16?"0":"")+(n2.toString(16))+(n3<16?"0":"")+(n3.toString(16));
	return hex;
}

function hslToRgb(h, s, l){
    var r, g, b;
    h/=360;
    s/=100;
    l/=100;
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h*360, s*100, l*100];
}