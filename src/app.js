#!/usr/bin/env node

/*
	core node.js server
*/

const express = require("express"); const app = express()
const path = require("path")
const fs = require("fs")

app.use(function (req, res, next) {
	let line = `${(new Date).toISOString()}: ${req.method} request for ${req.url} from ${req.ip}`
	console.log(line)
	fs.appendFile(path.join(__dirname, "http.log"), line + "\n", (err) => {if (err) {console.log(err)}})
	next()
})

app.use("/css/:cssId", function (req, res) {
	res.sendFile(path.join(__dirname, "css", req.params.cssId))
})
app.use("/js/:jsId", function (req, res) {
	res.sendFile(path.join(__dirname, "js", req.params.jsId))
})

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/index.html"))
})
app.get("/sort", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/sort.html"))
})
app.get("/tree", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/tree.html"))
})
app.get("/graph", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/graph.html"))
})
app.get("/audio", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/audio.html"))
})
app.use("/", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/404.html"))
})

app.listen(80, () => {
	console.info("server alive")
})
