import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_HOST_URL;
let socketInstance = null;

export const getSocketInstance = () => {
    if (!socketInstance) {
        socketInstance = io(ENDPOINT);
    }
    return socketInstance;
};