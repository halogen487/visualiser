/*
	main script for core classes and barchart
*/

let fasterer = true
let fasti = 0
let bets = []

function addBet(name, attempts) {
	bets.push({name: name, attempts: attempts})
	document.getElementById("betstable").innerHTML += `<tr><td>${name}</td><td>${attempts}</td></tr>`
}

console.info("rectangle.js is alive")

const canvas = document.getElementById("theRectangle")
const ctx = canvas.getContext("2d") // draw to this

// audio context for beeping and booping
actx = new (window.AudioContext || window.webkitAudioContext)()

const GraphNode = function (id, to) {
	this.id = id
	this.to = to
	this.x = null
	this.y = null
}

// visualiser parent class
// means a single chart
const Chart = function () {
	this.pause = function () {
		clearInterval(this.running)
		this.running = null
		if (this.oscillator) {this.oscillator.stop()}
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
	this.running = null
	this.value = null
	this.shownValue = null
	this.algo = null
	this.interval = 50
	this.scanning = null
}

// barchart visualiser object constructor
const SortChart = function (array) {
	
	Chart.call(this)
	
	this.done = false
	// swaps values at given array indices
	this.swap = function (a, b) {
		if (a >= array.length || b >= array.length) {
			throw new RangeError()
		}
		let t = this.value[a]
		this.value[a] = this.value[b]
		this.value[b] = t
	}
	
	this.draw = function () {
		if (this.scanning[0]) {this.beep(this.value[this.scanning[0]])}
		// calculate changes between shown array and real array
		let moves = []
		for (i in this.shownValue) {
			moves.push(this.value.indexOf(this.shownValue[i]))
		}
		// write algorithm name and variables
		document.getElementById("variables").innerHTML = ""
		for (i in this.v) {
			document.getElementById("variables").innerHTML += `<li>${i}: ${this.v[i]}</li>`
		}
		if ((fasterer && fasti == 0) || this.done) {
		ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
		let barWidth = canvas.getAttribute("width") / this.value.length
		let rectHeight = Number(canvas.getAttribute("height"))
		for (i in this.value) {
			// draw bar
			let barUnit = rectHeight / Math.max.apply(null, this.value) // height of smallest bar
			ctx.fillStyle = "#f7f7f7"
			if (moves[i] != i) {ctx.fillStyle = "#ffffff"}
			if (this.algo == "check" && i < this.checki) {ctx.fillStyle = "lime"}
			if (this.scanning.indexOf(Number(i)) >= 0) {ctx.fillStyle = "red"}
			ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.value[i]), barWidth + 1, barUnit * this.value[i])
		}
		// reset shownValue
		this.shownValue = []
		for (i of this.value) {this.shownValue.push(i)}
		if (this.fasti > 50) {this.fasti = 0} else {this.fasti++}
		}
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
					} else if (this.done) {this.pause()}
				}, this.interval)
			}
			this.oscillator = actx.createOscillator()
			this.gainNode = actx.createGain()
			this.oscillator.connect(this.gainNode)
			this.gainNode.connect(actx.destination)
			this.gainNode.gain.value = 0
			this.oscillator.type = "sine"
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
	this.reset = function () {
		this.pause()
		if (this.algo == "check") {this.algo = null}
		this.value = Array.from({length: this.value.length}, (n, i) => i + 1)
		for (let i = this.value.length - 1; i > 0; i--) {
			let r = Math.floor(Math.random() * (this.value.length - 1))
			if (r) {}
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
			this.gainNode.gain.value = 0.5
			this.oscillator.frequency.value = height + 300
		} catch {}
	}
	this.running = null
	this.algo = null
	this.shownValue = []
	this.interval = 50
	if (typeof array == "number") {
		this.value = Array.from({length: array}, (n, i) => i + 1)
		this.reset()
	} else {this.value = array}
	this.draw()
}

const algos = {
	check: { // doesn't actually check, just does the whoosh
		init: function () {
			this.checki = 0
			this.done = false
		},
		step: function () {
			this.scanning = [this.checki, this.checki + 1]
			if (this.checki <= this.value.length) {
				
			} else {
				this.done = true
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
			for (let i = this.value.length - 1; i > 0; i--) {
				let r = Math.floor(Math.random() * (this.value.length - 1))
				if (r) {}
				this.swap(i,  r)
			}
			let goodArr = Array.from({length: this.value.length}, (v, i) => i + 1)
			let done = true
			for (i in this.value) {
				if (this.value[i] != goodArr[i]) {
					done = false
					break
				}
			}
			if (done == true) {this.done = true}
		}
	},
	boggle: {
		init: function () {
			this.v.comparisons = 0
		},
		step: function () {
			a = Math.floor(Math.random() * (this.value.length))
			b = Math.floor(Math.random() * (this.value.length))
			this.scanning = [a, b]
			if (a > b) {
				let x = b
				b = a
				a = x
			}
			this.v.comparisons++
			if (this.value[a] > this.value[b]) {
				this.swap(a, b)
			}
			this.comparisons++
			let goodArr = Array.from({length: this.value.length}, (v, i) => i + 1)
			let done = true
			for (i in this.value) {
				if (this.value[i] != goodArr[i]) {
					done = false
					break
				}
			}
			if (done == true) {this.done = true}
		}
	},
	bubble: { // clean up
		init: function () {
			this.v = {
				n: this.value.length - 1,
				newn: this.value.length - 1,
				swapped: true,
				comparisons: 0
			}
			this.scanning = [this.value.length, this.value.length + 1]
		},
		step: function () {
			for (i in this.scanning) {this.scanning[i]++}
			if (this.scanning[1] >= this.v.n) { // at end
				if (this.v.n <= 1) {
					this.done = true
				} else {
					this.v.swapped = false
					this.scanning = [0, 1]
					this.v.n = this.v.newn + 1
					this.v.newn = 0
				}
			}
			[a, b] = [this.scanning[0], this.scanning[1]] // for easier reading
			this.v.comparisons++
			if (this.value[a] > this.value[b]) {
				this.swap(a, b)
				this.v.newn = this.scanning[0]
				this.v.swapped = true
			}
		}
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
			if (this.v.i < this.value.length) {
				this.scanning = [this.v.j, this.v.j - 1]
				this.v.comparisons++
				if (this.v.j > 0 && this.value[this.v.j - 1] > this.value[this.v.j]) {
					this.swap(this.v.j, this.v.j - 1)
					this.v.j--
				} else {
					this.v.i++
					this.v.j = this.v.i
				}
			} else {
				this.done = true
			}
		}
	}
}

let chart = new SortChart(40)
