import express from 'express'
import cors from 'cors'
import userRouter from './Route/userAuthRoute.js'
import uploadRoute from "./Route/uploadRoute.js"
import adminRoute from "./Route/adminRoute.js"
import homeRoutes from "./Route/homeRoutes.js"
import cartRoutes from "./Route/cartRoutes.js"
import "dotenv/config"

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
    "https://archaic-vogue-frontend.onrender.com",
    "https://archaic-vogue-admin.onrender.com"
];

//Middleware
app.use(express.json());

app.use(cors({origin: (origin,callback)=>{
    if(!origin||allowedOrigins.includes(origin)){
        callback(null,true);
    }else{
        callback(new Error("Not allowed by CORS"));
    }
} }));

//Routes

app.get('/',(req,res)=>{res.send("Konichiwa")});

app.use("/api/user",userRouter);

app.use("/api/admin",adminRoute);

app.use('/images',express.static("./upload/images"));

app.use("/api",uploadRoute);

app.use("/api/home",homeRoutes);

app.use("/api/cart",cartRoutes);

app.get("/health", (req, res) => {res.status(200).json({ status: "UP", message: "Server is running" });});

app.listen(port,(err)=>{!err ? console.log(`Server running at port ${port}`) : console.log(`Error: ${err}`)});
