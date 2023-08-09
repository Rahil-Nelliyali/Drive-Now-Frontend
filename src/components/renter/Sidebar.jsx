import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiHomeAlt2 } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import { FaCar, FaCarSide  } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success('Renter Logged Out');
  };

  return (
    <div className='w-full h-20 flex items-center justify-between font-poppins px-5 bg-gradient-to-r from-black to-gray-900'>
      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex items-center gap-12'>
        <h1 className='font-semibold text-2xl text-white'>DN Seller</h1>
      </div>

      <div className='flex gap-3 items-center'>
        <NavLink
          to='/dashboards'
          className='px-1 list-none text-white hover:text-customColorC transition duration-300'
        >    <FaCarSide size={45} className='px-3' />
          Home
        </NavLink>
        <NavLink
          to='/carrenter'
          className='px-1 list-none text-white hover:text-customColorC transition duration-300'
          activeClassName='text-customColorC'
        >
        <FaCar size={45} className='px-3' />
        <h3 className='font-semibold'>My Cars</h3>
        </NavLink>
        <NavLink
          to='/categoryrenter'
          className='px-1 list-none text-white hover:text-customColorC transition duration-300'
          activeClassName='text-customColorC'
        >
        <FaFolder size={45} className='px-3' />
        <h3 className='font-semibold'>Location</h3>
        </NavLink>
        <NavLink
          to='/renterbookings'
          className='px-1 list-none text-white hover:text-customColorC transition duration-300'
          activeClassName='text-customColorC'
        >
        <FiCalendar size={45} className='px-3' />
        <h3 className='font-semibold'>Bookings</h3>
        </NavLink>
        <CiLogout
          size={30}
          className='cursor-pointer text-white hover:text-customColorC transition duration-300'
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
