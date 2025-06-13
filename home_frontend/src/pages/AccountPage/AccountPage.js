import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";

function AccountPage() {
    const changeInfo = useSelector((state) => state.user.isChangeInfo);
    const firstName = useSelector((state) => state.auth.user.firstName);
    const lastName = useSelector((state) => state.auth.user.lastName);
    const phone = useSelector((state) => state.auth.user.phone);
    const email = useSelector((state) => state.auth.user.email);
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    useEffect(() => {
        function getDetails() {
            firstName && setFirstname(firstName);
            lastName && setLastname(lastName);
            phone && setPhoneNo(phone);
        }
        getDetails();
    }, [firstName, lastName, phone, changeInfo]);
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
                            {lastname + " " + firstname}
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
                                navigate("/account");window.scrollTo(0, 0);
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
                                navigate("/account/infochange");window.scrollTo(0, 0);
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
                                navigate("/account/passwordchange");window.scrollTo(0, 0);
                            }}
                        >
                            Thay đổi mật khẩu
                        </Typography>
                    </Grid>
                    <Grid item lg={9} sm={12} xs={12}>
                        <Typography variant="h4" sx={{ fontSize: "2rem", marginBottom: "30px" }}>
                            Thông tin tài khoản
                        </Typography>
                        <Divider />
                        <Typography variant="h4" sx={{ fontSize: "1.8rem", margin: "30px 0" }}>
                            <strong>Họ và tên: </strong>
                            {lastname + " " + firstname}
                        </Typography>
                        <Typography variant="h4" sx={{ fontSize: "1.8rem", margin: "30px 0" }}>
                            <strong>Email: </strong>
                            {email}
                        </Typography>
                        <Typography variant="h4" sx={{ fontSize: "1.8rem", margin: "30px 0" }}>
                            <strong>Số điện thoại: </strong>
                            {phoneNo}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </ContainerComponent>
    );
}

export default AccountPage;
