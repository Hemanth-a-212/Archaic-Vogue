import React from 'react'
import './Navbar.css'
import navlogo from "../../Assets/logo2.png"
import profile from "../../Assets/profile.png" 
const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="nav-logo">
      <img src={navlogo} alt="logo"/>
      </div>
      <div className="nav-profile">
        <img src={profile} alt="" />
      </div>
    </div>
  )
}

export default Navbar
