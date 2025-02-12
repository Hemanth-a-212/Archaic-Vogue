import db from "../Config/db.js";

const addtocart = async(req,res)=>{
    let {id}=req.user;
    let {itemId}=req.body;
    let userData = await db.query("SELECT * FROM users WHERE id=$1",[id]);
    let {cartdata}=userData.rows[0];
    cartdata[itemId]+=1;
    await db.query("UPDATE users SET cartdata = $1 WHERE id = $2",[cartdata,id]);
    console.log("Added",itemId);
}

const removefromcart = async(req,res)=>{    
    let {id}=req.user;
    let {itemId}=req.body;
    let userData = await db.query("SELECT * FROM users WHERE id=$1",[id]);
    let {cartdata}=userData.rows[0];
    if(cartdata[itemId]>0){
        cartdata[itemId]-=1;
    }
    await db.query("UPDATE users SET cartdata = $1 WHERE id = $2",[cartdata,id]);
    console.log("Removed",itemId);
}

const getcart = async(req,res)=>{
    let {id}=req.user;
    let userData = await db.query("SELECT * FROM users WHERE id = $1 ",[id])
    let {cartdata}=userData.rows[0];
    res.json(cartdata);
}

export {addtocart,removefromcart,getcart};