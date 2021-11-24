import {algos} from "/js/algos.js"

/*
	test script for charts
*/

console.info("rectangle.js is alive")

function GraphNode (id, to) {
	this.id = id
	this.to = to
	this.from = from
	this.x = null
	this.y = null
}

function TreeNode (id, to) {
	GraphNode.call(this)
}
function Chart () {

	this.pause = function () {
		clearInterval(this.running)
		this.running = null
		try {this.oscillator.stop()} catch {}
	}

	this.setAlgo = function (algo) {
		this.algo = algo
		this.scanning = []
		if (this.algo) {
			if (algo != "check") {
				this.v = {}
				document.getElementById("algo").innerHTML = this.algo ? this.algo : "Heading"
			}
			algos[this.algo]["init"].apply(this)
		}
		this.draw()
	}
	this.setSpeed = function (ms) {
		this.pause()
		this.interval = ms
		if (this.running) {
			this.play()
		}
	}

	this.ele = document.getElementById("theRectangle")
	this.ctx = this.ele.querySelector("canvas").getContext("2d")

	this.running = null
	this.value = null
	this.shownValue = null
	this.algo = null
	this.interval = 50
	this.scanning = null
}


function GraphChart (nodeCount, maxTos) {

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

function TreeChart (height, maxChildren) {

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

function SortChart (length) {

	Chart.call(this)

	this.done = false
	// swaps values at given array indices
	this.swap = function (a, b) {
		if (a >= length || b >= length) {
			throw new RangeError()
		}
		let t = this.value[a]
		this.value[a] = this.value[b]
		this.value[b] = t
	}

	this.draw = function () {
		if (this.scanning[0] && config.sound) {this.beep(this.value[this.scanning[0]])}
		// calculate changes between shown array and real array
		let moves = []
		for (let i in this.shownValue) {
			moves.push(this.value.indexOf(this.shownValue[i]))
		}
		// write algorithm name and variables
		document.getElementById("variables").innerHTML = ""
		for (let i in this.v) {
			document.getElementById("variables").innerHTML += `<li>${i}: ${this.v[i]}</li>`
		}
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height) // clear canvas
		let barWidth = this.ctx.canvas.getAttribute("width") / this.value.length
		let rectHeight = Number(this.ctx.canvas.getAttribute("height"))
		for (let i in this.value) {
			// draw bar
			let barUnit = rectHeight / Math.max.apply(null, this.value) // height of smallest bar
			this.ctx.fillStyle = "#f7f7f7"
			if (moves[i] != i) {this.ctx.fillStyle = "#ffffff"}
			if (this.algo == "check" && i < this.checki) {this.ctx.fillStyle = "lime"}
			if (this.scanning.indexOf(Number(i)) >= 0) {this.ctx.fillStyle = "red"}
			this.ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.value[i]), barWidth + 1, barUnit * this.value[i])
		}
		// reset shownValue
		this.shownValue = []
		for (let i of this.value) {this.shownValue.push(i)}
	}

	this.play = function () {
		if (!this.running && this.algo) {
			if (this.done) {
				this.reset()
			}
			if (this.algo) {
				this.running = setInterval(() => {
					algos[this.algo]["step"].apply(this)
					this.draw()
					if (this.done && this.algo != "check") {
						this.setAlgo("check")
						this.play()
					} else if (this.done) {
						if (config.loop) {
							this.reset()
							let options = Object.keys(algos)
							let choiceno = Math.floor(Math.random() * options.length - 1)
							this.setAlgo(algos[choiceno])
							this.play()
						} else {
							this.pause()
						}
					}
				}, this.interval)
			}
			try {
				this.oscillator.start()
			} catch {}
		}
	}
	this.setLength = function (n) {
		let o = this.value.length
		this.value.splice(o - (o - n))
		for (let i = 0; i < n - o; i++) {
			this.value.push(o + i + 1)
		}
		this.draw()
	}
	this.reset = function (length) {
		if (!length) {length = this.value.length}
		this.pause()
		if (this.algo == "check") {this.algo = null}
		this.value = Array.from({length: length}, (n, i) => i + 1)
		for (let i = length - 1; i > 0; i--) {
			let r = Math.floor(Math.random() * (length - 1))
			this.swap(i,  r)
		}
		this.setAlgo(this.algo)
		this.scanning = []
		this.done = false
		if (this.algo) {algos[this.algo]["init"].apply(this)}
		this.draw()
	}
	this.beep = function (height) { // implement logarithmic distribution
		try {
			this.vol.gain.value = 0.5
			this.oscillator.frequency.value = height + 300
		} catch {}
	}
	this.running = null
	this.algo = null
	this.shownValue = []
	this.interval = 50

	this.actx = new (window.AudioContext || window.webkitAudioContext)()
	this.oscillator = this.actx.createOscillator()
	this.vol = this.actx.createGain()
	this.oscillator.connect(this.vol)
	this.vol.connect(this.actx.destination)
	this.vol.gain.value = 0
	this.oscillator.type = "sine"

	this.reset(length)
	this.draw()
}

function playAll() {
	for (let i of charts) {
		i.play()
	}
}

function pauseAll () {
	for (let i of charts) {
		i.pause()
	}
}

function resetAll () {
	for (let i of charts) {
		i.reset()
	}
}

var config = {
	loop: true,
	sound: false
}
var charts = []

document.getElementById("play").addEventListener("click", playAll)
document.getElementById("pause").addEventListener("click", pauseAll)
document.getElementById("reset").addEventListener("click", resetAll)
charts.push(new SortChart(40))
charts[0].setSpeed(0)

charts[0].setAlgo("insertion")
