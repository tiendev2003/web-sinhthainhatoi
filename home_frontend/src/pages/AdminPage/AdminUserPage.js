import axios from "axios";
import DefaultAdminLayout from "./DefaultAdminLayout";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Divider, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, removeUser } from "../../redux/slices/userSlice";
import CreateUserDialog from "./CreateUserModal";
import { Box } from "@mui/system";
import { HotelState } from "../../components/MyContext/MyContext";

function AdminUserPage() {
    const isAdmin = useSelector((state) => state.auth.user.role) === "admin";
    const { setAlert } = HotelState();
    const dispatch = useDispatch();
    const [rowId, setRowId] = React.useState("");

    const handleDelete = async (idUser) => {
        if (window.confirm("Xác nhận xóa người dùng???") === true) {
            const res = await axios.delete(`/auth/admin/user/delete/${idUser}`);
            if (res.status === 200) {
                setAlert({
                    open: true,
                    message: "Đã xóa tài khoản thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
                dispatch(removeUser(idUser));
            }
        }
    };
    const handleUpdate = async (id, firstName, lastName, email, phone, role, password) => {
        const confirm = window.confirm("Xác nhận thay đổi thông tin?");
        if (confirm) {
            const res = await axios.put(`/auth/admin/user/update/${id}`, {
                firstName,
                lastName,
                email,
                phone,
                role,
            });
            if (res.status === 200) {
                setRowId("");
                setAlert({
                    open: true,
                    message: "Đã cập nhật tài khoản thành công!",
                    type: "success",
                    origin: { vertical: "bottom", horizontal: "center" },
                });
            }
        }
    };

    React.useEffect(() => {
        async function getListUser() {
            const response = await axios.get("auth/admin/user");
            dispatch(getUserList([...response.data]));
        }

        getListUser();
    }, []);

    const users = useSelector((state) => {
        return state.user.user;
    });

    const rows = users.map((user) => ({
        id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }));
    const columns = [
        { field: "id", headerName: "ID", width: 300 },
        { field: "firstName", headerName: "First name", width: 130, editable: "true" },
        { field: "lastName", headerName: "Last name", width: 130, editable: "true" },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 200,
            valueGetter: (params) => `${params.row.lastName || ""} ${params.row.firstName || ""}`,
        },
        {
            field: "email",
            headerName: "Email",
            type: "email",
            width: 350,
        },

        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 150,
            editable: "true",
        },

        {
            field: "role",
            headerName: "Phân quyền",
            width: 130,
            type: "singleSelect",
            valueOptions: ["admin", "subadmin", "regular"],
            editable: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "action",
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            sx={{ marginRight: "12px", fontSize: "1.5rem" }}
                            onClick={() => handleDelete(params.id)}
                            variant="contained"
                            disabled={!isAdmin}
                        >
                            Xóa
                        </Button>
                        <Button
                            disabled={!isAdmin || params.id !== rowId}
                            onClick={() =>
                                handleUpdate(
                                    params.id,
                                    params.row.firstName,
                                    params.row.lastName,
                                    params.row.email,
                                    params.row.phone,
                                    params.row.role
                                )
                            }
                            sx={{ fontSize: "1.5rem" }}
                            variant="contained"
                        >
                            Cập nhật
                        </Button>
                    </>
                );
            },
            width: 250,
        },
    ];

    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" fontSize="2rem" component="div" sx={{ padding: "20px" }}>
                        Danh sách tài khoản
                    </Typography>
                    <CreateUserDialog />
                </div>
                <Divider />
                <Box sx={{ height: 754, width: "100%" }}>
                    <DataGrid
                        sx={{ fontSize: "1.6rem" }}
                        rows={rows}
                        columns={columns}
                        hideFooterSelectedRowCount
                        disableSelectionOnClick
                        onCellEditStop={(row) => {
                            setRowId(row.id);
                        }}
                    />
                </Box>
            </Paper>
        </DefaultAdminLayout>
    );
}

export default AdminUserPage;
