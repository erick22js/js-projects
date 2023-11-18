
var speed = 0.5;
var rotSpeed = 0.02;


function initialize(){
	
}

function update(DeltaTime=0){
	
	/* Clears Screen */
	
	for(var x=0; x<WIDTH; x++){
		for(var y=0; y<HEIGHT; y++){
			VGA[y*WIDTH+x] = palete[0xe7];
		}
	}
	
	
	renderer.renderSidedef(camera, sidedefs[0]);
	
	if(Keys["w"]){
		camera.x += Math.cos(camera.rot)*speed;
		camera.y += Math.sin(camera.rot)*speed;
	}
	if(Keys["s"]){
		camera.x -= Math.cos(camera.rot)*speed;
		camera.y -= Math.sin(camera.rot)*speed;
	}
	if(Keys["a"]){
		camera.x += Math.cos(camera.rot-Math.HPI)*speed;
		camera.y += Math.sin(camera.rot-Math.HPI)*speed;
	}
	if(Keys["d"]){
		camera.x += Math.cos(camera.rot+Math.HPI)*speed;
		camera.y += Math.sin(camera.rot+Math.HPI)*speed;
	}
	if(Keys["q"]){
		camera.rot -= rotSpeed;
	}
	if(Keys["e"]){
		camera.rot += rotSpeed;
	}
	
}
