import DefaultAdminLayout from "./DefaultAdminLayout";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { DataGrid, GridCheckCircleIcon, GridCloseIcon, } from "@mui/x-data-grid";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";
import { blue, grey } from "@mui/material/colors";
import { useNavigate} from "react-router-dom";
import { getSocketInstance } from "../../socket";

function AdminBookingPage() {
    const socket = getSocketInstance();
    
    const [newStatus, setNewStatus] = useState(false);
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [booking, setBooking] = useState([]);

   


    useEffect(() => {
        socket.on("updatedetail", () => {
            setNewStatus(!newStatus);
        });
        async function getBookingList() {
            const response = await axios.get("api/booking/list");
            setBooking(response.data);
        }
        getBookingList();
    }, [flag, newStatus]);
    const { setAlert } = HotelState();
    const handleCancel = async (id) => {
        const confirm = window.confirm("Xác nhận hủy?");
        if (confirm) {
            const response = await axios.put(`api/booking/cancelled/${id}`);
            if (response.status === 200) {
                socket.emit("adminbookingcanceled");
                setAlert({
                    open: true,
                    message: "Đã thực hủy đặt phòng thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
            setFlag(!flag);
        }
    };
    const handleCheckout = async (id) => {
        const confirm = window.confirm("Xác nhận trả phòng?");
        if (confirm) {
            const response = await axios.put(`api/booking/checkout/${id}`);
            if (response.status === 200) {
                socket.emit("checkedout");
                setAlert({
                    open: true,
                    message: "Đã thực hiện trả phòng thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                setFlag(!flag);
            }
        }
    };
    const handleDelivery = async (id) => {
        const confirm = window.confirm("Xác nhận giao phòng?");
        if (confirm) {
            const response = await axios.put(`api/booking/delivery/${id}`);
            if (response.status === 200) {
                socket.emit("roomdeliveried");
                setAlert({
                    open: true,
                    message: "Đã thực hiện giao phòng thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                setFlag(!flag);
            }
        }
    };
    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: "250",
        },
        {
            field: "fullname",
            headerName: "Họ và tên",
            width: 200,
        },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 200,
        },
        {
            field: "receiveDate",
            headerName: "Ngày nhận",
            width: 200,
        },
        {
            field: "checkoutDate",
            headerName: "Ngày trả",
            width: 200,
        },
        {
            field: "roomQuantity",
            headerName: "Số lượng",
            width: 150,
        },
        {
            field: "roomPrice",
            headerName: "Giá phòng",
            width: 200,
        },
        {
            field: "roomNo",
            headerName: "Phòng số",
            width: 300,
        },

        {
            field: "createAt",
            headerName: "Ngày đặt",
            width: "250",
        },
        {
            field: "summaryPrice",
            headerName: "Tiền phòng",
            width: 250,
        },
        {
            field: "isReceived",
            headerName: "Đã nhận phòng",
            type: "boolean",
            width: 140,
            editable: true,
            renderCell: (params) => {
                return params.value ? (
                    <GridCheckCircleIcon
                        style={{
                            color: blue[500],
                        }}
                    />
                ) : (
                    <GridCloseIcon
                        style={{
                            color: grey[500],
                        }}
                    />
                );
            },
        },
        {
            field: "isCheckedOut",
            headerName: "Đã trả phòng",
            type: "boolean",
            width: 140,
            editable: true,
            renderCell: (params) => {
                return params.value ? (
                    <GridCheckCircleIcon
                        style={{
                            color: blue[500],
                        }}
                    />
                ) : (
                    <GridCloseIcon
                        style={{
                            color: grey[500],
                        }}
                    />
                );
            },
        },
        {
            field: "isCancelled",
            headerName: "Đã hủy",
            type: "boolean",
            width: 140,
            editable: true,
            renderCell: (params) => {
                return params.value ? (
                    <GridCheckCircleIcon
                        style={{
                            color: blue[500],
                        }}
                    />
                ) : (
                    <GridCloseIcon
                        style={{
                            color: grey[500],
                        }}
                    />
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "action",
            renderCell: (params) => {
                return (
                    <div>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                handleDelivery(params.id);
                            }}
                            variant="contained"
                            disabled={params.row.isCheckedOut || params.row.isCancelled || params.row.isReceived}
                        >
                            Giao phòng
                        </Button>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                handleCheckout(params.id);
                            }}
                            variant="contained"
                            disabled={params.row.isCheckedOut || params.row.isCancelled || !params.row.isReceived}
                        >
                            Trả phòng
                        </Button>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                handleCancel(params.id);
                            }}
                            variant="contained"
                            disabled={params.row.isCheckedOut || params.row.isReceived || params.row.isCancelled}
                        >
                            hủy
                        </Button>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                navigate(`/admin/bill/${params.row.id}`);
                                window.scrollTo(0, 0);
                            }}
                            variant="contained"
                            disabled={!params.row.isCheckedOut || params.row.isCancelled || params.row.isCancelled}
                        >
                            in hóa đơn
                        </Button>
                    </div>
                );
            },
            width: 550,
        },
    ];
    const rows = booking.map((item) => ({
        id: item._id,
        fullname: item.fullname,
        phone: item.phone,
        receiveDate: moment(item.receiveDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
        checkoutDate: moment(item.checkoutDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
        roomNo: item.roomNo,
        summaryPrice: item.summaryPrice.toLocaleString() + "đ",
        createAt: moment(item.createAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
        isReceived: item.isReceived,
        isCheckedOut: item.isCheckedOut,
        isCancelled: item.isCancelled,
        roomQuantity: item.roomNo.length,
        roomPrice: item.roomPrice.toLocaleString() + "đ",
    }));

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách đặt phòng
                    </Typography>
                </div>
                
                <Divider />
                <Box sx={{ height: 754, width: "100%" }}>
                    <DataGrid
                        
                        sx={{ fontSize: "1.6rem" }}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        hideFooterSelectedRowCount
                        disableSelectionOnClick
                        
                    />
                </Box>
            </Paper>
        </DefaultAdminLayout>
    );
}

export default AdminBookingPage;
