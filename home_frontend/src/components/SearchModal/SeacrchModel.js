import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/system";
import { AppBar, Card, CardContent, CardMedia, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ContainerComponent from "../ContainerComponent/ContainerComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CoffeeIcon from "@mui/icons-material/Coffee";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import BathtubIcon from "@mui/icons-material/Bathtub";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";

const StyledTextField = styled("input")`
    height: 45px;
    padding: 0 20px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;
    width: 100%;
    outline: none;
    border: initial;
    font-size: 1.6rem;
`;
const NavItem = styled("span")({
    fontSize: "1.4rem",
    lineHeight: "1.8rem",
    textTransform: "unset",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
});
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
function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [result, setResult] = useState(null);

    const handleClose = () => {
        onClose(selectedValue);
        setIsSearched(false);
        setSearch("");
    };
    const [isSearched, setIsSearched] = useState(false);
    const [search, setSearch] = useState("");
    const handleSearch = async () => {
        const response = await axios.get(`/search?query=${search}`);
        setResult(response.data);
        setIsSearched(true);
    };
    const navigate = useNavigate();
    const ResultItemRoom =
        result &&
        (result[0].roomType === "single" || result[0].roomType === "double" || result[0].roomType === "vip") &&
        result.map((item, index) => {
            return (
                <Grid key={index} item lg={3}>
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
                                <Button
                                    onClick={() => {
                                        navigate(`/room/${item._id}`);window.scrollTo(0, 0);
                                    }}
                                >
                                    ĐẶT PHÒNG
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            );
        });
    const ResultItemCuisine =
        result &&
        (result[0].type === "food" || result[0].type === "drink") &&
        result.map((item, index) => {
            return (
                <Grid key={index} item lg={3}>
                    <Card
                        sx={{
                            "& .MuiCardContent-root:last-child": {
                                paddingBottom: "16px",
                            },
                        }}
                    >
                        <CardMedia
                            sx={{ height: "225px", cursor: "pointer" }}
                            image={`${process.env.REACT_APP_HOST_URL}${item.images[0]}`}
                            onClick={() => {
                                navigate(`/cuisine/${item._id}`);window.scrollTo(0, 0);
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
                                    navigate(`/cuisine/${item._id}`);window.scrollTo(0, 0);
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
                </Grid>
            );
        });

    return (
        <Dialog fullScreen sx={{ margin: "0" }} onClose={handleClose} open={open}>
            <AppBar sx={{ backgroundColor: "#fafafa", position: "relative", width: "100%" }}>
                <ContainerComponent>
                    <Toolbar sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton edge="start" color="#000" onClick={handleClose} aria-label="close">
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <StyledTextField
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsSearched(false);
                            }}
                        />
                        <IconButton edge="end" color="#000" onClick={handleSearch} aria-label="close">
                            <SearchIcon fontSize="large" />
                        </IconButton>
                    </Toolbar>
                </ContainerComponent>
            </AppBar>
            <ContainerComponent>
                <Grid sx={{ margin: "20px 0" }} container spacing={2}>
                    {ResultItemRoom && ResultItemRoom}
                    {ResultItemCuisine && ResultItemCuisine}
                    {!result && isSearched && <Typography>Không có kết quả cho tìm kiếm "{search}"</Typography>}
                </Grid>
            </ContainerComponent>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function SearchModel() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            <NavItem onClick={handleClickOpen}>
                <SearchIcon style={{ fontSize: "20px", marginRight: "6px" }} />
                Tìm kiếm
            </NavItem>
            <SimpleDialog selectedValue="none" open={open} onClose={handleClose} />
        </div>
    );
}
