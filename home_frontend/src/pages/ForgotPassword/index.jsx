import { Grid } from "@mui/material";
import { Box, styled } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
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

const StyledSpan = styled("span")({
	color: "#000",
	fontSize: "1.6rem",
	float: "right",
	paddingRight: "12px",
	"&:hover": {
		color: "var(--primary-color)",
	},
});

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const { setAlert } = HotelState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `${process.env.REACT_APP_HOST_URL}/api/auth/password-reset`;
			const { data } = await axios.post(url, { email });
			setAlert({
				open: true,
				message: data.message,
				type: "success",
				origin: { vertical: "bottom", horizontal: "center" },
			});
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setAlert({
					open: true,
					message: error.response.data.message,
					type: "error",
					origin: { vertical: "bottom", horizontal: "center" },
				});
			}
		}
	};

	return (
		<section style={{ marginTop: "20px" }}>
			<ContainerComponent>
				<Grid container>
					<Grid item xs={12} sm={3} md={4} md2={4} lg={4}></Grid>
					<Grid item xs={12} sm={6} md={4} md2={4} lg={4}>
						<StyledBox
							onSubmit={handleSubmit}
							component="form"
							autoComplete="off"
						>
							<Title>
								<span style={{ color: "var(--primary-color)" }}>
									quên mật khẩu
								</span>
							</Title>

							<StyledTextField
								type="email"
								placeholder="Email"
								name="email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
								autoComplete="email"
							/>

							<div
								style={{
									display: "flex",
									marginBottom: "20px",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<StyledSpan sx={{ paddingLeft: "6px" }}>
									<Link to={"/login"}>Quay lại đăng nhập</Link>
								</StyledSpan>
								<StyledSpan>
									<Link to={"/register"}>Đăng ký tại đây</Link>
								</StyledSpan>
							</div>

							<Button type="submit">Gửi yêu cầu</Button>
						</StyledBox>
					</Grid>
				</Grid>
			</ContainerComponent>
		</section>
	);
};

export default ForgotPassword;
