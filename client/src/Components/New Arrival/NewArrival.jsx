import React, { useEffect, useState } from 'react'
import Items from '../Items/Item'
import './NewArrival.css'

const NewArrival = () => {
  const [new_arrival,setNew_arrival]=useState([]);
  useEffect(()=>{
    fetch("http://localhost:5000/newarrival")
    .then((res)=>res.json())
    .then((data)=>setNew_arrival(data))
  },[])
  return (
    <div className='new-arrival'>
      <h1>New Arrival</h1>
      <hr />
      <div className="new-items">
      {new_arrival.map((item,i)=>{
        return <Items key={i} id={item.id} star={item.star} image={item.image} name={item.name} price={item.price} />
      })}
      </div>  
    </div>
  )
}

export default NewArrival
