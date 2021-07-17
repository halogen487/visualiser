console.info("rectangle.js is alive")

const rectangle = document.getElementById("theRectangle")
const ctx = rectangle.getContext("2d")

const testArr = [5, 2, 3, 4, 1, 6, 8, 7]

const drawSort = function (array) {
	const barWidth = rectangle.getAttribute("width") / array.length
	const rectHeight = Number(rectangle.getAttribute("height"))
	for (i in array) {
		let barUnit = rectHeight / Math.max.apply(null, array)
		console.log(i * barWidth, 0, i * barWidth + barWidth, barUnit * array[i])
		//if (i == 2) {
		ctx.fillStyle = "red"
		ctx.fillRect(i * barWidth, 0, barWidth, barUnit * array[i])
		//}
	}
}
drawSort(testArr)

//ctx.fillStyle = "green"
//ctx.fillRect(20, 20, 100, 200)
