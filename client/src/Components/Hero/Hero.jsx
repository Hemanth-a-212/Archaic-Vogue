import React from 'react'
import './Hero.css'
import right_arrow_icon from '../Assets/right_arrow_icon_hero.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-outer">
        <div className="hero-inner">
            <h2 className='hero-head'>A wardrobe of timeless elegance,</h2>
            <p className='hero-intro'>Between the pages, woven in rhyme,<br/>
             A style that echoes through endless time.<br/>
             Classic and quiet, in every seam,<br/>
             For those who live beyond the dream.</p>
            <button className='hero-btn'>
              <div>SHOP NOW</div>
              <img src={right_arrow_icon} alt="" />
            </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
