import { Box } from "@mui/material";
import NavComponent from "./NavComponent";
import Sidenav from "./Sidenav";
import { getSocketInstance } from "../../socket";
import { useEffect } from "react";
import { HotelState } from "../../components/MyContext/MyContext";

function DefaultAdminLayout({ children }) {
    const { setAlert } = HotelState();
    const notificationSound = new Audio(process.env.PUBLIC_URL + "/audio/notification.mp3");
    const socket = getSocketInstance();
    useEffect(() => {
        socket.on("adminAlert", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "warning",
                origin: { vertical: "top", horizontal: "right" },
            });
        });
        return () => {
            socket.off("adminAlert");
        };
    }, []);

    return (
        <>
            <NavComponent />
            <Box height={64} />
            <Box sx={{ display: "flex" }}>
                <Sidenav />
                {children}
            </Box>
        </>
    );
}

export default DefaultAdminLayout;
