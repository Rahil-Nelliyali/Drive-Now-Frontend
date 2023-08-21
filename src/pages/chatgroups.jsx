import React from "react";
import NavbarComponent from "../components/user/Navbar";
import Chat from "../components/chat/chat"
import NavbarComponentRenter from "../components/renter/Sidebar";
const ChatGroup = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const isRenter = userData ? userData.is_renter : false;

  return (
    <div>
    {isRenter ? <NavbarComponentRenter /> : <NavbarComponent />}
     <Chat/>
     </div>
  );
};

export default ChatGroup;
