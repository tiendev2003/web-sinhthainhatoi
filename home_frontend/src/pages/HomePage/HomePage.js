import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useNavigate } from "react-router-dom";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import axios from "axios";
import RoomList from "../../components/RoomList/RoomList";
import CuisineList from "../../components/CuisineList/CuisineList";

function HomePage() {
    const ContentIntroduce = styled("div")({
        paddingTop: "48px",
    });
    const TitleFrame = styled("div")({
        position: "relative",
        display: "inline-block",
        color: "#eaecf3",
    });
    const LineTop = styled("span")`
        top: 0;
        height: 5px;
        width: 172px;
        left: 0;
        position: absolute;
        content: "";
        background-color: currentColor;
    `;
    const LineRight = styled("span")`
        left: 172px;
        width: 5px;
        height: 100%;
        position: absolute;
        content: "";
        background-color: currentColor;
    `;
    const LineBottom = styled("span")`
        bottom: 0;
        height: 5px;
        width: 172px;
        left: 0;
        position: absolute;
        content: "";
        background-color: currentColor;
    `;
    const LineLeft = styled("span")`
        left: 0;
        width: 5px;
        height: 100%;
        position: absolute;
        content: "";
        background-color: currentColor;
    `;
    const LineMask = styled("span")`
        width: 5px;
        height: calc(100% - 26px);
        top: 13px;
        z-index: 50;
        left: 172px;
        background-color: #fff;
        position: absolute;
        content: "";
    `;
    const IntroduceTitleIner = styled("div")`
        display: inline-block;
        position: relative;
        z-index: 150;
        padding: 11px 0 11px 80px;
    `;
    const EntryTitleIner = styled("h3")`
        display: block;
        margin: 4px 10px;
        color: #000;
    `;
    const NameIntr = styled("span")`
        font-weight: bold;
        font-size: 26px;
        line-height: 56.4px;
    `;
    const ButtonShowMore = styled("button")({
        backgroundColor: "var(--primary-color)",
        color: "#fff",
        padding: "15px 40px",
        outline: "none",
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease-in-out",
        marginTop: "20px",
        "&:hover": {
            backgroundColor: "#a37a22",
        },
    });
    const Titles = styled("h2")({
        marginBottom: "10px",
        paddingBottom: "10px",

        fontSize: "30px",
        textTransform: "uppercase",
        fontWeight: "600",
        paddingTop: "20px",
        cursor: "pointer",
        position: "relative",

        "&::after": {
            borderBottom: "3px double #333",
            content: '" "',
            height: "3px",
            bottom: "0",
            left: "0",
            position: "absolute",
            right: "0",
            width: "10%",
            margin: "0 auto",
        },
    });

    React.useEffect(() => {
        async function getSingleRoom() {
            const singleRoom = await axios.get("api/room/single");
            setSingleRooms(singleRoom.data);
        }
        async function getDoubleRoom() {
            const doubleRoom = await axios.get("api/room/double");
            setDoubleRooms(doubleRoom.data);
        }
        async function getVipRoom() {
            const vipRoom = await axios.get("api/room/vip");
            setVipRooms(vipRoom.data);
        }

        getVipRoom();
        getDoubleRoom();
        getSingleRoom();
    }, []);
    const [value, setValue] = React.useState("1");

    React.useEffect(() => {
        async function getFood() {
            const food = await axios.get("api/cuisine/food");
            setFood(food.data);
        }
        async function getDrinks() {
            const drink = await axios.get("api/cuisine/drink");
            setDrinks(drink.data);
        }
        getDrinks();
        getFood();
    }, [value]);
    const [drinks, setDrinks] = React.useState();
    const [food, setFood] = React.useState();
    const [vipRooms, setVipRooms] = React.useState();
    const [doubleRooms, setDoubleRooms] = React.useState();

    const [singleRooms, setSingleRooms] = React.useState();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigate = useNavigate();

    const TitlesSpan = styled("span")({
        " &:hover": {
            color: "var(--primary-color)",
        },
    });
    return (
        <>
            <div style={{ marginBottom: "20px" }}>
                <img
                    src="/images/banner_nhatoi.jpg"
                    alt="slider1"
                    style={{ border: "0 none", width: "100%", height: "auto", lineHeight: "30.8px" }}
                />
            </div>
            <ContainerComponent>
                <Grid sx={{ marginBottom: "20px", paddingRight: "16px" }} container spacing={0}>
                    <Grid item lg={6}>
                        <img
                            src="/images/khu-du-lich-sinh-thai-nha-toi-3.jpg"
                            alt="slider1"
                            style={{ border: "0 none", width: "100%", height: "auto" }}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <ContentIntroduce>
                            <TitleFrame>
                                <LineTop />
                                <LineRight />
                                <LineBottom />
                                <LineLeft />
                                <LineMask />
                                <IntroduceTitleIner>
                                    <EntryTitleIner>
                                        <NameIntr>Khu sinh thái Nhà Tôi</NameIntr>
                                        <br />
                                        <span style={{ fontSize: "2.2rem", fontWeight: "600", lineHeight: "36.8px" }}>
                                            Giới thiệu về chúng tôi
                                        </span>
                                    </EntryTitleIner>
                                </IntroduceTitleIner>
                            </TitleFrame>
                            <div style={{ marginLeft: "90px" }}>
                                <p
                                    style={{
                                        fontSize: "1.6rem",
                                        fontWeight: "400",
                                        lineHeight: "23.8px",
                                        padding: "10px 0",
                                        textAlign: "justify",
                                    }}
                                >
                                    Là khu sinh thái đẳng cấp quốc tế, tọa lạc tại Thái Nguyên. Với hệ thống phòng tiêu
                                    chuẩn và phòng hạng sang thiết kế đẹp mắt và trang nhã được chú trọng tới từng chi
                                    tiết sẽ đem lại sự tiện nghi và thoải mái tối đa cho quý khách dù là thời gian nghỉ
                                    ngơi thư giãn hay trong chuyến công tác...
                                </p>
                                <ButtonShowMore
                                    onClick={() => {
                                        navigate("/about");
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Xem thêm
                                </ButtonShowMore>
                            </div>
                        </ContentIntroduce>
                    </Grid>
                </Grid>
                <Grid
                    sx={{ backgroundColor: "#f3f3f3", paddingRight: "16px", paddingBottom: "48px" }}
                    container
                    spacing={2}
                >
                    <div style={{ marginBottom: "30px", textAlign: "center", width: "100%" }}>
                        <Titles>
                            <TitlesSpan
                                onClick={() => {
                                    navigate("/room");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Phòng
                            </TitlesSpan>
                        </Titles>
                    </div>
                    <RoomList rooms={singleRooms} />
                </Grid>
                <Grid
                    sx={{ backgroundColor: "#fff", paddingRight: "16px", paddingBottom: "48px" }}
                    container
                    spacing={2}
                >
                    <div style={{ marginBottom: "30px", textAlign: "center", width: "100%" }}>
                        <Titles>
                            <TitlesSpan
                                onClick={() => {
                                    navigate("/double-room");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Phòng đôi
                            </TitlesSpan>
                        </Titles>
                    </div>
                    <RoomList rooms={doubleRooms} />
                </Grid>
                <Grid
                    sx={{ backgroundColor: "#f3f3f3", paddingRight: "16px", paddingBottom: "48px" }}
                    container
                    spacing={2}
                >
                    <div style={{ marginBottom: "30px", textAlign: "center", width: "100%" }}>
                        <Titles>
                            <TitlesSpan
                                onClick={() => {
                                    navigate("/vip-room");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Phòng vip
                            </TitlesSpan>
                        </Titles>
                    </div>
                    <RoomList rooms={vipRooms} />
                </Grid>
                <Grid
                    sx={{ backgroundColor: "#fff", paddingRight: "16px", paddingBottom: "48px" }}
                    container
                    spacing={2}
                >
                    <div style={{ marginBottom: "20px", textAlign: "center", width: "100%" }}>
                        <Titles>
                            <TitlesSpan
                                onClick={() => {
                                    navigate("/cuisine");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Ẩm thực
                            </TitlesSpan>
                        </Titles>
                    </div>
                    <Box sx={{ width: "100%", typography: "body1" }}>
                        <TabContext value={value}>
                            <Box
                                sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <TabList
                                    sx={{
                                        "& .MuiTab-root": {
                                            fontSize: "1.8rem !important",
                                            fontWeight: "500 ",
                                        },
                                        "& .Mui-selected": {
                                            color: "var(--primary-color) !important",
                                            fontWeight: "500 !important",
                                            fontSize: "1.8rem !important",
                                        },
                                        "& .MuiTabs-indicator": {
                                            backgroundColor: "var(--primary-color)",
                                        },
                                    }}
                                    onChange={handleChange}
                                    aria-label=""
                                >
                                    <Tab label="Món ăn" value="1" />
                                    <Tab label="Đồ uống" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Grid container spacing={2}>
                                    <CuisineList cuisine={food} />
                                </Grid>
                            </TabPanel>
                            <TabPanel value="2">
                                <Grid container spacing={2}>
                                    <CuisineList cuisine={drinks} />
                                </Grid>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Grid>
            </ContainerComponent>
        </>
    );
}

export default HomePage;
