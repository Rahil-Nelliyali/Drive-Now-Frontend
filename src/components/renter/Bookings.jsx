import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    closeDialog,
  } from "@material-tailwind/react";
import Sidebar from "./Sidebar";
import LateChargesDialog from './LateCharges';


export default function RenterBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState([]);
  const [lateCharges, setLateCharges] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData.userID
  console.log(userId)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.userID) {
      setUser(userData.userID);
    }

  }, []);

  async function getbookings(userId) {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData.userID
      if (token) {
        // Use the global Axios instance directly here
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      const response = await instance.get(`/payment/renterbookings/?user=${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('could not fetch data', error);
      console.error('API error response:', error.response); //
    }
  }
  useEffect(() => {
    if (user) {
      getbookings();
    }
  }, [user]);

  const handleStatusChange = (bookingId, newStatus) => {
    setLateCharges(0); // Reset late charges when changing status
    handleStatusUpdate(bookingId, newStatus);
  };
  
  const handleLateChargesUpdate = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
  
      // Update late return charges if status is 'late'
      await instance.put(`/payment/updatebooking/${bookingId}/`, {
        status: 'late',
        late_return_charges: lateCharges,
      });
      toast.success('Late return charges added successfully');
  
      // Refresh bookings after successful update
      getbookings(userId);
    } catch (error) {
      console.error('could not update late charges', error);
      console.error('API error response:', error.response);
    }
  };
  

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
  
      if (newStatus === 'late') {
        // Update late return charges if status is 'late'
        await instance.put(`/payment/updatebooking/${bookingId}/`, {
          status: newStatus,
          late_return_charges: lateCharges,
        });
        toast.success('Late return charges added successfully');
      } else {
        // Update status without late return charges
        await instance.put(`/payment/updatebooking/${bookingId}/`, {
          status: newStatus,
        });
        toast.success('Status updated successfully');
      }
  
      // Refresh bookings after successful update
      getbookings(userId);
    } catch (error) {
      console.error('could not update status', error);
      console.error('API error response:', error.response);
    }
  };
  

 

  const handleSearch = () => {
    const filteredbookings = bookings.filter(booking =>
      booking?.car?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredbookings;
  };

  const filteredbookings = handleSearch();

  return (
    <div className="">
    <Sidebar />
    <div className='flex h-full bg-acontent mt-3'>
      <Toaster position='top-center' reverseOrder={false} limit={1} />

      <div className='px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8  flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl'>
        <div className='w-full h-screen px-3 '>
          <div className="w-full p-5 flex justify-between">
            <h1 className='  text-3xl text-start  ms-4'>My Bookings</h1>
            <input
              type="text"
              placeholder='&#x1F50D; Search for bookings'
              className="border border-primaryBlue border-solid focus:outline-none px-2 w-1/5 rounded-lg "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Car Name</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Booking date</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Amount</th>
                 
                    <th scope="col" className="px-6 py-4 font-large text-gray-900">Late Return Fees</th>
                 
                  
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Status</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Update</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
                {filteredbookings?.length > 0 ? (
                  filteredbookings?.map((booking, index) => (
                    <tr className='hover:bg-gray-50' key={index}>
                      <td className='px-6 py-4'>
                        <p>
                          <div>{booking.car.name}</div>
                        </p>
                      </td>
                      {/* ...Your other table data cells... */}
                      <td className='px-6 py-4'>
                        <p>
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </td>
                     
                      <td className='px-6 py-4'>
                        <p>
                        <div>{(booking.car.price_per_day * 0.9).toFixed(2)} </div>
                         
                        </p>
                      </td>

                      <td className='px-6 py-4'>
                      <p>
                        <div>
                          {booking.late_return_charges > 0 ? (
                            <span className='text-red-500'>
                              Late Return Charges: {booking.late_return_charges}
                            </span>
                          ) : (
                            <span className='text-green-500'>Nil</span>
                          )}
                        </div>
                      </p>
                    </td>
                    

                      <td className='px-6 py-4'>
                        <p>
                          <div
                            className={
                              booking.status === 'pending' ||
                              booking.status === 'rejected' ||
                              booking.status === 'cancelled'||
                              booking.status === 'late'
                                ? 'text-red-500'
                                : 'text-green-500'
                            }
                          >
                            {booking.status.toUpperCase()}
                          </div>
                        </p>
                      </td>
                      <td className='px-6 py-4'>
                      {booking.status === 'cancelled' ? (
                        <span className='text-red-500'>Booking cancelled by customer</span>
                      ) : (
                        <div>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          >
                            <option value='pending'>Pending</option>
                            <option value='approved'>Approved</option>
                            <option value='rejected'>Rejected</option>
                            <option value='complete'>Complete</option>
                            <option value='picked_up'>Vehicle Picked Up</option>
                            <option value='returned'>Vehicle Returned</option>
                            <option value='late'>Late Returned</option>
                          </select>
                          {booking.status === 'late' && (
                            <div className="flex flex-col items-center mt-4">
                              <Input
                                type="number"
                                placeholder="Late Charges"
                                value={lateCharges}
                                onChange={(e) => setLateCharges(e.target.value)}
                                className=" py-2 px-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
                              />
                              <Button
                                onClick={() => handleLateChargesUpdate(booking.id)}
                                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              >
                                Update Late Charges
                              </Button>
                            </div>
                          )}
                          
                        </div>
                      )}
                    </td>
                    

                      {/* ...Your other table data cells... */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='6'
                      className='px-6 py-4 text-center text-red-500 font-bold'
                    >
                      No related bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredbookings?.map((booking) => (
              <LateChargesDialog
                key={booking.id}
                bookingId={booking.id}
                onClose={() => {}}
              />
            ))}
             </div>
        </div>
      </div>
    </div>
    </div>
  );
  
}
