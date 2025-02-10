import { Router } from "express";
import { login, deleteuser , signup } from "../Controller/userAuthController.js";
import fetchUser from "../Middleware/fetchUser.js";
const router = Router();


router.post("/signup",signup);
router.post("/login",login);
router.delete("/deleteuser",fetchUser,deleteuser)

export default router;