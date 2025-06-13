import { Button, Divider, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { HotelState } from "../../components/MyContext/MyContext";
function PasswordChange() {
    const [showPassword, setShowPassword] = useState(false);
    const firstName = useSelector((state) => state.auth.user.firstName);
    const lastName = useSelector((state) => state.auth.user.lastName);
    const { setAlert } = HotelState();

    const navigate = useNavigate();
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [newPassRetype, setNewPassRetype] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPass === newPassRetype) {
            const confirm = window.confirm("Xác nhận thay đổi mật khẩu?");
            if (confirm) {
                const response = await axios.put("auth/admin/user/passwordchange", {
                    oldPass,
                    newPass,
                });
                if (response.status === 200) {
                    setAlert({
                        open: true,
                        message: "Đã thay đổi mật khẩu thành công!",
                        type: "success",
                        origin: { vertical: "bottom", horizontal: "center" },
                        origin: { vertical: "top", horizontal: "right" },
                    });
                    navigate("/account");
                    window.scrollTo(0, 0);
                }
                if (response.status === 201) {
                    setAlert({
                        open: true,
                        message: response.data,
                        type: "error",
                        origin: { vertical: "bottom", horizontal: "center" },
                    });
                }
            }
        } else {
            setAlert({
                open: true,
                message: "Mật khẩu mới không khớp!",
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    return (
        <ContainerComponent>
            <Box sx={{ margin: "100px 0" }}>
                <Grid container spacing={2}>
                    <Grid item lg={3} sm={12} xs={12}>
                        <Typography
                            sx={{ fontSize: "2rem", textTransform: "uppercase", fontWeight: "600" }}
                            variant="body1"
                            color="initial"
                        >
                            Trang tài khoản
                        </Typography>
                        <Typography sx={{ fontSize: "1.8rem", fontWeight: "600" }}>Xin chào,</Typography>
                        <Typography sx={{ fontSize: "1.8rem", fontWeight: "600", color: "var(--primary-color)" }}>
                            {lastName + " " + firstName}
                            <span style={{ fontSize: "1.8rem", fontWeight: "600", color: "black" }}>!</span>
                        </Typography>
                        <Divider />
                        <Typography
                            sx={{
                                margin: "12px 0",
                                cursor: "pointer",
                                userSelect: "none",
                                "&.MuiTypography-root:hover": {
                                    color: "var(--primary-color)",
                                },
                            }}
                            onClick={() => {
                                navigate("/account");
                                window.scrollTo(0, 0);
                            }}
                        >
                            Thông tin tài khoản
                        </Typography>
                        <Typography
                            sx={{
                                margin: "12px 0",
                                cursor: "pointer",
                                userSelect: "none",
                                "&.MuiTypography-root:hover": {
                                    color: "var(--primary-color)",
                                },
                            }}
                            onClick={() => {
                                navigate("/account/infochange");
                                window.scrollTo(0, 0);
                            }}
                        >
                            Cập nhật thông tin
                        </Typography>
                        <Typography
                            sx={{
                                margin: "12px 0",
                                cursor: "pointer",
                                userSelect: "none",
                                "&.MuiTypography-root:hover": {
                                    color: "var(--primary-color)",
                                },
                            }}
                            onClick={() => {
                                navigate("/account/passwordchange");
                                window.scrollTo(0, 0);
                            }}
                        >
                            Thay đổi mật khẩu
                        </Typography>
                    </Grid>
                    <Grid item lg={9} sm={12} xs={12}>
                        <Typography variant="h4" sx={{ fontSize: "2rem", marginBottom: "30px" }}>
                            Thay đổi mật khẩu
                        </Typography>
                        <Divider />
                        <Box
                            onSubmit={handleSubmit}
                            component="form"
                            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="oldpassword"
                                label="Mật khẩu cũ"
                                variant="outlined"
                                required
                                value={oldPass}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => {
                                    setOldPass(e.target.value);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                                            {!showPassword ? (
                                                <VisibilityIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            ) : (
                                                <VisibilityOffIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="newpassword"
                                label="Mật khẩu mới"
                                variant="outlined"
                                required
                                type={showPassword ? "text" : "password"}
                                value={newPass}
                                onChange={(e) => {
                                    setNewPass(e.target.value);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                                            {!showPassword ? (
                                                <VisibilityIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            ) : (
                                                <VisibilityOffIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="newpasswordretype"
                                label="Nhập lại mật khẩu mới"
                                variant="outlined"
                                required
                                type={showPassword ? "text" : "password"}
                                value={newPassRetype}
                                onChange={(e) => {
                                    setNewPassRetype(e.target.value);
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                                            {!showPassword ? (
                                                <VisibilityIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            ) : (
                                                <VisibilityOffIcon
                                                    onClick={() => {
                                                        setShowPassword(!showPassword);
                                                    }}
                                                />
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button type="submit" variant="contained">
                                cập nhật
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ContainerComponent>
    );
}

export default PasswordChange;
