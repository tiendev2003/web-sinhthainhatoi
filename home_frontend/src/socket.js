import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_HOST_URL || "http://localhost:4000";
let socketInstance = null;

export const getSocketInstance = () => {
    if (!socketInstance) {
        socketInstance = io(ENDPOINT, {
            withCredentials: true,
            transports: ['polling', 'websocket'], // Try polling first, then websocket
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            forceNew: true
        });
        
        // Add event listeners for connection status
        socketInstance.on('connect', () => {
            console.log('Socket.io connected successfully');
        });
        
        socketInstance.on('connect_error', (error) => {
            console.error('Socket.io connection error:', error);
        });
        
        socketInstance.on('disconnect', (reason) => {
            console.log('Socket.io disconnected:', reason);
        });
    }
    return socketInstance;
};