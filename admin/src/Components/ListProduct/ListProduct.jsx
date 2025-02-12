import React, { useEffect, useState } from 'react'
import "./ListProduct.css"
import remove from "../../Assets/remove.png"
import empty from "../../Assets/empty.png"

const ListProduct = () => {

const [allProd,setAllProd]=useState([])  
const [prodInDB,setProdInDB]=useState( )
const url = "https://archaic-vogue-backend.onrender.com";
const fetchprod = async()=>{
  await fetch(url+"/api/admin/allproducts")
   .then((res)=>res.json()) 
   .then((data)=>{setAllProd(data)});
}

useEffect(()=>{
  fetchprod();
},[])

useEffect(()=>{
  if(allProd.length>0){
    setProdInDB(true);
   }else{
    setProdInDB(false)
   }
},[allProd])

const deleteProd = async(id,name)=>{
  let resp;
  await fetch(url+"/api/admin/removeproduct",{
    method:"DELETE",
    headers:{
      Accept:'application/json',
      'Content-Type':"application/json"
    },
    body:JSON.stringify({id:id})
  })
  await fetchprod()
}
  return (prodInDB?(<div className='list-prod'>
      <h1>All Products List</h1>
      <div className="listprod-format">
        <p>Product</p>
        <p>Name</p>
        <p>Price</p>
        <p>Category</p>
      </div>
      <div className="allprod">
        <hr />
        {allProd.map((prod,index)=>{
          return <div key={index} className="listprod-format product-format">
            <img src={prod.image} className="prod-icon" alt="" />
            <p>{prod.name}</p>
            <p>₹ {prod.price}</p>
            <p>{prod.category}</p>
            <img onClick={()=>{deleteProd(prod.id,prod.name)}} src={remove} alt="" className="remove" />
          </div>
        })}
      </div>
    </div>):(
      <div className='no-item'>
        <img src={empty} alt="" />
        <p>No items to be found</p>
      </div>
    )
  )
}

export default ListProduct
