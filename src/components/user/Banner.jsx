import React from 'react';
import carRentalImage from '../../images/Banner3.jpg';
import './Banner2.css'; 
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <>
      <div className='cool-banner-container'>
        <div className='cool-banner-content'>
          <h1 className='cool-banner-title'>Unleash Your Journey</h1>
          <p className='cool-banner-description'>
          Embark on a seamless and thrilling journey with our extensive range of vehicles.
          </p>
          <Link to='/home-list-car' className='cool-explore-btn'>Explore Now</Link>
        </div>
        <div className='cool-banner-image'>
          <img src={carRentalImage} alt='Car Rental' />
        </div>
      </div>
    </>
  );
}

export default Banner;
