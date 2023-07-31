import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import instance from '../../utils/axios';

function RenterSingleCar() {
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
    <div className=''>
      <Sidebar />

      <div className='w-full p-6'>
        <Toaster position='top-center' limit={3} />

        {loading ? (
          <h1 className='text-3xl font-bold text-center text-primaryBlue'>Loading...</h1>
        ) : car ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <img className='w-full h-auto rounded-md shadow-lg' src={car?.image} alt='Car' />
            </div>

            <div>
              <div className='bg-white w-full h-full rounded-lg shadow-lg p-6'>
                <h1 className='text-3xl font-bold text-primaryBlue mb-4'>{car?.name}</h1>
                <p className='text-gray-600'>{car?.description}</p>
                <div className='grid grid-cols-2 gap-6 mt-6'>
                  <div>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Price Per Day:</span> {'₹ ' + car?.price_per_day}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Brand:</span> {car?.brand}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Year Manufactured:</span> {car?.year_manufactured}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Mileage:</span> {car?.mileage}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Fuel Type:</span> {car?.fuel_type}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Transmission Type:</span> {car?.transmission_type}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Seating Capacity:</span> {car?.seating_capacity}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Air Conditioned:</span> {car?.air_conditioned ? 'Yes' : 'No'}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Power Windows:</span> {car?.power_windows ? 'Yes' : 'No'}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Central Locking:</span> {car?.central_locking ? 'Yes' : 'No'}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>Audio System:</span> {car?.audio_system ? 'Yes' : 'No'}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-semibold'>GPS Navigation:</span> {car?.gps_navigation ? 'Yes' : 'No'}
                    </p>
                  </div>
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

export default RenterSingleCar;
