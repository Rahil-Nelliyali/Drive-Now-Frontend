import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import jwtDecode from "jwt-decode";
import { getLocal } from "../../helpers/auth";
import instance from "../../utils/axios";
import { toast } from "react-hot-toast";
import NavBar from "./Navbar";

export default function Profile() {

    const email = JSON.parse(localStorage.getItem("user")).email;
    const id = JSON.parse(localStorage.getItem("user")).userID;

 
    const name = JSON.parse(localStorage.getItem("user")).name;
    return (
        <div className="w-full h-screen flex flex-col bg-gray-100">
          <Toaster position="top-center" limit={3} />
    
          <div className="w-full h-20 flex items-center bg-primaryBlue text-white">
            <NavBar />
          </div>
    
          <div className=" flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md mx-3 mt-10 font-poppins">
              <div className="overflow-hidden w-full">
                <h1 className="font-bold text-3xl mb-4">My Profile</h1>
              </div>
    
              <div className="w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                <p className="text-lg font-semibold mb-2">Full Name: {name}</p>
                <p className="text-lg font-semibold mb-2">Email Address: {email} </p>
                <p className="text-lg font-semibold mb-2">My Id: {id} </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    