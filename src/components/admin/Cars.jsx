import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance,  { BASE_URL } from '../../utils/axios';
import Swal from "sweetalert2";
import {
  Button,
  
} from "@material-tailwind/react";
import "./Cars.css"; 


function Car() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5); // Increase the number of posts per page for better visibility

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentCars = cars.slice(firstPostIndex, lastPostIndex);


  
  async function getCars() {
    const response = await instance.get("cars/car/");
    setCars(response.data);
  }

  useEffect(() => {
    async function getCars() {
      try {
        const response = await instance.get("cars/home-list-car/");
        setCars(response.data);
      } catch (error) {}
    }
    getCars();
  }, []);


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
          getCars();
          toast.success("Car deleted successfully");
        } catch (error) {
          toast.error("Failed to delete the Car");
        }
      }
    });
  };

 
 
  const statusChange = (id) => {
    instance.get(`cars/block-car/${id}`).then(() => getCars());
  };

  const options = [
    { value: 0, label: "All" },
    { value: 1, label: "Approved" },
    { value: 2, label: "Pending" },
  ];

  return (
    <div className="flex h-full bg-acontent">
      <Sidebar />

      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3 font-poppins">
          <div className="w-full p-5">
            <input
              type="text"
              placeholder="Search by name "
              className="border-b-2 border-primaryBlue focus:outline-none px-2 w-full"
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Car Image
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Short Description
                  </th>
                 
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {currentCars.map((car) => (
                  <tr className="hover:bg-gray-50" key={car.id}>
                    <td className="px-6 py-4">
                      <p>{car.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <img className="car-image" src={`${BASE_URL}${car.image}`} alt={car.title} />
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{car.description}</p>
                    </td>
                    
                    
                    <td className="action-col">
                    <Button
                    onClick={() => deleteCar(car.id)}
                    variant="gradient"
                   
                  >
                    Delete
                  </Button>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentCars.length < postsPerPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Car;
