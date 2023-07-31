import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loginimage from "../../images/login.png";
import { toast, Toaster } from "react-hot-toast";

const baseUrl = 'http://localhost:8000/api-renter/';

function RenterLogin() {
  const [renterLoginData, setrenterLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setrenterLoginData({
      ...renterLoginData,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    const renterFormData = new FormData();
    renterFormData.append('email', renterLoginData.email);
    renterFormData.append('password', renterLoginData.password);
  
    try {
      axios.post(baseUrl + 'renterlogin/', renterFormData)
        .then((res) => {
          if (res.data.bool === true) {
            const renterId = res.data.renter_id; // Assuming the API returns renter information

            localStorage.setItem('renterLoginStatus', true);
            localStorage.setItem('renter_id', renterId); // Corrected
              window.location.href = '/dashboards';
            } else {
              toast.error(res.data.message);
            }
          } )
    } catch (error) {
      console.log(error);
    }
  };

  const handleHomeButtonClick = () => {
    navigate('/');
  };

   const navigate = useNavigate();
  const renterLoginStatus = localStorage.getItem('renterLoginStatus');
  if (renterLoginStatus == 'true') {
    navigate("/dashboards");
 
}

  useEffect(() => {
    const renterLoginStatus = localStorage.getItem('renterLoginStatus');
    if (renterLoginStatus === 'true') {
      navigate("/dashboards");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Renter Login</h1>
        <form onSubmit={submitForm} className="space-y-4">
          <div className="relative">
            <input
              className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="email"
              name="email"
              placeholder="Email"
              value={renterLoginData.email}
              onChange={handleChange}
            />
            <span className="absolute top-3 right-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17L12 12 17 7"
                />
              </svg>
            </span>
          </div>
          <div className="relative">
            <input
              className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="password"
              name="password"
              placeholder="Password"
              value={renterLoginData.password}
              onChange={handleChange}
            />
            <span className="absolute top-3 right-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
            </span>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 font-bold transition duration-300">
            LOGIN
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Not yet registered?{' '}
          <Link to="/rentersignup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
        <button
        onClick={handleHomeButtonClick}
        className="w-full bg-blue-500 text-white rounded-full py-2 px-4 mt-4 font-semibold focus:outline-none focus:shadow-outline"
      >
        Go to Home Page
      </button>
      </div>
    </div>
  );
};

export default RenterLogin;
