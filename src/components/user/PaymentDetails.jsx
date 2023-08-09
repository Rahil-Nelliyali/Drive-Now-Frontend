import React from 'react';

import PaymentPage from "./Payment";
import { BASE_URL } from "../../utils/axios";
import { format } from 'date-fns';
import { AiOutlineCloseCircle } from 'react-icons/ai';

export default function PaymentDetails(props) {
  const { car, bookedSlot,setShowPayment } = props;
  console.log(bookedSlot[0].id,'booked slot')

  const slot = bookedSlot[0];
  const start_time = new Date(slot.date);
  const end_time = new Date(slot.date); // Convert the date string to a Date object
  end_time.setDate(end_time.getDate() + 1);

  // Calculate the number of days beyond the return date
  const today = new Date();
  const daysLate = Math.max(0, Math.ceil((today - end_time) / (1000 * 60 * 60 * 24)));

  // Calculate the additional charges
  const lateCharges = daysLate * car.price_per_day;

  return (
    <div className="flex items-center justify-center  bg-gradient-to-br from-indigo-800 to-indigo-600">
      <div className="w-96 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <AiOutlineCloseCircle
            onClick={() => setShowPayment(false)}
            className="text-white w-6 h-6 ml-auto cursor-pointer"
          />
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl text-indigo-800 font-semibold mb-2">{car?.name}</h2>
          <p className="text-gray-600 mb-2">Renter Name: {car?.renter_name}</p>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg text-gray-700 font-medium">Booking Fee</h3>
          <p className="text-3xl text-indigo-700 mt-2">&#x20B9; {car.price_per_day}</p>
          <h3 className="text-lg text-gray-700 font-medium mt-4">Booking Date</h3>
          <p className="text-2xl text-indigo-700 mt-2">{start_time.toDateString()}</p>
          <p className="text-md text-gray-600 mt-4">
            Late Return Charges: {car.price_per_day} per day
          </p>
          <p className="text-sm text-gray-500 mt-2">
            If the car is not returned by the end of the same day, you will be charged {car.price_per_day} for each additional day.
          </p>
          <div className="w-full flex items-center justify-center mt-6">
            <PaymentPage car={car} bookedSlot={bookedSlot} />
          </div>
        </div>
      </div>
    </div>
  );
  
}
