import { generateToken } from "../Util/jwt.js";
import db from "../Config/db.js";
import { hashPassword , comparePassword } from "../Util/hash.js";

const signup =  async(req,res)=>{
    let {email,password,name}=req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1",[email]);

        if(result.rows.length>0)
            return res.status(400).json({success:false, message:'Email already exists'});

        let hashedpassword =await hashPassword(password);

        let cart = {}
        for(let i=0;i<300;i++){
            cart[i]=0;
        }

        const insertEmail = await db.query("INSERT INTO users (name,email,password,cartdata) VALUES ($1, $2, $3, $4) RETURNING *",[name,email,hashedpassword,JSON.stringify(cart)]);

        const newUser = insertEmail.rows[0]
        const data = {id:newUser.id}
        const token = generateToken(data);
       
        return res.status(201).json({ success:true,token}); 

    } catch (err) {
        console.error("Error during signup: ",err);
        return res.status(500).json({success:false, message: 'Server error' });
    }

}

const login = async(req,res)=>{
    try {
        let {email,password} = req.body; 
        const user = await db.query("SELECT * FROM users WHERE email = $1",[email]);
        if(user.rows.length>0){
          const match = await comparePassword(password,user.rows[0].password);
          if(match){
            const data = {id:user.rows[0].id}
            const token =  generateToken(data);
            res.json({success:true,token})
          }else{
            res.status(500).json({success:false,message:"Wrong Password"})
          }
        }
        else{
            res.json({success:false,message:"Email Doesn't Exist"})
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({success:false, message: 'Server error' });
    }
   
}

const deleteuser = async(req,res)=>{
    let {id}=req.user;
    let deleted_user = await db.query("DELETE FROM users WHERE id = $1 RETURNING *",[id])
    if(deleted_user){
        res.status(201).json({success:true,message:"Deleted user successfully"});
    }else{
        res.status(401).json ({success:false});
    }
}

export {login,signup,deleteuser}