import React, { useContext } from 'react';
import { webContext } from '../Context/webContext';
import './css/Category.css';
import banner from "../Components/Assets/banner"
import Item from '../Components/Items/Item';

const Category = (props) => {
  const {all_product}=useContext(webContext);
  return (
    <div className='category'>
      {banner.map((item)=>{
        if (props.category === item.category){
          return (<div className="banner">
              <div className="banner-left">
                 <h2>{item.caption}</h2>
                </div>
                <div className="banner-right">
                <img src={item.image} alt="" />
               </div>
               </div>);
            }else{
              return null;
            }
            })}
        
      <div className="category-prod">
        {all_product.map((item,i)=>{
            if(props.category === item.category){
              return <Item key={i} id={item.id} star={item.star} image={item.image} name={item.name} price={item.price} />
            }else{
              return null;
            }
        })}
      </div>
      <div className='explore-more'>
        Explore More
      </div>
    </div>
  )
}

export default Category
