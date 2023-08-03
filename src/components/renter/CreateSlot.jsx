import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { getLocal } from '../../helpers/auth'
import { toast,Toaster } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';

const CreateSlot = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [car, setCar] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState(true);
    const [slotDuration, setSlotDuration] = useState('');
    const navigate = useNavigate();

   

      useEffect(() => {
        async function getCarDetails() {
           
          try {
            const response = await instance.get(`/cars/single-car/${id}/`, { 
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },});
            setCar(response.data);
          } catch (error) {
            console.error('Failed to fetch car details:', error);
          }
          setLoading(false);
        }
        getCarDetails();
      }, [id]);

      async function getSlotsForCar(carId) {
        try {
          const response = await instance.get(`/cars/getslots/${carId}`);
          return response.data;
        } catch (error) {
          console.error('Failed to fetch slots:', error);
          return [];
        }
      }
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !startTime || !endTime || !slotDuration) {
            toast.error("Please fill in all the required fields.");
            return;
          }
      
        const slotData = {
          car: car.id,
          date,
          start_time: startTime,
          end_time: endTime,
          status,
          slot_duration: slotDuration,
        };
      console.log(slotData)
        try {
          const userId = JSON.parse(localStorage.getItem("user")).userID;
          const response = await instance.post('/cars/createslots/', slotData, {
            params: { renter: userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log(response.data);
          navigate(`/carrenter`);
           // Fetch the updated slots for the car
            toast.success('Slot created successfully');
         
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 403) {
            toast.error('You do not have permission to create a slot.');
          } else {
            toast.error('Failed to create slot. Please try again later.');
          }
        }
      };
      
  return (
    <div className='w-2/4 '>
      <Toaster position='top-center' reverseOrder='false' limit={1} ></Toaster>
    <div className="w-3/4 mt-16 mx-auto p-6  bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Slot</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block font-medium mb-1">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            min={new Date().toISOString().split("T")[0]} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-gray-300 border-2 rounded-md py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startTime" className="block font-medium mb-1">Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border-gray-300 border-2 rounded-md py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endTime" className="block font-medium mb-1">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border-gray-300 border-2 rounded-md py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block font-medium mb-1">Status:</label>
          <input
            type="checkbox"
            id="status"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700">Active</span>
        </div>
        <div className="mb-4">
          <label htmlFor="slotDuration" className="block font-medium mb-1">Slot Duration in min:</label>
          <input
            type="number"
            id="slotDuration"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            className="w-full border-gray-300 border-2 rounded-md py-2 px-3"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
          Create
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateSlot;
