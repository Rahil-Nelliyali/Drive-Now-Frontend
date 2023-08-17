import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import notfound from '../../images/notfound.gif';
import instance,  { BASE_URL } from '../../utils/axios';
import {  AiOutlineEnvironment } from 'react-icons/ai';
import { AiOutlineFilter, AiOutlineSortAscending, AiOutlineSortDescending , AiOutlineCloseCircle } from 'react-icons/ai';
import './loader.css';
function Car() {
  const [cars, setCars] = useState([]);
  const [load, setLoad] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); 

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFilterOptions = () => {
    setFilterOptionsVisible(!filterOptionsVisible);
  };

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await instance.get('/cars/home-list-locations/'); 
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
  
      
      setTimeout(async () => {
        try {
          const response = await instance.get('/cars/home-list-car/');
          setCars(response.data);
        } catch (error) {
          console.error('Failed to fetch cars:', error);
        }
        setLoad(false);
      }, 1000); 
    }
    
    getCars();
  }, []);

  const filterCarsByPriceRange = (car) => {
    const carPrice = parseFloat(car.price_per_day);
    if (selectedPriceRange === '0-1000') {
      return carPrice >= 0 && carPrice <= 1000;
    } else if (selectedPriceRange === '1000-above') {
      return carPrice > 1000;
    } else if (selectedPriceRange === '10000-above') {
      return carPrice > 10000;
    }
    return true;
  };



  const filteredCars = cars.filter(car => {
    const matchesLocation = !selectedLocation || car.category.name === selectedLocation;
    const matchesPriceRange = filterCarsByPriceRange(car);
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesPriceRange && matchesSearch;
  });

  const sortedCars = filteredCars.slice().sort((a, b) => {
    const priceA = parseFloat(a.price_per_day);
    const priceB = parseFloat(b.price_per_day);
    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

  return (
    <div className='w-full h-full font-poppins relative'>
      <Toaster position='top-center' limit={3} />
      <div className='w-full h-20 flex items-center bg-primaryBlue text-white'>
        <Navbar />
      </div>
      <div className='p-5 w-full h-full min-h-screen'>
        <div className='w-full mt-10'>
        <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
        <button
        onClick={toggleSortOrder}
        className='bg-black text-white rounded-md px-4 py-2 mr-4 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-400 flex items-center'
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease-in-out' }}
      >
        {sortOrder === 'asc' ? <AiOutlineSortAscending className='mr-1' /> : <AiOutlineSortDescending className='mr-1' />}
        Sort by Price {sortOrder === 'asc' ? '(Low-High)' : '(High-Low)'}
      </button>
      <button
        onClick={toggleFilterOptions}
        className={`bg-black text-white rounded-md px-4 py-2 ${filterOptionsVisible ? '' : ''} hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-400 flex items-center`}
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease-in-out' }}
      >
        {filterOptionsVisible ? <AiOutlineFilter className='mr-2' /> : <AiOutlineFilter className='mr-2' />}
        Filters ({[selectedLocation, selectedPriceRange].filter(Boolean).length})
      </button>
      

      
      
           
      
        {filterOptionsVisible && (
          <div className='flex items-center border rounded-lg p-2 bg-gray-100 ml-4'>
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
            <div className='flex items-center border rounded-lg p-2 bg-gray-100 ml-4'>
<select
  value={selectedPriceRange}
  onChange={handlePriceRangeChange}
  className='bg-transparent text-gray-600 focus:outline-none'
>
  <option value=''>Select Price Range</option>
  <option value='0-1000'>0 - 1000</option>
  <option value='1000-above'>1000 above</option>
  <option value='10000-above'>10000 above</option>
</select>
</div>
            
          </div>
        )}
      </div>
      <div className='flex items-center border rounded-lg bg-gray-100 px-3 py-2 transition duration-300 ease-in-out transform hover:scale-105 focus-within:ring focus-within:ring-gray-400'>
      <input
        type='text'
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder='Search for Cars'
        className='bg-transparent text-gray-600 focus:outline-none placeholder-gray-400'
      />
      <button
        className='ml-2 text-gray-500 hover:text-gray-700 focus:outline-none'
        onClick={() => setSearchQuery('')}
      >
      <AiOutlineCloseCircle size={18} />
      </button>
    </div>
    
  </div>
        
          {load ? (
            <div className='flex flex-col items-center justify-center align-center h-full'>
           
            <div class="jelly"></div> </div>
          ) : (
            <>
              
              {sortedCars?.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {sortedCars.map(car => (
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
