import React from 'react';
import { Link } from 'react-router-dom';
import vintage from '../../images/vintage.jpg';
import vintage2 from '../../images/vintage2.jpg';
import vintage3 from '../../images/vintage3.jpg';
import './Card.css'; // Create a CSS file for custom styles

function VintageCard({ image, name }) {
  return (
    <div className="vintage-card">
      <div className="card-image-container">
        <img src={image} alt={name} className="card-image" />
      </div>
      <div className="card-body text-center">
        <h4 className="card-name">
          <Link to="#" className="text-blue-gray">
            {name}
          </Link>
        </h4>
      </div>
      
    </div>
  );
}

export default function Card() {
  return (
    <div className="vintage-card-container">
      <p className="vintage-card-title">Explore Our Vintage Side</p>
      <div className="flex items-center mt-11 justify-center">
        <VintageCard image={vintage} name="Giorgio Trovato" />
        <VintageCard image={vintage2} name="Dan Gold" />
        <VintageCard image={vintage3} name="Oli WoodMan" />
      </div>
    </div>
  );
}
