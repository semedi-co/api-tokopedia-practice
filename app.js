require("dotenv").config()
const express=require("express");
const morgan = require("morgan");
const compression = require("compression")
const path = require("path")
const cors = require("cors")
const app= express();
// supaya bisa melakukan inputan di postman
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// 
app.use(compression({ level: 1 }));
app.use(express.static(path.join(__dirname,"./public")))
app.use(morgan("dev"))
app.use(
    cors({
        origin: "*",
        methods:["GET","POST", "PUT","PATCH", "DELETE"]
    })
)
// regestring routes
app.use(require("./app/routes"))
// regestring error
app.use(require("./app/middlewares/errorHandler"))
// running server 
app.listen(process.env.port, ()=> console.log(`port running in port ${process.env.port} `))