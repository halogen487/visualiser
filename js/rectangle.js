console.info("rectangle.js is alive")

const rectangle = document.getElementById("theRectangle")
const ctx = rectangle.getContext("2d")
let shownArr = []

let unsortedArr =	[5, 2, 3, 4, 1, 6, 8, 7]
let sortedArr =	[1, 2, 3, 4, 5, 6, 7, 8]
let weirdArr =	[8, 8, 1, 3, 5, 0, 2, 4]

const swap = function (array, a, b) {
	let t = array[a]
	array[a] = array[b]
	array[b] = t
	return array
}

const getMoves = function (bef, aft) {
	let moves = []
	for (i in bef) {
		moves.push(aft.indexOf(bef[i]))
	}
	return moves
}

const drawSort = function (array) {
	if (shownArr.length == 0) {
		for (i of array) {shownArr.push(i)}
	}
	let moves = getMoves(shownArr, array)
	for (i in moves) {
		// if there is a move
		if (i != moves[i]) {
			console.log(i, "has moved")
		}
	}
	// draw graph
	ctx.clearRect(0, 0, rectangle.width, rectangle.height) // clear canvas
	let barWidth = rectangle.getAttribute("width") / array.length
	let rectHeight = Number(rectangle.getAttribute("height"))
	for (i in array) {
		// draw bar
		let barUnit = rectHeight / Math.max.apply(null, array)
		ctx.fillStyle = "red"
		ctx.fillRect(i * barWidth, 0, barWidth, barUnit * array[i])
	}
	shownArr = array
}
drawSort(unsortedArr)
swap(unsortedArr, 3, 5)
drawSort(unsortedArr)
