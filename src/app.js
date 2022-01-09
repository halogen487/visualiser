#!/usr/bin/env node

/*
	core node.js server
*/

const express = require("express"); const app = express() // import express, require is the node.js function for imports
const path = require("path") // import file path manipulation functions
const fs = require("fs") // import filesystem control functions

app.use(function (req, res, next) { // log all HTTP requests to console and log file
	let line = `${(new Date).toISOString()}: ${req.method} request for ${req.url} from ${req.ip}`
	console.log(line)
	fs.appendFile(path.join(__dirname, "http.log"), line + "\n", (err) => {if (err) {console.log(err)}})
	next()
})

app.use("/css/:cssId", function (req, res) { // requests for /css/... go to css folder
	res.sendFile(path.join(__dirname, "css", req.params.cssId))
})
app.use("/js/:jsId", function (req, res) { // requests for /js/... go to js folder
	res.sendFile(path.join(__dirname, "js", req.params.jsId))
})

app.get("/", function (req, res) { // request for homepage
	res.sendFile(path.join(__dirname, "/html/index.html"))
})
app.get("/single", function (req, res) { // request for single animation page
	res.sendFile(path.join(__dirname, "/html/single.html"))
})
app.get("/multiple", function (req, res) { // request for multiple animation page
	res.sendFile(path.join(__dirname, "/html/multiple.html"))
})
app.use("/", function (req, res) { // request for anything else returns 404 page
	res.sendFile(path.join(__dirname, "/html/404.html"))
})

app.listen(80, () => { // listen on port 80
	console.info("server alive")
})
