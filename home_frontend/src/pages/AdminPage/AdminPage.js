import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DefaultAdminLayout from "./DefaultAdminLayout";
import CountUp from "react-countup";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
    const [dashboard, setDashboard] = useState();

    useEffect(() => {
        async function getData() {
            const response = await axios.get("/api/dashboard/revenue");
            setDashboard(response.data[0]);
        }
        getData();
    }, []);

    return (
        <DefaultAdminLayout>
            <Box sx={{ width: "100%", height: "100%", padding: "100px 20px" }}>
                <Grid container spacing={2}>
                    <Grid item lg={9}>
                        <Grid container spacing={2}>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Bookings
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng đơn đặt phòng hôm nay
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard &&
                                                    (dashboard.todayBookingCount / dashboard.totalBookingCount) * 100
                                                }
                                                text={`${(dashboard
                                                    ? (dashboard.todayBookingCount / dashboard.totalBookingCount) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.todayBookingCount}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Orders
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng đơn gọi món hôm nay
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard &&
                                                    (dashboard.todayOrderCount / dashboard.totalOrderCount) * 100
                                                }
                                                text={`${(dashboard
                                                    ? (dashboard.todayOrderCount / dashboard.totalOrderCount) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.todayOrderCount}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Orders
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng doanh thu từ gọi món
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard && (dashboard.orderRevenue / dashboard.totalRevenue) * 100
                                                }
                                                text={`${(dashboard
                                                    ? (dashboard.orderRevenue / dashboard.totalRevenue) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.orderRevenue}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Bookings
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng doanh thu từ đặt phòng hôm nay
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard &&
                                                    dashboard.todayRevenue > 0 &&
                                                    (dashboard.todayBookingRevenue / dashboard.todayRevenue) * 100
                                                }
                                                text={`${(dashboard && dashboard.todayRevenue > 0
                                                    ? (dashboard.todayBookingRevenue / dashboard.todayRevenue) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.todayBookingRevenue}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Orders
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng doanh thu từ gọi món hôm nay
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard &&
                                                    dashboard.todayRevenue > 0 &&
                                                    (dashboard.todayOrderRevenue / dashboard.todayRevenue) * 100
                                                }
                                                text={`${(dashboard
                                                    ? (dashboard.todayOrderRevenue &&
                                                          dashboard.todayRevenue > 0 / dashboard.todayRevenue) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.todayOrderRevenue}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item lg={4}>
                                <Box
                                    sx={{
                                        boxShadow:
                                            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                        width: "100%",
                                        height: "300px",
                                        borderRadius: "40px",
                                        padding: "50px",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item lg={6}>
                                            <Typography
                                                sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}
                                            >
                                                Bookings
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}
                                            >
                                                Tổng doanh thu từ đặt phòng
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6}>
                                            <CircularProgressbar
                                                value={
                                                    dashboard &&
                                                    (dashboard.bookingRevenue / dashboard.totalRevenue) * 100
                                                }
                                                text={`${(dashboard
                                                    ? (dashboard.bookingRevenue / dashboard.totalRevenue) * 100
                                                    : 0
                                                ).toFixed(2)}%`}
                                                background={false}
                                            />
                                        </Grid>
                                        <Grid item lg={12}>
                                            <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                                <CountUp
                                                    start={0}
                                                    end={dashboard && dashboard.bookingRevenue}
                                                    duration={3}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={3}>
                        <Box
                            sx={{
                                boxShadow:
                                    "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                                width: "100%",
                                height: "100%",
                                borderRadius: "40px",
                                padding: "50px",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item lg={6}>
                                    <Typography sx={{ fontSize: "2.4rem", fontWeight: "600", marginBottom: "12px" }}>
                                        Today Revenue
                                    </Typography>
                                    <Typography sx={{ fontSize: "1.6rem", fontWeight: "500", marginBottom: "6px" }}>
                                        Tổng doanh thu hôm nay
                                    </Typography>
                                </Grid>
                                <Grid item lg={6}>
                                    <CircularProgressbar
                                        value={dashboard && (dashboard.todayRevenue / dashboard.totalRevenue) * 100}
                                        text={`${(dashboard
                                            ? (dashboard.todayRevenue / dashboard.totalRevenue) * 100
                                            : 0
                                        ).toFixed(2)}%`}
                                        background={false}
                                    />
                                </Grid>
                                <Grid item lg={12}>
                                    <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "600" }}>
                                        <CountUp start={0} end={dashboard && dashboard.todayRevenue} duration={3} />
                                    </Typography>
                                </Grid>
                                <Grid sx={{ margin: "20px" }} item lg={12}>
                                    <Box sx={{ marginBottom: "12px" }}>
                                        <Typography sx={{ fontSize: "1.8rem", fontWeight: "600", textAlign: "center" }}>
                                            Tổng đơn đặt phòng
                                        </Typography>
                                        <Typography
                                            variant="h2"
                                            sx={{ fontSize: "3rem", fontWeight: "600", textAlign: "center" }}
                                        >
                                            <CountUp
                                                start={0}
                                                end={dashboard && dashboard.totalBookingCount}
                                                duration={3}
                                            />
                                        </Typography>
                                    </Box>
                                    <Box sx={{ marginBottom: "12px" }}>
                                        <Typography sx={{ fontSize: "1.8rem", fontWeight: "600", textAlign: "center" }}>
                                            Tổng đơn gọi món
                                        </Typography>
                                        <Typography
                                            variant="h2"
                                            sx={{ fontSize: "3rem", fontWeight: "600", textAlign: "center" }}
                                        >
                                            <CountUp
                                                start={0}
                                                end={dashboard && dashboard.totalOrderCount}
                                                duration={3}
                                            />
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "3rem", fontWeight: "600", textAlign: "center" }}>
                                            Tổng doanh thu
                                        </Typography>
                                        <Typography
                                            variant="h2"
                                            sx={{ fontSize: "4rem", fontWeight: "600", textAlign: "center" }}
                                        >
                                            <CountUp start={0} end={dashboard && dashboard.totalRevenue} duration={3} />
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </DefaultAdminLayout>
    );
}

export default AdminPage;
