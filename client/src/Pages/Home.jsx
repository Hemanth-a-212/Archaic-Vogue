import React from 'react'
import Hero from '../Components/Hero/Hero'
import Trending from '../Components/Trending/Trending'
import NewArrival from '../Components/New Arrival/NewArrival'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import './css/Home.css'

const Home = () => {
  return (
    <div className='home'>
      <Hero/>
      <Trending/>
      <NewArrival/>
      <NewsLetter/>
    </div>
  )
}

export default Home
