import React, { useContext } from 'react'
import './Cartitem.css'
import { webContext } from '../../Context/webContext'
import remove from '../Assets/remove.png'
const Cartitem = () => {
    const {getTotalCartamount,all_product,cartItems,removefromCart}=useContext(webContext);
  return (
    <div className='cart'>
        <h1>Shopping Cart</h1>
      <div className="cartitem-format">
        <p className='heading'>Product</p>
        <p className='heading'>Name</p>
        <p className='heading'>Price</p>
        <p className='heading'>Qty</p>
        <p className='heading'>Total</p>
      </div>
      <hr />
        {all_product.map((e)=>{
            if(cartItems[e.id]>0){
                return <div className='item-in-cart'>
                            <div className="cartitem-format">
                                <img src={e.image} alt="" className='prod-icon record' />
                                <p className='record'>{e.name}</p>
                                <p className='record'>₹ {e.price}</p>
                                <div className='record'>{cartItems[e.id]}</div>
                                <p className='record'>₹ {e.price*cartItems[e.id]}</p>
                                <div className='record'><img src={remove} onClick={()=>{removefromCart(e.id)}} alt="" className='remove-icon'/></div>
                            </div>
              </div>
            }
            return null;
        })}
        <hr className='median-line'/>
        <div className="cart-total-cont">
        <div className="cartitem-promocode">
                <p>
                Add a gift card or promotion code</p>
                <div className="promobox">
                    <input type="text" placeholder='Promo code'/>
                    <button>Submit</button>
                </div>
            </div>
            <div className="total">
                <h1>Cart Total</h1>
                <div>
                    <div className="cart-total-item">
                        <p>Subtotal</p>
                        <p>₹ {getTotalCartamount()}</p>
                    </div>
                    <hr />
                    <div className="cart-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div><hr />
                    <div className="cart-total-item">
                        <h3>Total</h3>
                        <h3>₹ {getTotalCartamount()}</h3>
                    </div><hr />
                </div>
                <button>Proceed to checkout</button>
            </div>
            
        </div>
    </div>
  )
}

export default Cartitem
