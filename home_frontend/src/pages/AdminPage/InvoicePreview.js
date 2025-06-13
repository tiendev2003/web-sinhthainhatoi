import { Divider, Typography } from "@mui/material";
import moment from "moment-timezone";
import React from 'react';
import VNnum2words from "vn-num2words";

const InvoicePreview = React.forwardRef(({ detail, orders, id, total, get_day_of_time }, ref) => {
    return (
        <div
            className="invoice-container no-page-break"
            style={{ 
                border: "2px solid #000", 
                padding: "20px",
                backgroundColor: "#fff",
                maxWidth: "800px",
                width: "100%",
                margin: "0 auto"
            }}
            ref={ref}
        >
            {/* Header với logo, tiêu đề và số hóa đơn */}
            <div className="invoice-header" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '15px',
                minHeight: '80px'
            }}>
                <div style={{ flex: '0 0 150px' }}>
                    <img 
                        className="invoice-logo"
                        style={{ maxWidth: "140px", height: "auto" }} 
                        src="/images/logo_nhatoi.jpg" 
                        alt="logo" 
                    />
                </div>
                <div style={{ flex: '1', textAlign: 'center', padding: '0 20px' }}>
                    <Typography className="invoice-title" sx={{
                        fontSize: "18px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        lineHeight: 1.2
                    }}>
                        Hóa đơn giá trị gia tăng
                    </Typography>
                </div>
                <div style={{ flex: '0 0 150px', textAlign: 'right' }}>
                    <Typography className="invoice-number" sx={{
                        fontSize: "14px",
                        fontWeight: "600",
                    }}>
                        Số: {id}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#666" }}>
                        Ngày: {moment().format("DD/MM/YYYY")}
                    </Typography>
                </div>
            </div>

            <Divider sx={{ height: "2px", backgroundColor: "#000", mb: 2 }} />

            {/* Thông tin đơn vị bán hàng */}
            <div className="company-info" style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        ĐƠN VỊ BÁN HÀNG:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Khu Du Lịch Sinh Thái Nhà Tôi
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        MÃ SỐ THUẾ:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        0868 466 005
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        SỐ ĐIỆN THOẠI:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        0868 466 005
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        ĐỊA CHỈ:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        Xóm 8, Phú Lương, Thái Nguyên
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        SỐ TÀI KHOẢN:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        109870685410 - VIETINBANK
                    </Typography>
                </div>
            </div>

            <Divider sx={{ height: "1px", backgroundColor: "#ccc", mb: 2 }} />

            {/* Thông tin khách hàng */}
            <div className="customer-info" style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        Họ tên người mua:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        {detail?.fullname}
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        Số điện thoại:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        {detail?.phone}
                    </Typography>
                </div>
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <Typography sx={{ minWidth: "140px", fontSize: "12px", fontWeight: "600" }}>
                        Thời gian checkout:
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "500" }}>
                        {detail && moment(detail.checkoutDate).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm")}
                    </Typography>
                </div>
            </div>

            <Divider sx={{ height: "2px", backgroundColor: "#000", mb: 2 }} />

            {/* Bảng chi tiết dịch vụ */}
            <table className="invoice-table" style={{ 
                width: "100%", 
                border: "1px solid #000", 
                borderCollapse: "collapse",
                fontSize: "11px"
            }}>
                <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={{
                            border: "1px solid #000",
                            padding: "8px 4px",
                            width: "40px",
                            fontSize: "11px",
                            fontWeight: "700"
                        }}>
                            STT
                        </th>
                        <th style={{
                            border: "1px solid #000",
                            padding: "8px 6px",
                            fontSize: "11px",
                            fontWeight: "700"
                        }}>
                            Tên hàng hóa, dịch vụ
                        </th>
                        <th style={{
                            border: "1px solid #000",
                            padding: "8px 4px",
                            width: "80px",
                            fontSize: "11px",
                            fontWeight: "700"
                        }}>
                            Số lượng
                        </th>
                        <th style={{
                            border: "1px solid #000",
                            padding: "8px 4px",
                            width: "100px",
                            fontSize: "11px",
                            fontWeight: "700"
                        }}>
                            Đơn giá
                        </th>
                        <th style={{
                            border: "1px solid #000",
                            padding: "8px 4px",
                            width: "120px",
                            fontSize: "11px",
                            fontWeight: "700"
                        }}>
                            Thành tiền
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dịch vụ phòng */}
                    <tr>
                        <td style={{
                            border: "1px solid #000",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "11px"
                        }}>
                            1
                        </td>
                        <td style={{
                            border: "1px solid #000",
                            padding: "6px",
                            textAlign: "left",
                            fontSize: "11px"
                        }}>
                            {detail?.roomTitle} (Phòng số: {detail?.roomNo.toString()})
                        </td>
                        <td style={{
                            border: "1px solid #000",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "11px"
                        }}>
                            {detail && 
                                `${detail.roomNo.length} phòng × ${
                                    get_day_of_time(detail.receiveDate, detail.checkoutDate) + 1
                                } đêm`
                            }
                        </td>
                        <td style={{
                            border: "1px solid #000",
                            padding: "6px 4px",
                            textAlign: "right",
                            fontSize: "11px"
                        }}>
                            {detail?.roomPrice.toLocaleString()}đ
                        </td>
                        <td style={{
                            border: "1px solid #000",
                            padding: "6px 4px",
                            textAlign: "right",
                            fontSize: "11px",
                            fontWeight: "600"
                        }}>
                            {detail?.summaryPrice.toLocaleString()}đ
                        </td>
                    </tr>
                    
                    {/* Các món ăn/dịch vụ khác */}
                    {orders?.map((item, index) => (
                        <tr key={index}>
                            <td style={{
                                border: "1px solid #000",
                                padding: "6px 4px",
                                textAlign: "center",
                                fontSize: "11px"
                            }}>
                                {index + 2}
                            </td>
                            <td style={{
                                border: "1px solid #000",
                                padding: "6px",
                                textAlign: "left",
                                fontSize: "11px"
                            }}>
                                {item.cuisineName}
                            </td>
                            <td style={{
                                border: "1px solid #000",
                                padding: "6px 4px",
                                textAlign: "center",
                                fontSize: "11px"
                            }}>
                                {item.quantity}
                            </td>
                            <td style={{
                                border: "1px solid #000",
                                padding: "6px 4px",
                                textAlign: "right",
                                fontSize: "11px"
                            }}>
                                {item.promotionalPrice.toLocaleString()}đ
                            </td>
                            <td style={{
                                border: "1px solid #000",
                                padding: "6px 4px",
                                textAlign: "right",
                                fontSize: "11px",
                                fontWeight: "600"
                            }}>
                                {item.totalPrice.toLocaleString()}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Tổng tiền */}
            {detail && (
                <div className="total-section" style={{ marginTop: "15px", padding: "10px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <Typography sx={{ fontWeight: "700", fontSize: "14px" }}>
                            TỔNG CỘNG:
                        </Typography>
                        <Typography sx={{ fontWeight: "700", fontSize: "14px", color: "#d32f2f" }}>
                            {(detail.summaryPrice + total).toLocaleString()}đ
                        </Typography>
                    </div>
                    <Typography sx={{ fontWeight: "600", fontSize: "12px", fontStyle: "italic" }}>
                        Số tiền viết bằng chữ:{" "}
                        <span style={{ textTransform: "capitalize", fontWeight: "700" }}>
                            {VNnum2words(detail.summaryPrice + total)} đồng
                        </span>
                    </Typography>
                </div>
            )}

            {/* Chữ ký */}
            <div className="signature-section" style={{ 
                marginTop: "40px",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <div style={{ textAlign: "center", width: "200px" }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                        Người mua hàng
                    </Typography>
                    <Typography sx={{ fontSize: "10px", color: "#666", marginBottom: "40px" }}>
                        (Ký, ghi rõ họ tên)
                    </Typography>
                </div>
                <div style={{ textAlign: "center", width: "200px" }}>
                    <Typography sx={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                        Người bán hàng
                    </Typography>
                    <Typography sx={{ fontSize: "10px", color: "#666", marginBottom: "40px" }}>
                        (Ký, ghi rõ họ tên)
                    </Typography>
                </div>
            </div>
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
