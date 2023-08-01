import React from 'react'
import { NavLink } from 'react-router-dom'
import {BsBook} from 'react-icons/bs'
import {AiOutlineUser} from 'react-icons/ai'
import {CiLogout} from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import profile from '../../images/avatar.png'
import { toast, Toaster } from "react-hot-toast";
import { FaCar  } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa';


export default function Sidebar() {
    const history = useNavigate()

    const adminLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      history('/');
      toast.success('Admin Logged Out');
    }
    return (
        <div className='bg-black z-50 absolute h-auto min-h-screen xl:relative left-0 w-2/4 md:w-2/6 lg:w-1/5 shadow-xl font-poppins'>
          <div className="flex py-3 items-center">
            <img src={profile} alt="admin_profile_image" className='rounded-full w-12 h-12 ml-8 mr-3' />
            <p className='text-green-400 font-semibold'>Admin</p>
          </div>
          <div className="flex flex-col px-3 py-5 mt-2">
            <NavLink
              to="/adminhome"
              className="flex items-center text-white font-semibold my-2 hover:text-green-400 transition-colors duration-200"
            >
              <BsBook size={20} className='mr-3' />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/cars"
              className="flex items-center text-white font-semibold my-2 hover:text-green-400 transition-colors duration-200"
            >
              <FaCar size={20} className='mr-3' />
              <span>Cars</span>
            </NavLink>
            <NavLink
              to="/user"
              className="flex items-center text-white font-semibold my-2 hover:text-green-400 transition-colors duration-200"
            >
              <AiOutlineUser size={20} className='mr-3' />
              <span>Users</span>
            </NavLink>
            <NavLink
              to="/renter"
              className="flex items-center text-white font-semibold my-2 hover:text-green-400 transition-colors duration-200"
            >
              <FaUserTie size={20} className='mr-3' />
              <span>Renters</span>
            </NavLink>
            <div
              className="flex items-center text-white font-semibold my-2 cursor-pointer hover:text-green-400 transition-colors duration-200"
              onClick={() => {
                adminLogout();
              }}
            >
              <CiLogout size={20} className='mr-3' />
              <span>Logout</span>
            </div>
          </div>
        </div>
      )
    }
   
    
    
    
    