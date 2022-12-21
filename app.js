const express     = require("express");
const path        = require("path");
const logger      = require("morgan");
const boom        = require("express-boom");
const cors        = require("cors");
const compression = require("compression"); 

const app = express();

app.use(logger("dev"));
app.use(boom());
app.use(compression({ level: 1 }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
