import DefaultAdminLayout from "./DefaultAdminLayout";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { DataGrid, GridCloseIcon } from "@mui/x-data-grid";
import moment from "moment-timezone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useEffect, useState } from "react";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";
import { blue, grey } from "@mui/material/colors";
import { getSocketInstance } from "../../socket";

function AdminOrderpage() {
    const socket = getSocketInstance();
    const [newOrder, setnewOrder] = useState(false);
    const [flag, setFlag] = useState(false);
    const [order, setOrder] = useState([]);

    useEffect(() => {
        socket.on("updateadminorder", () => {
            setnewOrder(!newOrder);
        });
        async function getBookingList() {
            const response = await axios.get("api/order/list");
            setOrder(response.data);
        }
        getBookingList();
        return () => {
            socket.off("updateadminorder");
        };
    }, [flag, newOrder]);
    const { setAlert } = HotelState();
    const handleAccept = async (id) => {
        const confirm = window.confirm("Chấp nhận gọi món?");
        if (confirm) {
            const response = await axios.put(`api/order/accept/${id}`);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã chấp nhận thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                setFlag(!flag);
            }
        }
    };
    const handleDeny = async (id) => {
        const confirm = window.confirm("Chấp nhận gọi món?");
        if (confirm) {
            const response = await axios.put(`api/order/deny/${id}`);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã từ chối thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                setFlag(!flag);
            }
        }
    };
    const handleDeliveried = async (id) => {
        const confirm = window.confirm("Hoàn tất giao hàng?");
        if (confirm) {
            const response = await axios.put(`api/order/deliveried/${id}`);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xác nhận hoàn tất giao hàng!",
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
            width: 250,
        },
        {
            field: "userName",
            headerName: "Họ và tên",
            width: 250,
        },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 200,
        },

        {
            field: "createAt",
            headerName: "Thời gian đặt",
            width: 250,
        },
        {
            field: "cuisineName",
            headerName: "Tên đồ ăn",
            width: 250,
        },
        {
            field: "quantity",
            headerName: "Số lượng",
            width: 150,
        },
        {
            field: "totalPrice",
            headerName: "Tổng tiền",
            width: 200,
        },
        {
            field: "to",
            headerName: "Giao tới",
            width: 200,
        },
        {
            field: "isCancelled",
            headerName: "Đã hủy",
            type: "boolean",
            width: 140,
            editable: true,
            renderCell: (params) => {
                return params.value ? (
                    <CheckCircleIcon
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
            field: "isDenied",
            headerName: "Đã từ chối",
            type: "boolean",
            width: 140,
            editable: true,
            renderCell: (params) => {
                return params.value ? (
                    <CheckCircleIcon
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
            field: "isAccept",
            headerName: "Trạng thái xác nhận",
            width: 250,
        },
        {
            field: "isDelivery",
            headerName: "Trạng thái giao hàng",
            width: 250,
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "action",
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                handleAccept(params.id);
                            }}
                            variant="contained"
                            disabled={
                                params.row.isAccept === "Đã xác nhận" || params.row.isCancelled || params.row.isDenied
                            }
                        >
                            chấp nhận
                        </Button>
                        <Button
                            sx={{ marginRight: "12px" }}
                            onClick={() => {
                                handleDeny(params.id);
                            }}
                            variant="contained"
                            disabled={
                                params.row.isAccept === "Đã xác nhận" || params.row.isCancelled || params.row.isDenied
                            }
                        >
                            từ chối
                        </Button>
                        <Button
                            onClick={() => {
                                handleDeliveried(params.id);
                            }}
                            variant="contained"
                            disabled={
                                params.row.isDelivery === "Đã giao hàng" ||
                                params.row.isAccept === "Chưa xác nhận" ||
                                params.row.isCancelled ||
                                params.row.isDenied
                            }
                        >
                            giao xong
                        </Button>
                    </>
                );
            },
            width: 350,
        },
    ];
    const rows = order.map((item) => ({
        id: item._id,
        userName: item.userName,
        phone: item.phone,
        createAt: moment(item.createdAt).tz("Asia/Ho_Chi_Minh").format("hh:mm Aqw DD/MM/YYYY"),
        cuisineName: item.cuisineName,
        quantity: item.quantity,
        totalPrice: item.totalPrice.toLocaleString() + "đ",
        to: item.roomNo,
        isCancelled: item.isCancelled,
        isAccept: item.isAccept === true ? "Đã xác nhận" : "Chưa xác nhận",
        isDenied: item.isDenied,
        isDelivery: item.isDelivery === true ? "Đã giao hàng" : "Chưa giao hàng",
    }));

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách đặt đồ ăn
                    </Typography>
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

export default AdminOrderpage;
