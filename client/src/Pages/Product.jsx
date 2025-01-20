import React, { useContext } from 'react'
import { webContext } from '../Context/webContext'
import { useParams } from 'react-router-dom';
import Bc from '../Components/Bc/Bc';
import ProdDisplay from '../Components/ProdDisplay/ProdDisplay';
import Description from '../Components/Description/Description';
import Relatedproduct from '../Components/RelatedProducts/Relatedproduct';
import './css/Product.css';


const Product = () => {
  const {all_product}=useContext(webContext);
  const {productId}= useParams();
  const product = all_product.find( (e) => e.id === Number(productId));
  return (
    <div className='product'>
      <Bc product= {product} />
      <ProdDisplay product={product} />
      <Description/>
      <Relatedproduct/>
    </div>
  )
}

export default Product
