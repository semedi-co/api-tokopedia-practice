const multer = require("multer")
const path = require("path")
const fs = require("fs")

module.exports= destination => {
    const storage = multer.diskStorage({
        destination: (req, file, cb)=> {
            if (!fs.existsSync(path.join(__dirname, "../../public/avatar"))) {
                fs.mkdirSync(path.join(__dirname, "../../public/avatar"));
            }
            if (!fs.existsSync(path.join(__dirname, "../../public/store"))) {
                fs.mkdirSync(path.join(__dirname, "../../public/store"));
            }
            if (!fs.existsSync(path.join(__dirname, "../../public/product"))) {
                fs.mkdirSync(path.join(__dirname, "../../public/product"));
            }

            if (destination == "user") {
                cb(null, path.join(__dirname, "../../public/avatar"))
            } else if (destination == "store"){
                cb(null, path.join(__dirname, "../../public/store"))    
            }  else if (destination == "product"){
                cb(null, path.join(__dirname, "../../public/product"))
            }
        },
        filename: (req, file, cb)=>{
            cb(null, Date.now().toString().concat(".", file.mimetype.split("/")[1]))
        }
    })
    
    
    // config limit and filter by
    const upload = multer({
        storage,
        limits:{
            fieldSize: "1MB"
        },
        fileFilter : (req, file, cb)=>{
            if (file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
                cb(null, true);
            } else {
                cb(" file is not supported", false);
            }
        }
    })

    return upload ;
}