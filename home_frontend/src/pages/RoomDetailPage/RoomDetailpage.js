import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import parse from "html-react-parser";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, styled, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CropIcon from "@mui/icons-material/Crop";
import CoffeeIcon from "@mui/icons-material/Coffee";
import WifiIcon from "@mui/icons-material/Wifi";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useSelector } from "react-redux";
import { HotelState } from "../../components/MyContext/MyContext";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import { getSocketInstance } from "../../socket";

const StyledTextField = styled("input")`
    height: 35px;
    padding: 0 12px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;
    width: 100%;
    outline: none;
    border: initial;
    font-size: 1.4rem;
    border-radius: 5px;
`;
const TagReview = styled("div")({
    marginBottom: "10px",
    position: "relative",
    display: "inline-block",

    "&::before": {
        borderBottom: "3px double #333",
        top: "0",
        content: '" "',
        position: "absolute",
        height: "3px",
        left: "0",
        margin: "0 auto",
        right: "0",
        width: "100%",
    },
});
const BookButton = styled("button")({
    padding: "10px 7px",
    backgroundColor: "#c40025",
    border: "1px solid #c40025",
    color: "#fff",
    fontSize: "1.2rem",
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
        backgroundColor: "#fff",
        color: "#c40025",
        border: "1px solid #c40025",
    },
});
function RoomDetailpage() {
    const socket = getSocketInstance();
    const [newStatus, setNewStatus] = useState(false);
    const [detail, setDetail] = useState();
    const params = useParams();
    const roomId = params.id;

    const [bookSuccess, setbookSuccess] = useState(false);
    const [roomType, setRoomType] = useState("");
    useEffect(() => {
        socket.on("updatedetail", () => {
            setNewStatus(!newStatus);
        });
        async function getDetail() {
            const detail = await axios.get(`api/room/${roomId}`);
            setDetail(detail.data);
            setRoomType(detail.data.roomType);
        }
        async function getSimilarRoom() {
            if (roomType !== "") {
                const rooms = await axios.get(`api/room/${roomType}?sort=price,asc`);
                setSimilarRoom(rooms.data);
            }
        }
        async function getVipRoom() {
            if (roomType !== "") {
                const rooms = await axios.get(`api/room/vip?sort=price,desc`);
                setVipRooms(rooms.data);
            }
        }

        getDetail();
        getSimilarRoom();
        getVipRoom();
    }, [bookSuccess, roomType, roomId, newStatus]);
    const [vipRooms, setVipRooms] = useState();

    const bestRooms =
        vipRooms &&
        vipRooms.slice(0, 4).map((item, index) => {
            return (
                <div style={{ margin: "6.5px 0", display: "flex" }} key={index}>
                    <img
                        src={`${process.env.REACT_APP_HOST_URL}${item.cover}`}
                        alt=""
                        style={{ width: "35%", userSelect: "none", cursor: "pointer" }}
                        onClick={() => {
                            navigate(`/room/${item._id}`);
                            window.scrollTo(0, 0);
                        }}
                    />
                    <div style={{ marginLeft: "12px" }}>
                        <Typography
                            sx={{
                                fontSize: "1.8rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                marginBottom: "12px",
                                "&.MuiTypography-root:hover": {
                                    color: "var(--primary-color)",
                                },
                            }}
                            onClick={() => {
                                navigate(`/room/${item._id}`);
                                window.scrollTo(0, 0);
                                window.scrollTo(0, 0);
                            }}
                        >
                            {item.title}
                        </Typography>
                        <span style={{ fontSize: "1.6rem", fontWeight: "600", color: "var(--primary-color)" }}>
                            {item.price.toLocaleString() + "đ"}
                        </span>
                    </div>
                </div>
            );
        });
    const [similarRoom, setSimilarRoom] = useState([]);
    const similar = similarRoom.filter((room) => {
        return room._id !== roomId;
    });

    const items = similar.map((item, index) => {
        return (
            <Card sx={{ margin: "5px" }} key={index}>
                <CardMedia sx={{ height: "165px" }} image={`${process.env.REACT_APP_HOST_URL}${item.cover}`} />
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                        fontSize="1.4rem"
                        sx={{
                            width: "100%",
                            textTransform: "uppercase",
                            textAlign: "center",
                            fontWeight: "600",
                            cursor: "pointer",
                            "&:hover": {
                                color: "var(--primary-color)",
                            },
                        }}
                        onClick={() => {
                            navigate(`/room/${item._id}`);
                            window.scrollTo(0, 0);
                            window.scrollTo(0, 0);
                        }}
                    >
                        {item.title}
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                        {item.services[0].includes("roomCoffee") && <CoffeeIcon sx={{ margin: "0 6px" }} />}
                        {item.services[0].includes("roomBathtub") && <BathtubIcon sx={{ margin: "0 6px" }} />}
                        {item.services[0].includes("roomWifi") && <WifiOutlinedIcon sx={{ margin: "0 6px" }} />}
                        {item.services[0].includes("roomStove") && <MicrowaveIcon sx={{ margin: "0 6px" }} />}
                        {item.services[0].includes("roomFood") && <DinnerDiningIcon sx={{ margin: "0 6px" }} />}
                    </div>
                    <TagReview>
                        <ul
                            style={{
                                paddingTop: "10px",
                                listStyle: "none",
                                display: "flex",
                            }}
                        >
                            <li style={{ fontSize: "1.5rem", margin: "0 6px" }}>{item.adults + " Khách"}</li>
                            <li style={{ fontSize: "1.5rem", margin: "0 6px" }}>{item.area + "m²"}</li>
                        </ul>
                    </TagReview>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "12px",
                        }}
                    >
                        <span style={{ color: "#c40025", fontWeight: "600", fontSize: "1.8rem" }}>
                            {item.price.toLocaleString()}₫/Đêm
                        </span>
                        <BookButton
                            onClick={() => {
                                navigate(`/room/${item._id}`);
                                window.scrollTo(0, 0);
                                setSelectedRoom([]);
                            }}
                        >
                            ĐẶT PHÒNG
                        </BookButton>
                    </div>
                </CardContent>
            </Card>
        );
    });

    const [selectedRoom, setSelectedRoom] = useState([]);
    const [receiveDate, setReceiveDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const get_day_of_time = (d1, d2) => {
        let ms1 = d1.getTime();
        let ms2 = d2.getTime();
        return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
    };
    const handleClickRoom = (event) => {
        if (selectedRoom.includes(event.target.textContent)) {
            setSelectedRoom(selectedRoom.filter((item) => item !== event.target.textContent));
        } else {
            setSelectedRoom([...selectedRoom, event.target.textContent]);
        }
    };
    const firstName = useSelector((state) => state.auth.user.firstName);
    const lastName = useSelector((state) => state.auth.user.lastName);
    const phone = useSelector((state) => state.auth.user.phone);

    const [fullname, setFullname] = useState("");
    useEffect(() => {
        if (firstName && lastName) {
            setFullname(lastName + " " + firstName);
        }
    }, [firstName, lastName]);
    const [phoneNumber, setPhoneNumber] = useState("");
    useEffect(() => {
        if (phone) {
            setPhoneNumber(phone);
        }
    }, [phone]);

    // Chuyển đổi chuỗi ngày thành đối tượng ngày
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    // Hàm kiểm tra xem một phòng có được đặt trong khoảng ngày nhận và ngày trả đã chọn hay không
    const isRoomBooked = (roomNo) => {
        if (receiveDate && checkoutDate) {
            const startDate = receiveDate.$d.getTime();
            const endDate = checkoutDate.$d.getTime();

            return detail.roomStatus.some((roomStatus) => {
                // Kiểm tra nếu bookedDate là một mảng có các ngày đặt phòng, nếu không thì mặc định là mảng rỗng
                const bookedDates = Array.isArray(roomStatus.bookedDate) ? roomStatus.bookedDate : [];

                return (
                    roomStatus.roomNo === roomNo &&
                    bookedDates.some((bookedDate) => {
                        const bookedDateObj = parseDate(bookedDate);
                        const bookedDateStart = new Date(
                            bookedDateObj.getFullYear(),
                            bookedDateObj.getMonth(),
                            bookedDateObj.getDate(),
                            0,
                            0,
                            0
                        ).getTime();
                        const bookedDateEnd = new Date(
                            bookedDateObj.getFullYear(),
                            bookedDateObj.getMonth(),
                            bookedDateObj.getDate(),
                            23,
                            59,
                            59
                        ).getTime();

                        return startDate <= bookedDateEnd && endDate >= bookedDateStart;
                    })
                );
            });
        }

        return true; // Nếu ngày nhận và ngày trả chưa được chọn, mặc định hiển thị tất cả phòng là có sẵn (không bị disable)
    };

    const roomItem =
        detail &&
        detail.roomStatus.map((roomStatus) => (
            <div key={roomStatus.roomNo} style={{ padding: "12px" }}>
                <Button
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    disableTouchRipple
                    variant="contained"
                    onClick={handleClickRoom}
                    color={!selectedRoom.includes(roomStatus.roomNo) ? "primary" : "success"}
                    disabled={!receiveDate || !checkoutDate || isRoomBooked(roomStatus.roomNo)}
                >
                    {roomStatus.roomNo}
                </Button>
            </div>
        ));

    const caroselItem =
        detail &&
        detail.images.map((item) => {
            return (
                <div key={item}>
                    <img
                        src={`${process.env.REACT_APP_HOST_URL}${item}`}
                        alt=""
                        style={{ width: "100%", userSelect: "none" }}
                    />
                </div>
            );
        });
    const isLogined = useSelector((state) => state.auth.isLogined);
    const navigate = useNavigate();
    const { setAlert } = HotelState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirm = window.confirm("Xác nhận đặt phòng?");
        if (isLogined && confirm) {
            const response = await axios.post("/api/booking/create", {
                fullname: fullname,
                receiveDate: receiveDate,
                checkoutDate: checkoutDate,
                roomQuantity: selectedRoom.length,
                roomNo: selectedRoom,
                roomPrice: detail.price,
                summaryPrice: Number(
                    selectedRoom.length * (get_day_of_time(receiveDate.$d, checkoutDate.$d) + 1) * detail.price
                ),
                roomId: roomId,
                phone: phoneNumber,
            });
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã đặt phòng thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                navigate("/booking");
                window.scrollTo(0, 0);
                setbookSuccess(!bookSuccess);
                setSelectedRoom([]);
                setCheckoutDate(null);
                setReceiveDate(null);
            }
        } else {
            let confirm = window.confirm("Bạn cần đăng nhập để đặt phòng");
            if (confirm) {
                navigate("/login");
                window.scrollTo(0, 0);
            }
        }
    };

    return (
        <>
            {detail && (
                <ContainerComponent>
                    <Grid
                        container
                        sx={{
                            padding: "12px 0",
                            width: "100%",
                        }}
                        spacing={{ lg: 2, xs: 0 }}
                    >
                        <Grid item lg={12}>
                            <Carousel>{caroselItem}</Carousel>
                        </Grid>

                        <Grid item lg={8} xs={12}>
                            <Typography sx={{ textAlign: "left" }} variant="h4">
                                {detail && detail.title}
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                    margin: "20px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <PeopleIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                    <span style={{ marginLeft: "12px", fontSize: "1.6rem" }}>
                                        {" "}
                                        {detail && detail.adults} Người lớn{" "}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <PeopleIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                    <span style={{ marginLeft: "12px", fontSize: "1.6rem" }}>
                                        {detail && detail.children} Trẻ em{" "}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <CropIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                    <span style={{ marginLeft: "12px", fontSize: "1.6rem" }}>
                                        {" "}
                                        Phòng {detail && detail.area}m²
                                    </span>
                                </div>
                            </div>
                            <Divider />
                            <Typography sx={{ margin: "20px", textAlign: "justify" }}>
                                Các phòng trang nhã và dãy phòng trang nghiêm của chúng tôi gợi nhớ về một thời đại đã
                                qua. Mỗi tính năng như đường cong, thảm sang trọng, trần nhà cao, phòng tắm lát đá cẩm
                                thạch, thiết bị làm sạch và nhiều không gian đều được bố trí một cách chu đáo để gọi cho
                                riêng bạn. Tông màu nâu phong phú và gỗ sồi tự nhiên tạo nên những khu bảo tồn yên tĩnh
                                và yên tĩnh, được tôn lên một cách tuyệt vời bởi đồ nội thất trang nhã.
                            </Typography>
                            <div
                                style={{
                                    color: "white",
                                    backgroundColor: "var(--primary-color)",
                                    marginLeft: "10px",
                                    fontSize: "1.8rem",
                                    borderRadius: "10px 10px 0px 0px",
                                    display: "inline-block",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0 15px",
                                }}
                            >
                                Dịch vụ phòng
                            </div>
                            <div
                                style={{
                                    border: "1px solid #0e6828",
                                    padding: "5px 10px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    marginBottom: "20px",
                                }}
                            >
                                {detail && detail.services[0].includes("roomCoffee") && (
                                    <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                        <CoffeeIcon fontSize="large" />
                                        <span style={{ marginLeft: "12px" }}>Cafe Buổi Sáng</span>
                                    </div>
                                )}
                                {detail && detail.services[0].includes("roomBathtub") && (
                                    <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                        <BathtubIcon fontSize="large" />
                                        <span style={{ marginLeft: "12px" }}>Bồn Tắm Hoa Sen</span>
                                    </div>
                                )}
                                {detail && detail.services[0].includes("roomWifi") && (
                                    <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                        <WifiIcon fontSize="large" />
                                        <span style={{ marginLeft: "12px" }}>Internet Không Dây</span>
                                    </div>
                                )}
                                {detail && detail.services[0].includes("roomFood") && (
                                    <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                        <DinnerDiningIcon fontSize="large" />
                                        <span style={{ marginLeft: "12px" }}>Gọi Đồ Ăn Tại Phòng</span>
                                    </div>
                                )}
                                {detail && detail.services[0].includes("roomStove") && (
                                    <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                        <MicrowaveIcon fontSize="large" />
                                        <span style={{ marginLeft: "12px" }}>Bếp Nấu Tại Phòng</span>
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid item lg={4}>
                            <Box
                                sx={{
                                    width: "100%",
                                    minHeight: "95%",
                                    backgroundColor: "#f2f2f2",
                                    borderRadius: "10px",
                                    padding: "20px 15px",
                                }}
                            >
                                <form onSubmit={handleSubmit}>
                                    {detail && (
                                        <div style={{ marginBottom: "6px" }}>
                                            <span style={{ color: "#c40025", fontSize: "2.2rem", fontWeight: "600" }}>
                                                {detail.price.toLocaleString()}₫/Đêm
                                            </span>
                                        </div>
                                    )}
                                    <Divider
                                        variant="fullWidth"
                                        orientation="horizontal"
                                        sx={{ backgroundColor: "var(--primary-color)" }}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid
                                            sx={{ marginTop: "12px" }}
                                            item
                                            lg={6}
                                            md2={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            ms={12}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>Họ và tên*</span>
                                            <StyledTextField
                                                onChange={(e) => setFullname(e.target.value)}
                                                value={fullname}
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            sx={{ marginTop: "12px" }}
                                            item
                                            lg={6}
                                            md2={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            ms={12}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>Số điện thoại*</span>
                                            <StyledTextField
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                value={phoneNumber}
                                            />
                                        </Grid>
                                        <Grid item lg={6} md2={6} md={6} sm={6} xs={12} ms={12}>
                                            <div style={{ marginBottom: "6px" }}>
                                                <span style={{ fontSize: "1.4rem" }}>Ngày nhận</span>
                                            </div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    sx={{ width: "100%" }}
                                                    value={receiveDate}
                                                    onChange={(date) => setReceiveDate(date)}
                                                    disablePast
                                                    format="DD/MM/YYYY"
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item lg={6} md2={6} md={6} sm={6} xs={12} ms={12}>
                                            <div style={{ marginBottom: "6px" }}>
                                                <span style={{ fontSize: "1.4rem" }}>Ngày trả</span>
                                            </div>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    sx={{ width: "100%" }}
                                                    value={checkoutDate}
                                                    onChange={(date) => setCheckoutDate(date)}
                                                    disablePast
                                                    format="DD/MM/YYYY"
                                                    minDate={receiveDate}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid
                                            sx={{ marginTop: "12px" }}
                                            item
                                            lg={6}
                                            md2={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            ms={12}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>Số lượng phòng</span>
                                            <StyledTextField disabled value={selectedRoom.length} />
                                        </Grid>
                                        <Grid
                                            sx={{ marginTop: "12px" }}
                                            item
                                            lg={6}
                                            md2={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            ms={12}
                                        >
                                            <span style={{ fontSize: "1.4rem" }}>Phòng số</span>
                                            <StyledTextField disabled value={selectedRoom.toString()} />
                                        </Grid>
                                        <Grid item lg={12}>
                                            {receiveDate && checkoutDate && (
                                                <>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography>
                                                            Giá niêm yết({selectedRoom.length}x
                                                            {receiveDate &&
                                                                checkoutDate &&
                                                                get_day_of_time(receiveDate.$d, checkoutDate.$d) +
                                                                    1 +
                                                                    "x"}{" "}
                                                            {detail.price.toLocaleString()}₫/Đêm)
                                                        </Typography>
                                                        <span style={{ fontSize: "1.6rem", fontWeight: "600" }}>
                                                            {Number(
                                                                selectedRoom.length *
                                                                    (get_day_of_time(receiveDate.$d, checkoutDate.$d) +
                                                                        1) *
                                                                    detail.price
                                                            ).toLocaleString() + "₫"}
                                                        </span>
                                                    </div>
                                                    <Divider
                                                        variant="fullWidth"
                                                        orientation="horizontal"
                                                        sx={{
                                                            backgroundColor: "var(--primary-color)",
                                                            margin: "12px 0",
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typography>Tổng tiền</Typography>
                                                        <span style={{ fontSize: "1.6rem", fontWeight: "600" }}>
                                                            {Number(
                                                                selectedRoom.length *
                                                                    (get_day_of_time(receiveDate.$d, checkoutDate.$d) +
                                                                        1) *
                                                                    detail.price
                                                            ).toLocaleString() + "₫"}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item lg={3}></Grid>
                                        <Grid item lg={6}>
                                            <Button
                                                sx={{
                                                    width: "100%",
                                                }}
                                                size="large"
                                                variant="contained"
                                                type="submit"
                                                disabled={
                                                    receiveDate &&
                                                    checkoutDate &&
                                                    Number(
                                                        selectedRoom.length *
                                                            (get_day_of_time(receiveDate.$d, checkoutDate.$d) + 1) *
                                                            detail.price
                                                    ) > 0
                                                        ? false
                                                        : true
                                                }
                                            >
                                                Đặt phòng
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Grid>

                        <Grid item lg={12}>
                            <div
                                style={{
                                    color: "white",
                                    backgroundColor: "var(--primary-color)",
                                    marginLeft: "10px",
                                    fontSize: "1.8rem",
                                    borderRadius: "10px 10px 0px 0px",
                                    display: "inline-block",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0 15px",
                                }}
                            >
                                Mô tả
                            </div>
                            <div
                                style={{
                                    border: "1px solid #0e6828",
                                    padding: "5px 10px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    flexWrap: "wrap",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{ width: "100%", fontSize: "1.6rem" }}
                                    className="ql-editor"
                                    datagramm="false"
                                >
                                    {detail && parse(detail.description)}
                                </div>
                            </div>
                        </Grid>

                        <Grid item lg={12}>
                            <div
                                style={{
                                    color: "white",
                                    backgroundColor: "var(--primary-color)",
                                    marginLeft: "10px",
                                    fontSize: "1.8rem",
                                    borderRadius: "10px 10px 0px 0px",
                                    display: "inline-block",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0 15px",
                                }}
                            >
                                Danh sách phòng
                            </div>
                            <div
                                style={{
                                    border: "1px solid #0e6828",
                                    padding: "5px 10px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    flexWrap: "wrap",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        justifyContent: "space-around",
                                        flexWrap: "wrap",
                                        width: "100%",
                                    }}
                                >
                                    {detail && roomItem}
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div style={{ marginRight: "24px", fontSize: "1.6rem" }}>
                                        <Button
                                            disableRipple
                                            disableFocusRipple
                                            disableElevation
                                            sx={{ height: "36px" }}
                                            variant="contained"
                                        />
                                        <strong>:</strong>
                                        Phòng trống
                                    </div>
                                    <div style={{ fontSize: "1.6rem", marginRight: "24px" }}>
                                        <Button sx={{ height: "36px" }} variant="contained" disabled color="primary" />
                                        <strong>:</strong>
                                        Phòng đã được thuê
                                    </div>
                                    <div style={{ fontSize: "1.6rem" }}>
                                        <Button sx={{ height: "36px" }} variant="contained" color="success" />
                                        <strong>:</strong>
                                        Phòng bạn đã chọn
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={8} md={12} xs={12} sm={12} ms={12}>
                            <div
                                onClick={() => {
                                    navigate(`/${roomType}-room`);
                                    window.scrollTo(0, 0);
                                }}
                                style={{
                                    color: "white",
                                    backgroundColor: "var(--primary-color)",
                                    marginLeft: "10px",
                                    fontSize: "1.8rem",
                                    borderRadius: "10px 10px 0px 0px",
                                    display: "inline-block",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0 15px",
                                    cursor: "pointer",
                                }}
                            >
                                Phòng tương tự
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    border: "1px solid #0e6828",
                                    padding: "10px 5px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        height: "100%",
                                        width: "100%",
                                    }}
                                >
                                    <AliceCarousel
                                        mouseTracking
                                        infinite
                                        autoPlayInterval={2000}
                                        animationDuration={2500}
                                        items={items}
                                        disableDotsControls
                                        autoPlay
                                        disableButtonsControls
                                        responsive={{
                                            0: {
                                                items: 1,
                                            },
                                            767: {
                                                items: 2,
                                            },
                                            992: {
                                                items: 3,
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={4}>
                            <div
                                onClick={() => {
                                    navigate(`/${roomType}-room`);
                                    window.scrollTo(0, 0);
                                }}
                                style={{
                                    color: "white",
                                    backgroundColor: "var(--primary-color)",
                                    marginLeft: "10px",
                                    fontSize: "1.8rem",
                                    borderRadius: "10px 10px 0px 0px",
                                    display: "inline-block",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0 15px",
                                    cursor: "pointer",
                                }}
                            >
                                Phòng tốt nhất
                            </div>
                            <div
                                style={{
                                    border: "1px solid #0e6828",
                                    padding: "5px 10px",
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    flexWrap: "wrap",
                                    marginBottom: "20px",
                                }}
                            >
                                {bestRooms}
                            </div>
                        </Grid>
                    </Grid>
                </ContainerComponent>
            )}
        </>
    );
}

export default RoomDetailpage;
