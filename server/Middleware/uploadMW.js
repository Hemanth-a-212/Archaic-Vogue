import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = "./upload/images";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination:(req,res,cb)=>{return cb(null,uploadDir)},
    filename:(req,file,cb)=>{return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)}
});
const upload = multer({storage});

export {upload}