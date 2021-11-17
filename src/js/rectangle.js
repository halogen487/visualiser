import * as charts from "./classes.js"

/*
	test script for barchart
*/

console.info("rectangle.js is alive")

var chart = new charts.SortChart(40)
chart.setAlgo("bubble")
chart.play()
