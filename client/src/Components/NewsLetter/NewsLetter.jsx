import React from 'react'
import './NewsLetter.css'
const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <div className="inner-nl">
      <h1>Unlock the Secrets of Timeless Elegance</h1>
      <p>Join our exclusive circle and receive updates on the mysteries of dark academia.</p>
      <div className='nl-email'>
        <input type="email" placeholder='Enter your email id' />
        <button>Subscribe</button>
      </div>
      </div>
    </div>
  )
}

export default NewsLetter
