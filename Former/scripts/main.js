
//window.showDirectoryPicker();

const docs = {
	"flowy/api.hpp": {
		"typedefs": [
			{
				"name": "Bool",
				"type": "bool"
			},
			{
				"name": "Char",
				"type": "char"
			},
			{
				"name": "Int",
				"type": "signed int"
			},
			{
				"name": "Float",
				"type": "float"
			},
			{
				"name": "Uint8",
				"type": "unsigned char"
			},
			{
				"name": "Uint16",
				"type": "unsigned short"
			},
			{
				"name": "Uint32",
				"type": "unsigned int"
			},
			{
				"name": "Sint8",
				"type": "signed char"
			},
			{
				"name": "Sint16",
				"type": "signed short"
			},
			{
				"name": "Sint32",
				"type": "signed int"
			},
			{
				"name": "Float32",
				"type": "float"
			},
			{
				"name": "Float64",
				"type": "double"
			},
		]
	},
	"flowy/math.hpp": {
		"classes": [
			{
				"name": "Vector2",
				"properties": [
					{"name": "x", "type": "Float"},
					{"name": "y", "type": "Float"},
				]
			},
			{
				"name": "Vector3",
				"properties": [
					{"name": "x", "type": "Float"},
					{"name": "y", "type": "Float"},
					{"name": "z", "type": "Float"},
				]
			},
			{
				"name": "Rect",
				"properties": [
					{"name": "x", "type": "Float"},
					{"name": "y", "type": "Float"},
					{"name": "w", "type": "Float"},
					{"name": "h", "type": "Float"},
				]
			},
			{
				"name": "Matrix2x3",
				"properties": [
					{"name": "a", "type": "Float"},
					{"name": "b", "type": "Float"},
					{"name": "c", "type": "Float"},
					{"name": "d", "type": "Float"},
					{"name": "x", "type": "Float"},
					{"name": "y", "type": "Float"},
				]
			},
			{
				"name": "Color",
				"properties": [
					{"name": "r", "type": "Float"},
					{"name": "g", "type": "Float"},
					{"name": "b", "type": "Float"},
					{"name": "a", "type": "Float"},
				]
			},
		]
	},
	"flowy/graphics.hpp":{
		"classes": [
			{
				"name": "FlowyMesh",
				"properties": [
					{"name": "vertices", "type": "Float32[]"}
				]
			},
			{
				"name": "FlowyBatchMesh",
				"description": "Provides a batchable mesh for Flowy rendering"
			},
			{
				"name": "FlowyShader"
			},
			{
				"name": "FlowyBitmap",
			},
			{
				"name": "FlowyImage",
				"properties": [
					{"name": "bitmap", "type": "FlowyBitmap"},
					{"name": "source", "type": "Rect"},
				]
			},
		]
	},
	"flowy/renderer.hpp": {
		"classes": [
			{
				"name": "FlowyRenderer",
				"description": "The renderer engine for Flowy Library",
				"properties": [
					{"name": "shader", "type": "FlowyShader"},
					{"name": "viewport", "type": "Rect"}
				]
			}
		]
	}
};

docgenGenAllFiles(docs, document.body);
