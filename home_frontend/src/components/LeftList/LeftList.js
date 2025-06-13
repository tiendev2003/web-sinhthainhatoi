import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import HomeIcon from "@mui/icons-material/Home";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import InfoIcon from "@mui/icons-material/Info";
import BedIcon from "@mui/icons-material/Bed";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import KingBedIcon from "@mui/icons-material/KingBed";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import ContactsIcon from "@mui/icons-material/Contacts";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import CollectionsIcon from "@mui/icons-material/Collections";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";

function LeftList() {
    const [openRoom, setOpenRoom] = React.useState(false);
    const [openCuisine, setOpenCuisine] = React.useState(false);

    const handleClickRoom = () => {
        setOpenRoom(!openRoom);
        if (openCuisine) {
            setOpenCuisine(!openCuisine);
        }
    };

    const handleClickCuisine = () => {
        setOpenCuisine(!openCuisine);
        if (openRoom) {
            setOpenRoom(!openRoom);
        }
    };

    const StyledListItemText = styled(ListItemText)({
        ".MuiListItemText-primary": {
            fontSize: "1.6rem",
        },
    });

    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <Link to={"/"}>
                <ListItemButton>
                    <ListItemIcon>
                        <HomeIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Trang chủ" />
                </ListItemButton>
            </Link>
            <Link to={"/about"}>
                <ListItemButton>
                    <ListItemIcon>
                        <InfoIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Về chúng tôi" />
                </ListItemButton>
            </Link>

            <ListItemButton>
                <Link style={{ display: "flex", alignItems: "center", flex: "1" }} to={"/room"}>
                    <ListItemIcon>
                        <BedIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Phòng" />
                </Link>
                {openRoom ? (
                    <ExpandLess onClick={handleClickRoom} fontSize="large" />
                ) : (
                    <ExpandMore onClick={handleClickRoom} fontSize="large" />
                )}
            </ListItemButton>
            <Collapse in={openRoom} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Link to={"/single-room"}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <SingleBedIcon fontSize="large" />
                            </ListItemIcon>
                            <StyledListItemText primary="Phòng đơn" />
                        </ListItemButton>
                    </Link>
                    <Link to={"/double-room"}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <BedroomParentIcon fontSize="large" />
                            </ListItemIcon>
                            <StyledListItemText primary="Phòng đôi" />
                        </ListItemButton>
                    </Link>
                    <Link to={"vip-room"}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <KingBedIcon fontSize="large" />
                            </ListItemIcon>
                            <StyledListItemText primary="Phòng vip" />
                        </ListItemButton>
                    </Link>
                </List>
            </Collapse>
            <ListItemButton>
                <Link style={{ display: "flex", alignItems: "center", flex: "1" }} to={"/cuisine"}>
                    <ListItemIcon>
                        <RestaurantIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Ẩm thực" />
                </Link>
                {openCuisine ? (
                    <ExpandLess onClick={handleClickCuisine} fontSize="large" />
                ) : (
                    <ExpandMore onClick={handleClickCuisine} fontSize="large" />
                )}
            </ListItemButton>
            <Collapse in={openCuisine} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Link to={"/food"}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <DinnerDiningIcon fontSize="large" />
                            </ListItemIcon>
                            <StyledListItemText primary="Món ăn" />
                        </ListItemButton>
                    </Link>
                    <Link to={"/drink"}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <LocalDrinkIcon fontSize="large" />
                            </ListItemIcon>
                            <StyledListItemText primary="Đồ uống" />
                        </ListItemButton>
                    </Link>
                </List>
            </Collapse>

            <Link to={"/contact"}>
                <ListItemButton>
                    <ListItemIcon>
                        <ContactsIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Liên hệ" />
                </ListItemButton>
            </Link>
            <Link to={"/gallery"}>
                <ListItemButton>
                    <ListItemIcon>
                        <CollectionsIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Thư viện ảnh" />
                </ListItemButton>
            </Link>
            <Link to={"/room"}>
                <ListItemButton>
                    <ListItemIcon>
                        <DateRangeIcon fontSize="large" />
                    </ListItemIcon>
                    <StyledListItemText primary="Đặt Phòng" />
                </ListItemButton>
            </Link>
        </List>
    );
}
export default LeftList;
