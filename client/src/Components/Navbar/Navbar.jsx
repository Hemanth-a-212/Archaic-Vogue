import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
import { webContext } from '../../Context/webContext';
import user_icon from "../Assets/user.png"
import ham_menu from '../Assets/ham_menu.png'
function Navbar(){
   const [menu,setmenu]=useState("");
   const [isMenuOpen,setIsMenuOpen]=useState(false);
   const [isUserOpen,setIsUserOpen] = useState(false);
   const [confirm,setConfirm]=useState(false)
   const {totalItemsInCart}=useContext(webContext);
   const menuRef = useRef();
   const user_ref=useRef();
   const url = "https://archaic-vogue-backend.onrender.com";
   const toggleMenuDropdown = ()=>{
      setIsMenuOpen(p => !p);
   }

   useEffect(()=>{
      const handleClickOutside = (e)=>{
            if(menuRef.current && !menuRef.current.contains(e.target)){
               setIsMenuOpen(false);
            }
            if(user_ref.current && !user_ref.current.contains(e.target)){
               setIsUserOpen(false);
            }
         
      }
      document.addEventListener("mousedown",handleClickOutside);
      return ()=>{
         document.removeEventListener("mousedown",handleClickOutside);
      }
   },[])

   const itemClicked = () => {
      setIsMenuOpen((prev)=> !prev);
   }

   const delAccPopup = async()=>{
      fetch(url+"/api/user/deleteuser",{
         method:"DELETE",
         headers:{Accept:"application/form-data","auth-token":`${localStorage.getItem("auth-token")}`,"Content_type":"application/json"},
         body:""
      });
      localStorage.removeItem("auth-token");
      window.location.replace('/')
   }

   const closePopUp = ()=>{
      setConfirm(false);
      document.documentElement.classList.remove("no-scroll");
   }

     return (<>
      <div className={confirm?'del-confirm del-confirm-visible':"del-confirm"}>
      <div>
      <p>Are you sure you wanna delete your account?</p>
      <div className="btn-cont">
         <button onClick={delAccPopup}>Yes</button>
         <button onClick={closePopUp}>cancel</button>
      </div>
      </div>
</div>
        <div className='navbar'>
         <div className="nav-logo">
         <Link to='/'><img src={logo} alt="logo" onClick={()=>{setmenu("home")}}/></Link>
         <Link to='/' style={{textDecoration:'none'}}><p onClick={()=>{setmenu("home")}}>Archaic Vogue</p></Link>
         </div >
         <div ref={menuRef} >
         <img  className="nav-drop-icon" onClick={toggleMenuDropdown} src={ham_menu} alt="" />   
         <div className={`nav-dropdown ${isMenuOpen && "nav-menu-visible"}`}>
            <ul  className="nav-menu">
               <Link to='/' style={{textDecoration:'none',color:'#572617'}}><li onClick={()=>{itemClicked();setmenu("home");}}>HOME {menu==="home"?<hr/>:""}</li></Link>
               <Link to='/men' style={{textDecoration:'none',color:'#572617'}}><li onClick={()=>{itemClicked();setmenu("men")}}>MEN {menu==="men"?<hr/>:""}</li></Link>
               <Link to='/women' style={{textDecoration:'none',color:'#572617'}}>  <li onClick={()=>{itemClicked();setmenu("women")}}>WOMEN {menu==="women"?<hr/>:""}</li></Link>
               <Link to='/decor' style={{textDecoration:'none',color:'#572617'}}>  <li onClick={()=>{itemClicked();setmenu("decor")}} >ROOM DECOR {menu==="decor"?<hr/>:""}</li></Link>
            </ul>
            <div ref={user_ref} className="nav-login-cart">
               {localStorage.getItem("auth-token")?
               <><div><img className='user-icon' src={user_icon} alt="" onClick={()=>setIsUserOpen((prev) => !prev)} />
               <div><Link style={{textDecoration:"none"}} to='/cart'><img src={cart_icon} alt="Cart icon" onClick={()=>{itemClicked();setmenu("cart")}}/></Link>
               {totalItemsInCart()?<div className="cart-item-count">{totalItemsInCart()}</div>:""}</div>
               </div>
               <div  className={`user-menu-dropdown ${isUserOpen && "user-menu-visible"}`}>
                  <p className="deleteAcc" onClick={()=>{setIsUserOpen(false);setConfirm(true);document.documentElement.classList.add("no-scroll")}}>Delete Account</p>
                  <button onClick={()=>{localStorage.removeItem("auth-token");window.location.replace('/')}}>Log Out</button>
               </div>
               </>
               :
                <Link to='/login'style={{textDecoration:"none"}}><button onClick={()=>{itemClicked();setmenu("login")}}>Login / Sign up</button></Link>} 
               
            </div>
         </div>   
         </div>
        </div></>
     )
}
export default Navbar;