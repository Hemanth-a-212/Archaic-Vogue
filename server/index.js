import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import userRouter from './Route/userAuthRoute.js'
import db from "./Config/db.js"
import fetchUser from './Middleware/fetchUser.js'
import "dotenv/config"

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors({origin: "https://archaic-vogue-frontend.onrender.com"}));

app.use("/api/user",userRouter)

const uploadDir = './upload/images';
if(!fs.existsSync(uploadDir)){
    fs.makdirSync(uploadDir);
}

// image storage 

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        return cb(null,uploadDir) ;
    },
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage});

app.use('/images',express.static(uploadDir));

//API 

app.get('/',(req,res)=>{
    res.send("Konichiwa");
})

// image upload route

app.post("/upload",upload.single('product'),(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({success:0,message:"File not uploaded"});
        }
        return res.json({success:1, image_url:`https://archaic-vogue-backend.onrender.com/images/${req.file.filename}`})
    } catch (err) {
        console.error("Error during file upload",err.message);
        res.status(500).json({success:0,message:"Internal server error"});
    }
});

app.post('/addproduct', async(req,res)=>{
    const {name,image,category,price} = req.body;
    try {
        const added_item = await db.query(`INSERT INTO product (name,image,category,price)
        VALUES ($1,$2,$3,$4) RETURNING *`,[name,image,category,price]);
        res.status(201).json({
            success:true,
            product:added_item.rows[0]
        });
    } catch (err) {
        console.error("Error adding product:",err.message);
        res.status(500).json({
            success:false,
            product:"Failed to add product"
        });
    }
    
});

app.delete("/removeproduct", async(req,res) => {
    const {id}=req.body;
    try {
        const removed_item = await db.query("DELETE FROM product WHERE id = $1 RETURNING*",[id]);
        if(removed_item.rowCount===0){
            res.status(404).json({success:false,message:"The product not found"})
        } 
        res.json({
            success:true,
            product:removed_item.rows[0]
        })
        
    } catch (err) {
        console.error("Error removing product",err.message)
        res.status(500).json({success:false,message:"Failed to remove product"});
    }
})

app.get('/allproducts',async(req,res)=>{
    try {
        const all_products = await db.query("SELECT * FROM product");
        res.json(all_products.rows);
    } catch (err) {
        console.error("Error fetching products:",err.message);
        res.status(500).json({success:0,message:'Failed to fetch products'})
    }
})

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
app.post("/getcart",fetchUser,async(req,res)=>{
    let {id}=req.user;
    let userData = await db.query("SELECT * FROM users WHERE id = $1 ",[id])
    let {cartdata}=userData.rows[0];
    res.json(cartdata);
})

app.listen(port,(err)=>{
    if(!err){
        console.log(`Server running at port ${port}`);
    }else{
        console.log(`Error: ${err}`);
    }
})
