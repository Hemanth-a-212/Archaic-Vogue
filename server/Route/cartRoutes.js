import { Router } from "express";
import fetchUser from "../Middleware/fetchUser.js";
import { addtocart,removefromcart,getcart } from "../Controller/cartController.js";
const router = Router();

router.post("/addtocart",fetchUser,addtocart);

router.post("/removefromcart",fetchUser,removefromcart);

router.get("/getcart",fetchUser,getcart)

export default router;