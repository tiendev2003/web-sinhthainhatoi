import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import { getSocketInstance } from "../../socket";
import { useNavigate } from "react-router-dom";

function OrderPage() {
    const navigate = useNavigate();
    const socket = getSocketInstance();
    const [newStatus, setNewStatus] = useState(false);
    const get_day_of_time = (d1, d2) => {
        let ms1 = new Date(d1).getTime();
        let ms2 = new Date(d2).getTime();
        return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
    };
    const [clickCancel, setClickCancel] = useState(false);
    const [userBooking, setUserBooking] = useState([]);
    useEffect(() => {
        socket.on("updateuserbooking", () => {
            setNewStatus(!newStatus);
        });
        async function getUserBooking() {
            const bookings = await axios.get("api/booking/user");
            setUserBooking(bookings.data);
        }
        getUserBooking();
        return () => {
            socket.off("updateuserbooking");
        };
    }, [clickCancel, newStatus]);
    const { setAlert } = HotelState();

    const handleCancel = async (id) => {
        const confirm = window.confirm("Xác nhận hủy?");
        if (confirm) {
            const response = await axios.put(`api/booking/cancelled/${id}`);
            if (response.status === 200) {
                socket.emit("userbookingcancelled");
                setAlert({
                    open: true,
                    message: "Đã thực hủy đặt phòng thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
            setClickCancel(!clickCancel);
        }
    };

    const handlePayment = async (id, amount) => {
        const confirm = window.confirm("Xác nhận chuyển đến trang thanh toán?");
        if (confirm) {
            const response = await axios.post("/api/payment/create_payment_url", {
                amount: amount,
                language: "vn",
                bankCode: "",
                targetType: "booking",
                id: id,
            });
            if (response.status === 200) {
                window.location.href = response.data;
            }
        }
    };

    const orderList = userBooking.map((item, index) => {
        return (
            <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}
                key={index}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "20%",
                        textAlign: "center",
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        alignItems: "center",
                    }}
                >
                    <img
                        src={`${process.env.REACT_APP_HOST_URL}${item.roomCoverImage}`}
                        alt=""
                        style={{ width: "100%", userSelect: "none", marginBottom: "6px" }}
                    />
                    <h2>{item.roomTitle}</h2>
                </div>
                <Typography
                    sx={{
                        width: "16%",
                        textAlign: "center",
                        fontSize: "1.6rem",
                        fontWeight: "600",
                        margin: "0 5px",
                        display: { xs: "none", ms: "none", md: "block" },
                    }}
                >
                    {item.roomPrice.toLocaleString()}đ
                </Typography>
                <div style={{ width: "16%" }}>
                    <Typography
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            margin: "0 5px",
                        }}
                    >
                        {item.roomNo.length} Phòng
                    </Typography>
                    <Typography
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            margin: "0 5px",
                        }}
                    >
                        {get_day_of_time(item.receiveDate, item.checkoutDate) + 1} Đêm
                    </Typography>
                </div>
                <Typography
                    sx={{ width: "16%", textAlign: "center", fontSize: "1.6rem", fontWeight: "600", margin: "0 5px" }}
                >
                    {item.summaryPrice.toLocaleString()}đ
                </Typography>
                <Box sx={{ width: "16%", display: "flex", flexDirection: "column" }}>
                    {item.isReceived === true && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã nhận
                        </Typography>
                    )}
                    {item.isReceived === false && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Chưa nhận
                        </Typography>
                    )}
                    {item.isCheckedOut === true && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã trả
                        </Typography>
                    )}
                    {item.isCheckedOut === false && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Chưa trả
                        </Typography>
                    )}
                    {item.isCancelled === true && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã hủy
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        width: "16%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button
                        onClick={() => {
                            handleCancel(item._id);
                        }}
                        disabled={item.isReceived || item.isCancelled}
                        sx={{ width: "100%", marginBottom: "12px" }}
                        variant="contained"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            navigate(`/booking/${item._id}`);
                        }}
                        sx={{ width: "100%", marginBottom: "12px" }}
                        variant="contained"
                    >
                        Chi tiết
                    </Button>
                    <Button
                        onClick={() => {
                            handlePayment(item._id, item.summaryPrice);
                        }}
                        disabled={item.isPaid || item.isCancelled}
                        sx={{ width: "100%" }}
                        variant="contained"
                    >
                        thanh toán
                    </Button>
                </Box>
            </div>
        );
    });

    return (
        <ContainerComponent>
            <Box sx={{ padding: "0 30px", backgroundColor: "transparent" }}>
                <Paper
                    sx={{
                        padding: "10px",
                        margin: "20px 0",
                        backgroundColor: "#f7f8f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>Danh sách đặt phòng của bạn</h2>
                </Paper>
            </Box>
            <Box sx={{ padding: "0 30px", backgroundColor: "transparent" }}>
                <Paper
                    sx={{
                        padding: "10px",
                        margin: "20px 0",
                        backgroundColor: "#fff",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",

                            textTransform: "uppercase",
                            marginBottom: "6px",
                        }}
                    >
                        <Typography
                            sx={{
                                width: "20%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Thông tin phòng
                        </Typography>
                        <Typography
                            sx={{
                                width: "16%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                                display: { xs: "none", ms: "none", md: "block" },
                            }}
                        >
                            Đơn giá
                        </Typography>
                        <Typography
                            sx={{
                                width: "16%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Số lượng
                        </Typography>
                        <Typography
                            sx={{
                                width: "16%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Thành tiền
                        </Typography>
                        <Typography
                            sx={{
                                width: "16%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Trạng thái
                        </Typography>
                        <Typography
                            sx={{
                                width: "16%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        ></Typography>
                    </div>
                    <Divider variant="fullWidth" sx={{ width: "100%" }} orientation="horizontal" />
                    {orderList}
                </Paper>
            </Box>
        </ContainerComponent>
    );
}

export default OrderPage;
