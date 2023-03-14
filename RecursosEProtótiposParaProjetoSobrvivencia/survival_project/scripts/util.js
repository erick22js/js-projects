
function itemIn(element, array){
	for(var i=0;i<array.length;i++)
		if(array[i]==element)
			return i;
	return null;
}


function determineValue(min, max, value){
	var n = value>max?value-max+min-1:value<min?value-min+max+1:value;
	if(n>max||n<min) n = determineValue(min, max, n);
	return n;
}

function diferenceBetweenValues(n1, n2){
	return Math.abs(n2-n1);
}
