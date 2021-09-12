console.info("graph.js is alive")

const canvas = document.getElementById("theGraph")
const ctx = canvas.getContext("2d")

const GraphNode = function (id, to) {
	this.id = id
	this.to = to
	this.x = null
	this.y = null
}

const GraphChart = function (nodeCount, maxTos) {
	this.
}

let graph = []
for (i = 0; i < 10; i++) {
	let toCount = Math.floor(Math.random() * 3) + 1
	let tos = []
	for (j = 0; j < toCount; j++) {tos.push(Math.floor(Math.random() * 10))}
	graph.push(new GraphNode(i, tos))
}
