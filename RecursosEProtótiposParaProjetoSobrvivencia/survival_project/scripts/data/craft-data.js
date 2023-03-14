const CRAFTS = [
	{
		shaped:false,
		material:["stone"],
		tool:["stone"],
		requireProcess:"esfregar",
		time: 30,
		result:["affinedStone", 0, 1]
	},
	{
		shaped:false,
		material:["stone","stone"],
		tool:["improvedKnife"],
		requireProcess:"raspar",
		time: 40,
		result:["polishedStone",0,1]
	},
	{
		shaped:false,
		material:["stick","polishedStone"],
		insert:["vineStrings","vineStrings"],
		requireProcess:"amarrar",
		time: 20,
		result:["improvedAxe", 1, 1]
	},
	{
		shaped:false,
		material:["stick","affinedStone"],
		insert:["vineStrings"],
		requireProcess:"amarrar",
		time: 7,
		result:["improvedKnife", 1, 1]
	},
	{
		shaped:false,
		material:["appleEaten"],
		tool:["empty"],
		requireProcess:"pressionar",
		time: 3,
		result:["seedApple", 0, 4]
	},
	{
		material:["beams"],
		requireProcess:"descascar",
		time: 6,
		result:["bean", 0, 4]
	}
]


const craftActions = {
	"encaixar":{},
	"amarrar":{},
	"bater":{},
	"descascar":{},
	"esfregar":{},
	"pressionar":{},
	"cortar":{},
	"fincar":{},
	"raspar":{}
}