import React, { useEffect, useState } from 'react'
import './Trending.css'
import Item from '../Items/Item'


const Trending = () => {
  const [trendingDecor,setTrendingDecor]=useState([]);

  useEffect(()=>{
    fetch("http://localhost:5000/trendingdecor")
    .then((res)=>res.json())
    .then((data)=>setTrendingDecor(data))
  },[])
  return (
    <div className='trending'>
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
