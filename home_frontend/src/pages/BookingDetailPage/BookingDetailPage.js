import { Button, Grid, Typography } from "@mui/material";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

function BookingDetailPage() {
    const params = useParams();
    const [detail, setDetail] = useState();
    useEffect(() => {
        async function getBookingDetail() {
            const response = await axios.get(`api/booking/detail/${params.id}`);
            setDetail(response.data);
        }
        getBookingDetail();
    }, []);
    console.log(detail);
    const handlePayment = async () => {
        const confirm = window.confirm("Xác nhận thanh toán???");
        if (confirm) {
            const response = await axios.post("/api/payment/create_payment_url", {
                amount: detail.summaryPrice,
                language: "vn",
                bankCode: "",
                targetType: "booking",
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
                    Thông tin đặt phòng
                </Typography>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <img
                            width="100%"
                            style={{ borderRadius: "15px" }}
                            src={`${process.env.REACT_APP_HOST_URL}${detail.roomCoverImage}`}
                            alt="cover"
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="body1" color="initial">
                            Loại phòng: {detail.roomTitle}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Số phòng: {detail.roomNo.toString()}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Giá phòng: {detail.roomPrice.toLocaleString() + "đ"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Tổng chi phí: {detail.summaryPrice.toLocaleString() + "đ"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Ngày nhận phòng: {moment(detail.receiveDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Ngày trả phòng: {moment(detail.checkoutDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Thời gian đặt:{" "}
                            {moment(detail.createdAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:MM:SS")}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Trạng thái đặt phòng:{" "}
                            {(detail.isCancelled && "Đã hủy") ||
                                (!detail.isCancelled && detail.isReceived && "Đã xác nhận") ||
                                (!detail.isCancelled && !detail.isReceived && "Chưa xác nhận")}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Trạng thái nhận phòng: {detail.isReceived ? "Đã nhận" : "Chưa nhận"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Trạng thái trả phòng: {detail.isCheckedOut ? "Đã trả" : "Chưa trả"}
                        </Typography>
                        <Typography variant="body1" color="initial">
                            Trạng thái thanh toán: {detail.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Typography>
                        {!detail.isPaid && !detail.isCancelled && !detail.isCheckedOut && (
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
                        {!detail.isCancelled && !detail.isReceived && !detail.isPaid && (
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

export default BookingDetailPage;
