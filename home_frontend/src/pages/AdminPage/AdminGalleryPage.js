import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getListRoom } from "../../redux/slices/roomSlice";
import DefaultAdminLayout from "./DefaultAdminLayout";
import { HotelState } from "../../components/MyContext/MyContext";
// import parse from "html-react-parser";

function AdminGalleryPage() {
    const [reload, setReload] = useState(false);
    const { setAlert } = HotelState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function getImagesList() {
            const response = await axios.get("api/gallery/list");
            setImages(response.data);
        }
        getImagesList();
    }, [reload]);

    const handleDelete = async (path) => {
        let confirm = window.confirm("Xác nhận xóa!!!??");
        if (confirm) {
            await axios.put("api/gallery/delete/", { path: path });
            const response = await axios.get("api/room/list");
            dispatch(getListRoom([...response.data]));
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xóa thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
            setReload(true);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 250 },
        {
            field: "image",
            headerName: "Ảnh",
            renderCell: (params) => {
                return (
                    <div style={{ width: "100%", height: "100%", padding: "15px" }}>
                        <img
                            width="800px"
                            height="100%"
                            style={{ borderRadius: "15px" }}
                            alt=""
                            src={`${process.env.REACT_APP_HOST_URL}${params.value}`}
                        />
                    </div>
                );
            },
            width: 1000,
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "action",
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            onClick={() => {
                                handleDelete(params.row.path);
                            }}
                            color="primary"
                            aria-label="Xóa"
                            component="label"
                        >
                            <DeleteIcon fontSize="large" />
                        </IconButton>
                    </>
                );
            },
            width: 250,
        },
        {
            field: "path",
            headerName: "Path",
            width: 250,
        },
    ];

    const rows = images.map((item, index) => ({
        id: index + 1,
        image: item,
        path: item,
    }));

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách hình ảnh
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ marginRight: "20px", fontSize: "1.5rem" }}
                        onClick={() => {
                            navigate("/admin/gallery/upload");
                            window.scrollTo(0, 0);
                        }}
                    >
                        Thêm ảnh
                    </Button>
                </div>
                <Divider />
                <Box sx={{ height: 754, width: "100%" }}>
                    <DataGrid
                        sx={{ fontSize: "1.6rem" }}
                        rows={rows}
                        rowHeight={500}
                        columns={columns}
                        hideFooterSelectedRowCount
                        disableSelectionOnClick
                        disableRowSelectionOnClick
                    />
                </Box>
            </Paper>
        </DefaultAdminLayout>
    );
}

export default AdminGalleryPage;
