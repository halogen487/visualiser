// unencapsulate the runAlgo method

console.info("rectangle.js is alive")

const canvas = document.getElementById("theRectangle")
const ctx = canvas.getContext("2d")

const sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// visualiser object constructor
// visualiser means a single chart
const SortChart = function (array) {
	this.running = false
	this.array = array
	this.shownArr = []
	this.v = {}
	this.sorted = false
	this.scanning = []
	this.interval = 1000
	this.swap = function (a, b) {
		let t = this.array[a]
		this.array[a] = this.array[b]
		this.array[b] = t
	}
	this.draw = function () {
		// calculate changes between shown array and real array
		let moves = []
		for (i in this.shownArr) {
			moves.push(this.array.indexOf(this.shownArr[i]))
		}
		// write algorithm name and variables
		document.getElementById("algo").innerHTML = this.algo ? this.algo : "Heading"
		document.getElementById("variables").innerHTML = ""
		for (i in this.v) {
			document.getElementById("variables").innerHTML += `<li>${i}: ${this.v[i]}</li>`
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
		let barWidth = canvas.getAttribute("width") / this.array.length
		let rectHeight = Number(canvas.getAttribute("height"))
		for (i in this.array) {
			// draw bar
			let barUnit = rectHeight / Math.max.apply(null, this.array) // height of smallest bar
			ctx.fillStyle = "white"
			if (this.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
			if (this.sorted == true) {ctx.fillStyle = "green"}
			ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.array[i]), barWidth, barUnit * this.array[i])
		}
		// reset shownArr
		this.shownArr = []
		for (i of this.array) {this.shownArr.push(i)}
	}
	this.runAlgo = async function (algo) {
		if (this.running == false) {
			this.running = true
			this.algo = algo
			this.v = {}
			algos[algo][0].apply(this)
			while (this.running) {
				algos[algo][1].apply(this)
				this.draw()
				await sleep(this.interval)
			}
		}
	}
	this.stop = async function () {
		this.running = false
	}
	this.draw()
}

/*const getMoves = function (bef, aft) {
	let moves = []
	for (i in bef) {
		moves.push(aft.indexOf(bef[i]))
	}
	return moves
}*/

/*const drawSort = function (v, done = false) {
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
}*/

const bogo = function () {
	this.v.attempts += 1
	this.array = this.array.sort(() => Math.random() - 0.5)
}

let bubble = function (v) {
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
	bogo: [
		function () { // init function
			this.v.attempts = 0
		},
		function () { // step function
			this.v.attempts += 1
			this.array = this.array.sort(() => Math.random() - 0.5)}
	],
	bubble: [
		function () {
			this.v = {
				passes: 0,
				i: 0,
				swaps: 0,
				swapped: false,
				unsorted: this.array.length
			}
		},
		function () {
			
		}
	]
}

/*const bubbleInit = function (v) {
	v.vars = {
		passes: 0,
		i: 0,
		swaps: 0,
		swapped: false,
	}
	v.vars.unsorted = v.array.length
	spr
}*/
/*inits.bubble = {
	passes: 0,
	i: 0,
	swaps: 0,
	swapped: false,
	unsorted: 40
}*/

/*const runAlgo = function (algo, v, interval) {
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
}*/

let chart = new SortChart(Array.from({length: 40}, (n, i) => i + 1).sort(() => Math.random() - 0.5))


