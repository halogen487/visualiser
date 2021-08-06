console.info("rectangle.js is alive")

const canvas = document.getElementById("theRectangle")
const ctx = canvas.getContext("2d")
const inits = {}

// visualiser object constructor
// visualiser means a single chart
const SortChart = function (array) {
	this.running = false
	this.array = array
	this.shownArr = []
	this.v = {}
	this.sorted = false
	this.scanning = []
	this.interval = 10
	this.algo = null
	this.swap = function (a, b) {
		let t = this.array[a]
		this.array[a] = this.array[b]
		this.array[b] = t
	}
	this.draw = function () {
		document.getElementById("algo").innerHTML = this.algo.name
		for (i in this.v) {
			document.getElementById("variables").innerHTML += `<li>${i}: ${this.v[i]}</li>`
		}
		let moves = getMoves(this.shownArr, this.array)
		ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
		let barWidth = canvas.getAttribute("width") / this.array.length
		let rectHeight = Number(canvas.getAttribute("height"))
		for (i in this.array) {
			// draw bar
			let barUnit = rectHeight / Math.max.apply(null, this.array)
			ctx.fillStyle = "white"
			if (this.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
			if (this.sorted == true) {
				ctx.fillStyle = "green"
			}
			ctx.fillRect(i * barWidth, rectHeight - (barUnit * v.array[i]), barWidth, barUnit * v.array[i])
		}
		this.shownArr = []
		for (i of this.array) {this.shownArr.push(i)}
	}
}

const sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

const getMoves = function (bef, aft) {
	let moves = []
	for (i in bef) {
		moves.push(aft.indexOf(bef[i]))
	}
	return moves
}

const drawSort = function (v, done = false) {
	// write name and variables to document
	document.getElementById("algo").innerHTML = algo.name
	for (i in v.vars) {
		document.getElementById("variables").innerHTML += `<li>${i}: ${v.vars[i]}</li>`
	}
	
	let moves = getMoves(v.shownArr, v.array)
	ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
	let barWidth = canvas.getAttribute("width") / v.array.length
	let rectHeight = Number(canvas.getAttribute("height"))
	for (i in v.array) {
		// draw bar
		let barUnit = rectHeight / Math.max.apply(null, v.array)
		ctx.fillStyle = "white"
		if (v.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
		if (done == true) {
			ctx.fillStyle = "green"
		}
		ctx.fillRect(i * barWidth, rectHeight - (barUnit * v.array[i]), barWidth, barUnit * v.array[i])
	}
	v.shownArr = []
	for (i of v.array) {v.shownArr.push(i)}
	//moves = []
}

const bogo = function (v) {
	v.vars.attempts += 1
	v.array = v.array.sort(() => Math.random() - 0.5)
}
inits.bogo = {
	attempts: 0
}

const bubble = function (v) {
	v.scanning = [v.vars.i, v.vars.i + 1]
	if (v.array[v.vars.i] > v.array[v.vars.i + 1]) {
		swap(v, v.vars.i, v.vars.i + 1)
		v.vars.swaps++
		v.vars.swapped = true
	}
	v.vars.i++
	if (v.vars.i > v.vars.unsorted) {
		if (v.vars.swapped = false) {
			v.sorted = true
		} else { 
			v.vars.unsorted = i - 1
			v.vars.i = 0
			v.vars.passes++
			v.vars.swapped = false
		}
	}
}
const algos = {
	bubble: async function () {
		console.log("bubble sorting")
		this.v.unsorted = this.array.length
		while (this.v.unsorted > 2) {
			this.v.currentMax = 0
			for (i = 0; i < this.v.unsorted; i++) {
				console.log(this.array)
				if (this.array[i] > this.array[i + 1]) {
					this.swap(i, i + 1)
					this.v.currentMax = i
				}
				drawSort(this)
				await sleep(1000)
			}
		}
	},
}
const bubbleInit = function (v) {
	v.vars = {
		passes: 0,
		i: 0,
		swaps: 0,
		swapped: false,
	}
	v.vars.unsorted = v.array.length
	spr
}
inits.bubble = {
	passes: 0,
	i: 0,
	swaps: 0,
	swapped: false,
	unsorted: 40
}

const runAlgo = function (algo, v, interval) {
	v.algo = new Algorithm(algos[algo.name])
	v.vars = inits[algo.name]
	drawSort(v)
	let loop = setInterval(() => {
		algo(v)
		document.getElementById("variables").innerHTML = ""
		for (i in v.vars) {
			document.getElementById("variables").innerHTML += `<li>${i}: ${v.vars[i]}</li>`
		}
		drawSort(v)
	}, interval)
}

let chart = new SortChart(Array.from({length: 40}, (n, i) => i + 1).sort(() => Math.random() - 0.5))
chart.algo = algos.bubble
chart.running = true
