import { Box, Divider, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import DefaultAdminLayout from "./DefaultAdminLayout";

function AdminContactPage() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        async function getListContacts() {
            const contact = await axios.get("api/contact/list");
            setContacts(contact.data);
        }
        getListContacts();
    }, []);
    
    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 150,
        },
        {
            field: "fullname",
            headerName: "Họ và tên",
            width: 300,
        },

        {
            field: "email",
            headerName: "Email",
            width: 250,
        },
        {
            field: "message",
            headerName: "Nội dung",
            renderCell: (params) => {
                return (
                    <p
                        style={{
                            overflow: "auto",
                            width: "100%",
                            height: "100%",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                        }}
                    >
                        {params.value}
                    </p>
                );
            },
            width: 800,
        },
        {
            field: "createAt",
            headerName: "Ngày nhận",
            width: "250",
        },
    ];
    const rows = contacts.map((item, index) => ({
        id: index,
        fullname: item.fullname,
        email: item.email,
        message: item.message,
        createAt: moment(item.createAt).tz("Asia/Ho_Chi_Minh").format("HH:MM DD/MM/YYYY"),
    }));
    return (
        <DefaultAdminLayout>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontSize: "2.4rem" }}>
                        Danh sách lời nhắn
                    </Typography>
                </div>
                <Divider />
                <Box sx={{ height: 754, width: "100%" }}>
                    <DataGrid
                        sx={{ fontSize: "1.6rem" }}
                        rows={rows}
                        rowHeight={100}
                        columns={columns}
                        hideFooterSelectedRowCount
                        disableSelectionOnClick
                    />
                </Box>
            </Paper>
        </DefaultAdminLayout>
    );
}

export default AdminContactPage;
