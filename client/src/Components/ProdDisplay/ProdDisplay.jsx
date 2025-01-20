import React, { useContext} from 'react'
import './ProdDisplay.css'
import { webContext } from '../../Context/webContext';

const ProdDisplay = (props) => {
    const {product}=props;
    const {addToCart}=useContext(webContext)
  return (
    <div className='productdisplay'>
        <div className="prodleft">
            <img className='prodimg' src={product.image} alt="" />
        </div>
        <div className="prodright">
            <h1>{product.name}</h1>
            <div className="rating">
                <img src={product.star} alt="" />
                <p>()</p>
            </div>
            <h2>₹{product.price}</h2>
            <div className='description'>
            Timeless elegance meets scholarly charm—where muted tones, vintage textures, and intellectual vibes define your style
        </div>
        {product.category==="decor"?"":<div className="select-size">
            <p>Select Size</p>
            <div className="size-cont">
                <div className="size">S</div>
                <div className="size">M</div>
                <div className="size">L</div>
                <div className="size">XL</div>
                <div className="size">XXL</div>
            </div>
        </div>}
    <button className='add-to-cart' onClick={() => {addToCart(product.id)}}>ADD TO CART</button>

        </div>
       
    </div>
  )
}

export default ProdDisplay
