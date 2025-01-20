import React from 'react'
import './Bc.css';
import arrow from "../Assets/arrow.png";

const Bc = (props) => {
    const {product} =props;
  return (
    <div className='bc'>
      <p>Home <img src={arrow} alt="" /> {product.category} <img src={arrow} alt="" />{product.name}</p> 
    </div>
  )
}

export default Bc
