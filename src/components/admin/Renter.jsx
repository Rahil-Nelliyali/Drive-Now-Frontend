import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import instance from "../../utils/axios";

function Renter() {
  const [renters, setRenters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  async function getRenters() {
    const response = await instance.get("api/renters/");
    setRenters(response.data);
  }

  useEffect(() => {
    async function getRenters() {
      try {
        const response = await instance.get("api/renters/");
        setRenters(response.data);
      } catch (error) {}
    }
    getRenters();
  }, []);

  const statusChange = (id) => {
    instance.get(`api/blockrenter/${id}/`).then(() => getRenters());
  };





  const handleSearch = () => {
    const filteredRenters = renters.filter(renter =>
      renter.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || renter.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||renter.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredRenters;
  };

  const filteredRenters = handleSearch();

  return (
    <div className="flex h-full bg-acontent">
      <Sidebar />
      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3 font-poppins">
          <Toaster position="top-center" reverseOrder={false} />
          <div className="w-full p-5 flex justify-between">
          <h1 className='  text-3xl text-start  ms-4'>Renters</h1>
          <input
              type="text"
              placeholder='&#x1F50D; Search '
              className="border border-primaryBlue border-solid focus:outline-none px-2 w-1/5 rounded-lg "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /></div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-large text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-large text-gray-900"
                  >
                    Email
                  </th>
                 
                  <th
                    scope="col"
                    className="px-6 py-4 font-large text-gray-900"
                  >
                    Phone number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-large text-gray-900"
                  >
                    Status
                  </th>
                  <th
                  scope="col"
                  className="px-6 py-4 font-large text-gray-900"
                >
                  Action
                </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                 {filteredRenters.map((renter, index) => (
                  <tr className="hover:bg-gray-50" key={index}>
                    <td className="px-6 py-4">{renter.first_name} {renter.last_name}</td>
                    <td className="px-6 py-4">{renter.email}</td>
                    <td className="px-6 py-4">{renter.phone_number}</td>
                    <td class="px-6 py-4">
                      {renter.is_active ? (
                        <span class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          Active
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          <span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                          Blocked
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <td class="px-6 py-4">
                        <div className="flex">
                          <label class="inline-flex relative items-center mr-5 cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!renter.is_active}
                              readOnly
                            />
                            <div
                              onClick={() => statusChange(renter.id)}
                              className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                            ></div>
                            {renter.is_active ? (
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                Block
                              </span>
                            ) : (
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                Unblock
                              </span>
                            )}
                          </label>
                        </div>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        </div>
      </div>
    </div>
  );
} 
  



export default Renter;
