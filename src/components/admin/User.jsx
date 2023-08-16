import React from "react";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import instance from "../../utils/axios";

function User() {
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  async function getUser() {
    const response = await instance.get("api/users/");
    setUser(response.data);
  }
  useEffect(() => {
    async function getUser() {
      try {
        const response = await instance.get("api/users/");
        setUser(response.data);
      } catch (error) {}
    }
    getUser();
  }, []);

  const statusChange = (id) => {
    // console.log('user id', id)
    instance.get(`api/blockuser/${id}/`).then(() => getUser());
    // console.log(response);
  };


  const handleSearch = () => {
    const filteredUsers = user.filter(user =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredUsers;
  };

  const filteredUsers = handleSearch();

  return (
    <div className="flex h-full bg-acontent">
      <Sidebar />
      <div className="px-5 w-full h-auto min-h-screen mx-5 mt-2 py-8 font-poppins flex flex-col place-content-start place-items-center bg-white shadow-xl rounded-xl">
        <div className="w-full h-screen px-3 font-poppins">
          {/* User search input */}
          <div className="w-full p-5 flex justify-between">
          <h1 className='  text-3xl text-start  ms-4'>Users</h1>
          <input
              type="text"
              placeholder='&#x1F50D; Search '
              className="border border-primaryBlue border-solid focus:outline-none px-2 w-1/5 rounded-lg "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /></div>
          {/* User table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    User Name
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Email Address
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-large text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {filteredUsers.map((user, index) => (
                  <tr className="hover:bg-gray-50" key={index}>
                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <span className={`absolute right-0 bottom-0 h-2 w-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'} ring ring-white`}></span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="text-gray-400">{user.email}</div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      <p>{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{user.phone_number}</p>
                    </td>
                    <td class="px-6 py-4">
                      {user.is_active ? (
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
                            checked={!user.is_active}
                            readOnly
                          />
                          <div
                            onClick={() => statusChange(user.id)}
                            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                          ></div>
                          {user.is_active ? (
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

export default User;
