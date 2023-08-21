import React, { useEffect, useState } from "react";
import { Card, Input, Typography } from "@material-tailwind/react";
import { toast, Toaster } from 'react-hot-toast';
import instance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [doctor, setDoctor] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setDoctor(userData.userID);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('doctor', doctor);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      const renterID = JSON.parse(localStorage.getItem("user")).userID;
      formData.append("renter", renterID); 
      console.log(renterID)
      await instance.post('/roomCreate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
     
      toast.success('Successfully created Room');
      navigate("/dashboards");
    } catch (error) {
      console.log(error);
      toast.error('Could not create Room');
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card color="transparent" shadow={false} className="w-96">
        <Toaster position="top-center" reverseOrder={false} limit={1} />
        <Typography variant="h4" color="blue-gray" className="font-serif mt-3 text-center">
          Create Room
        </Typography>
  
        <form
          className="mt-8 mb-2"
          onSubmit={handleFormSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Input
              size="lg"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <Input
              size="lg"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 mt-3"
              required
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="focus:outline-none mt-5"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Create Room
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
  
}
