function GraphNode (id, to) {
	this.id = id
	this.to = to
	this.from = []
	this.x = null
	this.y = null
}

function Graph () {
	this.nodes = []
	this.edges = []
}

function GraphChart (nodeCount, maxTos) {

	Chart.call(this)

	this.oldReset = function () {
		this.value = []
		// init nodes
		for (let i = 0; i < nodeCount; i++) {
			let toCount = Math.floor(Math.random() * maxTos) + 1
			let tos = []
			for (let j = 0; j < toCount; j++){tos.push(Math.floor(Math.random() * 10))}
			this.value.push(new GraphNode(i, tos))
		}
		// assign froms
		for (let i of this.value) {
			for (let j of this.value) {
				if (j.to.indexOf(i.id) >= 0) {
					i.from.push(j.id)
				}
			}
		}
		console.log(this.value)
		return this
	}

	this.reset = function () {
		this.value = []
	}

	this.draw = function () {

	}

	this.running = null
	this.reset()
}

