import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { HotelState } from "../MyContext/MyContext";

export default function AccountMenu({ notificationId, notificationType }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const { setAlert } = HotelState();
    const handleClickMark = async () => {
        setAnchorEl(null);
        let response;
        if (notificationType === "user") {
            response = await axios.put(`/api/userNotification/mark-as-read/${notificationId}`);
        } else if (notificationType === "admin") {
            response = await axios.put(`/api/adminNotification/mark-as-read/${notificationId}`);
        }
        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Đánh dấu thông báo là đã đọc thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    const handleClickDelete = async () => {
        let response;
        setAnchorEl(null);
        if (notificationType === "user") {
            response = await axios.delete(`/api/userNotification/delete/${notificationId}`);
        } else if (notificationType === "admin") {
            response = await axios.delete(`/api/adminNotification/delete/${notificationId}`);
        }
        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Xóa thông báo thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Tooltip title="Tùy chọn">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClickMark}>Đánh dấu là đã đọc</MenuItem>
                <MenuItem onClick={handleClickDelete}>Xóa thông báo</MenuItem>
            </Menu>
        </React.Fragment>
    );
}
