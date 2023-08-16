import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import instance from '../../utils/axios';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logo from "../../images/logo.png";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const [filteredBookings, setFilteredBookings] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData.userID

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.userID) {
      setUser(userData.userID);
    }

  }, []);

  async function getbookings() {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData.userID
      if (token) {
        // Use the global Axios instance directly here
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      const response = await instance.get(`/payment/allbookings/`);
      setBookings(response.data);
    } catch (error) {
      console.error('could not fetch data', error);
      console.error('API error response:', error.response); //
    }
  }
  useEffect(() => {
  
    if (userData.is_admin) {
        getbookings();
      }
  }, []);

  const calculateTotalAmount = () => {
    return bookingsToRender.reduce((total, booking) => {
      if (booking.status !== 'cancelled' && booking.status !== 'rejected' ) {
        return total + booking.car.price_per_day * 0.1;
      }
      return total;
    }, 0);
  };

  const generateSummary = () => {
    const totalAmount = calculateTotalAmount();
    
    const docDefinition = {
      content: [
        
        {
          text: 'Booking Summary Report',
          fontSize: 24,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: [
            `Date: ${new Date().toLocaleDateString()}`,
            `Total Amount Received: ₹ ${totalAmount.toFixed(0)}`,
            `Number of Bookings: ${bookingsToRender.length}`,
          ],
          fontSize: 16,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              ['Car Name', 'Booking Date', 'Amount', 'Status'],
              ...bookingsToRender.map(booking => [
                booking.car.name,
                new Date(booking.slot.date).toLocaleDateString(),
                `₹ ${(booking.car.price_per_day * 0.1).toFixed(0)}`,
                {
                  text: booking.status.toUpperCase(),
                  style: {
                    color: booking.status === 'pending' || booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'late' ? 'red' : 'green',
                  },
                },
              ]),
            ],
          },
        },
      ],
    };
  
    return docDefinition;
  };
  
  const handleExportToPDF = () => {
  const totalAmount = calculateTotalAmount();
  const img = new Image();
  img.src = logo;
  img.crossOrigin = 'Anonymous';

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const logoDataUrl = canvas.toDataURL('image/png');

    const docDefinition = {
      content: [
        {
          image: logoDataUrl,
          width: 100,
          alignment: 'center',
        },
        {
          text: 'Booking Summary Report',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        },
        {
          text: [
            { text: startDate && endDate ? 'Report Period: ' : 'Report Date: ', fontSize: 14, bold: true },
            { text: startDate && endDate ? `${startDate} - ${endDate}` : new Date().toLocaleDateString(), fontSize: 14 },
          ],
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        {
          text: [
            { text: 'Total Amount Received: ', fontSize: 14, bold: true },
            { text: `₹ ${totalAmount.toFixed(0)}`, fontSize: 14 },
          ],
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        {
          text: [
            { text: 'Number of Bookings: ', fontSize: 14, bold: true },
            { text: bookingsToRender.length.toString(), fontSize: 14 },
          ],
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              ['Car Name', 'Booking Date', 'Amount', 'Status'],
              ...bookingsToRender.map(booking => [
                booking.car.name,
                { text: new Date(booking.slot.date).toLocaleDateString(), alignment: 'center' },
                { text: `₹ ${(booking.car.price_per_day * 0.1).toFixed(0)}`, alignment: 'center' },
                {
                  text: booking.status.toUpperCase(),
                  alignment: 'center',
                  style: {
                    color: booking.status === 'pending' || booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'late' ? 'red' : 'green',
                  },
                },
              ]),
            ],
          },
        },
        {
          text: 'Signature:',
          fontSize: 14,
          bold: true,
          alignment: 'right',
          margin: [0, 50, 20, 0],
        },
        { text: '__________________________', fontSize: 12, alignment: 'right', margin: [0, 0, 20, 0] },

        { text: 'Date:', fontSize: 12, alignment: 'right', margin: [0, 10, 20, 0] },
      ],
    };

    pdfMake.createPdf(docDefinition).download('bookings-report.pdf');
  };
};
  
  
const handleMonthFilter = () => {
  const filteredbookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.slot.date);
    const isWithinSelectedMonth =
      selectedMonth === '' || bookingDate.getMonth() === parseInt(selectedMonth) - 1;
    return isWithinSelectedMonth;
  });
  setFilteredBookings(filteredbookings); // Set the filtered bookings
};

const handleSearch = () => {
  const filteredbookings = filteredBookings.filter(booking =>
    booking?.car?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return filteredbookings;
};

const handleDateFilter = () => {
  const filteredbookings = filteredBookings.filter(booking => {
    const bookingDate = new Date(booking.slot.date);
    if (startDate && endDate) {
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      return bookingDate >= filterStartDate && bookingDate <= filterEndDate;
    }
    return true;
  });
  return filteredbookings;
};

const dateFilteredBookings = handleDateFilter();

const filteredbookings = handleSearch();

const bookingsToRender = startDate && endDate ? dateFilteredBookings : filteredbookings;


  return (
    <div className="flex h-full bg-acontent">
    <Sidebar />
  
      <div className='px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8  flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl'>
        <div className='w-full h-screen px-3 '>
          <div className="w-full p-5 flex justify-between">
            <h1 className='  text-3xl text-start  ms-4'>Bookings</h1>
            <div className="flex space-x-2">
              <input
                type="date"
                className="border border-primaryBlue border-solid focus:outline-none px-2 rounded-lg"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="border border-primaryBlue border-solid focus:outline-none px-2 rounded-lg"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <select
    className="border border-primaryBlue border-solid focus:outline-none px-2 rounded-lg"
    value={selectedMonth}
    onChange={e => setSelectedMonth(e.target.value)}
  >
    <option value="">Select Month</option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
  <button
    onClick={handleMonthFilter}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
  >
    Filter by Month
  </button>
            
          
            </div>
            <input
              type="text"
              placeholder='&#x1F50D; Search '
              className="border border-primaryBlue border-solid focus:outline-none px-2 w-1/5 rounded-lg "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
          <table  id="bookings_table" className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Car Name</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Booking date</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Amount</th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
                {bookingsToRender?.length > 0 ? (
                  bookingsToRender?.slice().sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date)).map((booking, index) => (
                    <tr className='hover:bg-gray-50' key={index}>
                    <td className='px-6 py-4'>
                    <p>
                    <div>{booking.car.name}</div>

                    </p>
                  </td>{/* ...Your other table data cells... */}
                      <td className='px-6 py-4'>
                        <p>
                          {new Date(booking.slot.date).toLocaleDateString()}
                        </p>
                      </td>
                     
                      <td className='px-6 py-4'>
                        <p>
                        <div>&#8377; {(booking.car.price_per_day * 0.1).toFixed(0)}</div>
                        </p>
                      </td>
                      <td className='px-6 py-4'>
                        <p>
                          <div
                            className={
                              booking.status === 'pending' ||
                              booking.status === 'rejected' ||
                              booking.status === 'cancelled' ||
                              booking.status === 'late' 
                                ? 'text-red-500'
                                : 'text-green-500'
                            }
                          >
                            {booking.status.toUpperCase()}
                          </div>
                        </p>
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
          </div>
          <div className="flex justify-end">
          <button
            onClick={handleExportToPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Download Report as PDF
          </button>
        </div>
        </div>
      </div>
    </div>
  );
  
}

export default AllBookings;
