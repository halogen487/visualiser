console.info("rectangle.js is alive")

const canvas = document.getElementById("theRectangle")
const ctx = canvas.getContext("2d")

const sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// visualiser object constructor
// visualiser means a single chart
const SortChart = function (array) {
	this.swap = function (a, b) {
		if (a >= array.length || b >= array.length) {
			throw new RangeError()
		}
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
			ctx.fillStyle = "#f7f7f7"
			if (moves[i] != i) {ctx.fillStyle = "#ffffff"}
			if (this.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
			if (this.sorted == true) {ctx.fillStyle = "lime"}
			ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.array[i]), barWidth, barUnit * this.array[i])
		}
		// reset shownArr
		this.shownArr = []
		for (i of this.array) {this.shownArr.push(i)}
	}
	this.play = function () {
		if (this.algo) {
			this.running = setInterval(() => {
				algos[this.algo]["step"].apply(this)
				this.draw()
				if (this.sorted == true) {
					this.pause()
				}
			}, this.interval)
		} else {}
	}
	this.setAlgo = function (algo) {
		this.pause()
		this.algo = algo
		this.v = {}
		this.scanning = []
		algos[this.algo]["init"].apply(this)
		document.getElementById("algo").innerHTML = this.algo ? this.algo : "Heading"
		this.draw()
	}
	this.pause = function () {
		clearInterval(this.running)
	}
	this.setSpeed = function (ms) {
		this.pause()
		this.interval = ms
		this.play()
	}
	this.checkSorted = function () {
		sorted = true
		for (i of this.array) {
			if (i != this.array[i]) {sorted = false}
		}
		if (sorted == true) {
			this.sorted = true
			this.pause()
		}
	}
	this.shuffle = function () {
		//this.array = Array.from({length: length}, (n, i) => i + 1)
		for (let i = this.array.length - 1; i > 0; i--) {
			let r = Math.floor(Math.random() * (this.array.length - 1))
			if (r) {}
			this.swap(i,  r)
		}
		this.scanning = []
		this.sorted = false
	}
	this.reset = function () {
		this.pause()
		this.shuffle()
		if (this.algo) {algos[this.algo]["init"].apply(this)}
		this.draw()
	}
	this.running = false
	this.algo = null
	if (typeof array == "number") {
		this.array = Array.from({length: array}, (n, i) => i + 1)
		this.shuffle()
	} else {this.array = array}
	this.shownArr = []
	this.v = {}
	this.sorted = false
	this.scanning = []
	this.interval = 5
	this.draw()
}

const algos = {
	bogo: {
		init: function () {
			this.v.attempts = 0
		},
		step: function () {
			this.checkSorted()
			this.v.attempts += 1
			this.shuffle()
		}
	},
	bubble: {
		init: function () {
			this.v = {
				n: this.array.length,
				swapped: false,
				swaps: 0,
			}
			this.scanning = [0, 1]
		},
		step: function () {
			for (i in this.scanning) {this.scanning[i]++}
			if (this.scanning[1] >= this.v.n) {
				if (this.v.swapped == false) {
					this.sorted = true
				} else {
					this.v.swapped = false
					this.scanning = [0, 1]
				}
			}
			[a, b] = [this.scanning[0], this.scanning[1]] // for easier reading
			if (this.array[a] > this.array[b]) {
				this.swap(a, b)
				this.v.swapped = true
				this.v.swaps++
			}
		}
	}
}

const runAlgo = function (algo, chart) {
	if (chart.running) {clearInterval(chart.running)}
	chart.algo = algo
	chart.v = {}
	algos[algo]["init"].apply(chart)
	chart.running = setInterval(() => {
		algos[algo]["step"].apply(chart)
		chart.draw()
	}, chart.interval)
}

let chart = new SortChart(80)
