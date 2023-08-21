import React, { createContext, useContext, useMemo } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    console.log(socket, 'socketcontext');
    return socket;
};

export const SocketProvider = ({ children }) => {
    // Create a WebSocket connection using the native browser API
    const socket = useMemo(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const socketURL = `${wsProtocol}//${window.location.host}/ws/chat/`;

        return new WebSocket(socketURL);
    }, []);

    socket.onopen = (event) => {
        console.log('WebSocket connection opened:', event);
    };

    socket.onmessage = (event) => {
        console.log('WebSocket message received:', event);
    };

    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
