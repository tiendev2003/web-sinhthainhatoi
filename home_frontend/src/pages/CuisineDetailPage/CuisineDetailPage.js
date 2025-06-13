import styled from "@emotion/styled";
import { Button, Card, CardContent, CardMedia, Divider, Grid, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import AliceCarousel from "react-alice-carousel";

const TagItem = styled("li")({
    display: "inline-block",
    listStyleType: "none",
});
const StyledSpan = styled("span")({
    display: "inline-block",
    borderLeft: "3px solid #c40025",
    backgroundColor: "#e2e2e2",
    color: "#323c42",
    padding: "4px 9px",
    margin: "5px",
    fontSize: "1.6rem",
    position: "relative",
    "&::before": {
        left: "0",
        top: "10px",
        border: "solid transparent",
        content: '" "',
        height: "0",
        width: "0",
        position: "absolute",
        pointerEvent: "none",
        borderColor: "rgba(136, 183, 213, 0)",
        borderLeftColor: "#c40025",
        borderWidth: "4px",
    },
});
const StyledTextField = styled("input")`
    height: 45px;
    padding: 0 20px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;

    width: 100px;
    outline: none;
    border: initial;
    font-size: 1.4rem;
`;
function CuisineDetailPage() {
    const navigate = useNavigate();
    const isLogined = useSelector((state) => state.auth.isLogined);
    const params = useParams();
    const cuisineId = params.id;
    const { setAlert } = HotelState();
    const [cuisineType, setCuisineType] = useState("");
    const [bookingId, setbookingId] = useState("");

    useEffect(() => {
        async function getDetail() {
            try {
                const response = await axios.get(`api/cuisine/detail/${cuisineId}`);
                const detailData = response.data;

                setDetail(detailData);
                setCuisineType(detailData.type);
            } catch (error) {
                console.error("Error fetching cuisine detail:", error);
            }
        }

        async function getCurrentBooking() {
            try {
                const response = await axios.get("api/booking/current");
                const data = response.data;

                // Đảm bảo data là mảng
                if (Array.isArray(data) && data.length > 0) {
                    const cur = data.map((item) => ({
                        roomNo: item.roomNo,
                        bookingId: item._id,
                    }));
                    setCurrentBooking(cur);
                } else {
                    setCurrentBooking([]); // Nếu không có dữ liệu, set mảng rỗng
                }
            } catch (error) {
                console.error("Error fetching current booking:", error);
                setCurrentBooking([]); // fallback khi lỗi
            }
        }

        getCurrentBooking();
        getDetail();
    }, [cuisineId]);


    const [currentBooking, setCurrentBooking] = useState([]);
    const [selectedRoomNo, setSelectedRoomNo] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [detail, setDetail] = useState();
    const handleChange = (event) => {
        const selectedRoomNo = event.target.value;
        console.log(selectedRoomNo);
        // Tìm đối tượng có roomNo tương ứng trong currentBooking
        const selectedBooking = currentBooking.find((item) => item.roomNo.includes(selectedRoomNo));
        console.log(selectedBooking, currentBooking);
        if (selectedBooking) {
            const bookingId = selectedBooking.bookingId;
            // Sử dụng bookingId theo nhu cầu của bạn
            setbookingId(bookingId);
        }
        setSelectedRoomNo(selectedRoomNo);
    };

    const caroselItem =
        detail &&
        detail.images.map((item, index) => {
            return (
                <div key={index}>
                    <img
                        src={`${process.env.REACT_APP_HOST_URL}${item}`}
                        alt=""
                        style={{ width: "100%", userSelect: "none" }}
                    />
                </div>
            );
        });

    useEffect(() => {
        async function getSimilarCuisine() {
            if (cuisineType !== "") {
                const response = await axios.get(`api/cuisine/${cuisineType}`);
                setSimlarCuisine(response.data);
            }
        }
        getSimilarCuisine();
    }, [cuisineType]);
    const [simlarCuisine, setSimlarCuisine] = useState([]);
    const similarCuisineArr = simlarCuisine.filter((item) => {
        return item._id !== cuisineId;
    });

    const items = similarCuisineArr.map((item, index) => {
        return (
            <Card
                key={index}
                sx={{
                    margin: "5px",
                    "& .MuiCardContent-root:last-child": {
                        paddingBottom: "16px",
                    },
                }}
            >
                <CardMedia
                    sx={{ height: "225px", cursor: "pointer" }}
                    image={`${process.env.REACT_APP_HOST_URL}${item.images[0]}`}
                    onClick={() => {
                        navigate(`/cuisine/${item._id}`);
                        window.scrollTo(0, 0);
                        window.scrollTo(0, 0);
                    }}
                />
                <CardContent>
                    <Typography
                        fontSize="1.4rem"
                        sx={{
                            width: "100%",
                            textTransform: "uppercase",

                            fontWeight: "600",
                            cursor: "pointer",
                            "&:hover": {
                                color: "var(--primary-color)",
                            },
                        }}
                        onClick={() => {
                            navigate(`/cuisine/${item._id}`);
                            window.scrollTo(0, 0);
                            window.scrollTo(0, 0);
                        }}
                    >
                        {item.title}
                    </Typography>
                    <div style={{ marginTop: "6px" }}>
                        <span
                            style={{
                                color: "var(--primary-color)",
                                fontWeight: "600",
                                fontSize: "1.8rem",
                            }}
                        >
                            {item.promotionalPrice.toLocaleString()}₫
                        </span>
                        <span
                            style={{
                                fontSize: "1.6rem",
                                marginLeft: "6px",
                                textDecoration: "line-through",
                                color: "#acacac",
                            }}
                        >
                            {item.listedPrice && item.listedPrice.toLocaleString() + "₫"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    });

    const handleOrder = async () => {
        if (isLogined) {
            const confirmOrder = window.confirm("Xác nhận đặt đồ ăn?");
            if (confirmOrder) {
                const response = await axios.post("/api/order/create", {
                    cuisineName: detail.title,
                    promotionalPrice: detail.promotionalPrice,
                    totalPrice: Number(quantity * detail.promotionalPrice),
                    quantity: quantity,
                    cuisineId: cuisineId,
                    roomNo: selectedRoomNo,
                    bookingId: bookingId,
                });
                if (response.status === 200) {
                    setAlert({
                        open: true,
                        message: "Đã đặt đồ ăn thành công!",
                        type: "success",
                        origin: { vertical: "bottom", horizontal: "center" },
                    });
                }
                navigate("/order");
                window.scrollTo(0, 0);
            }
        } else {
            if (window.confirm("Bạn cần đăng nhập để gọi đồ ăn! Quay về trang đăng nhập?")) {
                navigate("/login");
                window.scrollTo(0, 0);
            }
        }
    };
    return (
        detail && (
            <ContainerComponent>
                <Grid
                    container
                    sx={{
                        padding: "12px 0",
                        width: "100%",
                    }}
                    spacing={2}
                >
                    <Grid item lg={6} md={12} xs={12}>
                        <Carousel>{caroselItem}</Carousel>
                    </Grid>
                    <Grid item lg={6} md={12} xs={12}>
                        <Typography variant="h2">{detail && detail.title}</Typography>
                        <div style={{ marginTop: "20px", paddingLeft: "10px" }}>
                            <span
                                style={{
                                    fontSize: "2.4rem",
                                    fontWeight: "600",
                                    color: "var(--primary-color)",
                                }}
                            >
                                {detail && detail.promotionalPrice.toLocaleString() + "₫"}
                            </span>
                            {detail && detail.listedPrice && (
                                <span
                                    style={{
                                        fontSize: "1.6rem",
                                        marginLeft: "6px",
                                        textDecoration: "line-through",
                                        color: "#acacac",
                                    }}
                                >
                                    {detail && detail.listedPrice.toLocaleString() + "₫"}
                                </span>
                            )}
                        </div>
                        <Divider sx={{ margin: "20px 0" }} variant="fullWidth" orientation="horizontal" />
                        <p style={{ margin: "12px 0", fontSize: "1.8rem", textAlign: "justify" }}>
                            {detail && detail.summary}
                        </p>
                        <Divider sx={{ margin: "20px 0" }} variant="fullWidth" orientation="horizontal" />
                        <div
                            style={{
                                margin: "20px 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography sx={{ fontSize: "18px" }} variant="body2" color="initial">
                                Chọn nơi nhận: Phòng số
                            </Typography>
                            <Select labelId="room-No" id="room-No" value={selectedRoomNo} onChange={handleChange}>
                                {currentBooking.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.roomNo.toString()}>
                                            {" "}
                                            {/* Sử dụng item.roomNo.toString() */}
                                            {item.roomNo.toString()}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                        <div
                            style={{
                                margin: "20px 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    margin: "20px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <StyledTextField
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={(event) => {
                                        setQuantity(event.target.value);
                                    }}
                                />
                                <Button
                                    onClick={handleOrder}
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    sx={{ marginLeft: "20px" }}
                                >
                                    đặt hàng
                                </Button>
                            </div>
                            {quantity > 0 && (
                                <div>
                                    <span style={{ fontSize: "2rem" }}>Tổng tiền: </span>
                                    <span style={{ fontSize: "2rem", color: "var(--primary-color)" }}>
                                        {Number(quantity * detail.promotionalPrice).toLocaleString()}đ
                                    </span>
                                </div>
                            )}
                        </div>
                        <Divider />

                        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                            <span style={{ fontSize: "1.6rem" }}>Tags:</span>
                            <ul style={{ listStyle: "none", marginBottom: "0", marginLeft: "0" }}>
                                {detail &&
                                    detail.tags.map((item) => {
                                        return (
                                            <TagItem key={item}>
                                                <StyledSpan>{item}</StyledSpan>
                                            </TagItem>
                                        );
                                    })}
                            </ul>
                        </div>
                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>
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
                            Mô tả sản phẩm
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
                                style={{ width: "100%", fontSize: "1.8rem", textAlign: "justify" }}
                                className="ql-editor"
                                datagramm="false"
                            >
                                {detail && parse(detail.description)}
                            </div>
                        </div>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <div
                            onClick={() => {
                                navigate(`/${cuisineType}`);
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
                            Sản phẩm tương tự
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
                                        393: {
                                            items: 1,
                                        },
                                        767: {
                                            items: 2,
                                        },

                                        992: {
                                            items: 4,
                                        },
                                        1025: { items: 4 },
                                        1199: { items: 4 },
                                        1536: { items: 4 },
                                    }}
                                />
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </ContainerComponent>
        )
    );
}

export default CuisineDetailPage;
