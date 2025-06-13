import styled from "@emotion/styled";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import BathtubIcon from "@mui/icons-material/Bathtub";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import { useNavigate } from "react-router-dom";

function RoomList({ rooms }) {
    const navigate = useNavigate();
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
    const Button = styled("button")({
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

    return (
        <>
            {rooms &&
                rooms.map((item, index) => {
                    return (
                        <Grid key={index} item lg={3} md={6} sm={12} xs={12}>
                            <Card>
                                <CardMedia
                                    onClick={() => {
                                        navigate(`/room/${item._id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                    sx={{ height: "165px", cursor: "pointer" }}
                                    image={`${process.env.REACT_APP_HOST_URL}${item.cover}`}
                                />
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
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                                        {item.services[0].includes("roomCoffee") && (
                                            <CoffeeIcon sx={{ margin: "0 6px" }} />
                                        )}
                                        {item.services[0].includes("roomBathtub") && (
                                            <BathtubIcon sx={{ margin: "0 6px" }} />
                                        )}
                                        {item.services[0].includes("roomWifi") && (
                                            <WifiOutlinedIcon sx={{ margin: "0 6px" }} />
                                        )}
                                        {item.services[0].includes("roomStove") && (
                                            <MicrowaveIcon sx={{ margin: "0 6px" }} />
                                        )}
                                        {item.services[0].includes("roomFood") && (
                                            <DinnerDiningIcon sx={{ margin: "0 6px" }} />
                                        )}
                                    </div>
                                    <TagReview>
                                        <ul
                                            style={{
                                                paddingTop: "10px",
                                                listStyle: "none",
                                                display: "flex",
                                            }}
                                        >
                                            <li style={{ fontSize: "1.5rem", margin: "0 6px" }}>
                                                {item.adults + " Khách"}
                                            </li>
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
                                        <Button
                                            onClick={() => {
                                                navigate(`/room/${item._id}`);
                                                window.scrollTo(0, 0);
                                            }}
                                        >
                                            ĐẶT PHÒNG
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
        </>
    );
}

export default RoomList;
