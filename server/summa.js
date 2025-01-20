import express from 'express'
import pg from 'pg'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { type } from 'os'

const app = express();
const port = 5000;

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
    res.send("Konichiwa");
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
        res.status(500),json({success:0,message:"Internal server error"});
    }
});
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    date:{
        type: Date,
        default:Date.now()
    },
    Availabele:{
        type: Boolean,
        default: true
    },
})
app.post("/addproduct",async (req,res)=>{
    const product= new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        price:req.body.price
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name
    })
})

app.post("/removeproduct",async ()=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All product fetched");
    res.send(products);
})

////////////////////////////////////////////

const Users=mongoose.model('Users',{
    name:{
        type:String
    }
    email:{
        type:String,
        unique:true
    }
    password:{
        type:String
    }
    cartdata:{
        type:object
    },
    date:{
        type:Date,
        DEFAULT:Date.now
    }
})
app.post("/signup",async(req, res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"Error da"})
    }
    let cart = {};
    for (let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartdata:cart
    }) 

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

    })

app.listen(port,(err)=>{
    if(!err){
        console.log(`Server running at port ${port}`);
    }else{
        console.log(`Error: ${err}`);
    }
})