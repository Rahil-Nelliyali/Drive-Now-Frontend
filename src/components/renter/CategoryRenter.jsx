import React from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import instance from "../../utils/axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

function Categories() {
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user")).userID;
    getCategory(userId);
  }, []);

  const getCategory = async (userId) => {
    try {
      const response = await instance.get("cars/car-category/", {
        params: { renter: userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategory(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };


  const deleteCategory = async (cat_id) => {
    console.log(cat_id);
  
    // Show the SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this category. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await instance.delete(
            `cars/delete-car-category/${cat_id}/`
          );
          console.log(response);
          getCategory();
          toast.success("Category deleted successfully");
          handleClose();
        } catch (error) {
          toast.error("Failed to delete the Category");
        }
      }
    });
  };


  const handleClose = () => {
    setSelectedCategory(null);
    setOpen(false);
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", selectedCategory.name);
      formData.append("description", selectedCategory.description);
      formData.append("image", selectedCategory.image);

      const response = await instance.get(`cars/update-car-category/${selectedCategory.id}`, formData);

      if (response.status === 200) {
        toast.success('Category updated successfully');
        getCategory();
        handleClose();
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  return (
    <div className="">
      <Sidebar />
      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2  py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3  font-poppins">
          <div className="w-full p-5 mb-10">
            <Button
              className="bg-blue-gray-900 float-right"
              onClick={() => navigate("/createcategory")}
            >
              Add Location
            </Button>
          </div>
          <Toaster position="top-center" reverseOrder={false}></Toaster>
          <div className=" rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full  border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Location Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Location Image
                  </th>
                 
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {category.map((category) => (
                  <tr className="hover:bg-gray-50" key={category.id}>
                    <td className="px-6 py-4">
                      <p>{category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>
                        <img className="w-4/5 h-24" src={category.image} alt={category.name} />
                      </p>
                    </td>
                  
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleOpen(category)}
                          variant="gradient"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteCategory(category.id)}
                          variant="gradient"
                         
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogHeader>Edit Category</DialogHeader>
        <DialogBody>
          <label className="text-gray-700">Name:</label>
          <input
            className="border border-gray-300 p-2 mt-1 w-full"
            type="text"
            value={selectedCategory?.name || ""}
            onChange={(e) =>
              setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                name: e.target.value,
              }))
            }
          />
          <label className="text-gray-700 mt-3">Description:</label>
          <input
            className="border border-gray-300 p-2 mt-1 w-full"
            type="text"
            value={selectedCategory?.description || ""}
            onChange={(e) =>
              setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                description: e.target.value,
              }))
            }
          />
          <label className="text-gray-700 mt-3">Image:</label>
          <input
            className="border border-gray-300 p-2 mt-1 w-full"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                image: e.target.files[0],
              }))
            }
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleEdit}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Categories;