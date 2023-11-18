
function Raster(cv){
	/*
		Protected Setting Properties
	*/
	let raster = this;
	let ctx = cv.getContext("2d");
	let res_w = Number(cv.width);
	let res_h = Number(cv.height);
	let pixels = res_w*res_h;
	let data = ctx.createImageData(res_w, res_h);
	let cbuff = data.data;
	let dbuff = new Float32Array(pixels);
	let cbuff32 = new Uint32Array(cbuff.buffer);
	let cbuff8 = new Uint8Array(cbuff.buffer);
	
	/*
		Render Properties
	*/
	let clear_color = 0xFF00FFFF;
	let clear_depth = -1;
	/*
		Vertices Buffer
		- position:3
		- color:4
		- uv:2
	*/
	let plot_vertices_buffer = [
		{
			"position": [0, 0, 0], "color": [0, 0, 0, 1], "uv": [0, 0]
		},
		{
			"position": [0, 0, 0], "color": [0, 0, 0, 1], "uv": [0, 0]
		},
		{
			"position": [0, 0, 0], "color": [0, 0, 0, 1], "uv": [0, 0]
		}
	];
	let plot_seek = 0;
	
	/*
		Public Properties
	*/
	
	/*
		Private Methods
	*/
	function flush() {
		ctx.putImageData(data, 0, 0);
	}
	function plotTriangle() {
		let p1 = plot_vertices_buffer[0].position;
		let p2 = plot_vertices_buffer[1].position;
		let p3 = plot_vertices_buffer[2].position;
		
		let v_top = p1[1]>p2[1]?((p1[1]>p3[1])?0:2):((p2[1]>p3[1])?1:2);
		let v_bottom = v_top==0?(p2[1]<p3[1]?1:2):v_top==1?(p1[1]<p3[1]?0:2):(p1[1]<p2[1]?0:1);
		let v_middle = (v_top!=2&&v_bottom!=2)?2:(v_top!=1&&v_bottom!=1)?1:0;
		let v_left = plot_vertices_buffer[v_middle].position[0]<plot_vertices_buffer[v_bottom].position[1]?v_middle:v_bottom;
		let v_right = plot_vertices_buffer[v_middle].position[0]>=plot_vertices_buffer[v_bottom].position[1]?v_middle:v_bottom;
		
		let m_top = plot_vertices_buffer[v_top].position[1];
		m_top = ~~((m_top-1)*res_h*-.5);
		let m_middle = plot_vertices_buffer[v_middle].position[1];
		m_middle = ~~((m_middle-1)*res_h*-.5);
		let m_bottom = plot_vertices_buffer[v_bottom].position[1];
		m_bottom = ~~((m_bottom-1)*res_h*-.5);
		let m_left = p1[0]<p2[0]?((p1[0]<p3[0])?p1[0]:p3[0]):((p2[0]<p3[0])?p2[0]:p3[0]);
		m_left = ~~((m_left+1)*res_w*.5);
		let m_right = p1[0]>p2[0]?((p1[0]>p3[0])?p1[0]:p3[0]):((p2[0]>p3[0])?p2[0]:p3[0]);
		m_right = ~~((m_right+1)*res_w*.5);
		
		for (let y=m_top; y<=m_middle; y++){
			let pl = (y-m_top)/(plot_vertices_buffer[v_left].position[1]-m_top);
			let pr = (y-m_top)/(plot_vertices_buffer[v_right].position[1]-m_top);
			let left = m_left;
			let right = m_right;
			for (let x=left; x<right; x++){
				cbuff32[y*res_w + x] = 0xFF0000FF;
			}
		}
		for (let y=m_middle; y<=m_bottom; y++){
			let left = m_left;
			let right = m_right;
			for (let x=left; x<right; x++){
				cbuff32[y*res_w + x] = 0xFFFF0000;
			}
		}
	}
	
	/*
		Public Methods
	*/
	raster.addVertex = function([pos_x, pos_y, pos_z], [col_r, col_g, col_b, col_a], [uv_x, uv_y]) {
		if (plot_seek < 3){
			plot_vertices_buffer[plot_seek].position[0] = pos_x;
			plot_vertices_buffer[plot_seek].position[1] = pos_y;
			plot_vertices_buffer[plot_seek].position[2] = pos_z;
			plot_vertices_buffer[plot_seek].color[0] = col_r;
			plot_vertices_buffer[plot_seek].color[1] = col_g;
			plot_vertices_buffer[plot_seek].color[2] = col_b;
			plot_vertices_buffer[plot_seek].color[3] = col_a;
			plot_vertices_buffer[plot_seek].uv[0] = uv_x;
			plot_vertices_buffer[plot_seek].uv[1] = uv_y;
			plot_seek++;
		}
	}
	raster.clear = function(){
		for (let i=0; i<pixels; i++){
			cbuff32[i] = clear_color;
			dbuff[i] = clear_depth;
		}
	}
	raster.draw = function(){
		plotTriangle();
		plot_seek = 0;
	};
	raster.flush = function(){
		flush();
	}
}
