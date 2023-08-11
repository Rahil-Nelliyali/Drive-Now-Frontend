import React, { useState, useEffect } from 'react';
import {  Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import instance from '../../utils/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [renters, setRenters] = useState([]);
  const [cars, setCars] = useState([]);
  const [salesDataYear, setSalesDataYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (token) {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const bookingsResponse = await instance.get('/payment/allbookings/');
        setBookings(bookingsResponse.data);

        const usersResponse = await instance.get('/api/users/');
        setUsers(usersResponse.data);

        const rentersResponse = await instance.get('/api/renters/');
        setRenters(rentersResponse.data);

        const carsResponse = await instance.get('cars/home-list-car/');
        setCars(carsResponse.data);

        // Your provided logic to fetch sales data by month
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const monthsOfYear = monthNames.map((month, index) => ({
          period: month,
          amount: 0,
        }));

        const salesByMonth = {};
        bookingsResponse.data.forEach(booking => {
          const date = new Date(booking.booking_date);
          const monthIndex = date.getMonth();
          const amount = booking.car.price_per_day * 0.1;

          if (salesByMonth[monthIndex]) {
            salesByMonth[monthIndex] += amount;
          } else {
            salesByMonth[monthIndex] = amount;
          }
        });

        const salesDataForYear = monthsOfYear.map((month, index) => ({
          ...month,
          amount: salesByMonth[index] || 0,
        }));

        setSalesDataYear(salesDataForYear);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error or redirect if needed
      }
    }

    fetchData();
  }, []);

  return (
    <div
    className="flex h-full text-white"
    style={{
      animation: isLoading ? 'fadein 2s ease-in-out' : 'none'
    }}
  >
      <Sidebar />
      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3 font-poppins">
          <Toaster position="top-center" reverseOrder={false} />

          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-4 text-black-3xl hover:text-green-300 transition-colors duration-300" style={{ color: 'black' }}>
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                <p className="text-2xl">{users.length}</p>
              </div>
              <div className="bg-black p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Renters</h2>
                <p className="text-2xl">{renters.length}</p>
              </div>
              <div className="bg-black p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Cars</h2>
                <p className="text-2xl">{cars.length}</p>
              </div>
              <div className="bg-black p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
                <p className="text-2xl">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            {/* Display Yearly Sales Chart */}
            <h2 className="text-2xl mb-2">Monthly Sales</h2>
            <BarChart width={1000} height={400} data={salesDataYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#000000" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
