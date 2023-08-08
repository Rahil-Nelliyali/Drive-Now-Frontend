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
    <div className="w-96 mt-10 mx-auto shadow-lg rounded-lg overflow-hidden bg-gray-50">
      <div className="bg-indigo-500">
        <AiOutlineCloseCircle
          onClick={() => setShowPayment(false)}
          className="text-white w-5 h-5 ml-auto mt-2 me-2"
        />
       
      </div>
      <div className="text-center py-8">
        <h5 className="text-blue-gray-800 mb-2"> {car?.name}</h5>
        <h5 className="text-blue-gray-800 mb-2"> Renter Name: {car?.renter_name}</h5>
        

      </div>
      <div className="flex flex-col items-center py-4">
        <h4 className="text-gray-700 font-medium">Booking Fee</h4>
        <p className="text-indigo-600 text-2xl mt-2">&#x20B9; {car.price_per_day}</p>
        <h4 className="text-gray-700 font-medium mt-4">Booking Date</h4>
        <p className="text-indigo-600 text-2xl mt-2">{start_time.toDateString()} </p>
        <p className="text-lg font-semibold mb-2 mt-4">Late Return Charges: {car.price_per_day} per day</p>
        <p className="text-sm text-gray-500 mt-4">
        If the car is not returned by the end of the same day, you will be charged {car.price_per_day} for each additional day.
      </p>
      
        
        <div className="w-full flex items-center justify-center mt-6">
        <PaymentPage car={car} bookedSlot={bookedSlot} />
         
        </div>
      </div>
    </div>
  );

}
