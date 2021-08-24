console.info("rectangle.js is alive")

const canvas = document.getElementById("theRectangle")
const ctx = canvas.getContext("2d")

actx = new (window.AudioContext || window.webkitAudioContext)()

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
		if (this.scanning[0]) {this.beep(this.array[this.scanning[0]])}
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
			if (this.algo == "check" && i < this.checki) {ctx.fillStyle = "lime"}
			if (this.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
			ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.array[i]), barWidth + 1, barUnit * this.array[i])
		}
		// reset shownArr
		this.shownArr = []
		for (i of this.array) {this.shownArr.push(i)}
	}
	this.play = function () {
		if (!this.running && this.algo) {
			if (this.sorted) {
				this.reset()
			}
			if (this.algo) {
				this.running = setInterval(() => {
					algos[this.algo]["step"].apply(this)
					this.draw()
					if (this.sorted && this.algo != "check") {
						this.setAlgo("check")
						this.play()
					} else if (this.sorted) {this.pause()}
				}, this.interval)
			}
			this.oscillator = actx.createOscillator()
			this.gainNode = actx.createGain()
			this.oscillator.connect(this.gainNode)
			this.gainNode.connect(actx.destination)
			this.gainNode.gain.value = 0.1
			this.oscillator.type = "sine"
			try {
				this.oscillator.start()
			} catch {}
		}
	}
	this.setAlgo = function (algo) {
		this.pause()
		this.algo = algo
		this.scanning = []
		if (algo != "check") {
			this.v = {}
			document.getElementById("algo").innerHTML = this.algo ? this.algo : "Heading"
		}
		algos[this.algo]["init"].apply(this)
		this.draw()
	}
	this.pause = function () {
		clearInterval(this.running)
		this.running = null
		if (this.oscillator) {this.oscillator.stop()}
	}
	this.setSpeed = function (ms) {
		let on = this.running
		this.pause()
		this.interval = ms
		if (on) {
			this.play()
		}
	}
	this.setLength = function (n) {
		let o = this.array.length
		this.array.splice(o - (o - n))
		for (let i = 0; i < n - o; i++) {
			this.array.push(o + i + 1)
		}
		this.draw()
	}
	this.reset = function () {
		this.pause()
		if (this.algo == "check") {this.algo = null}
		this.array = Array.from({length: this.array.length}, (n, i) => i + 1)
		for (let i = this.array.length - 1; i > 0; i--) {
			let r = Math.floor(Math.random() * (this.array.length - 1))
			if (r) {}
			this.swap(i,  r)
		}
		this.scanning = []
		this.sorted = false
		if (this.algo) {algos[this.algo]["init"].apply(this)}
		this.draw()
	}
	this.beep = function (height) {
		try {this.oscillator.frequency.value = height + 300} catch {}
		//oscillator.stop(actx.currentTime + (Number(this.interval) / 1500))
		return "sure bub"
	}
	this.running = false
	this.algo = null
	this.shownArr = []
	this.interval = 500
	if (typeof array == "number") {
		this.array = Array.from({length: array}, (n, i) => i + 1)
		this.reset()
	} else {this.array = array}
	this.draw()
}

const algos = {
	check: { // doesn't actually check, just does the whoosh
		init: function () {
			this.checki = 0
			this.sorted = false
		},
		step: function () {
			this.scanning = [this.checki, this.checki + 1]
			if (this.checki <= this.array.length) {
				
			} else {
				this.sorted = true
			}
			this.checki++
		}
	},
	bogo: {
		init: function () {
			this.v.attempts = 0
		},
		step: function () {
			this.v.attempts += 1
			for (let i = this.array.length - 1; i > 0; i--) {
				let r = Math.floor(Math.random() * (this.array.length - 1))
				if (r) {}
				this.swap(i,  r)
			}
			let goodArr = Array.from({length: this.array.length}, (v, i) => i + 1)
			let sorted = true
			for (i in this.array) {
				if (this.array[i] != goodArr[i]) {
					sorted = false
				}
			}
			if (sorted == true) {this.sorted = true}
		}
	},
	bubble: {
		init: function () {
			this.v = {
				n: this.array.length - 1,
				newn: this.array.length - 1,
				swapped: true,
				comparisons: 0
			}
			this.scanning = [this.array.length, this.array.length + 1]
		},
		step: function () {
			for (i in this.scanning) {this.scanning[i]++}
			if (this.scanning[1] >= this.v.n) { // at end
				if (this.v.n <= 1) {
					this.sorted = true
				} else {
					this.v.swapped = false
					this.scanning = [0, 1]
					this.v.n = this.v.newn + 1
					this.v.newn = 0
				}
			}
			[a, b] = [this.scanning[0], this.scanning[1]] // for easier reading
			this.v.comparisons++
			if (this.array[a] > this.array[b]) {
				this.swap(a, b)
				this.v.newn = this.scanning[0]
				this.v.swapped = true
			}
		}
		//step: function () {}
	},
	cocktail: {
		init: function () {},
		step: function () {}
	},
	insertion: {
		init: function () {
			this.v = {
				i: 1,
				j: 1,
				comparisons: 0
			}
		},
		step: function () {
			if (this.v.i < this.array.length) {
				this.scanning = [this.v.j, this.v.j - 1]
				this.v.comparisons++
				if (this.v.j > 0 && this.array[this.v.j - 1] > this.array[this.v.j]) {
					this.swap(this.v.j, this.v.j - 1)
					this.v.j--
				} else {
					this.v.i++
					this.v.j = this.v.i
				}
			} else {
				this.sorted = true
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

let chart = new SortChart(7)
