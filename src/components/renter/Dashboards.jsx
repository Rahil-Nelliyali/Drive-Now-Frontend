import React from 'react'
import Sidebar from './Sidebar'
import Banner from './Banner'

import { Toaster } from 'react-hot-toast'
import { useState } from 'react';
import instance from '../../utils/axios';
import { useEffect } from "react";
import { getRenterDataFromLocalStorage } from '../../utils/renterutils.js';


export default function Dashboards() {
  const[cars,setcars]=useState([]);
  const[renter,setRenter]=useState([]);
 
  const { renter_id, renter_is_active } = getRenterDataFromLocalStorage();



 

  


  return (
    <>
    <Sidebar/>
   
    <Banner/>
       
        </>
  
  )
}
