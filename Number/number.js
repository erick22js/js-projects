function number(value){
	
	var integer = [];
	this.int = 5;
	var decimal = [];
	this.float = null;
	var signal = [1];
	this.sign = null;
	
	var global = this;
	var NumberFormatException = new Error("Invalid number format.");
	
	function agroupQuantitys(s_number){
		var deciming = false;
		for(var i=0; i<s_number.length; i++){
			var value = s_number.charAt(i);
			switch(value){
				case "+":
					signal[0] = 1;
					break;
				case "-":
					signal[0] = -1;
					break;
				case ".":
					deciming = true;
					break;
				default:
					if(isNaN(value))
						throw NumberFormatException;
					if(!deciming)
						integer.push(Number(value));
					else
						decimal.push(Number(value));
			}
		}
		integer = reorderInteger();
		updateReference();
	}
	function updateReference(){
		global.int = integer;
		global.float = decimal;
		global.sign = signal;
	}
	function reorderInteger(){
		var ninteger = [];
		for(var i=integer.length-1; i>-1; i--)
			ninteger.push(integer[i]);
		integer = null;
		return ninteger;
	}
	function alignNumberGroups(g1, g2){
		g1.push(0);
		g2.push(0);
		var g = g1.length<g2.length?g1:g2;
		var gg = g1.length>=g2.length?g1:g2;
		var begin = g.length;
		var end = gg.length;
		for(var is = begin; is<end; is++){
			g[is] = 0;
		}
	}
	/* ***********@OPERATIONS
	*/
	//Adição
	function _add(value){
		value = solveAsNumberIndent(value);
		alignNumberGroups(global.float, value.float);
		alignNumberGroups(global.int, value.int);
		var rest = 0;
		//Solve decimals
		for(var i=global.float.length-1; i>-1; i--){
			var v1 = global.float[i];
			var v1signed = v1*global.sign[0];
			var v2 = value.float[i];
			var v2signed = v2*value.sign[0];
			var solve = v1signed+v2signed+rest;
			
			var last = i==0;
			if(solve<0){
				global.float[i] = (solve+10);
				rest = -1;
			}else if(solve>9){
				global.float[i] = solve-10;
				rest = 1;
			}else{
				global.float[i] = solve;
				rest = 0;
			}
		}
		//...Then integers
		for(var i=0; i<global.int.length; i++){
			var v1 = global.int[i];
			var v1signed = v1*global.sign[0];
			var v2 = value.int[i];
			var v2signed = v2*value.sign[0];
			var solve = v1signed+v2signed+rest;
			
			var last = i==(global.int.length-1);
			
			if(solve<0){
				if(!last){
					global.int[i] = solve+10;
					rest = -1;
				}
			}else if(solve>9){
				global.int[i] = solve-10;
				rest = 1;
			}else{
				global.int[i] = solve;
				rest = 0;
			}
		}
	}
	this.add = _add;
	
	//Subtração
	function _subtract(value){
		value = solveAsNumberIndent(value);
		value.sign[0] *= -1;
		_add(value);
		value.sign[0] *= -1;
	}
	this.subtract = _subtract;
	
	//ExponentBy10
	function _multiplyBy10(exp){
		for(var i=0; i<exp; i++){
			var value = decimal.splice(0,1);
			value = value!=""?value:0;
			integer.splice(0,0,value);
		}
	}
	this.mul10 = _multiplyBy10;
	function _divideBy10(exp){
		for(var i=0; i<exp; i++){
			var value = integer.splice(0,1);
			value = value!=""?value:0;
			decimal.splice(0,0,value);
		}
	}
	this.div10 = _divideBy10;
	
	/* ***********@COMPARATIONS
	*/
	//Igual
	function _equal(value){
		value = solveAsNumberIndent(value);
		alignNumberGroups(global.float, value.float);
		alignNumberGroups(global.int, value.int);
		//comparate
		if(value.sign[0]!=global.sign[0])
			return false;
		for(var i=0; i<global.float.length; i++)
			if(global.float[i]!=value.float[i])
				return false;
		for(var i=0; i<global.int.length; i++)
			if(global.int[i]!=value.int[i])
				return false;
		return true;
	}
	this.equal = _equal;
	
	//Maior
	function _greaterThan(value){
		value = solveAsNumberIndent(value);
		alignNumberGroups(global.float, value.float);
		alignNumberGroups(global.int, value.int);
		if(value.sign[0]<global.sign[0])
			return true;
		else if(value.sign[0]>global.sign[0])
			return false;
		for(var i=0; i<global.float.length; i++)
			if(global.float[i]>value.float[i])
				return true;
		for(var i=0; i<global.int.length; i++)
			if(global.int[i]>value.int[i])
				return true;
		
		return false;
	}
	this.greaterThan = _greaterThan;
	
	//Menor
	function _lessThan(value){
		value = solveAsNumberIndent(value);
		return value.greaterThan(global);
	}
	this.lessThan = _lessThan;
	
	/* ***********@Export
	*/
	function _asString(){
		//alert(integer);
		_trimInteger();
		_trimDecimal()
		var str = "";
		if(signal[0]==-1)
			str+="-";
		for(var i=integer.length-1; i>-1; i--)
			str += integer[i];
		if(integer.length==0)
			str += "0";
		if(decimal.length>0){
			str += ".";
			for(var d=0; d<decimal.length; d++)
				str += decimal[d];
		}
		return str;
	}
	this.asString = _asString;
	
	function _asNumber(){
		return Number(_asString());
	}
	this.asNumber = _asNumber;
	
	function _trimInteger(){
		for(var i=integer.length-1;i>0;i--){
			if(integer[i]==0){
				integer.splice(i,1);
			}else{
				return;
			}
		}
	}
	this.trimInteger = _trimInteger;
	function _trimDecimal(){
		for(var i=decimal.length-1;i>-1;i--){
			if(decimal[i]==0){
				decimal.splice(i,1);
			}else{
				return;
			}
		}
	}
	this.trimDecimal = _trimDecimal;
	function solveAsNumberIndent(value){
		if(value instanceof number)
			return value;
		else
			return new number(value);
	}
	
	switch(typeof(value)){
		case "number":
			agroupQuantitys(""+value);
			break;
		case "string":
			if(isNaN(value))
				throw NumberFormatException;
			agroupQuantitys(value);
			break;
		default:
			if(isNaN(value))
				throw NumberFormatException;
	}
	
}