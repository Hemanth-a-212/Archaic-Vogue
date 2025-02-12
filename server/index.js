import express from 'express'
import cors from 'cors'
import userRouter from './Route/userAuthRoute.js'
import uploadRoute from "./Route/uploadRoute.js"
import adminRoute from "./Route/adminRoute.js"
import db from "./Config/db.js"
import fetchUser from './Middleware/fetchUser.js'
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

app.get('/',(req,res)=>{res.send("Konichiwa")});

app.use("/api/user",userRouter);

app.use("/api/admin",adminRoute);

app.use('/images',express.static("./upload/images"));

app.use("/api",uploadRoute)

// API for adding user details

// API for new Arrival

app.get('/newarrival',async (req,res)=>{
    let prod = await db.query("SELECT * FROM product")
    let new_arrival = prod.rows.slice(-8);
    res.send(new_arrival)
})

// API for trending in decor

app.get("/trendingdecor",async(req,res)=>{
let prod = await db.query("SELECT * FROM product WHERE category = $1",["decor"]);
let trendingdecor = prod.rows.slice(0,4);
res.send(trendingdecor);
})

//add prod from cartdata

app.post("/addtocart",fetchUser,async(req,res)=>{
    let {id}=req.user;
    let {itemId}=req.body;
    let userData = await db.query("SELECT * FROM users WHERE id=$1",[id]);
    let {cartdata}=userData.rows[0];
    cartdata[itemId]+=1;
    await db.query("UPDATE users SET cartdata = $1 WHERE id = $2",[cartdata,id]);
    console.log("Added",itemId);
})

//delete user 
//remove prod from  cartdata

app.post("/removefromcart",fetchUser,async(req,res)=>{    
    let {id}=req.user;
    let {itemId}=req.body;
    let userData = await db.query("SELECT * FROM users WHERE id=$1",[id]);
    let {cartdata}=userData.rows[0];
    if(cartdata[itemId]>0){
        cartdata[itemId]-=1;
    }
    await db.query("UPDATE users SET cartdata = $1 WHERE id = $2",[cartdata,id]);
    console.log("Removed",itemId);
})  

//get cartdata
app.get("/getcart",fetchUser,async(req,res)=>{
    let {id}=req.user;
    let userData = await db.query("SELECT * FROM users WHERE id = $1 ",[id])
    let {cartdata}=userData.rows[0];
    res.json(cartdata);
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Server is running" });
});


app.listen(port,(err)=>{
    if(!err){
        console.log(`Server running at port ${port}`);
    }else{
        console.log(`Error: ${err}`);
    }
})
