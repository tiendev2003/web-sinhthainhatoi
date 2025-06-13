import { Grid } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import jwtdecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { getSocketInstance } from "../../socket";

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

const StyledSpan = styled("span")({
    color: "#000",
    fontSize: "1.6rem",
    float: "right",
    paddingRight: "12px",
    "&:hover": {
        color: "var(--primary-color)",
    },
});

function Login() {
    const successSound = new Audio(process.env.PUBLIC_URL + "/audio/success.mp3");
    const socket = getSocketInstance();
    const navigate = useNavigate();
    const isLogined = useSelector((state) => state.auth.isLogined);
    const role = useSelector((state) => state.auth.user.role);
    if (isLogined === true && role === "regular") {
        navigate("/");
        window.scrollTo(0, 0);
    } else if (isLogined === true && (role === "subadmin" || role === "admin")) {
        navigate("/admin");
        window.scrollTo(0, 0);
    }
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const { setAlert } = HotelState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post("api/auth/login", {
            email,
            password,
        });

        // save user login to store
        if (response.status === 200) {
            const accessToken = response.data.accessToken;
            const userLogin = jwtdecode(accessToken);

            socket.emit("login", userLogin._id);

            dispatch(
                loginSuccess({
                    ...userLogin,
                })
            );

            // save jwt to local storage
            localStorage.setItem("accessToken", accessToken);
            //set alert when login success
            setAlert({
                open: true,
                message: "Đăng nhập thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
            successSound.play();
            // navigate to admin or homepage
            if (userLogin.role === "admin" || userLogin.role === "subadmin") {
                navigate("/admin");
                window.scrollTo(0, 0);
            } else navigate("/");
            window.scrollTo(0, 0);
        } else if (response.status === 201) {
            setAlert({
                open: true,
                message: response.data,
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        } else if (response.status === 202) {
            setAlert({
                open: true,
                message: response.data.message,
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section style={{ marginTop: "20px" }}>
            <ContainerComponent>
                <Grid container>
                    <Grid item xs={12} sm={3} md={4} md2={4} lg={4}></Grid>
                    <Grid item xs={12} sm={6} md={4} md2={4} lg={4}>
                        <StyledBox onSubmit={handleSubmit} component="form" autoComplete="off">
                            <Title>
                                <span style={{ color: "var(--primary-color)" }}>đăng nhập</span>
                            </Title>

                            <StyledTextField
                                id="email"
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                required
                                autoComplete="current-email"
                                onChange={handleChangeEmail}
                            />

                            <div style={{ width: "100%", position: "relative" }}>
                                <StyledTextField
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Mật khẩu"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    required
                                    onChange={handleChangePassword}
                                />
                                {!showPassword && (
                                    <VisibilityIcon
                                        onClick={() => setShowPassword(true)}
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: "calc(50% - 7px)",
                                            transform: "translateY(-50%)",
                                            marginRight: "12px",
                                            cursor: "pointer",
                                        }}
                                    />
                                )}
                                {showPassword && (
                                    <VisibilityOffIcon
                                        onClick={() => setShowPassword(false)}
                                        sx={{
                                            position: "absolute",
                                            right: 0,
                                            top: "calc(50% - 7px)",
                                            transform: "translateY(-50%)",
                                            marginRight: "12px",
                                            cursor: "pointer",
                                        }}
                                    />
                                )}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    marginBottom: "20px",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <StyledSpan sx={{ paddingLeft: "6px" }}>
                                    <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
                                </StyledSpan>
                                <StyledSpan>
                                    <Link to={"/register"}>Đăng ký tại đây</Link>
                                </StyledSpan>
                            </div>
                            <Button type="submit">Đăng nhập</Button>
                        </StyledBox>
                    </Grid>
                </Grid>
            </ContainerComponent>
        </section>
    );
}

export default Login;
