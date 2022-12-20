require("dotenv").config();
const express       = require("express");
const compression   = require("compression");
const morgan        = require("morgan");
const cors          = require("cors");
const path          = require("path");

// initialize app 
const app = express();

// registering middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression({ level: 1 }));
app.use(express.static(path.join(__dirname,"./public")));
app.use(morgan("dev"));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"]
}));

// registering routes 
app.use(require("./app/routes"));

// registering error handler
app.use(require("./app/middlewares/errorHandler"));

app.listen(process.env.PORT, () => console.log("server running on port 3000"));