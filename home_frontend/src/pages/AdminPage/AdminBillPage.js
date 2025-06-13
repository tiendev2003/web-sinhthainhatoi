import { Alert, Button, CircularProgress, Grid, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DefaultAdminLayout from "./DefaultAdminLayout";
import InvoicePreview from "./InvoicePreview";
import "./InvoicePrint.css";
import { printConfig } from "./printUtils";

function AdminBillPage() {
    const get_day_of_time = (d1, d2) => {
        let ms1 = new Date(d1).getTime();
        let ms2 = new Date(d2).getTime();
        return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
    };
    
    const [detail, setDetail] = useState();
    const [orders, setOrders] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const id = params.id;
    
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [detailResponse, ordersResponse] = await Promise.all([
                    axios.get(`api/booking/detail/${id}`),
                    axios.get(`api/order/viaBooking/${id}`)
                ]);
                
                setDetail(detailResponse.data);
                setOrders(ordersResponse.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu hóa đơn. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        }
        
        if (id) {
            fetchData();
        }
    }, [id]);
    
    let total = 0;
    if (orders) {
        total = orders.reduce((accumulator, order) => {
            return accumulator + order.totalPrice;
        }, 0);
    }

    const handlePrint = useReactToPrint({
        content: () => componetRef.current,
        documentTitle: printConfig.printOptions.documentTitle(id, moment().format('DDMMYYYY')),
        onBeforeGetContent: () => {
            // Validate data before printing
            const validation = printConfig.validatePrintData(detail, orders);
            if (!validation.isValid) {
                setError(`Không thể in hóa đơn: ${validation.errors.join(', ')}`);
                return Promise.reject(new Error('Validation failed'));
            }
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, printConfig.printDelay);
            });
        },
        onAfterPrint: () => {
            console.log("In hóa đơn thành công!");
        },
    });
    
    const componetRef = useRef();

    if (loading) {
        return (
            <DefaultAdminLayout>
                <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '400px' }}>
                    <Grid item>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Đang tải dữ liệu hóa đơn...</Typography>
                    </Grid>
                </Grid>
            </DefaultAdminLayout>
        );
    }    return (
        <DefaultAdminLayout>
            <Grid container spacing={2}>
                <Grid item lg={2}></Grid>
                <Grid sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} item lg={8}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }} className="no-print">
                        Hóa đơn thanh toán
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }} className="no-print">
                            {error}
                        </Alert>
                    )}
                    
                    {detail && (
                        <InvoicePreview
                            ref={componetRef}
                            detail={detail}
                            orders={orders}
                            id={id}
                            total={total}
                            get_day_of_time={get_day_of_time}
                        />
                    )}
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }} item lg={12} className="no-print">
                    <Button 
                        variant="contained" 
                        onClick={handlePrint}
                        size="large"
                        sx={{ 
                            px: 4, 
                            py: 1.5,
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                        disabled={!detail || loading || !!error}
                    >
                        🖨️ In hóa đơn
                    </Button>
                    
                    <Button 
                        variant="outlined" 
                        onClick={() => window.history.back()}
                        size="large"
                        sx={{ 
                            px: 4, 
                            py: 1.5,
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        ← Quay lại
                    </Button>
                </Grid>
            </Grid>
        </DefaultAdminLayout>
    );
}

export default AdminBillPage;
