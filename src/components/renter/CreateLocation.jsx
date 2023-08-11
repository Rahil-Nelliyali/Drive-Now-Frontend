import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../../utils/axios';

const CreateLocation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCarDetails() {
      try {
        const response = await instance.get(`/cars/single-car/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCar(response.data);
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      }
      setLoading(false);
    }
    getCarDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please fill the details.');
      return;
    }
    setLoading(true);
    try {
     
      const userId = JSON.parse(localStorage.getItem('user')).userID;
      const response = await instance.post(
        '/cars/createlocations/',
        {
          car: car.id,
          name: name,   // Upname field name here
         
          status,
        },
        {
          params: { renter: userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      navigate(`/carrenter`);
      toast.success('Location created successfully');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to create slots.');
      } else if (error.response && error.response.status === 400) {
        toast.error('Slots already exist for the selected name range.');
      } else {
        toast.error('Failed to create slots. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-2/4 '>
      <Toaster position='top-center' reverseOrder='false' limit={1}></Toaster>
      <div className='w-3/4 mt-16 mx-auto p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Create Location</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='name' className='block font-medium mb-1'>
               name:
            </label>
            <input
              type='name'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full border-gray-300 border-2 rounded-md py-2 px-3'
            />
          </div>
         
        

          <div className='mb-4'>
            <label htmlFor='status' className='block font-medium mb-1'>
              Status:
            </label>
            <input
              type='checkbox'
              id='status'
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className='mr-2'
            />
            <span className='text-gray-700'>Active</span>
          </div>

          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocation;
