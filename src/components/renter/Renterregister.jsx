import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import register from "../../images/logo.png";
import instance from '../../utils/axios';

const baseUrl = 'http://localhost:8000/api-renter/rentersignup/';

function RenterRegister() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { first_name, last_name, email, phone_number,password, password2 } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signupSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    if (first_name.trim() === "" || last_name.trim() === "" || email.trim() === "" || phone_number.trim() === "" || password.trim() === "" ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await instance.post('api/renterregister/', {
        first_name,
        last_name,
        email,
        username: email.split("@")[0],

        phone_number,
        password,
      });

      console.log(response);
      if (response.status === 200) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          password: "",
          password2: "",
        });
  
        toast.success("Please activate your email ");
      } else {
        toast.error("Something went wrong");
      }
    } catch(error) {
      toast.error("Renter with same email id already exists.");
    }
    finally {
      setIsSubmitting(false); // Set submitting state back to false
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
        <form className="space-y-4" onSubmit={signupSubmit}>
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            name="first_name"
            placeholder="First Name"
            value={first_name}
            onChange={handleChange}
          />
          <input
          className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={last_name}
          onChange={handleChange}
        />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
          />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            name="phone_number"
            placeholder="Phone"
            value={phone_number}
            onChange={handleChange}
          />
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
          <input
          className="w-full h-12 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          name="password2"
          placeholder="Password"
          value={password2}
          onChange={handleChange}
        />
        <button
        type="submit"
        className="w-full bg-red-500 text-white rounded-full py-2 px-4 font-semibold focus:outline-none focus:shadow-outline"
        disabled={isSubmitting} // Disable the button when submitting
      >
        {isSubmitting ? "Processing..." : "SIGNUP"}
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
