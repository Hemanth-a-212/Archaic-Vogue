import React from 'react'
import './Footer.css'
import logo from '../Assets/logo.png'
import instagram_icon from "../Assets/instagram-icon.png"
import facebook_icon from '../Assets/facebook-icon.png'
import pinterest_icon from "../Assets/pinterest-icon.png";
const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={logo} alt="logo" />
        <p>Archaic Vogue</p>
      </div>
        <ul className='footer-links'>
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="social-icon-cont"><img src={facebook_icon} alt="" /></div>
            <div className="social-icon-cont"><img src={instagram_icon} alt="" /></div>
            <div className="social-icon-cont"><img src={pinterest_icon} alt="" /></div>
        </div>
        <div className="footer-copyright">
            <hr/>
            <p>Copyright @ 2024 - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
