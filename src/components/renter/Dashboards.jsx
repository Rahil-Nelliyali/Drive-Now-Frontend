import React from 'react'
import Sidebar from './Sidebar'
import Banner from './Banner'

import { Toaster } from 'react-hot-toast'
import { useState } from 'react';
import instance from '../../utils/axios';
import { useEffect } from "react";


export default function Dashboards() {
  const[cars,setcars]=useState([]);
  const[renter,setRenter]=useState([]);
 

  async function getcars(){
    try{
    const response=await instance.get(`cars/car/`)
    setcars(response.data)
   
    
    console.log(cars)
   

  }
   catch (error){
    console.log('couldnt fetch data');
   }}

  useEffect(()=>{
    getcars();
    
  },[]);


  async function getRenter() {
    const response = await instance.get('api-renter/renter/')
    setRenter(response.data)
}

  useEffect(()=>{
    getRenter();
  }, [])


  


  return (
    <>
    <Sidebar/>
   
    <Banner/>
       
        </>
  
  )
}
