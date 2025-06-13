import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import { changeInfo, isChangeInfo } from "../../redux/slices/userSlice";

function InfoChange() {
    const dispatch = useDispatch();
    const firstName = useSelector((state) => state.auth.user.firstName);
    const lastName = useSelector((state) => state.auth.user.lastName);
    const { setAlert } = HotelState();
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirm = window.confirm("Xác nhận thay đổi thông tin?");
        if (confirm) {
            const response = await axios.put("auth/admin/user/update", {
                firstName: firstname,
                lastName: lastname,
                phone: phoneNo,
            });
            if (response.status === 200) {
                dispatch(changeInfo());
                setAlert({
                    open: true,
                    message: "Đã thay đổi thông tin tài khoản thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                    origin: { vertical: "top", horizontal: "right" },
                });
                navigate("/account");
                window.scrollTo(0, 0);
            }
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
                            Thay đổi thông tin tài khoản
                        </Typography>
                        <Divider />
                        <Box
                            onSubmit={handleSubmit}
                            component="form"
                            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="lastName"
                                label="Họ"
                                variant="outlined"
                                required
                                value={lastname}
                                onChange={(e) => {
                                    setLastname(e.target.value);
                                }}
                            />
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="firstName"
                                label="Tên đệm và tên"
                                variant="outlined"
                                required
                                value={firstname}
                                onChange={(e) => {
                                    setFirstname(e.target.value);
                                }}
                            />
                            <TextField
                                sx={{ margin: "12px 0", width: "100%" }}
                                id="phone"
                                label="Số điện thoại"
                                type="tel"
                                variant="outlined"
                                required
                                value={phoneNo}
                                onChange={(e) => {
                                    setPhoneNo(e.target.value);
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

export default InfoChange;
