
let raster = new Raster(display);
raster.clear();

raster.addVertex([0.0, 0.5, 0.0], [1, 0, 0, 1], [0, 0]);
raster.addVertex([0.5, -0.25, 0.0], [0, 1, 0, 1], [0, 0]);
raster.addVertex([-0.5, -0.75, 0.0], [0, 0, 1, 1], [0, 0]);
raster.draw();

raster.flush();
