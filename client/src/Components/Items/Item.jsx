import React from 'react'
import './Item.css'
import {Link} from 'react-router-dom'

const Item = (props) => {
    return (
      
      <div className='item'>
        <Link to={`/product/${props.id}`}><img className='prod-image' onClick={window.scrollTo(0,0)} src={props.image} alt=''/></Link>
        <div className="item-info">
            <p>{props.name}</p>
            <img src={props.star} alt="" />
            <div className="item-price">₹ {props.price}</div>
        </div>
      </div>
      
    )
  }
  
  export default Item;
