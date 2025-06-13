import {
    Card,
    CardContent,
    CardMedia,
    FormControl,
    Grid,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import SortIcon from "@mui/icons-material/Sort";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import CoffeeIcon from "@mui/icons-material/Coffee";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import BathtubIcon from "@mui/icons-material/Bathtub";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";

function RoomPage() {
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
    const [search, setSearch] = useSearchParams();
    const [sortBy, setSortBy] = useState(search.get("sort") != null ? search.get("sort") : "bookingCount,desc");
    console.log(sortBy);
    useEffect(() => {
        async function getRoom() {
            const room = await axios.get(`api/room/list?sort=${sortBy}`);
            setRooms(room.data);
        }

        getRoom();
    }, [sortBy]);
    const [page, setPage] = useState(1);
    const [rooms, setRooms] = useState();

    const handleChange = (event) => {
        setSortBy(event.target.value);
        search.set("sort", event.target.value);
        setSearch(search);
    };
    const count =
        Number(rooms?.length % 8) === 0 ? Number(rooms?.length / 8) : Math.floor(Number(rooms?.length / 8)) + 1;

    return (
        <>
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
                        <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>Phòng</h2>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <SortIcon />
                            <span style={{ fontSize: "1.5rem", marginRight: "12px" }}>Sắp xếp: </span>
                            <FormControl size="small" sx={{ border: "none" }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sortBy}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"bookingCount,desc"}>Xu hướng</MenuItem>
                                    <MenuItem value={"title,asc"}>Tên A → Z</MenuItem>
                                    <MenuItem value={"title,desc"}>Tên Z → A</MenuItem>
                                    <MenuItem value={"price,asc"}>Giá tăng dần</MenuItem>
                                    <MenuItem value={"price,desc"}>Giá giảm dần</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                </Box>
                <Box sx={{ padding: "0 30px", marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                        {rooms &&
                            rooms.slice((page - 1) * 8, (page - 1) * 8 + 8).map((item, index) => {
                                return (
                                    <Grid key={index} item lg={3} md={6} sm={6} ms={12} xs={12}>
                                        <Card>
                                            <CardMedia
                                                sx={{ height: "165px" }}
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
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        padding: "12px 0",
                                                    }}
                                                >
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
                                                        <li style={{ fontSize: "1.5rem", margin: "0 6px" }}>
                                                            {item.area + "m²"}
                                                        </li>
                                                    </ul>
                                                </TagReview>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginTop: "12px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#c40025",
                                                            fontWeight: "600",
                                                            fontSize: "1.8rem",
                                                        }}
                                                    >
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
                    </Grid>
                </Box>
                {rooms && count > 1 && (
                    <Pagination
                        sx={{
                            paddimg: 20,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "20px",
                            "& .MuiPaginationItem-root": {
                                color: "var(--primary-color)",
                            },
                        }}
                        variant="outlined"
                        onChange={(_, value) => {
                            setPage(value);
                        }}
                        shape="rounded"
                        count={count}
                    />
                )}
            </ContainerComponent>
        </>
    );
}

export default RoomPage;
