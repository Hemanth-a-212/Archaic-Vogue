import {Router} from "express"
import { upload } from "../Middleware/uploadMW.js";
import { uploadImage } from "../Controller/uploadController.js";
const router = Router();

router.post("/upload",upload.single("product"), uploadImage);

export default router