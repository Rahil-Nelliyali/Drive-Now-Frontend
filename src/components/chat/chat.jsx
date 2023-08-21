import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from './chatSideBar';
import { Avatar } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import instance from '../../utils/axios';
import avatar from '../../images/avatar.png';


const ChatComponent = () => {
  const [author, setAuthor] = useState('');
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user,setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const userData = JSON.parse(localStorage.getItem('user'));

  const scroll = useRef();

  const socketRef = useRef(null);
  
  const history = useNavigate()

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setAuthor(userData.userID);
  
      if (userData.is_renter) {
        instance
          .get(`rooms/?renter=${userData.userID}`) // Fetch only renter's rooms
          .then((response) => {
            setRooms(response.data);
            console.log(response.data);
            setActiveRoomId(response.data[0]?.id);
            setIsLoading(false); // Finished loading
          })
          .catch((error) => {
            console.error('Error:', error);
            setIsLoading(false);
          });
      } else {
        instance
          .get('allrooms/') // Fetch all rooms for normal user
          .then((response) => {
            setRooms(response.data);
            console.log(response.data);
            setActiveRoomId(response.data[0]?.id);
            setIsLoading(false); // Finished loading
          })
          .catch((error) => {
            console.error('Error:', error);
            setIsLoading(false);
          });
      }
    } catch (e) {
      history('/login');
      toast.error('Please Login for community chat', { duration: 5000 });
    }
  }, []);
  
  



  useEffect(() => {
    if (activeRoomId) {
      socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${activeRoomId}/`);

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      instance
        .get(`rooms/${activeRoomId}/messages/`)
        .then((response) => {
          setMessages(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [activeRoomId]);

  const sendMessage = () => {
    const message = {
      content: newMessage,
      author: author,
      room_id: activeRoomId,
    };

    
    instance
      .post(`rooms/${activeRoomId}/messages/`, message)
      .then((response) => {
        const newMessage = response.data;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message));
    }

    setNewMessage('');
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
    async function getUser() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData.userID);
        
       
      } catch (e) {
        console.log(e);
      }
    }
    getUser()
  }, [messages]);

const userIsRenter = user && user.is_renter;

  const filteredMessages = userIsRenter
    ? messages.filter(message => message.room.renter.id === user.userID)
    : messages;


  return (
    <div className="flex h-screen   rounded-md bg-gray-200">
      <ChatSidebar
        rooms={rooms}
        activeRoomId={activeRoomId}
        setActiveRoomId={setActiveRoomId}
      />
      <div className="flex-grow ">
        <div className="flex flex-col h-screen">
          <div className="py-4 px-6 bg-gray-700 text-white">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
          <div className="flex-grow p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  ref={scroll}
                  className={`flex ${
                    message.author === author ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`${
                      message.author === author
                        ? 'bg-green-500 text-white self-end'
                        : 'bg-blue-500 text-white self-start'
                    } py-2 px-4 rounded-lg max-w-md`}
                  >
                    <div className="flex items-center">
                      {message.author === author ? (
                        <>
                          {message.content && (
                            <div className="mr-3">{message.content}</div>
                          )}
                          <Avatar
                            src={avatar}
                            alt="avatar"
                            size="xs"
                            className='rounded-full h-6 w-6'
                          />
                        </>
                      ) : (
                        <>
                          <Avatar
                            src={
                              message.author === user ? (
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHQv_th9wq3ivQ1CVk7UZRxhbPq64oQrg5Q&usqp=CAU"
                              ) : (
                                avatar
                              )
                            }
                            alt="avatar"
                            size="xs"
                            className="mr-3 rounded-full h-6 w-6"
                          />
                          {message.content && (
                            <div>{message.content}</div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}                  </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No messages yet</div>
            )}
          </div>
          <div className="py-4 px-6 bg-gray-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow border border-gray-400 rounded-lg px-4 py-2 focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
