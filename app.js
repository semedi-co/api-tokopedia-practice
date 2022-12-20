require("dotenv").config();
const express = require("express");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");

//initialize express
const app = express();

//registering midleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(compression({ level: 1 }));
app.use(morgan("dev"));
//registering routes
app.use(require("./app/routes"));

//registering error handler
app.use(require("./app/middlewares/errorHandler"));

//running server
app.listen(process.env.PORT, () => console.log("Server running on port 3000"));