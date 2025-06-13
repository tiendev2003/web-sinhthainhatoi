import DefaultAdminLayout from "./DefaultAdminLayout";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system";
import { Button, Box, Grid, Typography, Select, MenuItem, IconButton } from "@mui/material";
import HideImageIcon from "@mui/icons-material/HideImage";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";

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
const StyledTextarea = styled("textarea")`
    height: 100px;
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
    resize: none;
`;
function AdminCuisineEdit() {
    const navigate = useNavigate();
    const params = useParams();
    const cuisineId = params.id;
    const { setAlert } = HotelState();

    useEffect(() => {
        async function getDetail() {
            const detail = await axios.get("api/cuisine/detail/" + cuisineId);
            setCuisineType(detail.data.type);
            setSummary(detail.data.summary);
            setTitle(detail.data.title);
            if (detail.data.listedPrice) {
                setListedPrice(detail.data.listedPrice);
            }
            setPromotionalPrice(detail.data.promotionalPrice);
            setTags(detail.data.tags.toString());
            setSelectedImages(detail.data.images);
            setValue(detail.data.description);
            setOldImages(detail.data.images);
        }
        getDetail();
    }, []);
    const [oldImages, setOldImages] = useState();

    const [title, setTitle] = useState("");
    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };
    const [cuisineType, setCuisineType] = useState("");
    const handleChangeCuisineType = (event) => {
        setCuisineType(event.target.value);
    };
    const [listedPrice, setListedPrice] = useState("");
    const handleChangeListedPrice = (event) => {
        setListedPrice(event.target.value);
    };
    const [promotionalPrice, setPromotionalPrice] = useState("");
    const handleChangePromotionalPrice = (event) => {
        setPromotionalPrice(event.target.value);
    };
    const [tags, setTags] = useState("");
    const handleChangeTags = (event) => {
        setTags(event.target.value);
    };

    const [selectedImages, setSelectedImages] = useState([]);
    const [file, setFile] = useState([]);

    const onSelectFile = (event) => {
        setFile(event.target.files);
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
            return URL.createObjectURL(file);
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    };
    const [summary, setSummary] = useState("");
    const handleChangeSummary = (e) => {
        setSummary(e.target.value);
    };
    const fileRef = useRef(null);
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
    const [value, setValue] = useState();
    useEffect(() => {
        if (quill && value) {
            quill.clipboard.dangerouslyPasteHTML(value);
            quill.on("text-change", () => {
                setValue(quillRef.current.firstChild.innerHTML);
            });
        }
    }, [quill, value]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("type", cuisineType);
        formData.append("title", title);
        formData.append("description", value);
        formData.append("listedPrice", listedPrice);
        formData.append("promotionalPrice", promotionalPrice);
        formData.append("summary", summary);
        for (let i = 0; i < oldImages.length; i++) {
            formData.append("oldImage", oldImages[i]);
        }

        for (let i = 0; i < file.length; i++) {
            formData.append("images", file[i]);
        }

        const response = await axios.put(`api/cuisine/update/${cuisineId}`, formData);

        if (response.status === 200) {
            setAlert({
                open: true,
                message: "Cập nhật thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
            navigate(`/admin/cuisine/detail/${cuisineId}`);
            window.scrollTo(0, 0);
        }
    };

    return (
        <DefaultAdminLayout>
            <Grid container spacing={2}>
                <Typography variant="h4" sx={{ width: "100%", textAlign: "center", margin: "20px 0" }}>
                    Chỉnh sửa món ăn, đồ uống
                </Typography>

                <Grid item lg={2}></Grid>
                <Grid item lg={8}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item lg={4}>
                                <span>Tiêu đề </span>
                                <StyledTextField
                                    id="title"
                                    value={title}
                                    onChange={handleChangeTitle}
                                    name="title"
                                    type="text"
                                    required
                                />
                            </Grid>
                            <Grid item lg={2}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span>Loại thực phẩm</span>
                                    <Select
                                        sx={{ height: "45px" }}
                                        id="cuisineType"
                                        value={cuisineType}
                                        onChange={handleChangeCuisineType}
                                    >
                                        <MenuItem value={"food"}>Món ăn</MenuItem>
                                        <MenuItem value={"drink"}>Đồ uống</MenuItem>
                                    </Select>
                                </div>
                            </Grid>
                            <Grid item lg={2}>
                                <span>Giá niêm yết</span>

                                <StyledTextField
                                    id="listedPrice"
                                    value={listedPrice}
                                    onChange={handleChangeListedPrice}
                                    name="listedPrice"
                                    type="number"
                                />
                            </Grid>{" "}
                            <Grid item lg={2}>
                                <span>Giá bán</span>

                                <StyledTextField
                                    id="promotionalPrice"
                                    value={promotionalPrice}
                                    onChange={handleChangePromotionalPrice}
                                    name="promotionalPrice"
                                    required
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={2}>
                                <span>Tag (..., ...)</span>

                                <StyledTextField
                                    id="tags"
                                    value={tags}
                                    onChange={handleChangeTags}
                                    name="tags"
                                    required
                                    type="text"
                                />
                            </Grid>
                            <Grid item lg={12}>
                                <span>Tóm tắt</span>
                                <StyledTextarea value={summary} onChange={handleChangeSummary} />
                            </Grid>
                            <Grid item lg={12} mb={2}>
                                <span>Ảnh</span>

                                <input
                                    ref={fileRef}
                                    name="imgCollection"
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
                                                    <img
                                                        src={
                                                            image.includes("localhost")
                                                                ? image
                                                                : `${process.env.REACT_APP_HOST_URL}${image}`
                                                        }
                                                        width="80%"
                                                        alt="upload"
                                                    />
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
                                        Cập nhật
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </DefaultAdminLayout>
    );
}

export default AdminCuisineEdit;
