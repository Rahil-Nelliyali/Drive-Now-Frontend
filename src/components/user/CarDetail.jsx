import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import instance from '../../utils/axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import PaymentDetails from './PaymentDetails';

function CarDetail() {



  
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookedSlot, setBookedSlot] = useState([]);
  

  async function getSlotsForCar(carId) {
    try {
      const response = await instance.get(`/cars/slots/${carId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
       
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      return [];
    }
  }

  useEffect(() => {
    async function getCarDetails() {
      try {
        const response = await instance.get(`/cars/single-car/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCar(response.data);
        console.log(response.data);
        const slotsData = await getSlotsForCar(response.data.id);
        setSlots(slotsData);
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      }
      setLoading(false);
    }

   

   
    getCarDetails();
    
  }, [id]);

  const handleChange = async (e) => {
   
    setDate( e.target.value)
    const selected = slots.filter((slot) => slot.date ===  e.target.value);
    setSelectedSlots(selected);
  };
  

  const toggleDate = () => {
    setShowDate(true);
  };

  const handleClick = (id) => {
    console.log()
    const buttonElement = document.getElementById(id);
    if (buttonElement) {
      buttonElement.classList.toggle('bg-blue-500');
      buttonElement.classList.toggle('bg-green-500');
    }
    console.log(selectedSlots,'selected')
    const bookedslot = selectedSlots?.filter((selected) => selected.id === id)
    console.log(bookedslot,'booked slot')
    
    setBookedSlot(bookedslot)
  };
  
  
  const fetchData = async () => {
    if (showDate && date) {
      const slotsData = await getSlotsForCar(car.id);
      console.log(slotsData);
      setSlots(slotsData);
      const selected = slotsData.filter(slot => slot.date === date);
      setSelectedSlots(selected);
    }
  };

 
  
 


 


  return (
    <div className='w-full h-full font-poppins relative'>
      <Toaster position='top-center' limit={3} />
      <div className='w-full h-20 flex items-center bg-primaryBlue text-white'>
        <Navbar />
      </div>
      <div className='p-5 w-full h-full min-h-screen'>
        {loading ? (
          <h1 className='text-3xl font-bold text-center text-primaryBlue'>Loading...</h1>
        ) : car ? (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='relative group'>
              <img className='w-full h-screen object-cover rounded-md' src={car.image} alt='car_image' />
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <h1 className='text-4xl font-semibold text-white'>{car.name}</h1>
                <p className='text-xl font-normal text-gray-300 mt-2'>{car.category.name}</p>
              </div>
            </div>
            <div className='mt-4'>
              <h1 className='text-3xl font-semibold text-primaryBlue'>{car.name}</h1>
              <p className='text-gray-600 mt-2'>{car.description}</p>


              {!showDate ? (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md ms-1 mt-2"
                  onClick={toggleDate}
                >
                  Book Appointment
                </button>
              ) : (
                <div className='mb-4'>
                  <h5 className='mt-1'>Select a Date</h5>
                  <input
                    type='date'
                    id='date'
                    value={date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className='mt-3 border-gray-300 border-2 rounded-md py-2 px-3'
                  />
                  </div>
                  )
                }
                  
                    
      {showDate && selectedSlots?.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 mt-3">
          <div className="bg-white rounded-lg p-6">
            <div className="flex place-content-end">
              <AiOutlineCloseCircle
                className="text-end text-gray-500"
                onClick={() => {
                  setShowDate(false);
                  setSelectedSlots([]);
                  setDate('');
                }}
              />
            </div>
      
            <h5 className="mt-1 font-serif text-xl">Available Slots:</h5>
            <div className="grid grid-cols-3 gap-4 mt-4">
            {selectedSlots.map((slot) => {
              const startTime = slot.date;
            
              return (
                <button
                  key={slot.id}
                  className={`bg-blue-500 text-white py-2 px-4 rounded-md shadow-2xl ${slot.is_booked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  id={slot.id}
                  onClick={() => !slot.is_booked && handleClick(slot.id)}
                  disabled={slot.is_booked}
                >
                  {startTime}
                </button>
              );
            })}
            </div>
            <div className="w-full flex place-content-center">
              <button
                className="bg-yellow-500 text-black py-2 px-4 rounded-md border-black mt-4"
                onClick={() => setShowPayment(true)}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
      
              {showPayment && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
                  <PaymentDetails car={car} bookedSlot={selectedSlots} setShowPayment={setShowPayment} />
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div>
                  <p className='text-gray-600'>Price Per Day: {'₹ ' + car.price_per_day}</p>
                  <p className='text-gray-600'>Brand: {car.brand}</p>
                  <p className='text-gray-600'>Year Manufactured: {car.year_manufactured}</p>
                  <p className='text-gray-600'>Mileage: {car.mileage}</p>
                  <p className='text-gray-600'>Fuel Type: {car.fuel_type}</p>
                  <p className='text-gray-600'>Transmission Type: {car.transmission_type}</p>
                  <p className='text-gray-600'>Seating Capacity: {car.seating_capacity}</p>
                  <p className='text-gray-600'>Renter name: {car.renter_name}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Air Conditioned: {car.air_conditioned ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Power Windows: {car.power_windows ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Central Locking: {car.central_locking ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>Audio System: {car.audio_system ? 'Yes' : 'No'}</p>
                  <p className='text-gray-600'>GPS Navigation: {car.gps_navigation ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <p className='text-xl font-semibold text-primaryBlue mt-4'>Car not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarDetail;
