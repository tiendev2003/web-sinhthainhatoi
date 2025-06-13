import { Grid, Typography, Divider, Button } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import DefaultAdminLayout from "./DefaultAdminLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import parse from "html-react-parser";
import { useDispatch } from "react-redux";
import { getListCuisine } from "../../redux/slices/CuisineSlice";
import { HotelState } from "../../components/MyContext/MyContext";

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
    fontSize: "1.5rem",
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

function AdminCuisineDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const cuisineId = params.id;
    const { setAlert } = HotelState();

    useEffect(() => {
        async function getDetail() {
            const detail = await axios.get(`api/cuisine/detail/${cuisineId}`);

            setDetail(detail.data);
        }
        getDetail();
    }, []);
    const [detail, setDetail] = useState();
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
    const handleDeleteCuisine = async () => {
        let confirm = window.confirm("Xác nhận xóa??");
        if (confirm) {
            const res = await axios.delete(`api/cuisine/delete/${cuisineId}`);
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xóa thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });

                const response = await axios.get("/api/cuisine/list");
                dispatch(getListCuisine([...response.data]));
                navigate("/admin/cuisine");
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
                    spacing={2}
                >
                    <Grid item lg={2}></Grid>
                    <Grid item lg={4}>
                        <Carousel>{caroselItem}</Carousel>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography variant="h3">{detail && detail.title}</Typography>
                        <div>
                            <span style={{ fontSize: "2rem", fontWeight: "600", color: "var(--primary-color)" }}>
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
                        <Divider sx={{ marginTop: "12px" }} variant="fullWidth" orientation="horizontal" />
                        <p style={{ margin: "12px 0" }}>{detail && detail.summary}</p>
                        <Divider sx={{ marginTop: "12px" }} variant="fullWidth" orientation="horizontal" />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span>Tags:</span>
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
                            <div style={{ width: "100%" }} className="ql-editor" datagramm="false">
                                {detail && parse(detail.description)}
                            </div>
                        </div>
                    </Grid>
                    <Grid sx={{ textAlign: "center" }} item lg={12}>
                        <Button
                            onClick={() => {
                                navigate(`/admin/cuisine/edit/${cuisineId}`);
                                window.scrollTo(0, 0);
                            }}
                            variant="contained"
                        >
                            Chỉnh sửa
                        </Button>
                        <Button onClick={handleDeleteCuisine} variant="contained" sx={{ marginLeft: "20px" }}>
                            Xóa
                        </Button>
                    </Grid>
                </Grid>
            </>
        </DefaultAdminLayout>
    );
}

export default AdminCuisineDetail;
