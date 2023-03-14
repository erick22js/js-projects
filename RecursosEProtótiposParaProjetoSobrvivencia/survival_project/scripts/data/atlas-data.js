
var uiAtlas = {
	hungryIcon:{x:0, y:0, size:16},
	sedeIcon:{x:0, y:16, size:16},
	heartIcon:{x:16, y:0, size:16},
	energyIcon:{x:16, y:16, size:16},
	sleepIcon:{x:32, y:0, size:16},
	temperatureIcon:{x:32, y:16, size:16},
	
	cellInventory:{x:64, y:96, size:32},
	cellTool:{x:96, y:96, size:32},
	cellInsert:{x:128, y:96, size:32},
	cellMaterial:{x:160, y:96, size:32},
	cellResult:{x:192, y:96, size:32},
	cellFuel:{x:288, y:96, size:32},
	cellIngredient:{x:320, y:96, size:32},
	
	goNext:{x:224, y:96, size:32},
	goPrev:{x:256, y:96, size:32},
	goCook:{x:352, y:96, size:32},
	
	slot:{x:0, y:32, size:48},
	slotS:{x:48, y:32, size:48},
	slotInv:{x:96, y:32, size:48},
	invIcon:{x:144, y:32, size:48},
	craftIcon:{x:192, y:32, size:48},
	buildIcon:{x:240, y:32, size:48},
	containerIcon:{x:288, y:32, size:48},
	clayIcon:{x:336, y:32, size:48},
	cookerIcon:{x:384, y:32, size:48},
	
	//Clay Ui
	pierceIcon:{x:448, y:128, size:32},
	mashIcon:{x:480, y:128, size:32},
	rollIcon:{x:480, y:160, size:32},
	cutIcon:{x:448, y:192, size:32},
	retouchIcon:{x:480, y:192, size:32},
	
	
	
	selection0:{x:0, y:96, size:64},
	selection1:{x:0, y:128, size:64},
	selection2:{x:0, y:192, size:64}
}

var clayAtlas = {
	clayDefault:{x:0, y:0, size:64},
	clayHighUppered:{x:64, y:0, size:64},
	clayHighUpperedCutted:{x:128, y:0, size:64},
	clayUppered:{x:0, y:64, size:64},
	clayUpperedCutted:{x:64, y:64, size:64},
	clayIndented:{x:128, y:64, size:64},
	clayPot:{x:0, y:128, size:64},
	clayBowl:{x:64, y:128, size:64},
	clayCup:{x:128, y:128, size:64},
	clayJar:{x:192, y:128, size:64},
	clayDefaultDry:{x:0, y:192, size:64},
	clayPotDry:{x:0, y:256, size:64},
	clayBowlDry:{x:64, y:256, size:64},
	clayCupDry:{x:128, y:256, size:64},
	clayJarDry:{x:192, y:256, size:64}
}

var enviormentAtlas = {
	gota0:{x:0, y:0, size: 16},
	gota1:{x:16, y:0, size: 16},
	gota2:{x:32, y:0, size: 16},
	gota3:{x:48, y:0, size: 16},
	gota4:{x:64, y:0, size: 16},
	light:{x:0, y:192, size: 320}
}

var playerAtlas = {
	stand:{frames:[{x:0, y:0}], directions:[0, 1, 2, 3], speed:6},
	move:{frames:[{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0}], directions:[0, 1, 2, 3], speed:6},
	gotosleep:{frames:[{x:0, y:4},{x:1, y:4},{x:2, y:4},{x:3, y:4}], directions:[1, 0, 0, 1], onend:"sleep", speed:7},
	sleep:{frames:[{x:3, y:4}], directions:[1, 0, 0, 1], speed:6},
	wakeup:{frames:[{x:3, y:4},{x:2, y:4},{x:1, y:4},{x:0, y:4}], directions:[1, 0, 0, 1], onend:"stand", speed:4}
}