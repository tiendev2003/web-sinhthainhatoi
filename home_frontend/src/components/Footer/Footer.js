import { Divider, Grid, List, ListItem, ListItemAvatar, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple, blue, red } from "@mui/material/colors";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ContainerComponent from "../ContainerComponent/ContainerComponent";

function Footer() {
    const Wrapper = styled("div")({
        backgroundImage: "url('/images/bg_footer_1.png')",
        backgroundSize: "100%",
        paddingTop: "64px",
    });
    const Logo = styled("img")({
        height: "57px",
        marginRight: "24px",
    });
    const GridItem = styled(Grid)({
        padding: "24px 12px !important",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    });

    const HotelName = styled(Typography)({
        fontSize: "24px",
        lineHeight: "36px",
        color: "rgb(255, 255, 255)",
        letterSpacing: ".7px",
        textAlign: "center",
        marginTop: "24px",
    });
    const StyledListItemText = styled(ListItemText)({
        ".MuiListItemText-primary": {
            fontSize: "1.6rem",
            color: "#fff",
        },
    });
    const Contact = styled(ListItemText)({
        ".MuiListItemText-primary": {
            fontSize: "1.6rem",
            color: "#fff",
        },
        ".MuiListItemText-primary:hover": {
            color: deepOrange[500],
        },
    });
    return (
        <Wrapper>
            <ContainerComponent>
                <Grid container spacing={2}>
                    <GridItem item xs={12} sm={12} md={6} lg={6}>
                        <Link to={"/"}>
                            <Logo src="/images/logo_nhatoi.jpg" />
                        </Link>
                        <HotelName>KHU DU LỊCH SINH THÁI NHÀ TÔI</HotelName>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: "1.8rem",
                                marginTop: "16px",
                                padding: "0 24px",
                                textAlign: "justify",
                                color: " rgb(20, 219, 47)",
                                lineHeight: "2.6rem",
                            }}
                        >
                            Một điểm đến không thể nào quên!
                        </Typography>
                        <Typography
                            variant="p"
                            sx={{
                                fontSize: "1.5rem",
                                marginTop: "16px",
                                padding: "0 24px",
                                textAlign: "justify",
                                color: "#fff",
                                lineHeight: "2.6rem",
                            }}
                        >
                            Nằm ở trung tâm thành phố và nhiều thành phố khác. Chúng tôi cung cấp chỗ nghỉ thanh lịch và
                            đầy phong cách với truy cập Wifi miễn phí trong các khu vực chung. Khách sạn có lễ tân 24
                            giờ, hồ bơi trong nhà, trung tâm thể dục và bãi đỗ xe miễn phí trong khuôn viên.
                        </Typography>
                    </GridItem>
                    <GridItem item xs={12} sm={12} md={6} lg={6}>
                        <Typography
                            variant="h3"
                            sx={{
                                textTransform: "uppercase",
                                fontSize: "1.8rem",
                                marginTop: "16px",
                                padding: "0 24px",
                                textAlign: "justify",
                                color: " var(--white)",
                                lineHeight: "2.6rem",
                            }}
                        >
                            Liên hệ với chúng tôi
                        </Typography>
                        <List
                            sx={{
                                bgcolor: "transparent",
                            }}
                        >
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                        <LocationOnIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <StyledListItemText primary="Xóm 8, Phú Lương, Thái Nguyên" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                        <CallIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <a href="tel:+0868 466 005">
                                    <Contact primary="0868 466 005"></Contact>
                                </a>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                        <EmailIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <StyledListItemText primary="99999truong@gmail.com" />
                            </ListItem>
                            <ListItem sx={{ display: "flex", justifyContent: "space-between", padding: "32px 60px" }}>
                                <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                    <FacebookIcon fontSize="large" />
                                </Avatar>
                                <Avatar sx={{ bgcolor: blue[500] }}>
                                    <TwitterIcon fontSize="large" />
                                </Avatar>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                    <InstagramIcon fontSize="large" />
                                </Avatar>
                                <Avatar sx={{ bgcolor: red[500] }}>
                                    <YouTubeIcon fontSize="large" />
                                </Avatar>
                            </ListItem>
                        </List>
                    </GridItem>
                </Grid>
            </ContainerComponent>
            <Divider sx={{ backgroundColor: "#fff" }} />
            <Typography sx={{ textAlign: "center", color: "#fff", fontSize: "1.8rem", padding: "24px 0" }}>
                Copyright © 2025. Khu sinh thái Nhà Tôi. All Rights Reserved
            </Typography>
        </Wrapper>
    );
}

export default Footer;
