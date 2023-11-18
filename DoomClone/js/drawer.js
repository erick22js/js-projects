
/**
	DRAWER OBJECT
*/

const drawer = {};


/**
	DRAWER FUNCTIONS
*/

/* Flat textures */
/*
	width:int, height:int, data:uint8array
*/

drawer.drawFlatStrip = function(x, ytop, ybottom, xoffset, yoffset, texture){
	var uv_x = (xoffset)%drawer.flatTexture.width;
	var tex_y = 0;
	var tex_yadd = texture.height/(ybottom-ytop);
	
	for(var y=ytop; y<ybottom; y++){
		/* Calculates the uv y coordinate */
		var uv_y = ((~~tex_y)+yoffset)%texture.height;
		tex_y += tex_yadd;
		
		/* Retrieves the color index in palete */
		var color_i = texture.indices[uv_x+(uv_y*texture.width)];
		
		/* Puts pixel on screen */
		display.setPixel(x, y, palete[color_i]);
	}
}

drawer.drawColorStrip = function(x, ytop, ybottom, color){
	for(var y=ytop<0?0:ytop; (y<ybottom)&&(y<HEIGHT); y++){
		/* Puts pixel on screen */
		display.setPixel(x, y, color);
	}
}
