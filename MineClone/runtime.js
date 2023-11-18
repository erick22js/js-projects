
const Keys = {};

function ExecutePlayerInputs(){
	if(Keys["KeyW"]){
		Transform.position[2] += Math.cos(-Transform.rotation[1])*Math.abs(Math.cos(Transform.rotation[0]))*.1;
		Transform.position[0] += Math.sin(-Transform.rotation[1])*Math.abs(Math.cos(Transform.rotation[0]))*.1;
		Transform.position[1] += Math.sin(Transform.rotation[0])*.1;
	}
	if(Keys["KeyA"]){
		Transform.position[2] -= Math.cos(-Transform.rotation[1]-Math.PI*.5)*.1;
		Transform.position[0] -= Math.sin(-Transform.rotation[1]-Math.PI*.5)*.1;
	}
	if(Keys["KeyS"]){
		Transform.position[2] -= Math.cos(-Transform.rotation[1])*Math.abs(Math.cos(Transform.rotation[0]))*.1;
		Transform.position[0] -= Math.sin(-Transform.rotation[1])*Math.abs(Math.cos(Transform.rotation[0]))*.1;
		Transform.position[1] -= Math.sin(Transform.rotation[0])*.1;
	}
	if(Keys["KeyD"]){
		Transform.position[2] -= Math.cos(-Transform.rotation[1]+Math.PI*.5)*.1;
		Transform.position[0] -= Math.sin(-Transform.rotation[1]+Math.PI*.5)*.1;
	}
	if(Keys["ArrowLeft"]){
		Transform.rotation[1] -= .035;
	}
	if(Keys["ArrowRight"]){
		Transform.rotation[1] += .035;
	}
	if(Keys["ArrowUp"]){
		Transform.rotation[0] -= .035;
	}
	if(Keys["ArrowDown"]){
		Transform.rotation[0] += .035;
	}
}

/*
 * @Application base functions
*/

window.onkeydown = function(ev){
	Keys[ev.code] = true;
	outDbgText.textContent = JSON.stringify(Transform);
}

window.onkeyup = function(ev){
	Keys[ev.code] = false;
	outDbgText.textContent = JSON.stringify(Transform);
}
