#!/usr/bin/env node

const express = require("express"); const app = express()
const path = require("path")

app.use(function (req, res, next) {
	console.log(`${req.method} request for ${req.url} from ${req.ip}`)
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
app.get("/test", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/rectangle.html"))
})
app.use("/", function (req, res) {
	res.sendFile(path.join(__dirname, "/html/404.html"))
})

app.listen(80, () => {
	console.info("server alive")
})
