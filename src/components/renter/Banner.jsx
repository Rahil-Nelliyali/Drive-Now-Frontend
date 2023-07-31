import React from 'react';
import bannerImage from '../../images/sellerbanner.jpg'; // Replace this with the actual image URL or import the image
import './Banner.css'; // Import the CSS file for the Banner component
import { Link} from 'react-router-dom';

const Banner = () => {
  return (
    <div className="custom-banner relative w-full h-screen">
      {/* Banner Image */}
      <img
        src={bannerImage}
        alt="Banner"
        className="custom-banner-image"
      />

      {/* Overlay */}
      <div className="custom-banner-overlay absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>

      {/* Content */}
      <div className="custom-banner-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <h1 className="custom-banner-heading text-4xl font-semibold mb-4">Welcome to Your Seller Dashboard</h1>
        <p className="custom-banner-text text-lg">Start managing your car listings and bookings now!</p>
        <Link to="/carrenter" className="custom-banner-button px-6 py-3 mt-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Get Started
      </Link>
      </div>
    </div>
  );
};

export default Banner;
