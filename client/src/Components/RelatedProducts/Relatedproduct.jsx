import React from 'react'
import './Relatedproduct.css'
import data_product from '../Assets/data'
import Item from '../Items/Item';
const Relatedproduct = ({category}) => {

  return (
    <div className='related-product'>
      <h1>Related products</h1>
      <hr />
      <div className="related-prod-item">
        {data_product.map((item,i)=>{
            return <Item key={i} id={item.id} image={item.image} name={item.name} price={item.price} />
        })}
      </div>
    </div>
  )
}

export default Relatedproduct
