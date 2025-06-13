import * as React from "react";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidenav } from "../../redux/slices/AdminPageSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { loginSuccess, logOutSuccess } from "../../redux/slices/authSlice";
import { HotelState } from "../../components/MyContext/MyContext";
import { getSocketInstance } from "../../socket";

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
}));

export default function NavComponent() {
    const [refreshNotification, setRefreshNotification] = React.useState(false);
    const [refreshMessage, setRefreshMessage] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const role = useSelector((state) => state.auth.user.role);
    const [notification, setNotification] = React.useState([]);
    const navigate = useNavigate();
    const socket = getSocketInstance();

    const dispatch = useDispatch();

    useEffect(() => {
        async function getUserLogin() {
            try {
                const response = await axios.get("api/auth/me");
                if(response.data){
                const user = response.data;
                dispatch(loginSuccess({ ...user }));
                
                
                if (user.role === "regular") {
                    navigate("/");
                }
            }
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    navigate("/login");
                    window.scrollTo(0, 0);
                }
            }
        }

        getUserLogin();
    }, []);
    useEffect(() => {
        async function getNotifications() {
            try {
                const response = await axios.get("api/adminNotification/unread");
                setNotification(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getNotifications();
    }, [refreshNotification]);
    useEffect(() => {
        async function getMessages() {
            try {
                const response = await axios.get("/api/contact/unread");
                console.log(response.data);
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
    }, [refreshMessage]);
    useEffect(() => {
        socket.on("adminnotification", () => {
            setRefreshNotification((prev) => !prev);
        });
        socket.on("admincontact", () => {
            setRefreshMessage((prev) => !prev);
        });
        return () => {
            // Đảm bảo remove event listener khi component bị unmount
            socket.off("adminnotification");
            socket.off("admincontact");
        };
    }, []);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const { setAlert } = HotelState();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        dispatch(logOutSuccess());
        navigate("/login");
        window.scrollTo(0, 0);
        setAlert({
            open: true,
            message: "Đã đăng xuất tài khoản thành công!",
            type: "success",
            origin: { vertical: "bottom", horizontal: "center" },
        });
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem sx={{ fontSize: "1.6rem" }} onClick={handleMenuClose}>
                Profile
            </MenuItem>
            <MenuItem sx={{ fontSize: "1.6rem" }} onClick={handleMenuClose}>
                My account
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="#000">
                    <Badge badgeContent={4} color="error">
                        <MailIcon
                            fontSize="large"
                            sx={{
                                fill: "black",
                                width: "26px",
                                height: "24px",
                            }}
                        />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton size="large" aria-label="show 17 new notifications" color="#000">
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon
                            sx={{
                                fill: "black",
                                width: "26px",
                                height: "24px",
                            }}
                        />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="#000"
                >
                    <AccountCircle
                        sx={{
                            fill: "black",
                            width: "26px",
                            height: "24px",
                        }}
                    />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const Logo = styled("img")({
        height: "57px",
        marginRight: "24px",
    });
    const lastName = useSelector((state) => state.auth.user.lastName);
    const firstName = useSelector((state) => state.auth.user.firstName);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ backgroundColor: "var(--white)" }}>
                <Toolbar>
                    <IconButton
                        onClick={() => {
                            dispatch(toggleSidenav());
                        }}
                        size="large"
                        edge="start"
                        color="#000"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon
                            sx={{
                                fill: "black",
                                width: "26px",
                                height: "24px",
                            }}
                        />
                    </IconButton>
                    <Link to={"/admin"}>
                        <Logo src="/images/logo_nhatoi.jpg" />
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={handleLogout} variant="contained" sx={{ marginRight: "20px", fontSize: "1.6rem" }}>
                        Đăng xuất
                    </Button>
                    <Typography sx={{ fontSize: "1.6rem", color: "#000", fontWeight: "600" }}>
                        {lastName} {firstName} ({role})
                    </Typography>
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <IconButton
                            onClick={async () => {
                                navigate("/admin/contact");
                                await axios.put("/api/contact/mark-all-as-read");
                            }}
                            size="large"
                            aria-label=""
                            color="#000"
                        >
                            <Badge badgeContent={messages.length} color="error">
                                <MailIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </Badge>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                navigate("/admin/notification");
                            }}
                            size="large"
                            color="#000"
                        >
                            <Badge badgeContent={notification.length} color="error">
                                <NotificationsIcon
                                    sx={{
                                        fill: "black",
                                        width: "26px",
                                        height: "24px",
                                    }}
                                />
                            </Badge>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="#000"
                        >
                            <MoreIcon
                                sx={{
                                    fill: "black",
                                    width: "26px",
                                    height: "24px",
                                }}
                            />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
