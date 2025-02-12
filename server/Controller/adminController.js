import db from "../Config/db.js";

const addproduct = async(req,res)=>{
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
    
}

const removeproduct = async(req,res) => {
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
}

const allproducts = async(req,res)=>{
    try {
        const all_products = await db.query("SELECT * FROM product");
        res.json(all_products.rows);
    } catch (err) {
        console.error("Error fetching products:",err.message);
        res.status(500).json({success:0,message:'Failed to fetch products'})
    }
}

export {addproduct,removeproduct,allproducts}