import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../utils/axios";
import { Link } from "react-router-dom";
import { AiFillEye } from 'react-icons/ai';
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function Carrenter() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editedCar, setEditedCar] = useState({
    name: "",
    brand: "",
    year_manufactured: "",
    mileage: "",
    fuel_type: "",
    transmission_type: "",
    seating_capacity: "",
    air_conditioned: "",
    power_windows: "",
    central_locking: "",
    audio_system: "",
    gps_navigation: "",
    description: "",
    category: 0, // Assuming 0 is the default category value
    image: null,
    price_per_day: 0, // Assuming 0 is the default price value
    user: "", // Assuming an empty string is the default user value
  });
  const [category, setCategory] = useState([]);

  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(1);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentCars = cars.slice(firstPostIndex, lastPostIndex);


  const handleOpen = (id) => {
    setSelectedCarId(id);
    setOpen(true);
  };

  

  const handleEdit = (car) => {
    setSelectedCarId(car.id);
    setEditMode(true);
    setEditedCar({
      ...car,
      category: car.category.id, // Extract the ID from the category object
    });
    setOpen(true);
  };

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value); // Convert the value to an integer
    setEditedCar({
      ...editedCar,
      category: categoryId,
      
    });
  };
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      if (files && files.length > 0) {
        setUploadedImage(files[0]);
        setEditedCar((preveditedCar) => ({
          ...preveditedCar,
          image: URL.createObjectURL(files[0]),
        }));
      }
    }else {
      setEditedCar((preveditedCar) => ({
        ...preveditedCar,
        [name]: value,
      }));
    }
  };
  

  const handleSave = async () => {
    try {
      console.log(editedCar,'edit');
      const formData = new FormData();
    
      formData.append("name", editedCar.name);
   
      formData.append("description", editedCar.description);
      formData.append("category", editedCar.category);
      formData.append("brand", editedCar.brand);
      formData.append("year_manufactured", editedCar.year_manufactured);
      formData.append("mileage", editedCar.mileage);
      formData.append("fuel_type", editedCar.fuel_type);
      formData.append("transmission_type", editedCar.transmission_type);
      formData.append("seating_capacity", editedCar.seating_capacity);
      formData.append("air_conditioned", editedCar.air_conditioned);
      formData.append("power_windows", editedCar.power_windows);
      formData.append("central_locking", editedCar.central_locking);
      formData.append("audio_system", editedCar.audio_system);
      formData.append("gps_navigation", editedCar.gps_navigation);

      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }
     
      formData.append("price_per_day", editedCar.price_per_day);
console.log(formData,'asdfghj');
      await updatecar(selectedCarId, formData);
    } catch (error) {
      toast.error("Failed to save the car");
    }
  };

 


  const updatecar = async (id, formData) => {
    try {
      const response = await instance.put(
        `cars/update-car/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getcars();
      toast.success("car updated successfully");
      handleClose();
    } catch (error) {
      toast.error("Failed to update the car");
    }
  };

  const deleteCar = async (car_id) => {
    console.log(car_id);
  
    
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this car. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await instance.delete(`cars/delete-car/${car_id}/`);
          console.log(response);
          getcars();
          toast.success("Car deleted successfully");
        } catch (error) {
          toast.error("Failed to delete the Car");
        }
      }
    });
  };

  const handleClose = () => {
    setSelectedCarId(null);
    setEditMode(false);
    setEditedCar({});
    setOpen(false);
  };

  const handleButtonClick = () => {
    navigate("/createcar");
  };
  const handleButtonClicks = () => {
    navigate('/singlecardetail/${car?.id}'); 
  };

  const handleCreateSlot = (carId) => {
    navigate(`/createslot/${carId}`);
  };

  const handleCreateLocation = (carId) => {
    navigate(`/createlocations/${carId}`);
  };

  


  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user")).userID;
    getcars(userId);
  }, []);

  const getcars = async (userId) => {
    try {
      const response = await instance.get("cars/car/", { params: { renter: userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },});
      setCars(response.data);
    } catch (error) {
      toast.error("Failed to fetch cars");
    }
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


  async function getuser() {
    const response = await instance.get("api/users/");
    setUser(response.data);
  }

  useEffect(() => {
    getuser();
  }, []);

  const statusChange = (id) => {
    // console.log('user id', id)
    instance.get(`api/blockuser/${id}`).then(() => getuser());
    // console.log(response);
  };

  
  return (
    <div className="">
      <Sidebar />
      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3 font-poppins">
          <h1 className="text-3xl font-bold text-center text-custom-red mt-10 mb-6">Your Cars</h1>
          <div className="w-full p-5 mb-10">
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 float-right transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-700 focus:outline-none"
              onClick={handleButtonClick}
            >
              Add new car
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Car Image
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Brand
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    Actions
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {cars.map((car) => (
                  <tr className="hover:bg-gray-50" key={car.id}>
                    <td className="px-6 py-4">
                      <p>{car.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <img className="h-16 w-16 object-cover rounded" src={car.image} alt={car.name} />
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.brand}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.price_per_day}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="bg-red-600 text-white rounded px-2 py-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-red-700 focus:outline-none"
                          onClick={() => deleteCar(car.id)}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleCreateSlot(car.id)}
                          className="bg-green-600 text-white rounded px-2 py-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-green-700 focus:outline-none"
                        >
                          Add Slot
                        </button>
                        <button
                        onClick={() => handleCreateLocation(car.id)}
                        className="bg-blue-600 text-white rounded px-2 py-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-700 focus:outline-none"
                      >
                        Add Pickup Location
                      </button>
                     
                      </div>
                    </td>
                    <td>
                      <Link className="action-text" to={`/singlecardetail/${car?.id}`}>
                        <p className="edit">
                          <AiFillEye /> View
                        </p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={open} onClose={handleClose}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            {editMode ? "Edit Car" : "Confirmation"}
            <Button
              color="red"
              buttonType="link"
              onClick={handleClose}
              ripple="dark"
              className="p-1 text-gray-500"
            >
              <FaTimes />
            </Button>
          </div>
        </DialogHeader>
        <DialogBody divider>
        <div className="h-96 overflow-y-auto">
          {editMode ? (
            <div>
              <label className="text-gray-600">Name</label>
              <Input
                name="name"
                value={editedCar.name || ""}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="mt-1"
              />
              <label className="text-gray-600">Brand</label>
              <Input
                name="brand"
                value={editedCar.brand || ""}
                onChange={handleInputChange}
                placeholder="Enter brand"
                className="mt-1"
              />
              <label className="text-gray-600">Year Manufactured</label>
              <Input
                name="year_manufactured"
                value={editedCar.year_manufactured || ""}
                onChange={handleInputChange}
                placeholder="Enter Year Manufactured"
                className="mt-1"
              />
              <label className="text-gray-600">Mileage</label>
              <Input
                name="mileage"
                value={editedCar.mileage || ""}
                onChange={handleInputChange}
                placeholder="Enter Mileage"
                className="mt-1"
              />
              <label className="text-gray-600">Fuel Type</label>
              <Input
                name="fuel_type"
                value={editedCar.fuel_type || ""}
                onChange={handleInputChange}
                placeholder="Enter Fuel Type"
                className="mt-1"
              />
              <label className="text-gray-600">Transmission Type</label>
              <Input
                name="transmission_type"
                value={editedCar.transmission_type || ""}
                onChange={handleInputChange}
                placeholder="Enter Transmission Type"
                className="mt-1"
              />
              <label className="text-gray-600">Seating Capacity</label>
              <Input
                name="seating_capacity"
                value={editedCar.seating_capacity || ""}
                onChange={handleInputChange}
                placeholder="Enter Seating Capacity"
                className="mt-1"
              />
              <label className="text-gray-600">Air Conditioned</label>
              <Input
                type="radio"
                name="air_conditioned"
                value={true}
                checked={editedCar.air_conditioned === true}
                onChange={handleInputChange}
              />
              Yes
              <label className="text-gray-600">Central Locking</label>
              <Input
                name="central_locking"
                type="radio"
                value={true}
                checked={editedCar.central_locking || ""}
                onChange={handleInputChange}
              />
              Yes
              <label className="text-gray-600">Audio System</label>
              <Input
                name="audio_system"
                type="radio"
                value={true}
                checked={editedCar.audio_system === true}
                onChange={handleInputChange}
                className="mt-1"
              />
              Yes
              <label className="text-gray-600">GPS</label>
              <Input
                name="gps_navigation"
                type="radio"
                value={true}
                checked={editedCar.gps_navigation === true}
                onChange={handleInputChange}
                className="mt-1"
              />
              Yes
              <label className="text-gray-600">Description</label>
              <Input
                name="description"
                value={editedCar.description || ""}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="mt-1"
              />
              <label className="text-gray-600">Price</label>
              <Input
                name="price"
                value={editedCar.price || ""}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="mt-1"
              />
              <br />
              <label className="text-gray-600">Category</label>
              <select
                value={editedCar.category.id}
                onChange={handleCategoryChange}
                name="category"
                className="border rounded-lg p-1 mt-1"
              >
                {category.map((category) => (
                  <option value={category.id} key={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
  
              <br />
              <label className="text-gray-600">Image</label>
              <div className="flex items-center mt-1">
                {uploadedImage ? (
                  <span className="mr-2">{uploadedImage.name}</span>
                ) : (
                  <span className="mr-2">Choose file</span>
                )}
                <input type="file" name="image" onChange={handleInputChange} />
              </div>
            </div>
          ) : (
            "Are you sure you want to delete this car?"
          )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleClose} className="mr-1">
            Cancel
          </Button>
          {editMode ? (
            <Button variant="gradient" color="green" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="gradient" color="green" >
              Confirm
            </Button>
          )}
        </DialogFooter>
      </Dialog>
        <ToastContainer position="top-center" />
       
      </div>
    </div>
  );
}

export default Carrenter;
