import { Grid } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";

const StyledBox = styled(Box)({
    boxShadow: "0px 1px 69.16px 6.84px rgba(20,64,51,0.05)",
    width: "100%",
    borderRadius: "10px",
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
});
const StyledTextField = styled("input")`
    height: 45px;
    padding: 0 20px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;
    margin-bottom: 15px;
    width: 100%;
    outline: none;
    border: initial;
    font-size: 1.4rem;
`;
const Title = styled("h1")({
    fontWeight: "600",
    letterSpacing: "0",
    fontSize: "2.6rem",
    position: "relative",
    margin: "0",
    paddingBottom: "20px",
    marginBottom: "10px",
    textTransform: "uppercase",
    "&::after": {
        content: '" "',
        width: "100%",
        height: "5px",
        background: "#e5e9ed",
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "0 auto",
        borderRadius: "3px",
    },
    "&::before": {
        content: '" "',
        width: "50px",
        height: "5px",
        background: "var(--primary-color)",
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "1",
        margin: "0 auto",
        borderRadius: "3px",
    },
});

const Button = styled("button")`
    background: var(--primary-color);
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    transition: 0.3s;
    -webkit-transition: 0.3s;
    -moz-transition: 0.3s;
    -ms-transition: 0.3s;
    -o-transition: 0.3s;
    text-transform: uppercase;
    border: 1px solid #0e6828;
    line-height: 42px;
    width: 100%;
    height: 45px;
    cursor: pointer;
`;
function Register() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRetype, setPasswordRetype] = useState("");
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    };
    const handleChangeFirstName = (event) => {
        event.preventDefault();
        setFirstName(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleChangePasswordRetype = (event) => {
        setPasswordRetype(event.target.value);
    };

    const { setAlert } = HotelState();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password === passwordRetype) {
            const response = await axios.post("api/auth/register", {
                lastName,
                firstName,
                email,
                phone,
                password,
            });
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đăng ký thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                navigate("/login");
                window.scrollTo(0, 0);
            } else if (response.status === 202) {
                setAlert({
                    open: true,
                    message: response.data.title,
                    type: "error",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            } else if (response.status === 201) {
                setAlert({
                    open: true,
                    message: response.data.message,
                    type: "error",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
        } else {
            setAlert({
                open: true,
                message: "Mật khẩu không khớp!",
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };

    return (
        <section style={{ marginTop: "20px" }}>
            <ContainerComponent>
                <Grid container>
                    <Grid item xs={12} sm={3} md={4} md2={4} lg={4}></Grid>
                    <Grid item xs={12} sm={6} md={4} md2={4} lg={4}>
                        <StyledBox onSubmit={handleSubmit} component="form" autoComplete="off">
                            <Title>
                                <span style={{ color: "var(--primary-color)" }}>Đăng kí</span>
                            </Title>
                            <span
                                style={{ marginTop: "10px", fontSize: "14px", fontWeight: "500", marginBottom: "20px" }}
                            >
                                Đã có tài khoản, đăng nhập
                                <span> </span>
                                <Link style={{ color: "var(--primary-color)" }} to={"/login"}>
                                    tại đây
                                </Link>
                            </span>
                            <StyledTextField
                                required
                                id="last-name"
                                name="last-name"
                                placeholder="Họ"
                                onChange={handleChangeLastName}
                                value={lastName}
                                autoComplete="false"
                            />
                            <StyledTextField
                                required
                                id="first-name"
                                name="first-name"
                                placeholder="Tên"
                                value={firstName}
                                autoComplete="false"
                                onChange={handleChangeFirstName}
                            />
                            <StyledTextField
                                required
                                id="email"
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={handleChangeEmail}
                            />
                            <StyledTextField
                                required
                                id="phone"
                                name="phone"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={handleChangePhone}
                            />

                            <StyledTextField
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={handleChangePassword}
                            />
                            <StyledTextField
                                id="password"
                                name="password"
                                placeholder="Nhập lại mật khẩu"
                                type="password"
                                value={passwordRetype}
                                onChange={handleChangePasswordRetype}
                            />
                            <Button type="submit">Đăng ký</Button>
                        </StyledBox>
                    </Grid>
                </Grid>
            </ContainerComponent>
        </section>
    );
}

export default Register;
