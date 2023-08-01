import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsCart3 } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { getLocal } from '../../helpers/auth';
import { useState } from 'react';
import { toast, Toaster } from "react-hot-toast";

function NavBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function searchCar(e) {
    if (e.key === 'Enter') {
      navigate(`/cars?key=${search}`);
    }
  }

  const user_auth =  localStorage.getItem('token');
  let user_name;
  if (user_auth) {
    user_name = jwtDecode(user_auth);
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged Out ");

    navigate('/');
  };

  return (
    <div className='w-full h-20 flex items-center justify-between font-poppins px-5 bg-gradient-to-r from-black to-gray-900'>
    <Toaster position="top-center" reverseOrder={false} />

      <div className='flex items-center gap-12'>
        <h1 className='font-semibold text-2xl text-white'>DriveNow</h1>
        <div className='flex px-10 rounded-3xl border-2 border-white py-2 place-items-center ms-3 transition duration-300 ease-in-out transform hover:scale-105'>
          <AiOutlineSearch className='text-black' size={20} />
          <input
            type='text'
            className='focus:outline-none ms-2 bg-transparent placeholder:text-white text-white'
            value={search}
            placeholder='Search for Cars'
          
            onKeyPress={(e) => {
              searchCar(e);
            }}
          />
        </div>
      </div>

      <div className='flex gap-3 items-center'>
        <Link to='/'>
          <li className='px-1 list-none text-white hover:text-customColorC transition duration-300'>
            Home
          </li>
        </Link>
        {user_auth ? (
          <>
            <Link to='/mybookings'>
              <li className='px-1 list-none text-white hover:text-customColorC transition duration-300'>
                My Bookings
              </li>
            </Link>
            <Link to='/profile'>
              <li className='px-1 list-none text-white hover:text-customColorC transition duration-300'>
                Edit profile
              </li>
            </Link>
          </>
        ) : null}
        <Link to='/car'>
          <li className='px-1 list-none text-white hover:text-customColorC transition duration-300'>
            Cars
          </li>
        </Link>
        <Link to='/cart'>
          <BsCart3 className='cursor-pointer text-white hover:text-customColorC transition duration-300' />
        </Link>
      </div>

      {user_auth ? (
        <div className='flex gap-2'>
          <button
            className='px-4 py-2 bg-green-400 mx-2 text-black shadow-xl rounded-xl transition duration-300 ease-in-out transform hover:scale-105'
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='flex gap-2'>
          <Link to='/login'>
            <button className='px-3 py-1 bg-gradient-to-r from-customColorB to-customColorA text-white shadow-xl rounded-xl transition duration-300 ease-in-out transform hover:scale-105'>
              User Login
            </button>
          </Link>
          <Link to='/rentersignin'>
            <button className='px-3 py-1 bg-gradient-to-r from-customColorB to-customColorA text-white shadow-xl rounded-xl transition duration-300 ease-in-out transform hover:scale-105'>
              Seller Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar;
