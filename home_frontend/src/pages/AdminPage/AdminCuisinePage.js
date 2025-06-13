import { Box, Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DefaultAdminLayout from "./DefaultAdminLayout";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getListCuisine } from "../../redux/slices/CuisineSlice";

function AdminCuisinePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        async function getCuisineList() {
            const response = await axios.get("api/cuisine/list");
            dispatch(getListCuisine([...response.data]));
        }
        getCuisineList();
    }, []);

    const handleShowDetail = (id) => {
        navigate(`detail/${id}`);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        let confirm = window.confirm("Xác nhận xóa??");
        if (confirm) {
            await axios.delete(`api/cuisine/delete/${id}`);
            const response = await axios.get("/api/cuisine/list");
            dispatch(getListCuisine([...response.data]));
        }
    };
    const handleEdit = (id) => {
        navigate("edit/" + id);
        window.scrollTo(0, 0);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 250 },
        {
            field: "cuisineType",
            headerName: "Loại",
            width: 130,
            editable: "true",
            type: "singleSelect",
            valueOptions: ["single", "double", "vip"],
        },
        {
            field: "title",
            headerName: "Tiêu đề",
            type: "title",
            width: 300,
            editable: "true",
        },

        {
            field: "listedPrice",
            headerName: "Giá niêm yết",
            width: 150,
        },
        {
            field: "promotionalPrice",
            headerName: "Giá bán ra",
            width: 150,
        },
        {
            field: "orderCount",
            headerName: "Số lần đặt",
            width: 150,
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
                                handleShowDetail(params.id);
                            }}
                            color="primary"
                            aria-label="Chi tiết"
                            component="label"
                        >
                            <PreviewIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                handleEdit(params.id);
                            }}
                            color="primary"
                            aria-label="Cập nhật"
                            component="label"
                        >
                            <EditIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                handleDelete(params.id);
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
    ];

    const cuisines = useSelector((state) => {
        return state.cuisine.cuisines;
    });
    const rows = cuisines.map((cuisine) => ({
        id: cuisine._id,
        cuisineType: cuisine.type,
        title: cuisine.title,
        listedPrice: cuisine.listedPrice && cuisine.listedPrice.toLocaleString() + "₫",
        promotionalPrice: cuisine.promotionalPrice.toLocaleString() + "₫",
        orderCount: cuisine.orderCount,
    }));

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách món ăn, đồ uống
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ marginRight: "20px", fontSize: "1.5rem" }}
                        onClick={() => {
                            navigate("/admin/cuisine/create");
                            window.scrollTo(0, 0);
                        }}
                        endIcon={<AddIcon />}
                    >
                        Thêm mới
                    </Button>
                </div>
                <Divider />
                <Box sx={{ height: 754, width: "100%" }}>
                    <DataGrid
                        sx={{ fontSize: "1.6rem" }}
                        rows={rows}
                        columns={columns}
                        hideFooterSelectedRowCount
                        disableSelectionOnClick
                    />
                </Box>
            </Paper>
        </DefaultAdminLayout>
    );
}

export default AdminCuisinePage;
