import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import img from '../../images/avatar.png';
import notfound from '../../images/notfound.gif';
import instance,  { BASE_URL } from '../../utils/axios';

function Car() {
  const [cars, setCars] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    async function getCars() {
      setLoad(true);
      try {
        
        const response = await instance.get('/cars/home-list-car/');
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
      setLoad(false);
    }
    getCars();
  }, []);

  return (
    <div className='w-full h-full font-poppins relative'>
      <Toaster position='top-center' limit={3} />
      <div className='w-full h-20 flex items-center bg-primaryBlue text-white'>
        <Navbar />
      </div>
      <div className='p-5 w-full h-full min-h-screen'>
        <div className='w-full mt-10'>
          {load ? (
            <h1 className='text-3xl font-bold text-center text-primaryBlue'>Loading...</h1>
          ) : (
            <>
              <h3 className='text-2xl font-semibold text-primaryBlue mb-4'>{cars.length} cars available</h3>
              {cars?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {cars.map(car => (
                    <Link
                      to={`/cardetail/${car?.id}`}
                      className='bg-white shadow-xl rounded-lg p-4 transition-transform transform hover:-translate-y-1'
                      key={car.id}
                    >
                      <img className='w-full h-40 object-cover rounded-md' src={`${BASE_URL}${car.image}`}  alt='car_image' />
                      <div className='mt-4'>
                        <h1 className='text-xl font-semibold text-primaryBlue'>{car?.name}</h1>

                        <p className='text-gray-600 mt-2'>{car?.category.name}</p>

                        <div className='flex items-center mt-4'>
                          <img className='w-10 h-10 rounded-full object-cover' src={img} alt='renter_profile' />
                          <p className='ml-2 text-lg font-normal text-primaryBlue'>{'₹ ' + car?.price_per_day}</p>
                        </div>
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
