import { createTheme, ThemeProvider } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlertComponent from "./components/AlertComponent/AlertComponent";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { routes } from "./routes";

import { useSelector } from "react-redux";
import { HotelState } from "./components/MyContext/MyContext";
import { getSocketInstance } from "./socket";

function App() {
    const notificationSound = new Audio(process.env.PUBLIC_URL + "/audio/notification.mp3");
    const userId = useSelector((state) => state.auth.user._id);
    console.log("userId:", userId);
    const { setAlert } = HotelState();
    const socket = getSocketInstance();
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            console.log("Socket ID:", socket.id);

            if (userId) {
                socket.emit("updateSocketId", userId);
                console.log("emit!");
            }
        });

        socket.on("deliverySuccessfully", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        socket.on("checkoutSuccessfully", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        socket.on("cancelSuccessfully", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        socket.on("acceptOrder", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        socket.on("denyOrder", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        socket.on("deliveryOrder", (message) => {
            notificationSound.play();
            setAlert({
                open: true,
                message: message,
                type: "success",
                origin: { vertical: "top", horizontal: "right" },
            });
        });

        return () => {
            // Đảm bảo remove event listener khi component bị unmount
            socket.off("deliverySuccessfully");
            socket.off("checkoutSuccessfully");
            socket.off("cancelSuccessfully");
            socket.off("acceptOrder");
            socket.off("denyOrder");
            socket.off("deliveryOrder");
        };
    }, [userId, socket]);

    const theme = createTheme({
        typography: {
            fontSize: 24,
        },
        breakpoints: {
            values: {
                xs: 0,
                ms: 393,
                sm: 767,
                md: 991,
                md2: 1025,
                lg: 1199,
                xl: 1536,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                    <AlertComponent />
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
