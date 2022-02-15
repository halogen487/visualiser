import {algos} from "/js/algos.js"

/*
	test script for charts
*/

console.info("rectangle.js is alive")

function Chart () { // class for any chart
	if (charts[0]) { // give self unique chart ID
		this.id = Number(Object.keys(charts)[Object.keys(charts).length - 1]) + 1
	} else {
		this.id = 0
	}
	document.querySelector("#charts-go-here").insertAdjacentHTML("beforeend", ` <!-- insert chart HTML into page -->
		<article id="chart${this.id}">
			<header>
				<select class="algoSelect">
					<option disabled selected>select algorithm</option>
				</select>
				<math class="bigo">O(n)</math>
			</header>
			<figure>
				<canvas width="${config.single ? 784 : 576}" height="${config.single ? 512 : 384}"></canvas> <!-- if single animation page, make it larger -->
				<figcaption>
					<ul class="variables"></ul>
				</figcaption>
			</figure>
		${config.single ? `
				<!--pre><code class="pseudocode"></code></pre--> <!-- only show pseudocode if it's the only animation -->
			` : ``}
		</article>
	`)
	this.ele = document.querySelector(`#chart${this.id}`) // element object for later HTML altering
	this.ctx = this.ele.querySelector("canvas").getContext("2d") // canvas context for drawing things
	this.ele.querySelector(".algoSelect").addEventListener("change", (evt) => { // when user selects different algorithm, change algorithm
		charts[this.id].setAlgo(evt.target.value)
	})
	this.pause = function () { // method to stop running
		clearInterval(this.running)
		this.running = null
		this.vol.gain.value = 0
		return this // most methods return themselves so you can run multiple methods in one line, it's called function chaining
	}

	this.setAlgo = function (algo) { // method to change algorithm
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
	this.setSpeed = function (ms) { // method to change speed
		this.pause()
		this.interval = ms
		if (this.running) {
			this.play()
		}
		return this
	}

	this.running = null // when running this contains the setInterval() loop ID so you can cancel the loop or see if it's running
	this.value = null // array that the chart represents
	this.shownValue = null // array currently being shown
	this.algo = null
	this.interval = 50
	this.scanning = null
}

function SortChart (length) { // class for a chart that shows a sorting algorithm

	Chart.call(this) // subclass of Chart, I was originally going to have multiple types of chart

	this.done = false // true if the algorithm finished running
	this.swap = function (a, b) { // swaps values at given array indices
		let t = this.value[a] // temporary variable
		this.value[a] = this.value[b]
		this.value[b] = t
		return this
	}

	this.draw = function () { // method to draw the chart itself to the appropriate canvas element on the page
		if (this.running && this.scanning[0] && config.sound) {this.beep(this.value[this.scanning[0]])}
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
			if (moves[i] != i) { // if bar moved, make it fully white
				this.ctx.fillStyle = "#ffffff"
			}
			if (this.algo == "check" && i < this.checki) { // turns green at end
				this.ctx.fillStyle = "lime"
			}
			if (
				this.scanning.indexOf(Number(i)) >= 0 // if bar is being "scanned" by the algorithm, make it red
				&& this.running
			) {
				this.ctx.fillStyle = "red"
			}
			this.ctx.fillRect(i * barWidth, rectHeight - (barUnit * this.value[i]), barWidth + 1, barUnit * this.value[i]) // draw bar
		}
		// reset shownValue
		this.shownValue = []
		for (let i of this.value) {this.shownValue.push(i)}
		return this
	}

	this.play = function () { // method to start running
		console.info("chart", this.id, "playing", this.algo)
		if (!this.running && this.algo) {
			if (this.done) {
				this.reset()
			}
			if (this.algo) {
				this.running = setInterval(() => { // setInterval runs this function every set amount of time, returns a loop ID
					algos[this.algo]["step"].apply(this)
					this.draw()
					if (this.done && this.algo != "check") { // if done, run check algorithm to do the green swoosh
						this.setAlgo("check")
						this.play()
					} else if (this.done) { // if it's already run check algorithm, stop
						this.pause()
					}
				}, this.interval)
			}
			try {
				this.oscillator.start() // try to start beeping, won't work if it's already started
			} catch {}
		}
		return this
	}
	this.setLength = function (n) { // method to change size of the array chart shows
		let o = this.value.length
		this.value.splice(o - (o - n))
		for (let i = 0; i < n - o; i++) {
			this.value.push(o + i + 1)
		}
		this.draw()
		return this
	}
	this.reset = function (length) { // shuffle
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
	this.beep = function (height) { // makes one beep
		try {
			this.vol.gain.value = 0.5
			this.oscillator.frequency.value = height + 300
		} catch {}
		return this
	}

	for (let i of Object.keys(algos).filter((key) => {return (algos[key].chartType == "sort" && key != "check")})) { // add options to change algorithm into HTML
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

function buttHandler (evt) { // handles any button push, runs function depending on content of button
	for (let chart in Object.keys(charts)) {
		charts[chart][evt.target.innerText]()
	}
}

function addChart (chart) { // function to add new chart
	charts[chart.id] = chart
}

function removeChart (id) { // function to remove a chart
	delete charts[chart.id]
}

var config = { // configuration, user can't access unless they somehow edit this script
	loop: false,
	sound: true,
	pageType: document.querySelector("body").getAttribute("id")
}
if (config.pageType == "single") {config.single = true}

var charts = {} // map of all chart objects

for (let i of document.querySelectorAll(".control")) { // attach button handler functions to button click events
	i.addEventListener("click", buttHandler)
}
document.querySelector(".speed").addEventListener("change", (evt) => { // attach speed changer functions to appropriate input box change events
	for (let i in Object.keys(charts)) {
		charts[i].setSpeed(evt.target.value)
		if (charts[i].running) {
			charts[i].play()
		}
	}
})
document.querySelector(".length").addEventListener("change", (evt) => { // attach size changer functions to appropriate input box change events
	for (let i in Object.keys(charts)) {
		charts[i].setLength(evt.target.value)
		charts[i].reset()
	}
})
try { // attach addChart function to new chart button click event
	document.querySelector("#new-chart").addEventListener("click", () => {
		addChart(new SortChart(40))
	})
} catch {}

if (config.single) { // if on single animation page, add one chart (user won't be able to add more)
	addChart(new SortChart(40))
}
