
const PARTICLES = {
	"gota":{texture:{main:["gota0"],colide:["gota1","gota2","gota3","gota4"]}, mainAnimation:"main", animationSpeed:20,
	oncreate:function(these, p){
		these.rest = Math.random()*20;
		these.playerFall = Math.random()>.5;
	}, onanimationend: function(these, p){
		if(these.actAnimation == "colide"){
			if((~~(these.x*DIV2P5))==(~~Player.x)&&((~~(these.y*DIV2P5-1))==(~~Player.y)||(~~(these.y*DIV2P5))==(~~Player.y)))
				Player.pinged();
			removeParticle(p);
			if(Weather.isRain) Weather.rainBuff.soundEffect.play();
		}
	}, on:function(these, p){
		these.rest -= .25;
		if((these.rest<=0||(these.playerFall&&(~~(these.x*DIV2P5))==(~~Player.x)&&((~~(these.y*DIV2P5-1))==(~~Player.y)||(~~(these.y*DIV2P5))==(~~Player.y))))&&particlesInWorld[p].actAnimation!="colide"){ these.actAnimation = "colide"; these.frame = 0; these.speed = 0}
		if(these.x>540+Camera.getX()||these.y>340+Camera.getY()){particlesInWorld.splice(p,1);}
	}}
}

function removeParticle(index){
	particlesInWorld.splice(index,1);
}
function insertParticle(id, x, y, dir, speed){
	particlesInWorld.push({type:id, x:x, y:y, direction:dir, speed:speed, actAnimation:PARTICLES[id].mainAnimation, speedAnimation:PARTICLES[id].animationSpeed, frame:0});
	PARTICLES[particlesInWorld[particlesInWorld.length-1].type].oncreate(particlesInWorld[particlesInWorld.length-1], particlesInWorld.length-1)
}
function renderParticles(){
	for(var p=0;p<particlesInWorld.length;p++){
		particlesInWorld[p].x += Math.cos(particlesInWorld[p].direction)*particlesInWorld[p].speed;
		particlesInWorld[p].y += Math.sin(particlesInWorld[p].direction)*particlesInWorld[p].speed;
		particlesInWorld[p].frame += getTiming()*particlesInWorld[p].speedAnimation;
		if(~~particlesInWorld[p].frame>=PARTICLES[particlesInWorld[p].type].texture[particlesInWorld[p].actAnimation].length){
			particlesInWorld[p].frame = 0;
			PARTICLES[particlesInWorld[p].type].onanimationend(particlesInWorld[p], p);
		}
		if(p>=particlesInWorld.length) break;
		PARTICLES[particlesInWorld[p].type].on(particlesInWorld[p], p);
		if(p>=particlesInWorld.length) break;
		gctx.drawImage(EnvStrip[PARTICLES[particlesInWorld[p].type].texture[particlesInWorld[p].actAnimation][~~particlesInWorld[p].frame]], particlesInWorld[p].x+Camera.x, particlesInWorld[p].y+Camera.y);
	}
}