import {algos} from "/js/algos.js"

/*
	test script for charts
*/

console.info("rectangle.js is alive")

function GraphNode (id, to) {
	this.id = id
	this.to = to
	this.from = []
	this.x = null
	this.y = null
}

function Chart () {
	if (charts[0]) {
		this.id = Number(Object.keys(charts)[Object.keys(charts).length - 1]) + 1
	} else {
		this.id = 0
	}
	document.querySelector("#charts-go-here").insertAdjacentHTML("beforeend", `
		<article id="chart${this.id}">
			<select class="algoSelect"></select>
			<figure>
				<canvas width="768" height="512"></canvas>
				<figcaption>
					<ul class="variables"></ul>
				</figcaption>
			</figure>
		</article>
	`)
	this.ele = document.querySelector(`#chart${this.id}`)
	this.ctx = this.ele.querySelector("canvas").getContext("2d")
	this.ele.querySelector(".algoSelect").addEventListener("change", (evt) => {
		charts[this.id].setAlgo(evt.target.value)
	})

	this.pause = function () {
		clearInterval(this.running)
		this.running = null
		try {this.oscillator.stop()} catch {}
		return this
	}

	this.setAlgo = function (algo) {
		this.algo = algo
		if (algo != "check") {this.actualAlgo = algo}
		this.scanning = []
		if (this.algo) {
			if (algo != "check") {
				this.v = {}
			}
			algos[this.algo]["init"].apply(this)
		}
		this.draw()
		return this
	}
	this.setSpeed = function (ms) {
		this.pause()
		this.interval = ms
		if (this.running) {
			this.play()
		}
		return this
	}

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
		// init nodes
		for (let i = 0; i < 10; i++) {
			let toCount = Math.floor(Math.random() * 3) + 1
			let tos = []
			for (let j = 0; j < toCount; j++){tos.push(Math.floor(Math.random() * 10))}
			this.value.push(new GraphNode(i, tos))
		}
		// assign froms
		for (let i of this.value) {
			for (let j of this.value) {
				if (j.to.indexOf(i.id) > 0) {
					i.from.push(j.id)
				}
			}
		}
		console.log(this.value)
		return this
	}

	this.assignCoords = function () {
		for (let i of this.value) {

		}
	}

	this.draw = function () {

	}

	this.running = null
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
		return this
	}

	this.draw = function () {
		if (this.scanning[0] && config.sound) {this.beep(this.value[this.scanning[0]])}
		// calculate changes between shown array and real array
		let moves = []
		for (let i in this.shownValue) {
			moves.push(this.value.indexOf(this.shownValue[i]))
		}
		// write algorithm name and variables
		this.ele.querySelector(".variables").innerHTML = ""
		for (let i in this.v) {
			this.ele.querySelector(".variables").innerHTML += `<li>${i}: ${this.v[i]}</li>`
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
		return this
	}

	this.play = function () {
		console.info(this.id, "playing", this.algo)
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
						this.pause()
						if (config.loop) {
							let options = ["bubble", "insertion"]
							this.setAlgo(options[Math.floor(Math.random() * options.length)])
							this.play()
						}
					}
				}, this.interval)
			}
			try {
				this.oscillator.start()
			} catch {}
		}
		return this
	}
	this.setLength = function (n) {
		let o = this.value.length
		this.value.splice(o - (o - n))
		for (let i = 0; i < n - o; i++) {
			this.value.push(o + i + 1)
		}
		this.draw()
		return this
	}
	this.reset = function (length) {
		if (!length) {length = this.value.length}
		this.pause()
		if (this.algo == "check") {this.algo = this.actualAlgo}
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
		return this
	}
	this.beep = function (height) { // implement logarithmic distribution
		try {
			this.vol.gain.value = 0.5
			this.oscillator.frequency.value = height + 300
		} catch {}
		return this
	}

	for (let i of Object.keys(algos).filter((key) => {return algos[key].chartType == "sort"})) {
		this.ele.querySelector(".algoSelect").insertAdjacentHTML("beforeend", `
			<option value="${i}">${i}</option>
		`)
	}

	this.running = null
	this.actualAlgo = null
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

function stepAll () {
	for (let i of charts) {
		i.step()
	}
	requestAnimationFrame(() => {})
}

function buttHandler (evt) {
	for (let chart in Object.keys(charts)) {
		charts[chart][evt.target.innerText]()
	}
}

function addChart (chart) {
	charts[chart.id] = chart
}

function removeChart (id) {}

var config = {
	loop: false,
	sound: false
}

var charts = {}

for (let i of document.querySelectorAll(".control")) {
	i.addEventListener("click", buttHandler)
}

// -----------------------------------------------------------------------------

//addChart(new GraphChart(10, 3))
addChart(new SortChart(40))

charts["0"].setAlgo("bubble")

/*
let options = ["bubble", "insertion"]
this.setAlgo(options[Math.floor(Math.random() * options.length - 1)])
this.play()
*/
