import { Button, Grid, Typography } from "@mui/material";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

function OrderDetailPage() {
    const params = useParams();
    const [detail, setDetail] = useState();
    useEffect(() => {
        async function getBookingDetail() {
            const response = await axios.get(`api/order/detail/${params.id}`);
            setDetail(response.data);
        }
        getBookingDetail();
    }, []);
    console.log(detail);
    const handlePayment = async () => {
        const confirm = window.confirm("Xác nhận thanh toán???");
        if (confirm) {
            const response = await axios.post("/api/payment/create_payment_url", {
                amount: detail.totalPrice,
                language: "vn",
                bankCode: "",
                targetType: "order",
                id: detail._id,
            });
            if (response.status === 200) {
                window.location.href = response.data;
            }
        }
    };
    if (detail) {
        return (
            <ContainerComponent>
                <Typography
                    variant="h3"
                    sx={{ width: "100%", textAlign: "center", fontSize: "36px", margin: "12px 0" }}
                >
                    Thông tin đặt đồ ăn, đồ uống
                </Typography>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <img
                            width="100%"
                            style={{ borderRadius: "15px" }}
                            src={`${process.env.REACT_APP_HOST_URL}${detail.cover}`}
                            alt="cover"
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="body1" color="initial">
                            Tên: {detail.cuisineName}
                        </Typography>

                        <Typography variant="body1" color="initial">
                            Giá: {detail.promotionalPrice.toLocaleString() + "đ"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Tổng chi phí: {detail.totalPrice.toLocaleString() + "đ"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Ngày đặt: {moment(detail.createdAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}
                        </Typography>

                        <Typography variant="body1" color="initial">
                            Trạng thái thanh toán: {detail.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Typography>
                        {!detail.isPaid && !detail.isCancelled && (
                            <Button
                                onClick={() => {
                                    handlePayment();
                                }}
                                sx={{ width: "150px", marginRight: "12px" }}
                                variant="contained"
                            >
                                thanh toán
                            </Button>
                        )}
                        {!detail.isCancelled && !detail.isDelivery && !detail.isPaid && (
                            <Button
                                onClick={() => {
                                    handlePayment();
                                }}
                                sx={{ width: "150px" }}
                                variant="contained"
                            >
                                hủy
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </ContainerComponent>
        );
    }
}

export default OrderDetailPage;
