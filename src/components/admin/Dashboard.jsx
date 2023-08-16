import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import instance from '../../utils/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AiOutlineArrowUp } from 'react-icons/ai';
function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [renters, setRenters] = useState([]);
  const [cars, setCars] = useState([]);
  const [salesDataYear, setSalesDataYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month for filtering
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = useNavigate();
  
  // Your provided logic to fetch sales data by month
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthsOfYear = monthNames.map((month, index) => ({
    period: month,
    amount: 0,
  }));

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const [bookingsResponse, usersResponse, rentersResponse, carsResponse] = await Promise.all([
          instance.get('/payment/allbookings/'),
          instance.get('/api/users/'),
          instance.get('/api/renters/'),
          instance.get('cars/home-list-car/')
        ]);

        setBookings(bookingsResponse.data);
        setUsers(usersResponse.data);
        setRenters(rentersResponse.data);
        setCars(carsResponse.data);

        // Your provided logic to fetch sales data by month
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

  useEffect(() => {

    
    // Filter sales data by selected month
    if (selectedMonth !== null) {
      const filteredData = bookings.filter(booking => {
        const date = new Date(booking.booking_date);
        return date.getMonth() === selectedMonth;
      });

      const filteredSalesByMonth = filteredData.reduce((acc, booking) => {
        const date = new Date(booking.booking_date);
        const monthIndex = date.getMonth();
        const amount = booking.car.price_per_day * 0.1;

        if (acc[monthIndex]) {
          acc[monthIndex] += amount;
        } else {
          acc[monthIndex] = amount;
        }
        return acc;
      }, {});

      const filteredSalesDataForYear = monthsOfYear.map((month, index) => ({
        ...month,
        amount: filteredSalesByMonth[index] || 0,
      }));

      setFilteredSalesData(filteredSalesDataForYear);
    } else {
      setFilteredSalesData(salesDataYear);
    }
  }, [selectedMonth, bookings]);

  // ... (existing state and effect code)
  const calculateMonthlySales = () => {
    if (selectedMonth === null) {
      return []; // Return an empty array if no month is selected
    }
  
    const filteredData = bookings.filter(booking => {
      const date = new Date(booking.booking_date);
      return date.getMonth() === selectedMonth;
    });
  
    if (filteredData.length === 0) {
      return []; // Return an empty array if there are no bookings for the selected month
    }
  
    const firstDate = new Date(filteredData[0].booking_date);
    firstDate.setDate(1); // Set to the first day of the selected month
  
    const lastDate = new Date(filteredData[filteredData.length - 1].booking_date);
    lastDate.setMonth(selectedMonth + 1, 0); // Set to the last day of the selected month
  
    const totalDays = (lastDate - firstDate) / (24 * 60 * 60 * 1000) + 1;
  
    const dailySalesData = Array.from({ length: totalDays }, (_, dayIndex) => {
      const currentDate = new Date(firstDate);
      currentDate.setDate(currentDate.getDate() + dayIndex);
  
      const daySales = filteredData.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        return bookingDate.toDateString() === currentDate.toDateString();
      }).reduce((total, booking) => total + booking.car.price_per_day * 0.1, 0);
  
      const dayLabel = currentDate.getDate();
  
      return {
        day: dayLabel,
        amount: daySales,
      };
    });
  
    return dailySalesData;
  };
  
  
  const dailySalesData = calculateMonthlySales();
  return (
    <div
      className="flex h-full text-white"
      style={{
        animation: isLoading ? 'fadein 2s ease-in-out' : 'none'
      }}
    >
      <Sidebar />
      <div className='flex-1 px-5 w-full min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl'>
        <div className="w-full px-3 md:px-8 lg:px-16 font-poppins">
          <Toaster position="top-center" reverseOrder={false} />
  
          <h2 className="text-5xl font-bold mb-4 text-black-3xl hover:text-green-300 transition-colors duration-300" style={{ color: 'black' }}>
            Admin Dashboard
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <button onClick={() => window.open('/payment/sales-report/', '_blank')}>
          Download Sales Report (HTML)
        </button>
        <button onClick={() => window.open('/payment/sales-report-pdf/', '_blank')}>
          Download Sales Report (PDF)
        </button>
        
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            {/* Display Yearly Sales Chart */}
            <h2 className="text-2xl mb-2 text-black">Monthly Sales</h2>
            <div className="flex items-center mb-4">
              <select
                className="bg-black border rounded-md py-1 px-2 mr-3"
                value={selectedMonth !== null ? selectedMonth : ''}
                onChange={e => setSelectedMonth(e.target.value === '' ? null : parseInt(e.target.value))}
              >
                <option value="">All Months</option>
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <LineChart width={1000} height={400} data={selectedMonth !== null ? filteredSalesData : salesDataYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#000000" />
            </LineChart>
          </div>
  
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            {/* Display Daily Sales Chart */}
            <h2 className="text-2xl mb-2 text-black">Sales by Day</h2>
            <LineChart width={1000} height={400} data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="amount" fill="#000000" />
            </LineChart>
          </div>
        </div>
      </div>
      {showScrollButton && (
        <button
          className="fixed bottom-8 right-8 p-2 bg-black text-white rounded-md shadow-md"
          onClick={scrollToTop}
        >
        <AiOutlineArrowUp size={24} />
        </button>
      )}
    </div>
  );
                }
export default AdminDashboard;
