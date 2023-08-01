import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import instance from "../../utils/axios";

function CreateCar() {

  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [yearManufactured, setYearManufactured] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [airConditioned, setAirConditioned] = useState("");
  const [powerWindows, setPowerWindows] = useState("");
  const [centralLocking, setCentralLocking] = useState("");
  const [audioSystem, setAudioSystem] = useState("");
  const [gpsNavigation, setGPSNavigation] = useState("");
  
  const [description, setDescription] = useState("");
  const [price_per_day, setPricePerDay] = useState(null);
 
  const [image, setImage] = useState(null);
  const [categoryList, setCategorylist] = useState([]);

  
  const navigate = useNavigate();

  useEffect(() => {
    async function categories() {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).userID;
        const response = await instance.get("cars/car-category/", {
          params: { renter: userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategorylist(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    }
  
    categories();
  }, []);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("category", category);
    form.append("name", name);
    form.append("brand", brand);
    form.append("year_manufactured", yearManufactured);
    form.append("mileage", mileage);
    form.append("fuel_type", fuelType);
    form.append("transmission_type", transmissionType);
    form.append("seating_capacity", seatingCapacity);
    form.append("air_conditioned", airConditioned);
    form.append("power_windows", powerWindows);
    form.append("central_locking", centralLocking);
    form.append("audio_system", audioSystem);
    form.append("gps_navigation", gpsNavigation);
    form.append("description", description);
    form.append("price_per_day", price_per_day);
    form.append("image", image);
   
    if (image) {
      const imageFileType = image.type;
      if (imageFileType.startsWith("image")) {
        form.append("image", image);
      } else {
        toast.error("Please select an image file for the 'image' field");
        return;
      }
    }
    const renterID = JSON.parse(localStorage.getItem("user")).userID; // Get the renter's ID from localStorage
    form.append("renter", renterID); // Include

    console.log(image);
    
    const res = await instance.post("cars/create-car/",form,{
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
  });
    console.log(res);
    if (res.status === 201) {
      toast.success("car added");
      navigate("/carrenter");
    } else {
      toast.error(res.statusText);
    }
  };

  const handlePriceChange = (e) => {
    const enteredValue = parseFloat(e.target.value);
    if (!isNaN(enteredValue) && enteredValue >= 0) {
      setPricePerDay(enteredValue);
    } else {
      // Prevent updating the state with negative values
      setPricePerDay("");
    }
  };

return (
  <div className="bg-gradient-to-br from-purple-300 to-blue-200 min-h-screen flex items-center justify-center px-4">
    <Toaster position="top-center" reverseOrder={false} />

    <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-bold underline mb-6 text-center">Add Car</h1>
      <form
      onSubmit={handleSubmit}
      encType="multipart/formdata"
    >
      <div className="space-y-4">
        <label className="block text-base" htmlFor="car">
          Car Name
        </label>
        <input
          className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-base" htmlFor="car">
          Description
        </label>
        <input
          className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
          type="text"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

     {/* Brand */}
<div className="space-y-4">
<label className="block text-base" htmlFor="brand">
  Brand
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="text"
  name="brand"
  onChange={(e) => setBrand(e.target.value)}
  required
/>
</div>

{/* Year Manufactured */}
<div className="space-y-4">
<label className="block text-base" htmlFor="year_manufactured">
  Year Manufactured
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="number"
  name="year_manufactured"
  onChange={(e) => setYearManufactured(e.target.value)}
  required
/>
</div>

{/* Mileage */}
<div className="space-y-4">
<label className="block text-base" htmlFor="mileage">
  Mileage
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="number"
  name="mileage"
  onChange={(e) => setMileage(e.target.value)}
  required
/>
</div>

{/* Fuel Type */}
<div className="space-y-4">
  <label className="block text-base" htmlFor="fuel_type">
    Fuel Type
  </label>
  <select
    className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
    name="fuel_type"
    onChange={(e) => setFuelType(e.target.value)}
    required
  >
    <option value="">Select Fuel Type</option>
    <option value="Petrol">Petrol</option>
    <option value="Diesel">Diesel</option>
    <option value="Electric">Electric</option>
    <option value="Hybrid">Hybrid</option>
   
  </select>
</div>


{/* Transmission Type */}
<div className="space-y-4">
  <label className="block text-base" htmlFor="transmission_type">
    Transmission Type
  </label>
  <select
    className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
    name="transmission_type"
    onChange={(e) => setTransmissionType(e.target.value)}
    required
  >
    <option value="">Select Transmission Type</option>
    <option value="Automatic">Automatic</option>
    <option value="Manual">Manual</option>
  </select>
</div>


{/* Seating Capacity */}
<div className="space-y-4">
<label className="block text-base" htmlFor="seating_capacity">
  Seating Capacity
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="number"
  name="seating_capacity"
  onChange={(e) => setSeatingCapacity(e.target.value)}
  required
/>
</div>

{/* Air Conditioned */}
<div className="space-y-4">
<label className="block text-base">
  Air Conditioned
</label>
<div className="space-x-4">
  <input
    type="radio"
    id="air_conditioned_yes"
    name="air_conditioned"
    value="yes"
    checked={airConditioned === "yes"}
    onChange={(e) => setAirConditioned(e.target.value)}
    required
  />
  <label htmlFor="air_conditioned_yes">Yes</label>
  <input
    type="radio"
    id="air_conditioned_no"
    name="air_conditioned"
    value="no"
    checked={airConditioned === "no"}
    onChange={(e) => setAirConditioned(e.target.value)}
  />
  <label htmlFor="air_conditioned_no">No</label>
</div>
</div>

{/* Power Windows */}
<div className="space-y-4">
<label className="block text-base">
  Power Windows
</label>
<div className="space-x-4">
  <input
    type="radio"
    id="power_windows_yes"
    name="power_windows"
    value="yes"
    checked={powerWindows === "yes"}
    onChange={(e) => setPowerWindows(e.target.value)}
    required
  />
  <label htmlFor="power_windows_yes">Yes</label>
  <input
    type="radio"
    id="power_windows_no"
    name="power_windows"
    value="no"
    checked={powerWindows === "no"}
    onChange={(e) => setPowerWindows(e.target.value)}
  />
  <label htmlFor="power_windows_no">No</label>
</div>
</div>

{/* Central Locking */}
<div className="space-y-4">
<label className="block text-base">
  Central Locking
</label>
<div className="space-x-4">
  <input
    type="radio"
    id="central_locking_yes"
    name="central_locking"
    value="yes"
    checked={centralLocking === "yes"}
    onChange={(e) => setCentralLocking(e.target.value)}
    required
  />
  <label htmlFor="central_locking_yes">Yes</label>
  <input
    type="radio"
    id="central_locking_no"
    name="central_locking"
    value="no"
    checked={centralLocking === "no"}
    onChange={(e) => setCentralLocking(e.target.value)}
  />
  <label htmlFor="central_locking_no">No</label>
</div>
</div>

{/* Audio System */}
<div className="space-y-4">
<label className="block text-base">
  Audio System
</label>
<div className="space-x-4">
  <input
    type="radio"
    id="audio_system_yes"
    name="audio_system"
    value="yes"
    checked={audioSystem === "yes"}
    onChange={(e) => setAudioSystem(e.target.value)}
    required
  />
  <label htmlFor="audio_system_yes">Yes</label>
  <input
    type="radio"
    id="audio_system_no"
    name="audio_system"
    value="no"
    checked={audioSystem === "no"}
    onChange={(e) => setAudioSystem(e.target.value)}
  />
  <label htmlFor="audio_system_no">No</label>
</div>
</div>

{/* GPS Navigation */}
<div className="space-y-4">
<label className="block text-base">
  GPS Navigation
</label>
<div className="space-x-4">
  <input
    type="radio"
    id="gps_navigation_yes"
    name="gps_navigation"
    value="yes"
    checked={gpsNavigation === "yes"}
    onChange={(e) => setGPSNavigation(e.target.value)}
    required
  />
  <label htmlFor="gps_navigation_yes">Yes</label>
  <input
    type="radio"
    id="gps_navigation_no"
    name="gps_navigation"
    value="no"
    checked={gpsNavigation === "no"}
    onChange={(e) => setGPSNavigation(e.target.value)}
  />
  <label htmlFor="gps_navigation_no">No</label>
</div>
</div>

{/* Price */}
<div className="space-y-4">
<label className="block text-base" htmlFor="car">
  Price Per Day
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="number"
  name="price"
  value={price_per_day}
  onChange={handlePriceChange}
  required
/>
</div>

{/* Image */}
<div className="space-y-4">
<label className="block text-base" htmlFor="car">
  Image
</label>
<input
  className="w-full h-12 border-2 rounded-md px-4 outline-none focus:ring-primaryBlue focus:border-primaryBlue"
  type="file"
  name="image"
  onChange={(e) => setImage(e.target.files[0])}
  required
/>
</div>

{/* Category */}
<div className="space-y-4">
<label className="block text-base" htmlFor="car">
  Category
</label>
<select
  className="w-full h-12 border-2 rounded-md px-4 bg-gray-200 border-gray-300 text-gray-800 outline-none focus:border-gray-400"
  name="category"
  onChange={(e) => setCategory(e.target.value)}
  required
>
  <option value="">Select category</option>
  {categoryList.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>
</div>


<input
className="bg-green-600 hover:bg-green-700 mt-4 h-12 w-full text-white font-semibold rounded-md shadow-md cursor-pointer transition-colors duration-300"
type="submit"
value="Add Car"
/>

      </form>
    </div>
  </div>
);
}

export default CreateCar;
