import React, { createContext, useContext, useMemo, useEffect } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    console.log(socket, 'socketcontext');
    return socket;
};

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const socketURL = `${wsProtocol}//drivenowbackend.onrender.com/ws/chat/`; // Update with your actual backend's WebSocket endpoint

        try {
            return new WebSocket(socketURL);
        } catch (error) {
            console.error("WebSocket connection failed:", error);
            return null; // Return null in case of connection failure
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
