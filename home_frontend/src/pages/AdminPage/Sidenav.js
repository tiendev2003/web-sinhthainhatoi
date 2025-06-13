import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import MessageIcon from "@mui/icons-material/Message";
import CollectionsIcon from "@mui/icons-material/Collections";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const StyledListItemText = styled(ListItemText)({
    ".MuiListItemText-primary": {
        fontSize: "1.6rem",
    },
});

export default function Sidenav() {
    const theme = useTheme();
    const open = useSelector((state) => state.admin.open);
    const navigate = useNavigate();
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton>{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/user");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <AccountBoxIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Tài khoản" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/room");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <MeetingRoomIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Quản lý phòng" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/cuisine");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <FastfoodIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Quản lý ẩm thực" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/booking");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <EventNoteIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Quản lý đặt phòng" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/order");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <RoomServiceIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Quản lý đặt đồ ăn" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/contact");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <MessageIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Danh sách lời nhắn" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => {
                                navigate("/admin/gallery");window.scrollTo(0, 0);
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                <CollectionsIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </ListItemIcon>
                            <StyledListItemText primary="Quản lý thư viện ảnh" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}
