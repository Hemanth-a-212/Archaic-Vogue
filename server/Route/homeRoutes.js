import { Router } from "express";
import { newarrival,trendingdecor } from "../Controller/homeController.js";
const router = Router()

router.get('/newarrival',newarrival);
router.get("/trendingdecor",trendingdecor);

export default router;