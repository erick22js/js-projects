
function ErrorTracer(pointer){
	return "At line "+pointer.line+" at row "+pointer.row+": ";
}

function UnexpectedError(entity, pointer){
	var error = new Error("Unexpected entity '"+entity+"'");
	return ErrorTracer(pointer)+error;
}

function UnexpectedTokenError(token, pointer){
	var error = new Error("Unexpected "+token.type+"");
	return ErrorTracer(pointer)+error;
}

function ExpectedError(entity, pointer){
	var error = new Error("Was Expected entity '"+entity+"'");
	return ErrorTracer(pointer)+error;
}
