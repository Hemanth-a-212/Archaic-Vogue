import express from 'express'
import pg from 'pg'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import bcrypt from "bcrypt"

const app = express();
const port = 5000;

//Middleware
app.use(express.json());
app.use(cors());

//database connection 
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"archaic_vogue",
    password:"Hemanth@0201",
    port:5432
});

db.connect( err =>{
    if(err){
        console.error("Error connecting to database:",err.message);
        process.exit(1);
    }
    console.log("Database connected successfully")
}); 
 
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
    console.log("Konichiwa");
})

// image upload route

app.post("/upload",upload.single('product'),(req,res)=>{
    console.log(req.file);
    try {
        if(!req.file){
            return res.status(400).json({success:0,message:"File not uploaded"});
        }
        return res.json({success:1, image_url:`http://localhost:${port}/images/${req.file.filename}`})
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

app.post("/signup",async(req,res)=>{
    let {email,password,name}=req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if(result.rows.length>0)
            return res.status(400).json({success:false, errors:'Email already exists'});

        let hashedpassword =await bcrypt.hash(password,12);

        let cart = {}
        for(let i=0;i<300;i++){
            cart[i]=0;
        }

        const insertEmail = await db.query("INSERT INTO users (name,email,password,cartdata) VALUES ($1, $2, $3, $4) RETURNING *",[name,email,hashedpassword,JSON.stringify(cart)]);

        const newUser = insertEmail.rows[0]

        const data = {user:{id:newUser.id}};
        const token = jwt.sign(data,"secret_key_ecom");
       
        return res.status(201).json({ success:true,token}); 

    } catch (err) {
        console.error("Error duting signup: ",err);
        return res.status(500).json({success:false, message: 'Server error' });
    }

});

//Login

app.post("/login",async(req,res)=>{
    try {
        let {email,password} = req.body; 
        const user = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(user.rows.length>0){
          const match = await bcrypt.compare(password,user.rows[0].password);
          if(match){
            const data = {user:{id:user.rows[0].id}}
            const token = jwt.sign(data,"secret_key_ecom")
            res.json({success:true,token})
          }else{
            res.json({success:false,errors:"Wrong Password"})
          }
        }
        else{
            res.json({success:false,errors:"Email Doesn't Exist"})
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Internal server error");
    }
   
})

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

//middleware to fetch user
const fetchUser =async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error:"please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,"secret_key_ecom");
            req.user=data.user;
            next();
        } catch (err) {
            res.status(401).send({error:"please authenticate using valid token"})
        }
    }
}

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

app.delete("/deleteuser",fetchUser, async(req,res)=>{
    let {id}=req.user;
    let deleted_user = await db.query("DELETE FROM users WHERE id = $1 RETURNING *",[id])
    if(!deleted_user){
        res.status(401).send("Error deleting user data");
    }
})

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
