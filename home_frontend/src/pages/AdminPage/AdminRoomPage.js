import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect } from "react";
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

function AdminRoomPage() {
    const { setAlert } = HotelState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        async function getRoomList() {
            const response = await axios.get("api/room/list");
            dispatch(getListRoom([...response.data]));
        }
        getRoomList();
    }, []);

    const handleShowDetail = (id) => {
        navigate(`${id}`);
        window.scrollTo(0, 0);
    };
    const handleEdit = async (id) => {
        navigate(`edit/${id}`);
        window.scrollTo(0, 0);
    };
    const handleDelete = async (id) => {
        let confirm = window.confirm("Xác nhận xóa!!!??");
        if (confirm) {
            await axios.delete("api/room/delete/" + id);
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
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 250 },
        { field: "roomNo", headerName: "Số Phòng", width: 400 },
        {
            field: "roomType",
            headerName: "Loại phòng",
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
            field: "price",
            headerName: "Giá",
            width: 150,
        },
        {
            field: "bookingCount",
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

    const rooms = useSelector((state) => {
        return state.room.rooms;
    });

    const rows = rooms.map((room) => ({
        id: room._id,
        roomNo: room.roomStatus.map((item) => [item.roomNo]),
        roomType: room.roomType,
        title: room.title,
        price: `${room.price.toLocaleString()}₫`,
        bookingCount: room.bookingCount,
    }));

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách phòng
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ marginRight: "20px", fontSize: "1.5rem" }}
                        onClick={() => {
                            navigate("/admin/room/create");
                            window.scrollTo(0, 0);
                        }}
                    >
                        Thêm phòng
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

export default AdminRoomPage;
