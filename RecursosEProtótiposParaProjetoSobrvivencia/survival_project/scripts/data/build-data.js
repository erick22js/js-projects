const BUILDS = [
	{
		shaped:true,
		material:[["stick","stick","stick"],["stick","stick","stick"],["stick","stick","stick"]],
		tool:["improvedKnife","empty"],
		insert:[["vineStrings","vineStrings"],["vineStrings","vineStrings"]],
		requireProcess:"amarrar",
		requireBaseBlock:["air"],
		//requireFoundation:"dirt",
		time: 30,
		result:["wallLog", 1,{}]
	},{
		shaped:true,
		material:[["empty","stick","empty"],["stick","stick","stick"],["stick","stick","stick"]],
		tool:["improvedKnife","empty"],
		insert:[["vineStrings","vineStrings"],["empty","empty"]],
		requireProcess:"amarrar",
		requireBaseBlock:["air"],
		//requireFoundation:"dirt",
		time: 25,
		result:["containerLog", 1,{},[]]
	},{
		shaped:true,
		material:[["stick","stick","stick"],["stick","stick","stick"],["stick","stick","stick"]],
		tool:["improvedKnife","empty"],
		insert:[["vineStrings","vineStrings"],["empty","empty"]],
		requireProcess:"amarrar",
		requireBaseBlock:["air","dirtFloor","rock"],
		//requireFoundation:"dirt",
		time: 30,
		result:["floorLog", 1,{}]
	},{
		shaped:true,
		material:[["stick","stone","stick"],["stone","stick","stone"],["stick","stone","stick"]],
		requireProcess:"encaixar",
		requireBaseBlock:["air"],
		time: 6,
		result:["bonfire", 1,{},
		{ingredients:[["empty",0,0],["empty",0,0],["empty",0,0]],
		fuel:[["empty",0,0],["empty",0,0],["empty",0,0]]
		}]
	},{
		shaped:false,
		material:["clay","clay"],
		requireBaseBlock:["air"],
		requireProcess:"pressionar",
		time: 4,
		result:["clay",1,{},{stage:"clayDefault",contain:[]}]
	},{
		shaped:false,
		material:["stone"],
		tool:["silex"],
		time: 35,
		requireBaseBlock:["bonfire","bonfireDry"],
		requireProcess:"bater",
		result:["bonfireActivated"]
	}
]