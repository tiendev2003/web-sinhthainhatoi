import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import { getSocketInstance } from "../../socket";
import { useNavigate } from "react-router-dom";

function OrderPage() {
    const socket = getSocketInstance();
    const [newStatus, setNewStatus] = useState(false);
    const [clickCancel, setClickCancel] = useState(false);
    const [userOrder, setUserOrder] = useState([]);
    useEffect(() => {
        socket.on("updateuserorder", () => {
            setNewStatus(!newStatus);
        });
        async function getUserOrder() {
            const orders = await axios.get("/api/order/user");
            setUserOrder(orders.data);
        }
        getUserOrder();
        return () => {
            socket.off("updateuserorder");
        };
    }, [clickCancel, newStatus]);
    const navigate = useNavigate();
    const { setAlert } = HotelState();

    const handleCancel = async (id) => {
        const confirm = window.confirm("Xác nhận hủy???");
        if (confirm) {
            const response = await axios.put(`/api/order/cancelled/${id}`);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xác nhận hủy thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
            setClickCancel(!clickCancel);
        }
    };

    const handlePayment = async (price, quantity, id) => {
        const confirm = window.confirm("Xác nhận thanh toán???");
        if (confirm) {
            const response = await axios.post("/api/payment/create_payment_url", {
                amount: price * quantity,
                language: "vn",
                bankCode: "",
                targetType: "order",
                id: id,
            });
            if (response.status === 200) {
                window.location.href = response.data;
            }
        }
    };
    const orderList = userOrder.map((item, index) => {
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
                        src={`${process.env.REACT_APP_HOST_URL}${item.cover}`}
                        alt=""
                        style={{ width: "100%", userSelect: "none", marginBottom: "6px" }}
                    />
                    <h2>{item.cuisineName}</h2>
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
                    {item.promotionalPrice.toLocaleString()}đ
                </Typography>
                <Typography
                    sx={{ width: "16%", textAlign: "center", fontSize: "1.6rem", fontWeight: "600", margin: "0 5px" }}
                >
                    {item.quantity}
                </Typography>
                <Typography
                    sx={{ width: "16%", textAlign: "center", fontSize: "1.6rem", fontWeight: "600", margin: "0 5px" }}
                >
                    {item.totalPrice.toLocaleString()}đ
                </Typography>
                <Box sx={{ width: "16%", display: "flex", flexDirection: "column" }}>
                    {item.isAccept === true && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã xác nhận
                        </Typography>
                    )}
                    {item.isAccept === false && item.isDenied === false && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Chưa xác nhận
                        </Typography>
                    )}
                    {item.isDenied === true && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã từ chối
                        </Typography>
                    )}
                    {item.isDelivery === true && item.isDenied === false && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Đã giao
                        </Typography>
                    )}
                    {item.isDelivery === false && item.isDenied === false && item.isCancelled === false && (
                        <Typography
                            sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.6rem",
                                fontWeight: "600",
                                margin: "0 5px",
                            }}
                        >
                            Chưa giao
                        </Typography>
                    )}
                    {item.isCancelled === true && item.isDenied === false && (
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
                        sx={{ marginBottom: "12px" }}
                        onClick={() => {
                            handleCancel(item._id);
                        }}
                        disabled={item.isDelivery || item.isCancelled || item.isAccept || item.isPaid || item.isDenied}
                        variant="contained"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handlePayment(item.promotionalPrice, item.quantity, item._id);
                        }}
                        disabled={item.isPaid || item.isCancelled || item.isDenied || item.isDelivery}
                        sx={{ marginBottom: "12px" }}
                    >
                        Thanh toán
                    </Button>
                    <Button
                        onClick={() => {
                            navigate(`/order/${item._id}`);
                        }}
                        variant="contained"
                    >
                        Chi tiết
                    </Button>
                </Box>
            </div>
        );
    });

    return (
        <ContainerComponent>
            <Box sx={{ backgroundColor: "transparent" }}>
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
                    <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>
                        Danh sách gọi món ăn, đồ uống của bạn
                    </h2>
                </Paper>
            </Box>
            <Box sx={{ backgroundColor: "transparent" }}>
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
                            Thông tin sản phẩm
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
