import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import instance from '../../utils/axios';

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCarDetails() {
      try {
        const response = await instance.get(`/cars/single-car/${id}/`);
        setCar(response.data);
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      }
      setLoading(false);
    }
    getCarDetails();
  }, [id]);

  return (
    <div className='w-full h-full font-poppins relative'>
      <Toaster position='top-center' limit={3} />
      <div className='w-full h-20 flex items-center bg-primaryBlue text-white'>
        <Navbar />
      </div>
      <div className='p-5 w-full h-full min-h-screen'>
        {loading ? (
          <h1 className='text-3xl font-bold text-center text-primaryBlue'>Loading...</h1>
        ) : car ? (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='relative group'>
              <img className='w-full h-screen object-cover rounded-md' src={car.image} alt='car_image' />
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <h1 className='text-4xl font-semibold text-white'>{car.name}</h1>
                <p className='text-xl font-normal text-gray-300 mt-2'>{car.category.name}</p>
              </div>
            </div>
            <div className='mt-4'>
              <h1 className='text-3xl font-semibold text-primaryBlue'>{car.name}</h1>
              <p className='text-gray-600 mt-2'>{car.description}</p>
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div>
                  <p className='text-gray-600'>Price Per Day: {'₹ ' + car.price_per_day}</p>
                  <p className='text-gray-600'>Brand: {car.brand}</p>
                  <p className='text-gray-600'>Year Manufactured: {car.year_manufactured}</p>
                  <p className='text-gray-600'>Mileage: {car.mileage}</p>
                  <p className='text-gray-600'>Fuel Type: {car.fuel_type}</p>
                  <p className='text-gray-600'>Transmission Type: {car.transmission_type}</p>
                  <p className='text-gray-600'>Seating Capacity: {car.seating_capacity}</p>
                
                </div>
                <div>
                  <p className='text-gray-600'>Air Conditioned: {car.air_conditioned ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Power Windows: {car.power_windows ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Central Locking: {car.central_locking ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Audio System: {car.audio_system ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>GPS Navigation: {car.gps_navigation ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <p className='text-xl font-semibold text-primaryBlue mt-4'>Car not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarDetail;
