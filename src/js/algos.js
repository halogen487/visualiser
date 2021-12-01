export function Algorithm (init, step, chartType) {
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
			this.scanning = [this.value.length, this.value.length + 1];
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
		function () {},
		function () {},
	),
	insertion: new Algorithm (
		function () {
			this.v = {
			i: 1,
			j: 1,
			comparisons: 0,
			}
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
	)
}
