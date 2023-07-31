import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";
import Sidebar from "./Sidebar";

function CreateCategory() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);
    const formData = new FormData();
    formData.append("name", category);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await instance.post(
        "cars/create-car-category/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);

      if (res.status === 201) {
        toast.success("Category created");
        navigate("/categoryrenter");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
        <h1 className="text-3xl font-bold mb-6">CREATE CATEGORY</h1>

        <input
          className="bg-gray-200 h-14 w-full border-2 mt-2 placeholder-gray-600 outline-none text-black px-4 rounded-md"
          type="text"
          name="category"
          placeholder="Category Name"
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
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;
