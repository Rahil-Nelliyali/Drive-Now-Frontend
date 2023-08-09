import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

function CreateCategory() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userJSON = localStorage.getItem('user');
  const user = userJSON ? JSON.parse(userJSON) : null;
  console.log(user);
  console.log(token)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", category);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    const renterID = JSON.parse(localStorage.getItem("user")).userID; // Get the renter's ID from localStorage
    formData.append("renter", renterID); // Include

    try {
      const res = await instance.post("cars/create-car-category/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Location created");
        navigate("/categoryrenter");
      } else {
        const errorData = await res.json();
        console.error("Form submission failed:", errorData);
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };


  return (
    <div className="bg-gradient-to-br h-screen w-screen flex items-center justify-center">
   
      <Toaster position="top-center" reverseOrder={false} />

      <form
        className="bg-white shadow-md rounded-lg px-10 py-8 flex flex-col items-center w-96"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1 className="text-3xl font-bold mb-6">Add Location</h1>

        <input
          className="bg-gray-200 h-14 w-full border-2 mt-2 placeholder-gray-600 outline-none text-black px-4 rounded-md"
          type="text"
          name="category"
          placeholder="Location Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          className="bg-gray-200 h-14 w-full border-2 mt-4 placeholder-gray-600 outline-none text-black px-4 rounded-md"
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="bg-gray-200 h-14 w-full border-2 mt-4 placeholder-gray-600 outline-none text-black px-4 rounded-md"
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button
          className="bg-custom-red mt-6 h-10 w-full text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
          type="submit"
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;