import React from 'react';
import carImage from '../../images/Banner2.jpg';
import './Banner.css';
import { Link } from 'react-router-dom';

function Banner2() {
  return (
    <>
      <div className='banner-container'>
        <div className='banner-content'>
          <h1 className='banner-title'>Your travel needs, our priority.</h1>
          <p className='banner-description'>
          Explore our fleet of top-notch vehicles for the journey of a lifetime. From scenic getaways to business travels, we have the keys to unforgettable experiences. Start your adventure now!
          </p>
          <Link to='/home-list-car' className='explore-btn'>Book Now</Link>
        </div>
        <div className='banner-image'>
          <img src={carImage} alt='Car Rental' />
        </div>
      </div>
    </>
  );
}

export default Banner2;
