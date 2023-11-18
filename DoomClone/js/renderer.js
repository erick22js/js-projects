
/**
	RENDERER OBJECT
*/

const renderer = {};


/**
	RENDERER FUNCTIONS
*/

renderer.renderSidedef = function(camera, sidedef){
	
	/* Pre-calculation */
	
	// tan = co/ca    =>    tan(camera.fov) = (WIDTH/2)/dis_fov    =>    tan(camera.fov)/(WIDTH/2) = 1/dis_fov    =>    HWIDTH/tan(camera.fov) = dis_fov
	var dis_fov = HWIDTH/Math.tan(camera.fov);
	
	
	/* Projects the sidedef on screen */
	
	var v1 = sidedef.v1;
	var v2 = sidedef.v2;
	var hfloor = sidedef.height[0]-camera.h;
	var hceil = sidedef.height[1]-camera.h;
	var hsize = hceil-hfloor;
	
	var angle1 = Math.angle(camera.x, camera.y, v1[0], v1[1])-camera.rot;
	var angle2 = Math.angle(camera.x, camera.y, v2[0], v2[1])-camera.rot;
	var dis1 = Math.distance(camera.x, camera.y, v1[0], v1[1]);
	var dis2 = Math.distance(camera.x, camera.y, v2[0], v2[1]);
	var pos1 = 0;
	var pos2 = 1;
	
	/* Adjust angles inside fov projection */
	if(angle2>Math.HPI){
		//angle2 = Math.HPI;
	}
	
	var dis_x1 = Math.sin(angle1)*dis1; // sen = co/hi    =>    sen(angle1) = dist_x1/dis1    =>    sen(angle1)*dist1 = dist_x1
	var dis_x2 = Math.sin(angle2)*dis2;
	
	var dis_z1 = Math.cos(angle1)*dis1; // cos = ca/hi    =>    cos(angle1) = dist_z1/dis1    =>    cos(angle1)*dis1 = dist_z1
	var dis_z2 = Math.cos(angle2)*dis2;
	
	var dw_x1 = (dis_fov/dis_z1)*dis_x1;
	var dw_x2 = (dis_fov/dis_z2)*dis_x2;
	
	var dw_f1 = (dis_fov/dis_z1)*hfloor;
	var dw_c1 = (dis_fov/dis_z1)*hceil;
	var dw_f2 = (dis_fov/dis_z2)*hfloor;
	var dw_c2 = (dis_fov/dis_z2)*hceil;
	
	
	/* Adjust draw Positions */
	
	dw_x1 = ~~(dw_x1+HWIDTH);
	dw_x2 = ~~(dw_x2+HWIDTH);
	dw_f1 = ~~(-dw_f1+HHEIGHT);
	dw_c1 = ~~(-dw_c1+HHEIGHT);
	dw_f2 = ~~(-dw_f2+HHEIGHT);
	dw_c2 = ~~(-dw_c2+HHEIGHT);
	
	//drawer.drawColorStrip(dw_x1, dw_c1, dw_f1, 0xff000000);
	//drawer.drawColorStrip(dw_x2, dw_c2, dw_f2, 0xff000000);
	
	debugOut.textContent = 
		"vertices: ["+v1+",\t"+v2+"]\n"+
		"height: {floor:"+hfloor.toFixed(2)+",\tceil:"+hceil.toFixed(2)+",\tsize:"+hsize.toFixed(2)+"}\n"+
		"angle: ["+(angle1*Math.R2D).toFixed(2)+",\t"+(angle2*Math.R2D).toFixed(2)+"]\n"+
		"dis: ["+dis1.toFixed(2)+",\t"+dis2.toFixed(2)+"]\n"+
		"pos: ["+pos1.toFixed(2)+",\t"+pos2.toFixed(2)+"]\n"+
		"dis_x: ["+dis_x1.toFixed(2)+",\t"+dis_x2.toFixed(2)+"]\n"+
		"dis_z: ["+dis_z1.toFixed(2)+",\t"+dis_z2.toFixed(2)+"]\n"+
		"draw_x: ["+dw_x1.toFixed(2)+",\t"+dw_x2.toFixed(2)+"]\n"+
		"draw_f: ["+dw_f1.toFixed(2)+",\t"+dw_f2.toFixed(2)+"]\n"+
		"draw_c: ["+dw_c1.toFixed(2)+",\t"+dw_c2.toFixed(2)+"]\n"
		;
	
	
	/* Renders the wall */
	
	var render_wid = dw_x2-dw_x1;
	var render_f = dw_f1;
	var render_fwid = dw_f2-dw_f1;
	var render_c = dw_c1;
	var render_cwid = dw_c2-dw_c1;
	
	for(var x=dw_x1<0?0:dw_x1; (x<dw_x2)&&(x<WIDTH); x++){
		
		var uv_x = (x-dw_x1)/render_wid;
		var render_f = ~~(dw_f1+(render_fwid*uv_x));
		var render_c = ~~(dw_c1+(render_cwid*uv_x));
		
		drawer.drawColorStrip(x, render_c, render_f, 0xff000000);
		
	}
	
	/* Renders a Strip Wall to Screen */
	/*
	drawer.pushFlatTexture(flat_textures.walltex0);
	
	for(var x=0; x<128; x++){
		drawer.drawFlatStrip(16+x, 20, 180, x, 0);
	}
	*/
	
}

