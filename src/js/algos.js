export function Algorithm (init, step, chartType) { // algorithm class
	this.init = init
	this.step = step
	this.chartType = chartType
}

export var algos = {
	check: new Algorithm (
	// doesn't actually check, just does the whoosh
		function () {
			this.checki = 0;
			this.done = false;
		},
		function () {
			this.scanning = [this.checki, this.checki + 1];
			if (this.checki <= this.value.length) {
			} else {
			  this.done = true;
			}
			this.checki++;
		},
		"sort"
	),
	bogo: new Algorithm (
		function () {
			this.v.attempts = 0;
			this.ele.querySelector(".bigo").innerHTML = "O(n!)"
			try {this.ele.querySelector(".pseudocode").innerText = `
while not sorted:
	shuffle(array)
			`} catch {}
		},
		function () {
			this.v.attempts += 1;
			for (let i = this.value.length - 1; i > 0; i--) {
			  let r = Math.floor(Math.random() * (this.value.length - 1));
			  if (r) {
			  }
			  this.swap(i, r);
			}
			let goodArr = Array.from({ length: this.value.length }, (v, i) => i + 1);
			let done = true;
			for (let i in this.value) {
			  if (this.value[i] != goodArr[i]) {
				done = false;
				break;
			  }
			}
			if (done == true) {
			  this.done = true;
			}
		},
		"sort"
	),
	boggle: new Algorithm (
		function () {
			this.v.comparisons = 0;
			this.ele.querySelector(".bigo").innerHTML = "O(a^n)"
			try {this.ele.querySelector(".pseudocode").innerText = `
while not sorted:
	a = random index in array
	b = random index in array
	if (a > b) and (array[a] > array[b]):
		swap(a, b)
			`} catch {}
		  },
		function () {
			let a = Math.floor(Math.random() * this.value.length);
			let b = Math.floor(Math.random() * this.value.length);
			this.scanning = [a, b];
			if (a > b) {
			  let x = b;
			  b = a;
			  a = x;
			}
			this.v.comparisons++;
			if (this.value[a] > this.value[b]) {
			  this.swap(a, b);
			}
			this.comparisons++;
			let goodArr = Array.from({ length: this.value.length }, (v, i) => i + 1);
			let done = true;
			for (let i in this.value) {
				if (this.value[i] != goodArr[i]) {
					done = false;
					break;
				}
			}
			if (done == true) {
				this.done = true;
			}
		},
		"sort"
	),
	bubble: new Algorithm (
		// clean up
		function () {
			this.v = {
				n: this.value.length - 1,
				newn: this.value.length - 1,
				swapped: true,
				comparisons: 0,
			};
			this.ele.querySelector(".bigo").innerHTML = "O(n^2)"
			this.scanning = [this.value.length, this.value.length + 1];
			try {this.ele.querySelector(".pseudocode").innerText = `
n = length(array)
repeat until n <= 1:
	newn = 0
	for i = 1 to n - 1:
		if array[i - 1] > array[i]:
			swap(i - 1, i)
			newn = i
	n = newn
			`} catch {}
		},
		function () {
			for (let i in this.scanning) {
				this.scanning[i]++;
			}
			if (this.scanning[1] >= this.v.n) {
				// at end
				if (this.v.n <= 1) {
					this.done = true;
				} else {
					this.v.swapped = false;
					this.scanning = [0, 1];
					this.v.n = this.v.newn + 1;
					this.v.newn = 0;
				}
			}
			let [a, b] = [this.scanning[0], this.scanning[1]]; // for easier reading
			this.v.comparisons++;
			if (this.value[a] > this.value[b]) {
				this.swap(a, b);
				this.v.newn = this.scanning[0];
				this.v.swapped = true;
			}
		},
		"sort"
	),
	cocktail: new Algorithm (
		function () {
			this.ele.querySelector(".bigo").innerHTML = "O(n^2)"
			/*try {this.ele.querySelector(".pseudocode").innerText = `

			`} catch {}*/
			this.v = {
				swapped: true,
				start: 0,
				end: this.value.length,
				up: true,
			}
			this.scanning = [this.value.length, this.value.length + 1]
		},
		function () {
			if (this.v.up) {
				for (let i in this.scanning) {
					this.scanning[i]++
				}
				if (this.scanning[0] >= this.v.end) {
					this.v.up = false
					this.v.end--;
					console.log("down")
					if (!this.v.swapped) {
						this.done = true
					}
				}
			} else {
				for (let i in this.scanning) {
					this.scanning[i]--
				}
				if (this.scanning[0] <= this.v.start) {
					this.v.up = true
					this.v.start++;
					this.v.swapped = false
					console.log("up")
				}
			}
			if (this.value[this.scanning[0]] > this.value[this.scanning[1]]) {
				this.swap(this.scanning[0], this.scanning[1])
				this.v.swapped = true
			}
		},
		"sort"
	),
	insertion: new Algorithm (
		function () {
			this.v = {
				i: 1,
				j: 1,
				comparisons: 0,
			}
			this.ele.querySelector(".bigo").innerHTML = "O(n^2)"
			try {this.ele.querySelector("pseudocode").innerText = ``} catch {}
		},
		function () {
			if (this.v.i < this.value.length) {
				this.scanning = [this.v.j, this.v.j - 1];
				this.v.comparisons++;
				if (this.v.j > 0 && this.value[this.v.j - 1] > this.value[this.v.j]) {
					this.swap(this.v.j, this.v.j - 1);
					this.v.j--;
				} else {
					this.v.i++;
					this.v.j = this.v.i;
				}
			} else {
				this.done = true;
			}
		},
		"sort"
	),
	selection: new Algorithm (
		function () {
			this.v = {
				jMin: 0
			}
			this.scanning = [0, 1]
		},
		function () {
			if (this.scanning[0] < this.value.length - 1) {
				if (this.scanning[1] < this.value.length) {
					if (this.value[this.scanning[1]] < this.value[this.v.jMin]) {
						this.v.jMin = this.scanning[1]
					}
					this.scanning[1]++
				} else {
					this.scanning[1] = this.scanning[0] + 1
					if (this.v.jMin != this.scanning[0]) {
						this.swap(this.scanning[0], this.v.jMin)
					}
					this.scanning[0]++
					this.v.jMin = this.scanning[0]
				}
			} else {
				this.done = true
			}
		},
		"sort"
	)
}
