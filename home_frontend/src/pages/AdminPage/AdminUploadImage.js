import { Box, Button, Grid, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import HideImageIcon from "@mui/icons-material/HideImage";
import DefaultAdminLayout from "./DefaultAdminLayout";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";
import { useNavigate } from "react-router-dom";

function AdminUploadImage() {
    const { setAlert } = HotelState();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [file, setFile] = useState([]);

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
    const clearAllImages = () => {
        const selectedFilesArray = Array.from(file);
        selectedFilesArray.map((file) => {
            return URL.revokeObjectURL(file);
        });
        setFile([]);
        setSelectedImages([]);
        fileRef.current.value = null;
    };
    const handleSubmit = async () => {
        const formData = new FormData();
        for (let i = 0; i < file.length; i++) {
            formData.append("images", file[i]);
        }
        const response = await axios.post("api/gallery/create", formData);
        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Đã thêm hình ảnh thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
            navigate("/admin/gallery");
            window.scrollTo(0, 0);
        }
    };
    return (
        <DefaultAdminLayout>
            <Grid container spacing={2}>
                <Grid item lg={2}></Grid>
                <Grid item lg={8} mb={2}>
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
                            <Button variant="contained" onClick={handleSubmit}>
                                Thêm ảnh
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </DefaultAdminLayout>
    );
}

export default AdminUploadImage;
