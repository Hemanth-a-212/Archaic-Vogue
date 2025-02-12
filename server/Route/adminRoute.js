import { Router } from "express";
import { addproduct,removeproduct,allproducts } from "../Controller/adminController.js";

const router = Router();

router.post("/addproduct",addproduct);
router.delete("/removeproduct",removeproduct)
router.get('/allproducts',allproducts)

export default router;