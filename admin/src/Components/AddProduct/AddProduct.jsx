import React, { useState } from 'react'
import './AddProduct.css'
import upload_img from "../../Assets/upload_image.png"

const AddProduct = () => {
  const [img,setImg]=useState(false);
  const [productDetails,setProductDetails]=useState({
    name:"",
    image:"",
    category:"men",
    price:"",
  });

  const imgHandle = (e) =>{
    setImg(e.target.files[0]);
  }

  const change = (e)=>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }

  const addProduct = async()=>{
    
   let responseData;
   let product=productDetails;
   let formData=new FormData();
   formData.append("product",img);

   await fetch('http://localhost:5000/upload',{
    method:"POST",
    headers:{Accept:'application/json'},
    body: formData
   }).then((res)=>res.json()).then((data)=>{responseData=data});

   if(responseData.success){
    product.image=responseData.image_url;
    await fetch("http://localhost:5000/addproduct",{
      method:"POST",
      headers:{
        Accept:'application/json',
        'Content-Type':"application/json"
      },
      body:JSON.stringify(product)
    }).then((res)=>res.json()).then((data)=>{
      data.success?"":alert("Failed")
      setProductDetails({
        name:"",
        image:"",
        category:"men",
        price:"",
      })
      setImg((p)=>!p)
    })
  }
  }
  return (
    <div className='add-prod'>
      <div className="item-field">
        <p>Product title</p>
        <input value={productDetails.name} onChange={change} type="text" name='name' placeholder='Enter here' />
      </div>
      <div className="item-field">
        <p>Price</p>
        <input value={productDetails.price} onChange={change} type="text" name='price' placeholder='Enter here' />
      </div>
      <div className="item-field">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={change} name="category" className='category-selector'>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="decor">Decor</option>
        </select>
      </div>
      <div className="item-field">
            <div>
            <label htmlFor="file-input">
            <img src={img?URL.createObjectURL(img):upload_img} className='thumbnail' alt="" />
            </label>
            </div>
        <input onChange={imgHandle} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={addProduct} className='btn'>ADD</button>
    </div>
  )
}

export default AddProduct
