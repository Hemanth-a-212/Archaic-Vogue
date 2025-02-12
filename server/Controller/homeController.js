import db from "../Config/db.js";


const newarrival = async (req,res)=>{
    let prod = await db.query("SELECT * FROM product")
    let new_arrival = prod.rows.slice(-8);
    res.send(new_arrival)
}

const trendingdecor = async(req,res)=>{
let prod = await db.query("SELECT * FROM product WHERE category = $1",["decor"]);
let trendingdecor = prod.rows.slice(0,4);
res.send(trendingdecor);
}

export {newarrival,trendingdecor}