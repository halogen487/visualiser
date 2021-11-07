/*
	tree chart class for testing
*/

console.info("tree.js is alive")

const canvas = document.getElementById("theTree")
const ctx = canvas.getContext("2d")

/*const generateTree = function (height, maxChildren) {
	//let childCount = Math.floor(Math.random() * maxChildren + 1)
	let childCount = 3
	let tree = []
	tree.push(1)
	if (height > 1) {
		let children = []
		for (i = 0; i < childCount; i++) {
			children.push(generateTree(height - 1, maxChildren))
		}
		tree.push(children)
	}
	return tree
}*/

const Tree = function (value, children) {
	this.value = value
	this.children = children // array of Trees
	this.x = null
	this.y = null
	this.traverse = function (order) {
		let traversal = []
		if (order == "pre") {traversal.push(this.value)}
		for (i of this.children) {traversal = traversal.concat(i.traverse(order))}
		if (order == "post") {traversal.push(this.value)}
		return traversal
	}
}

const TreeChart = function (height, maxChildren) {
	
	this.generateTree = function (height, maxChildren) {
		let childCount = Math.floor(Math.random() * maxChildren + 1)
		let children = []
		if (height > 1) {
			for (i = 0; i < childCount; i++) {
				children.push(this.generateTree(height - 1, maxChildren))
				this.r++
			}
		}
		return new Tree(this.r, children)
	}
	
	this.draw = function () {
		
	}
	this.reset = function () {
		this.r = 1
		this.tree = this.generateTree()
	}
	this.r = 1
	this.height = height
	this.maxChildren = maxChildren
	this.tree = this.generateTree(height, maxChildren)
}

let xmp = new TreeChart(3, 3)

