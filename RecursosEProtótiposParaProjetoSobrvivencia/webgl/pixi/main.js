var cv = document.getElementById("screen");
console.log(cv.getContext("webgl"));

var core = new PIXI.Application({view:cv})
