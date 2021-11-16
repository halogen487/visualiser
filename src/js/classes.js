/*
	classes for abstract structures and charts
*/

export function GraphNode (id, to) {
	this.id = id
	this.to = to
	this.from = from
	this.x = null
	this.y = null
}

export function TreeNode (id, to) {

	GraphNode.call(this)

}

export function GraphChart (nodeCount, maxTos) {

	this.reset = function () {
		this.value = []
		for (i = 0; i < 10; i++) {
			let toCount = Math.floor(Math.random() * 3) + 1
			let tos = []
			for (j = 0; j < toCount; j++){tos.push(Math.floor(Math.random() * 10))}
			this.value.push(new GraphNode(i, tos))
		}
	}
}

export function TreeChart (height, maxChildren) {

	this.reset = function () {
		let childCount = Math.floor(Math.random() * maxChildren + 1)
		let children = []
		if (height > 1) {
			for (let i = 0; i < childCount; i++) {
				children.push(this.generateTree(height - 1, maxChildren))
				this.r++
			}
		}
	}

	this.draw = function () {

		function calculateInitialX (tree) {
			for (child of tree.children) {
				calculateInitialX(child)
			}
			if (tree.children.length == 0) {
				if (tree) {}
			}
		}

		calculateInitialX(this.tree)

	}

	// returns array of IDs for the given traversal
	this.traverse = function (order) {

		function pre (node) {
			let trav = [TreeNode.id]
			for (i of node.to) {
				trav.concat(this.tree[i])
			}
		}

		function post (TreeNode) {

		}

		let traversal = []
		if (order == "pre") {traversal = pre()}
		for (i of this.to) {traversal = traversal.concat(i.traverse(order))}
		if (order == "post") {traversal.push(this.id)}
		return traversal
	}

	this.r = 1
	this.height = height
	this.maxChildren = maxChildren

	this.reset()
}
