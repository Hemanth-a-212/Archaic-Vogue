import express from 'express'
import cors from 'cors'
import userRouter from './Route/userAuthRoute.js'
import uploadRoute from "./Route/uploadRoute.js"
import db from "./Config/db.js"
import fetchUser from './Middleware/fetchUser.js'
import "dotenv/config"

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());

app.use(cors({origin: "https://archaic-vogue-frontend.onrender.com"}));

app.use("/api/user",userRouter);

app.use('/images',express.static("./upload/images"));

app.get('/',(req,res)=>{res.send("Konichiwa")});

app.use("/api",uploadRoute)
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
