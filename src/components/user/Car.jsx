import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import img from '../../images/avatar.png';
import notfound from '../../images/notfound.gif';
import instance,  { BASE_URL } from '../../utils/axios';
import {  AiOutlineEnvironment } from 'react-icons/ai';

import './loader.css';
function Car() {
  const [cars, setCars] = useState([]);
  const [load, setLoad] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');


  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await instance.get('/cars/home-list-locations/'); // Adjust the endpoint accordingly
        setLocations(response.data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    }
    fetchLocations();
  }, []);

  useEffect(() => {
    async function getCars() {
      setLoad(true);
  
      // Simulate a 5-second loading time
      setTimeout(async () => {
        try {
          const response = await instance.get('/cars/home-list-car/');
          setCars(response.data);
        } catch (error) {
          console.error('Failed to fetch cars:', error);
        }
        setLoad(false);
      }, 1000); // 5000 milliseconds = 5 seconds
    }
    
    getCars();
  }, []);
  
  const filteredCars = selectedLocation
    ? cars.filter(car => car.category.name === selectedLocation)
    : cars;

  return (
    <div className='w-full h-full font-poppins relative'>
      <Toaster position='top-center' limit={3} />
      <div className='w-full h-20 flex items-center bg-primaryBlue text-white'>
        <Navbar />
      </div>
      <div className='p-5 w-full h-full min-h-screen'>
        <div className='w-full mt-10'>
        <div className='flex items-center justify-end mb-4'>
        <div className='flex items-center border rounded-lg p-2 bg-gray-100'>
  <AiOutlineEnvironment size={20} className='text-gray-500 mr-2' />
  <select
    value={selectedLocation}
    onChange={handleLocationChange}
    className='bg-transparent text-gray-600 focus:outline-none'
  >
    <option value=''>Select Location</option>
    {locations.map((location) => (
      <option key={location.id} value={location.name}>
        {location.name}
      </option>
    ))}
  </select>
</div>
      
      </div>
          {load ? (
            <div className='flex flex-col items-center justify-center align-center h-full'>
           
            <div class="jelly"></div> </div>
          ) : (
            <>
              
              {filteredCars?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {filteredCars.map(car => (
                    <Link
                      to={`/cardetail/${car?.id}`}
                      className='bg-white shadow-xl rounded-lg p-4 transition-transform transform hover:-translate-y-1'
                      key={car.id}
                    >
                      <img className='w-full h-40 object-cover rounded-md' src={`${BASE_URL}${car.image}`}  alt='car_image' />
                      <div className='mt-4'>
                        <h1 className='text-xl font-semibold text-primaryBlue'>{car?.name}</h1>
                        <p className='text-lg font-semibold text-primaryBlue mt-2'>{car?.price_per_day}</p>
                        <p className='text-gray-600 mt-2'>{car?.category.name}</p>
                       
                        
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center h-full'>
                  <img className='w-1/2' src={notfound} alt='no_results_found' />
                  <p className='text-xl font-semibold text-primaryBlue mt-4'>No matching results found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Car;
