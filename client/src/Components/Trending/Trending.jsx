import React, { useEffect, useState } from 'react'
import './Trending.css'
import Item from '../Items/Item'


const Trending = () => {
  const [trendingDecor,setTrendingDecor]=useState([]);
  const url = "https://archaic-vogue-backend.onrender.com";
  useEffect(()=>{
    fetch(url+"/api/home/trendingdecor")
    .then((res)=>res.json())
    .then((data)=>setTrendingDecor(data))
  },[])
  return (
    <div className='trending' id='products-section'>
      <h1>Trending in Decor</h1>
      <hr />
      <div className="trending-decor">
      {trendingDecor.map((item,i)=>{
        return <Item key={i} id={item.id} image={item.image} star={item.star} name={item.name} price={item.price} />
        })}
      </div>
    </div>
  )
}

export default Trending
