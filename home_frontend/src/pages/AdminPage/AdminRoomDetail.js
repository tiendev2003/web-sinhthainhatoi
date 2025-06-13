import axios from "axios";
import { useEffect, useState } from "react";

import DefaultAdminLayout from "./DefaultAdminLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import parse from "html-react-parser";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Grid, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CropIcon from "@mui/icons-material/Crop";
import CoffeeIcon from "@mui/icons-material/Coffee";
import WifiIcon from "@mui/icons-material/Wifi";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import MoneyIcon from "@mui/icons-material/Money";
import { HotelState } from "../../components/MyContext/MyContext";
function AdminRoomDetail() {
    const params = useParams();
    const roomId = params.id;
    const navigate = useNavigate();
    const { setAlert } = HotelState();

    useEffect(() => {
        async function getDetail() {
            const detail = await axios.get(`api/room/${roomId}`);

            setDetail(detail.data);
        }
        getDetail();
    }, []);
    const [detail, setDetail] = useState();

    const roomItem =
        detail &&
        detail.roomStatus.map((item) => {
            return (
                <div key={item.roomNo} style={{ padding: "12px" }}>
                    <Button
                        disableRipple
                        disableElevation
                        disableFocusRipple
                        disableTouchRipple
                        variant="contained"
                        disabled={item.isBooked}
                    >
                        {item.roomNo}
                    </Button>
                </div>
            );
        });

    const caroselItem =
        detail &&
        detail.images.map((item) => {
            return (
                <div key={item}>
                    <img
                        src={`${process.env.REACT_APP_HOST_URL}${item}`}
                        alt=""
                        style={{ width: "75%", userSelect: "none" }}
                    />
                </div>
            );
        });

    const handleDeleteRoom = async () => {
        let confirm = window.confirm("Xác nhận xóa phòng???");
        if (confirm) {
            const response = await axios.delete("api/room/delete/" + roomId);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xóa thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                navigate("/admin/room");
                window.scrollTo(0, 0);
            }
        }
    };

    return (
        <DefaultAdminLayout>
            <>
                <Grid
                    container
                    sx={{
                        padding: "12px 0",
                        width: "100%",
                    }}
                >
                    <Grid item lg={12}>
                        <Carousel>{caroselItem}</Carousel>
                    </Grid>
                    <Grid item lg={2}></Grid>

                    <Grid item lg={8}>
                        <Typography sx={{ textAlign: "center" }} variant="h3">
                            {detail && detail.title}
                        </Typography>
                    </Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={8}>
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
                                <span style={{ marginLeft: "12px" }}> {detail && detail.adults} Người lớn </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <PeopleIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                <span style={{ marginLeft: "12px" }}>{detail && detail.children} Trẻ em </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <CropIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                <span style={{ marginLeft: "12px" }}> Phòng {detail && detail.area}m²</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <MoneyIcon fontSize="large" sx={{ marginLeft: "24px" }} />
                                {detail && (
                                    <span
                                        style={{
                                            marginLeft: "12px",
                                            fontSize: "2.4rem",
                                            color: "var(--primary-color)",
                                        }}
                                    >
                                        {" "}
                                        {detail && detail.price.toLocaleString()}₫/Đêm{" "}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Divider />
                    </Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={2}></Grid>

                    <Grid item lg={8}>
                        <Typography sx={{ margin: "20px" }} variant="h6">
                            Các phòng trang nhã và dãy phòng trang nghiêm của chúng tôi gợi nhớ về một thời đại đã qua.
                            Mỗi tính năng như đường cong, thảm sang trọng, trần nhà cao, phòng tắm lát đá cẩm thạch,
                            thiết bị làm sạch và nhiều không gian đều được bố trí một cách chu đáo để gọi cho riêng bạn.
                            Tông màu nâu phong phú và gỗ sồi tự nhiên tạo nên những khu bảo tồn yên tĩnh và yên tĩnh,
                            được tôn lên một cách tuyệt vời bởi đồ nội thất trang nhã.
                        </Typography>
                    </Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={2}></Grid>

                    <Grid item lg={8}>
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
                                justifyContent: "space-around",
                                flexWrap: "wrap",
                                marginBottom: "20px",
                            }}
                        >
                            {detail && detail.services[0].includes("roomCoffee") && (
                                <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                    <CoffeeIcon fontSize="large" />
                                    <span style={{ marginLeft: "6px" }}>Cafe Buổi Sáng</span>
                                </div>
                            )}
                            {detail && detail.services[0].includes("roomBathtub") && (
                                <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                    <BathtubIcon fontSize="large" />
                                    <span style={{ marginLeft: "6px" }}>Bồn Tắm Hoa Sen</span>
                                </div>
                            )}
                            {detail && detail.services[0].includes("roomWifi") && (
                                <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                    <WifiIcon fontSize="large" />
                                    <span style={{ marginLeft: "6px" }}>Internet Không Dây</span>
                                </div>
                            )}
                            {detail && detail.services[0].includes("roomFood") && (
                                <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                    <DinnerDiningIcon fontSize="large" />
                                    <span style={{ marginLeft: "6px" }}>Gọi Đồ Ăn Tại Phòng</span>
                                </div>
                            )}
                            {detail && detail.services[0].includes("roomStove") && (
                                <div style={{ fontSize: "1.6rem", display: "flex", alignItems: "center" }}>
                                    <MicrowaveIcon fontSize="large" />
                                    <span style={{ marginLeft: "6px" }}>Bếp Nấu Tại Phòng</span>
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={8}>
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
                            <div style={{ width: "100%" }} className="ql-editor" datagramm="false">
                                {detail && parse(detail.description)}
                            </div>
                        </div>
                    </Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={2}></Grid>
                    <Grid item lg={8}>
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
                                }}
                            >
                                {detail && roomItem}
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: "24px" }}>
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
                                <div>
                                    <Button sx={{ height: "36px" }} variant="contained" disabled />
                                    <strong>:</strong>
                                    Phòng đã được thuê
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid sx={{ textAlign: "center" }} item lg={12}>
                        <Button
                            onClick={() => {
                                navigate(`/admin/room/edit/${roomId}`);
                                window.scrollTo(0, 0);
                            }}
                            variant="contained"
                        >
                            Chỉnh sửa
                        </Button>
                        <Button onClick={handleDeleteRoom} variant="contained" sx={{ marginLeft: "20px" }}>
                            Xóa
                        </Button>
                    </Grid>
                </Grid>
            </>
        </DefaultAdminLayout>
    );
}

export default AdminRoomDetail;
