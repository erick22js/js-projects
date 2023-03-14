
var uiData;

var itemMove;
var blockIcon;

function loadUiElements(){
	gctx.shadowColor = "black";
	function addEvent(element, i, father){
		uionclick.push({
			box: [element.x+(element.width+element.spacing[0])*i[0], element.y+(element.height+element.spacing[1])*i[1], element.x+(element.width+element.spacing[0])*i[0]+element.width, element.y+(element.height+element.spacing[1])*i[1]+element.height],
			i: i,
			these: element,
			father: father,
			event: element.onclick
		});
		uionup.push({
			box: [element.x+(element.width+element.spacing[0])*i[0], element.y+(element.height+element.spacing[1])*i[1], element.x+(element.width+element.spacing[0])*i[0]+element.width, element.y+(element.height+element.spacing[1])*i[1]+element.height],
			i: i,
			these: element,
			father: father,
			event: element.onup
		})
	}
	for(var s in uiData){
		for(var e=0;e<uiData[s].length;e++){
			if(uiData[s][e].draggable){
				draggableelements.push({
					element:uiData[s][e],
					box: [uiData[s][e].x, uiData[s][e].y, uiData[s][e].x+uiData[s][e].width, uiData[s][e].y+uiData[s][e].height],
					father:s
				});
				
			}
			uiData[s][e].visible = uiData[s][e].visible?uiData[s][e].visible:true;
			uiData[s][e].opacity = uiData[s][e].opacity?uiData[s][e].opacity:true;
			uiData[s][e].textColor = uiData[s][e].textColor?uiData[s][e].textColor:"white";
			uiData[s][e].font = uiData[s][e].font?uiData[s][e].font:"20px arial";
			uiData[s][e].spacing = uiData[s][e].spacing?uiData[s][e].spacing:[0,0];
			uiData[s][e].shadowAlign = uiData[s][e].shadowAlign?uiData[s][e].shadowAlign:[0, 0];
			
			if(uiData[s][e].type=="panel"){
				for(var x=0; x<uiData[s][e].count[0]; x++){
					for(var y=0; y<uiData[s][e].count[1]; y++)
						addEvent(uiData[s][e], [x, y], s)
				}
			}else{
				addEvent(uiData[s][e], [0, 0], s)
			}
		}
	}
	itemMove = pickElementById("itemMove");
	blockIcon = pickElementById("blockIcon");
}

var actualInv = "uiInventory";
var activeUis = ["gameplay","slotBar"];

function pickElementById(id){
	for(var s in uiData){
		for(var e=0;e<uiData[s].length;e++){
			if(uiData[s][e].id==id)
				return uiData[s][e];
		}
	}
}

function activeUi(id){
	deactiveUi(id);
	activeUis.splice(0,0,id);
}
function hasActiveUi(id){
	for(var i=0;i<activeUis.length;i++){
		if(activeUis[i]==id){
			return true;
		}
	}
	return false;
}
function deactiveUi(id){
	for(var i=0;i<activeUis.length;i++){
		if(activeUis[i]==id){
			activeUis.splice(i, 1);
			return;
		}
	}
}
var panel;

function drawUiElement(e, i){
	if(e.on) e.on(i);
	if(e.visible){
		gctx.globalAlpha = e.opacity
		gctx.shadowBlur = e.shadow||0;
		gctx.shadowOffsetX = e.shadowAlign[0];
		gctx.shadowOffsetY = e.shadowAlign[1];
		if(e.color){
			gctx.fillStyle = e.color;
			gctx.fillRect(e.x+(((e.strokeWidth||e.width)+e.spacing[0])*i[0]), e.y+((e.height+e.spacing[1])*i[1]), e.width, e.height);
		}
		if(e.stroke){
			gctx.strokeStyle = e.stroke;
			gctx.lineWidth = e.strokeLine?e.strokeLine:1;
			gctx.strokeRect(e.x+(((e.strokeWidth||e.width)+e.spacing[0])*i[0]), e.y+((e.height+e.spacing[1])*i[1]), e.strokeWidth?e.strokeWidth:e.width, e.strokeHeight?e.strokeHeight:e.height);
		}
		if(e.img){
			gctx.drawImage(e.img, e.x+(((e.strokeWidth||e.width)+e.spacing[0])*i[0]), e.y+((e.height+e.spacing[1])*i[1]), e.width, e.height)
		}
		if(e.text){
			gctx.fillStyle = e.textColor;
			gctx.font = e.font;
			gctx.fillText(e.text, e.x+(((e.strokeWidth||e.width)+e.spacing[0])*i[0]), e.y+((e.height+e.spacing[1])*i[1]));
		}
		if(e.ondraw) e.ondraw(i, e.x+(((e.strokeWidth||e.width)+e.spacing[0])*i[0]), e.y+((e.height+e.spacing[1])*i[1]))
		gctx.shadowOffsetX = gctx.shadowOffsetY = 0;
		gctx.shadowBlur = 0;
		gctx.globalAlpha = 1;
	}
}
function drawUi(){
	for(var i=0;i<activeUis.length;i++){
		panel = uiData[activeUis[i]];
		for(var e=0;e<panel.length;e++){
			if(panel[e].type){
				switch(panel[e].type){
					case "panel":
						for(var x=0; x<panel[e].count[0]; x++){
							for(var y=0; y<panel[e].count[1]; y++){
								drawUiElement(panel[e], [x, y]);
							}
						}
						break;
				}
			}else{
				drawUiElement(panel[e], [0,0]);
			}
		}
	}
	
}
