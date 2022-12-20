require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(compression({ level: 1 }));
app.use(express.static(path.join(__dirname,"./public")));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  })
);

app.use(require("./app/routes"));

app.use(require("./app/middleware/errorhandler"));




app.listen(process.env.PORT, () => console.log("Server Running 3000"));