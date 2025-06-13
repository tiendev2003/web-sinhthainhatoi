import EventNoteIcon from "@mui/icons-material/EventNote";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, Button, styled, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutSuccess } from "../../redux/slices/authSlice";
import ContainerComponent from "../ContainerComponent/ContainerComponent";
import { HotelState } from "../MyContext/MyContext";
import SeacrchModel from "../SearchModal/SeacrchModel";

import { getSocketInstance } from "../../socket";

function TopHeader() {
  const socket = getSocketInstance();
  const navigate = useNavigate();
  const isLogined = useSelector((state) => state.auth.isLogined);
  const successSound = new Audio(process.env.PUBLIC_URL + "/audio/success.mp3");
  const StyledAppBar = styled(AppBar)({
    backgroundColor: "var(--primary-color)",
    color: "var(--white)",
    display: "flex",
    alignItems: "center",
  });
  const NavItem = styled("span")({
    fontSize: "1.4rem",
    lineHeight: "1.8rem",
    textTransform: "unset",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  });
  const Separate = styled("div")({
    borderLeft: "1px solid #fff",
    height: "1.4rem",
    margin: "0 26px",
  });
  const StyledTypography = styled(Typography)({
    flex: "1",
    fontSize: "1.4rem",
  });
  const BookingButton = styled(Button)({
    backgroundColor: "#ff6b6b",
    padding: "0",
    position: "absolute",
    flex: "2",
    top: "0",
    width: "120px",
    alignSelf: "flex-start",
    fontSize: "1.8rem",
    fontWeight: "bold",
    textTransform: "unset",
    zIndex: "100",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "0 0 10px 10px",
    transition: "all 0.3s ease",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      transform: "scale(0)",
      transition: "transform 0.5s ease-out",
    },
    "&:hover": {
      backgroundColor: "#ff8787",
      transform: "translateY(5px)",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    },
    "&:hover::before": {
      transform: "scale(1)",
    },
  });
  const { setAlert } = HotelState();
  const [unread, setUnread] = useState(0);

  const dispatch = useDispatch();
  const [refreshNotifications, setRefreshNotifications] = useState(false);

  useEffect(() => {
    async function getUnreadNotifications() {
      const unreadNotifcations = await axios.get("api/userNotification/unread");
      if (unreadNotifcations.data && unreadNotifcations.data.length > 0) {
        setUnread(unreadNotifcations.data.length);
      }
    }

    if (isLogined) {
      getUnreadNotifications();
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
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logOutSuccess());
    navigate("/login");
    window.scrollTo(0, 0);
    successSound.play();
    setAlert({
      open: true,
      message: "Đã đăng xuất tài khoản thành công!",
      type: "success",
      origin: { vertical: "bottom", horizontal: "center" },
    });
  };
  return (
    <StyledAppBar position="static">
      <ContainerComponent>
        <Toolbar
          style={{ minHeight: "3.4rem", justifyContent: "flex-end" }}
          sx={{ paddingRight: { md: "130px", lg: "155px" } }}
        >
          <StyledTypography
            sx={{ display: { xs: "none", sm: "block", md: "block" } }}
          >
            Chào mừng bạn đến với Khu sinh thái Nhà Tôi!
          </StyledTypography>
          {!isLogined && (
            <>
              <Link to={"/register"}>
                <NavItem>Đăng ký</NavItem>
              </Link>
              <Separate />
              <Link to={"/login"}>
                <NavItem>Đăng nhập</NavItem>
              </Link>
              <Separate />
            </>
          )}
          {isLogined && (
            <>
              <NavItem
                sx={{
                  cursor: "pointer",
                }}
                onClick={handleLogout}
              >
                Đăng xuất
              </NavItem>
              <Separate />
              <Link to={"/account"}>
                <NavItem>Tài khoản</NavItem>
              </Link>
              <Separate />
              <NavItem
                sx={{
                  cursor: "pointer",
                  display: { xs: "none", sm: "none", md: "flex" },
                }}
                onClick={() => {
                  navigate("/notification");
                }}
              >
                Thông báo ({unread})
              </NavItem>
              <Separate
                sx={{ display: { xs: "none", sm: "none", md: "block" } }}
              />
            </>
          )}
          {isLogined && (
            <>
              <Link to={"/order"}>
                <NavItem
                  sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
                >
                  <ShoppingCartIcon
                    style={{ fontSize: "20px", marginRight: "6px" }}
                  />
                  Order
                </NavItem>
              </Link>
              <Separate
                sx={{ display: { xs: "none", sm: "none", md: "block" } }}
              />
            </>
          )}
          {isLogined && (
            <>
              <Link to={"/booking"}>
                <NavItem
                  sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
                >
                  <MeetingRoomIcon
                    style={{ fontSize: "20px", marginRight: "6px" }}
                  />
                  Phòng đã đặt
                </NavItem>
              </Link>
              <Separate
                sx={{ display: { xs: "none", sm: "none", md: "block" } }}
              />
            </>
          )}
          <SeacrchModel />{" "}
          <BookingButton
            variant="contained"
            size="large"
            className="booking-button-mobile"
            sx={{
              flexGrow: "1",
              display: { xs: "block", md: "block", md2: "block", lg: "block" },
              height: { xs: "80px", md: "93px", md2: "101px", lg: "114px" },
              right: { xs: "10px", sm: "15px", md: "20px", lg: "40px" },
              width: { xs: "100px", sm: "110px", md: "120px" },
            }}
          >
            <Link
              to={"/room"}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              <EventNoteIcon
                sx={{
                  width: { xs: "35px", sm: "38px", md: "42px" },
                  height: { xs: "35px", sm: "38px", md: "42px" },
                  animation: "pulse 1.5s infinite",
                }}
              />
              <span
                style={{
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                }}
              >
                Đặt phòng
              </span>
            </Link>
          </BookingButton>
        </Toolbar>
      </ContainerComponent>
    </StyledAppBar>
  );
}

export default TopHeader;
