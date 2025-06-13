import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Paper,
    Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";
import { getSocketInstance } from "../../socket";

function MyTableBookingsPage() {
  const navigate = useNavigate();
  const socket = getSocketInstance();
  const [newStatus, setNewStatus] = useState(false);
  const [tableOrders, setTableOrders] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);
  const { setAlert } = HotelState();
  useEffect(() => {
    socket.on("orderUpdated", () => {
      setNewStatus(!newStatus);
    });
    socket.on("orderCompleted", () => {
      setNewStatus(!newStatus);
    });
    socket.on("orderCancelled", () => {
      setNewStatus(!newStatus);
    });
    socket.on("paymentSuccess", () => {
      setNewStatus(!newStatus);
    });

    async function getUserTableOrders() {
      try {
        const response = await axios.get("/api/table/user/orders");
        setTableOrders(response.data);
      } catch (error) {
        console.error("Error fetching table orders:", error);
      }
    }

    async function getUserTableBookings() {
      try {
        const response = await axios.get("/api/table/bookings");
        setTableBookings(response.data);
      } catch (error) {
        console.error("Error fetching table bookings:", error);
      }
    }

    getUserTableOrders();
    getUserTableBookings();    return () => {
      socket.off("orderUpdated");
      socket.off("orderCompleted");
      socket.off("orderCancelled");
      socket.off("paymentSuccess");
    };
  }, [newStatus]);

  const formatDateTime = (date) => {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm");
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString() + "đ";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "reserved":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "reserved":
        return "Đã đặt";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chưa thanh toán";
      case "paid":
        return "Đã thanh toán";
      default:
        return status;
    }
  };

  const handlePayment = async (orderId, amount) => {
    const confirm = window.confirm("Xác nhận chuyển đến trang thanh toán?");
    if (confirm) {
      try {
        const response = await axios.post("/api/payment/create_payment_url", {
          amount: amount,
          language: "vn",
          bankCode: "",
          targetType: "tableOrder",
          id: orderId,
        });
        if (response.status === 200) {
          window.location.href = response.data;
        }
      } catch (error) {
        setAlert({
          open: true,
          message: "Lỗi khi tạo thanh toán",
          type: "error",
          origin: { vertical: "bottom", horizontal: "center" },
        });
      }
    }
  };

  const renderOrderItems = (items) => {
    return items.map((item, index) => (
      <Box
        key={index}
        sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {item.cover && (
            <img
              src={`${process.env.REACT_APP_HOST_URL}${item.cover}`}
              alt={item.cuisineName}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
                marginRight: 12,
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontSize: "1.4rem", fontWeight: 600 }}
            >
              {item.cuisineName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Số lượng: {item.quantity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đơn giá: {formatCurrency(item.unitPrice)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Thành tiền: {formatCurrency(item.totalPrice)}
            </Typography>
            {item.specialInstructions && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Ghi chú: {item.specialInstructions}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    ));
  };

  const renderTableOrder = (order) => (
    <Card key={order._id} sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontSize: "1.8rem", fontWeight: 600 }}>
            Bàn {order.tableNumber}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={getStatusText(order.orderStatus)}
              color={getStatusColor(order.orderStatus)}
            />
            <Chip
              label={getPaymentStatusText(order.paymentStatus)}
              color={order.paymentStatus === "paid" ? "success" : "warning"}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Thời gian bắt đầu:</strong>{" "}
            {formatDateTime(order.startTime)}
          </Typography>
          {order.endTime && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Thời gian kết thúc:</strong>{" "}
              {formatDateTime(order.endTime)}
            </Typography>
          )}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Tổng tiền:</strong> {formatCurrency(order.totalAmount)}
          </Typography>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>
              Món ăn đã gọi ({order.items?.length || 0} món)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {order.items && order.items.length > 0 ? (
              renderOrderItems(order.items)
            ) : (
              <Typography color="text.secondary">Chưa có món ăn nào</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {order.orderStatus === "active" && (
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            {order.paymentStatus === "pending" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePayment(order._id, order.totalAmount)}
              >
                Thanh toán
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderTableBooking = (booking) => (
    <Card key={booking._id} sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontSize: "1.8rem", fontWeight: 600 }}>
            Đặt bàn {booking.tableNumber}
          </Typography>
          <Chip
            label={getStatusText(booking.orderStatus)}
            color={getStatusColor(booking.orderStatus)}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Ngày đặt:</strong>{" "}
            {moment(booking.bookingDate).format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Giờ đặt:</strong> {booking.bookingTime}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Số khách:</strong> {booking.numberOfGuests} người
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Thời gian:</strong> {booking.duration} giờ
          </Typography>
          {booking.specialRequests && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Yêu cầu đặc biệt:</strong> {booking.specialRequests}
            </Typography>
          )}
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Thời gian tạo:</strong> {formatDateTime(booking.createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <ContainerComponent>
      <Box sx={{ padding: "0 30px", backgroundColor: "transparent" }}>
        <Paper
          sx={{
            padding: "10px",
            margin: "20px 0",
            backgroundColor: "#f7f8f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>
            Lịch sử đặt bàn và gọi món
          </h2>
        </Paper>
      </Box>

      <Box sx={{ padding: "0 30px", backgroundColor: "transparent" }}>
        {/* Orders đang hoạt động */}
        <Paper
          sx={{ padding: "20px", margin: "20px 0", backgroundColor: "#fff" }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, fontSize: "2rem", fontWeight: 600 }}
          >
            Bàn đang sử dụng
          </Typography>
          {tableOrders.filter((order) => order.orderStatus === "active")
            .length > 0 ? (
            tableOrders
              .filter((order) => order.orderStatus === "active")
              .map((order) => renderTableOrder(order))
          ) : (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              Bạn chưa có bàn nào đang sử dụng
            </Typography>
          )}
        </Paper>

        {/* Booking đang chờ */}
        <Paper
          sx={{ padding: "20px", margin: "20px 0", backgroundColor: "#fff" }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, fontSize: "2rem", fontWeight: 600 }}
          >
            Bàn đã đặt
          </Typography>
          {tableBookings.filter((booking) => booking.orderStatus === "reserved")
            .length > 0 ? (
            tableBookings
              .filter((booking) => booking.orderStatus === "reserved")
              .map((booking) => renderTableBooking(booking))
          ) : (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              Bạn chưa có bàn nào đang đặt
            </Typography>
          )}
        </Paper>

        {/* Lịch sử hoàn thành */}
        <Paper
          sx={{ padding: "20px", margin: "20px 0", backgroundColor: "#fff" }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, fontSize: "2rem", fontWeight: 600 }}
          >
            Lịch sử
          </Typography>
          {[
            ...tableOrders.filter((order) => order.orderStatus !== "active"),
            ...tableBookings.filter(
              (booking) => booking.orderStatus !== "reserved"
            ),
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .length > 0 ? (
            <>
              {tableOrders
                .filter((order) => order.orderStatus !== "active")
                .map((order) => renderTableOrder(order))}
              {tableBookings
                .filter((booking) => booking.orderStatus !== "reserved")
                .map((booking) => renderTableBooking(booking))}
            </>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              Chưa có lịch sử đặt bàn
            </Typography>
          )}
        </Paper>
      </Box>
    </ContainerComponent>
  );
}

export default MyTableBookingsPage;
