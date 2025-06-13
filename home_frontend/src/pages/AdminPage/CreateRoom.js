import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Typography,
    Button,
} from "@mui/material";
import * as React from "react";
import { styled } from "@mui/system";
import { useState } from "react";
import DefaultAdminLayout from "./DefaultAdminLayout";
import CoffeeOutlinedIcon from "@mui/icons-material/CoffeeOutlined";
import CoffeeIcon from "@mui/icons-material/Coffee";
import DinnerDiningOutlinedIcon from "@mui/icons-material/DinnerDiningOutlined";
import MicrowaveOutlinedIcon from "@mui/icons-material/MicrowaveOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import BathtubIcon from "@mui/icons-material/Bathtub";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import HideImageIcon from "@mui/icons-material/HideImage";
// import parse from "html-react-parser";
import axios from "axios";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { HotelState } from "../../components/MyContext/MyContext";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled("input")`
    height: 45px;
    padding: 0 20px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;
    margin-bottom: 15px;
    width: 100%;
    outline: none;
    border: initial;
    font-size: 1.4rem;
`;

function CreateRoom() {
    const { setAlert } = HotelState();
    const navigate = useNavigate();
    const [roomType, setRoomType] = useState("");
    const handleChangeRoomType = (event) => {
        setRoomType(event.target.value);
    };

    const [services, setServices] = useState([]);

    const handleChangeServices = (event) => {
        const index = services.indexOf(event.target.value);
        if (index === -1) {
            setServices([...services, event.target.value]);
        } else {
            setServices(services.filter((service) => service !== event.target.value));
        }
    };
    const [roomNo, setRoomNo] = useState("");
    const handleChangeRoomNo = (event) => {
        setRoomNo(event.target.value);
    };
    const [title, setTitle] = useState("");
    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const [adults, setAdults] = useState("");
    const handleChangeAdult = (event) => {
        setAdults(event.target.value);
    };
    const [children, setChildren] = useState("");
    const handleChangeChildren = (event) => {
        setChildren(event.target.value);
    };
    const [area, setArea] = useState("");
    const handleChangeArea = (event) => {
        setArea(event.target.value);
    };

    const [price, setPrice] = useState("");
    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };

    const [selectedImages, setSelectedImages] = useState([]);

    const onSelectFile = (event) => {
        setFile(event.target.files);
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
            return URL.createObjectURL(file);
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    };
    const fileRef = React.useRef(null);
    const clearAllImages = () => {
        const selectedFilesArray = Array.from(file);
        selectedFilesArray.map((file) => {
            return URL.revokeObjectURL(file);
        });
        setFile([]);
        setSelectedImages([]);
        fileRef.current.value = null;
    };

    const { quill, quillRef } = useQuill();
    const [value, setValue] = useState("");
    React.useEffect(() => {
        if (quill) {
            quill.on("text-change", () => {
                setValue(quillRef.current.firstChild.innerHTML);
            });
        }
    }, [quill]);

    const [file, setFile] = useState([]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let roomStatus = [];
        if (roomNo.includes(",")) {
            roomStatus = roomNo.split(",");

            for (let i = 0; i < roomStatus.length; i++) {
                formData.append("roomStatus", roomStatus[i]);
            }
        } else {
            roomStatus = roomNo;
            formData.append("roomStatus", roomStatus);
        }

        formData.append("roomType", roomType);
        formData.append("title", title);
        formData.append("services", services);
        formData.append("adults", adults);
        formData.append("children", children);
        formData.append("area", area);
        formData.append("price", price);

        for (let i = 0; i < file.length; i++) {
            formData.append("images", file[i]);
        }

        formData.append("description", value);

        const response = await axios.post("api/room/create", formData);

        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Đã thêm phòng thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
            navigate("/admin/room");
            window.scrollTo(0, 0);
        } else if (response.status === 201) {
            setAlert({
                open: true,
                message: response.data,
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };

    return (
        <DefaultAdminLayout>
            <Grid container spacing={2}>
                <Typography variant="h4" sx={{ width: "100%", textAlign: "center", margin: "20px 0" }}>
                    Thêm phòng
                </Typography>
                <Grid item lg={2}></Grid>
                <Grid item lg={8}>
                    <form onSubmit={onSubmit}>
                        <Grid container spacing={2} mb={2}>
                            <Grid item lg={3}>
                                <span>Số phòng (101,102,...)</span>
                                <StyledTextField
                                    id="roomNo"
                                    value={roomNo}
                                    onChange={handleChangeRoomNo}
                                    name="roomNo"
                                    type="text"
                                />
                            </Grid>
                            <Grid item lg={6}>
                                <span>Tiêu đề</span>
                                <StyledTextField
                                    id="title"
                                    value={title}
                                    onChange={handleChangeTitle}
                                    name="title"
                                    type="text"
                                />
                            </Grid>
                            <Grid item lg={3}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span>Loại phòng</span>
                                    <Select
                                        sx={{ height: "45px" }}
                                        id="roomType"
                                        value={roomType}
                                        onChange={handleChangeRoomType}
                                    >
                                        <MenuItem value={"single"}>Phòng đơn</MenuItem>
                                        <MenuItem value={"double"}>Phòng đôi</MenuItem>
                                        <MenuItem value={"vip"}>Phòng vip</MenuItem>
                                    </Select>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid mb={2} item lg={12}>
                                <FormControl mb={2} sx={{ width: "100%" }}>
                                    <FormLabel sx={{ color: "#000" }}>Dịch vụ phòng</FormLabel>
                                    <FormGroup
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",

                                            justifyContent: "space-evenly",
                                        }}
                                    >
                                        <FormControlLabel
                                            label="Cà phê buổi sáng"
                                            control={
                                                <Checkbox
                                                    icon={<CoffeeOutlinedIcon />}
                                                    value="roomCoffee"
                                                    checkedIcon={<CoffeeIcon />}
                                                    checked={services.includes("roomCoffee")}
                                                    onChange={handleChangeServices}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Gọi đồ ăn tại phòng"
                                            control={
                                                <Checkbox
                                                    icon={<DinnerDiningOutlinedIcon />}
                                                    value="roomFood"
                                                    checkedIcon={<DinnerDiningIcon />}
                                                    checked={services.includes("roomFood")}
                                                    onChange={handleChangeServices}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Bếp nấu tại phòng"
                                            control={
                                                <Checkbox
                                                    icon={<MicrowaveOutlinedIcon />}
                                                    value="roomStove"
                                                    checkedIcon={<MicrowaveIcon />}
                                                    checked={services.includes("roomStove")}
                                                    onChange={handleChangeServices}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Bồn tắm hoa sen"
                                            control={
                                                <Checkbox
                                                    icon={<BathtubOutlinedIcon />}
                                                    value="roomBathtub"
                                                    checkedIcon={<BathtubIcon />}
                                                    checked={services.includes("roomBathtub")}
                                                    onChange={handleChangeServices}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            label="Internet không dây"
                                            control={
                                                <Checkbox
                                                    icon={<WifiOffOutlinedIcon />}
                                                    value="roomWifi"
                                                    checkedIcon={<WifiOutlinedIcon />}
                                                    checked={services.includes("roomWifi")}
                                                    onChange={handleChangeServices}
                                                />
                                            }
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item lg={3}>
                                <span>Người lớn</span>
                                <StyledTextField
                                    id="adults"
                                    value={adults}
                                    onChange={handleChangeAdult}
                                    name="adult"
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={3}>
                                <span>Trẻ em</span>
                                <StyledTextField
                                    id="children"
                                    value={children}
                                    onChange={handleChangeChildren}
                                    name="children"
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={3}>
                                <span>Diện tích</span>
                                <StyledTextField
                                    id="area"
                                    value={area}
                                    onChange={handleChangeArea}
                                    name="area"
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={3}>
                                <span>Giá phòng</span>
                                <StyledTextField
                                    id="price"
                                    value={price}
                                    onChange={handleChangePrice}
                                    name="price"
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={12} mb={2}>
                                <span style={{ marginRight: "12px" }}>Ảnh</span>

                                <input
                                    // hidden
                                    ref={fileRef}
                                    name="imgCollection"
                                    required
                                    multiple
                                    onChange={onSelectFile}
                                    type="file"
                                />
                                <IconButton color="primary" onClick={clearAllImages} component="label">
                                    <HideImageIcon fontSize="large" />
                                </IconButton>
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        minHeight: "350px",
                                        border: "solid 1px #ccc",
                                        borderRadius: "15px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "auto",
                                    }}
                                >
                                    {selectedImages &&
                                        selectedImages.map((image, index) => {
                                            return (
                                                <div
                                                    key={image}
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <p>{index + 1}</p>
                                                    <img src={image} width="80%" alt="upload" />
                                                </div>
                                            );
                                        })}
                                </Box>
                            </Grid>
                            <Grid item lg={12}>
                                <span>Mô tả</span>
                                <div style={{ width: "100%", height: "450px", marginBottom: "100px" }}>
                                    <div ref={quillRef} />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={12}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingBottom: "24px",
                                    }}
                                >
                                    <Button variant="contained" type="submit">
                                        Thêm phòng
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                        {/* <Grid container spacing={2}>
                        <Grid item lg={12}>
                            <div
                                style={{ width: "100%", height: "450px", marginBottom: "100px" }}
                                className="ql-editor"
                                data-gramm="false"
                                contenteditable="true"
                            >
                                {parse(value)}
                            </div>
                        </Grid>
                    </Grid> */}
                    </form>
                </Grid>
                <Grid item lg={2}></Grid>
            </Grid>
        </DefaultAdminLayout>
    );
}

export default CreateRoom;
