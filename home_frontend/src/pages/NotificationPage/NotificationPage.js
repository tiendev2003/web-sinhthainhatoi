import React, { useEffect, useState } from "react";
import { Box, IconButton, Tab, Tooltip, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext/TabContext";
import TabList from "@mui/lab/TabList/TabList";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import moment from "moment";
import "moment/locale/vi";
import styled from "@emotion/styled";
import NotificationMenu from "../../components/NotificationMenu/NotificationMenu";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";
import { useSelector } from "react-redux";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { getSocketInstance } from "../../socket";

const NotificationPage = () => {
    const isLogined = useSelector((state) => state.auth.isLogined);
    const socket = getSocketInstance();
    const [value, setValue] = React.useState("1");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const open = true;

    moment.locale("vi");
    const NotificationItem = styled("div")({
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "6px 8px",
        "&:hover": {
            backgroundColor: "#f4f4f4",
        },
    });

    const { setAlert } = HotelState();

    const handleMarkAllAsRead = async () => {
        const response = await axios.put("api/userNotification/mark-all-as-read");
        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Đã đánh dấu tất cả thông báo là đã đọc!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    const [refreshNotifications, setRefreshNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        async function getUnreadNotifications() {
            const unreadNotifcations = await axios.get("api/userNotification/unread");
            setUnreadNotifications(unreadNotifcations.data);
        }

        async function getAllNotifications() {
            const allNotifications = await axios.get("api/userNotification/list");
            setNotifications(allNotifications.data);
        }
        if (isLogined) {
            getUnreadNotifications();
            getAllNotifications();
        }
    }, [isLogined, refreshNotifications]);

    useEffect(() => {
        socket.on("notification", () => {
            console.log("new notification");
            setRefreshNotifications((prev) => !prev); // Toggle giá trị để trigger re-render
        });

        return () => {
            // Đảm bảo remove event listener khi component bị unmount
            socket.off("notification");
        };
    }, [socket]);

    const handleDelete = async (id) => {
        console.log(id);
        const response = await axios.delete(`api/userNotification/delete/${id}`);
        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Đã xóa thông báo thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    return (
        <ContainerComponent>
            <Box sx={{ typography: "body1", minHeight: "35vh" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 12px 6px 6px",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontSize: "2.4rem", fontWeight: "600", margin: "6px 0 0 4px" }}
                        color="initial"
                    >
                        Thông báo
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                        <Tooltip title="Đánh dấu tất cả là đã đọc">
                            <IconButton
                                onClick={handleMarkAllAsRead}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? "account-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <DoneAllIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </div>
                <TabContext value={value}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <TabList
                            sx={{
                                "& .MuiTab-root": {
                                    fontSize: "1.8rem !important",
                                    fontWeight: "500 ",
                                },
                                "& .Mui-selected": {
                                    color: "var(--primary-color) !important",
                                    fontWeight: "500 !important",
                                    fontSize: "1.8rem !important",
                                },
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "var(--primary-color)",
                                },
                            }}
                            onChange={handleChange}
                            aria-label=""
                        >
                            <Tab label="Chưa đọc" sx={{ textTransform: "unset" }} value="1" />
                            <Tab label="Tất cả" sx={{ textTransform: "unset" }} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel
                        sx={{
                            "&.MuiTabPanel-root": {
                                padding: "0",
                            },
                        }}
                        value="1"
                    >
                        {unreadNotifications.length > 0 &&
                            unreadNotifications.map((item, index) => {
                                const timeAgo = moment(item.createdAt).fromNow();
                                return (
                                    <NotificationItem key={index}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <img
                                                style={{ width: "76px", height: "76px", borderRadius: "50%" }}
                                                src={`${process.env.REACT_APP_HOST_URL}${item.image}`}
                                                alt="avatar"
                                            />
                                            <div style={{ padding: "8px 8px 0 8px", position: "relative" }}>
                                                <Typography sx={{ marginBottom: "6px" }}>{item.message}</Typography>
                                                <span
                                                    style={{
                                                        color: "var(--primary-color)",
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    {timeAgo}
                                                </span>
                                            </div>
                                        </div>
                                        <NotificationMenu notificationId={item._id} notificationType={"user"} />
                                    </NotificationItem>
                                );
                            })}
                        {unreadNotifications.length === 0 && (
                            <Typography sx={{ p: 2 }}>Bạn không có thông báo nào chưa đọc!</Typography>
                        )}
                    </TabPanel>
                    <TabPanel
                        sx={{
                            "&.MuiTabPanel-root": {
                                padding: "0",
                            },
                        }}
                        value="2"
                    >
                        {notifications.length > 0 &&
                            notifications.map((item, index) => {
                                const timeAgo = moment(item.createdAt).fromNow();
                                return (
                                    <NotificationItem key={index}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <img
                                                style={{ width: "76px", height: "76px", borderRadius: "50%" }}
                                                src={`${process.env.REACT_APP_HOST_URL}${item.image}`}
                                                alt="avatar"
                                            />
                                            <div style={{ padding: "8px 8px 0 8px", position: "relative" }}>
                                                <Typography sx={{ marginBottom: "6px" }}>{item.message}</Typography>
                                                <span
                                                    style={{
                                                        color: "var(--primary-color)",
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    {timeAgo}
                                                </span>
                                            </div>
                                        </div>
                                        {!item.isRead && (
                                            <NotificationMenu notificationId={item._id} notificationType={"user"} />
                                        )}
                                        {item.isRead && (
                                            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                                                <Tooltip title="Xóa thông báo">
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDelete(item._id);
                                                        }}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                        aria-controls={open ? "account-menu" : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? "true" : undefined}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )}
                                    </NotificationItem>
                                );
                            })}
                        {notifications.length === 0 && (
                            <Typography sx={{ p: 2 }}>Bạn không có thông báo nào</Typography>
                        )}
                    </TabPanel>
                </TabContext>
            </Box>
        </ContainerComponent>
    );
};

export default NotificationPage;
