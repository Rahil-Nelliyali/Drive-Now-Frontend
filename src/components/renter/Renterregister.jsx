import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, } from 'react-toastify';
import { toast, Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import register from "../../images/logo.png";

const baseUrl = 'http://localhost:8000/api-renter/rentersignup/';

function RenterRegister() {
  const [renterData, setrenterData] = useState({
    full_name: "",
    email: "",
    password: "",
    mobile_no: "",
  });

  const handleChange = (event) => {
    setrenterData({
      ...renterData,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const renterFormData = new FormData();
    renterFormData.append('full_name', renterData.full_name);
    renterFormData.append('email', renterData.email);
    renterFormData.append('password', renterData.password);
    renterFormData.append('mobile_no', renterData.mobile_no);
  
    try {
      const response = await axios.post(baseUrl, renterFormData);
      console.log(response.data);
  
      setrenterData({
        full_name: "",
        email: "",
        password: "",
        mobile_no: "",
      });
  
      toast.success('Success!! Wait for Admin approval', {
        position: 'top-center',
        autoClose: 3000
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('Email or phone number already exists. Please use a different email or phone number.', {
          position: 'top-center',
          autoClose: 3000
        });
      }
      else if (error.response && error.response.status === 400) {
        toast.error('All fields are required.', {
          position: 'top-center',
          autoClose: 3000
        });
      } else {
        console.log(error);
        toast.error('Registration failed', {
          position: 'top-center',
          autoClose: 3000
        });
      }
    }
  };
  
  
  
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Renter Signup</h1>
        <div className="flex items-center justify-center mb-6">
          <img src={register} alt="Login" className="w-32 h-32" />
        </div>
        <form className="space-y-4">
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={renterData.full_name}
            onChange={handleChange}
          />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            name="email"
            placeholder="Email"
            value={renterData.email}
            onChange={handleChange}
          />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            name="mobile_no"
            placeholder="Phone"
            value={renterData.mobile_no}
            onChange={handleChange}
          />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            name="password"
            placeholder="Password"
            value={renterData.password}
            onChange={handleChange}
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 font-bold transition duration-300"
            onClick={submitForm}
          >
            SIGNUP
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already a member?{' '}
          <Link to="/rentersignin" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RenterRegister;
