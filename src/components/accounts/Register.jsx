import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import register from "../../images/logo.png";
import instance from '../../utils/axios';

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    driving_license_number:"",
    password: "",
    password2: "",
  });

  const { first_name, last_name, email, phone_number,driving_license_number, password, password2 } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signupSubmit = async (e) => {
    e.preventDefault();

    if (first_name.trim() === "" || last_name.trim() === "" || email.trim() === "" || phone_number.trim() === "" || password.trim() === "" || driving_license_number.trim() === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await instance.post('api/register/', {
        first_name,
        last_name,
        email,
        username: email.split("@")[0],

        phone_number,
        password,
      });

      console.log(response);
      if (response.status === 200) {
        toast.success("Please activate your email ");
      } else {
        toast.error("Something went wrong");
      }
    } catch(error) {
      toast.error("User with same email id already exists.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full sm:w-96 bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-8">SIGNUP</h1>
        <div className="flex items-center justify-center mb-8">
          <img src={register} alt="Register" className="h-32 w-32" />
        </div>
        <form onSubmit={signupSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={last_name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={phone_number}
              onChange={handleChange}
            />
            <input
            type="text"
            name="driving_license_number"
            placeholder="Driving License Number"
            className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
            value={driving_license_number}
            onChange={handleChange}
          />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-red-500"
              value={password2}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white rounded-full py-2 px-4 font-semibold focus:outline-none focus:shadow-outline"
          >
            SIGNUP
          </button>
        </form>
        <p className="mt-4 text-center text-red-500 text-sm">
          Already a member?{" "}
          <Link to="/login" className="text-green-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
