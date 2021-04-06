var express = require("express");
var mongoose = require('mongoose');
const routes = require("./routes")
const bodyParser = require('body-parser');
var app = express();


mongoose
	.connect("mongodb://localhost:27017/users-data", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		const app = express()
        app.use(bodyParser.json());
        app.use("/api", routes)

		app.listen(5000, () => {
			console.log("Server has started!")
		})
	})

