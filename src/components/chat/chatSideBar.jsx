import React from 'react';
import avatar from '../../images/avatar.png';

const ChatSidebar = ({ rooms, activeRoomId, setActiveRoomId, isRenter }) => {
  const filteredRooms = isRenter
    ? rooms.filter(room => room.renter.id === isRenter.userID)
    : rooms;

  return (
    <div className="flex flex-col bg-gray-200 h-screen w-1/4 border-r-2 border-gray-300">
      <h2 className="text-xl font-bold p-4 bg-gray-700 text-white">Chat</h2>
      <ul className="flex-grow overflow-y-auto">
        {filteredRooms.map((room) => (
          <li
            key={room.id}
            className={`flex items-center py-3 px-4 cursor-pointer ${
              room.id === activeRoomId ? 'bg-gray-300' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveRoomId(room.id)}
          >
            <div className="flex-shrink-0 mr-3 mt-1">
              <img
                src={avatar}
                alt="Room Avatar"
                className="rounded-full w-12 h-12 object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-start ms-3 text-lg font-semibold">{room.name}</h3>
              
            </div>
            {room.unreadCount > 0 && (
              <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-white text-xs">{room.unreadCount}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
