import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Loginimage from "../../images/logo.png";
import instance from '../../utils/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 


 

  const handleHomeButtonClick = () => {
    navigate('/');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
  
    const data = {
      email: email,
      password: password,
    };
  
    try {
      const response = await instance.post('http://localhost:8000/api/token/', data);
      console.log(response);
  
      // Handle success response
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
  
        // Save the token and user data in local storage
        console.log(user, "------------------------user------------------------");
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
  
        // Check user role and status for redirection
        if (response.data.user.is_renter) {
          console.log('renter');
          navigate('/dashboards');
        } else if (response.data.user.is_admin) {
          console.log('admin');
          navigate('/adminhome');
        } else if (response.data.user.is_active) {
          console.log('active user');
          navigate('/');
        } else {
          console.log(response.data, 'inactive user');
        }
  
        toast.success("Login Success");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error response
        toast.error("Invalid email or password");
        console.error('Error:', error.response.data.message);
      } else {
        // Handle other errors
        toast.error("Login Failed");
        console.error('Error:', error);
      }
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
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
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