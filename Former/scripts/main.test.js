
docgenGenAllFiles({
	"teste": {
		"typedefs": [
			{
				"name": "Sint_8",
				"type": "signed char",
				"description": "Signed integer of 8-bits"
			},
			{
				"name": "Sint_16",
				"type": "signed short",
				"description": "Signed integer of 16-bits"
			},
			{
				"name": "Sint_32",
				"type": "signed int",
				"description": "Signed integer of 32-bits"
			},
		],
	},
	"main": {
		"typedefs": [
			{
				"name": "Sint_8",
				"type": "signed char",
				"description": "Signed integer of 8-bits"
			},
			{
				"name": "Sint_16",
				"type": "signed short",
				"description": "Signed integer of 16-bits"
			},
			{
				"name": "Sint_32",
				"type": "signed int",
				"description": "Signed integer of 32-bits"
			},
		],
		"classes": [
			{
				"name": "Object",
				"inheritance": ["Disposable"],
				"description": "The basic structure of the API",
				"structs": [
					{
						"name": "base",
						"description": "The basic structure of the API",
					}
				],
				"classes": [],
				"static_variables": [
					{
						"name": "index",
						"type": "int",
						"description": "Index flagger"
					},
					{
						"name": "i_total",
						"type": "Sint_32",
						"value": "0",
						"description": "Counter for all instances"
					},
					{
						"name": "last",
						"type": "base",
						"value": "0",
						"description": "Stores the last object reference"
					}
				],
				"properties": [
					{
						"name": "references",
						"type": "long",
						"value": "0",
						"description": "Will be keep alive until the counter is not zero"
					}
				],
				"constructor": [],
				"static_functions": [
					{
						"name": "destroy_all",
						"type": "void",
						"parameters": [],
						"description": "Nulls every object reference and destroy every instance"
					}
				],
				"methods": [
					{
						"name": "destroy",
						"type": "bool",
						"parameters": [
							{
								"type": "bool",
								"name": "keep",
								"value": "false",
								"description": "Keeps existing the objects, only zeroing all references"
							},
							{
								"type": "int",
								"name": "total",
								"description": "Anything"
							},
						],
						"description": "Unreferences and, optionally, removes its instance"
					}
				]
			},
		],
	},
}, document.body);
