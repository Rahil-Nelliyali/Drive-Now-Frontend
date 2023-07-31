import React from 'react';
import carRentalImage from '../../images/Banner.jpg';
import './Banner2.css'; 

function Banner() {
  return (
    <>
      <div className='cool-banner-container'>
        <div className='cool-banner-content'>
          <h1 className='cool-banner-title'>Unleash Your Journey</h1>
          <p className='cool-banner-description'>
          Embark on a seamless and thrilling journey with our extensive range of vehicles.
          </p>
          <button className='cool-explore-btn'>Explore Now</button>
        </div>
        <div className='cool-banner-image'>
          <img src={carRentalImage} alt='Car Rental' />
        </div>
      </div>
    </>
  );
}

export default Banner;
