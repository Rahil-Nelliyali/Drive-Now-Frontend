import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import login, { getLocal } from "../../helpers/auth";
import Loginimage from "../../images/logo.png";
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const response = getLocal();
  const history = useNavigate();
  const location = useLocation();

  let state = location.state;

  useEffect(() => {
    if (response) {
      history('/');
    }
    if (state?.msg) {
      toast.success(state?.msg);
      history(state => ({ ...state, msg: null }));
    }
  });

  const handleHomeButtonClick = () => {
    history('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const login_response = await login(email, password);
    console.log(login_response, 'log response');

    const local_response = getLocal('authToken');
    if (local_response) {
      const location = localStorage.getItem('location');
      const decoded = jwt_decode(local_response);
      console.log(decoded, 'decoded in login page');
      if (decoded.is_admin) {
        history('/adminhome');
      } else if (decoded.is_staff) {
        console.log('staff');
        history('/');
      } else if (location) {
        history(location, { replace: true });
        localStorage.removeItem('location');
      } else {
        history('/', { replace: true });
      }
    } else {
      toast.error('Invalid User Credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full sm:w-96 bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-8">USER LOGIN</h1>
        <div className="flex items-center justify-center mb-8">
          <img src={Loginimage} alt="Login" className="h-32 w-32" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white rounded-full py-2 px-4 font-semibold focus:outline-none focus:shadow-outline"
          >
            LOGIN
          </button>
        </form>
        <p className="mt-4 text-center text-red-500 text-sm">
          Not yet registered?{" "}
          <Link to="/register" className="text-green-500 font-semibold">
            SignUp
          </Link>
          <button
          onClick={handleHomeButtonClick}
          className="w-full bg-blue-500 text-white rounded-full py-2 px-4 mt-4 font-semibold focus:outline-none focus:shadow-outline"
        >
          Go to Home Page
        </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
