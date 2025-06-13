import { Add, Cancel, CheckCircle, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { HotelState } from "../../../components/MyContext/MyContext";
import DefaultAdminLayout from "../DefaultAdminLayout";

const TableManagement = () => {
  const { setAlert } = HotelState();
  const [tables, setTables] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tables"); // 'tables' hoặc 'orders'

  const [tableForm, setTableForm] = useState({
    tableNumber: "",
    tableName: "",
    capacity: "",
    area: "indoor",
    pricePerHour: "",
    amenities: "",
    description: "",
  });

  useEffect(() => {
    fetchTables();
    fetchTableOrders();
  }, []);
  const fetchTables = async () => {
    try {
      const response = await axios.get("api/table/tables");
      setTables(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bàn:", error);
      setAlert({
        open: true,
        message: "Lỗi khi tải danh sách bàn",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      setLoading(false);
    }
  };
  const fetchTableOrders = async () => {
    try {
      const response = await axios.get("api/table/orders");
      setTableOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách orders:", error);
    }
  };
  const handleAddTable = async () => {
    try {
      const amenitiesArray = tableForm.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      await axios.post("api/table/tables", {
        ...tableForm,
        capacity: Number(tableForm.capacity),
        pricePerHour: Number(tableForm.pricePerHour),
        amenities: amenitiesArray,
      });

      setAlert({
        open: true,
        message: "Tạo bàn thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      setShowAddModal(false);
      resetForm();
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi tạo bàn:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Lỗi khi tạo bàn",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };
  const handleEditTable = async () => {
    try {
      const amenitiesArray = tableForm.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await axios.put(`api/table/tables/${selectedTable._id}`, {
        ...tableForm,
        capacity: Number(tableForm.capacity),
        pricePerHour: Number(tableForm.pricePerHour),
        amenities: amenitiesArray,
      });

      setAlert({
        open: true,
        message: "Cập nhật bàn thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      setShowEditModal(false);
      resetForm();
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi cập nhật bàn:", error);
      setAlert({
        open: true,
        message: "Lỗi khi cập nhật bàn",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bàn này?")) return;
    try {
      await axios.delete(`api/table/tables/${tableId}`);

      setAlert({
        open: true,
        message: "Xóa bàn thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi xóa bàn:", error);
      setAlert({
        open: true,
        message: error.response?.data?.message || "Lỗi khi xóa bàn",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };

  const handleUpdateTableStatus = async (tableId, newStatus) => {
    try {
      await axios.patch(`api/table/tables/${tableId}/status`, {
        status: newStatus,
      });

      setAlert({
        open: true,
        message: "Cập nhật trạng thái bàn thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setAlert({
        open: true,
        message: "Lỗi khi cập nhật trạng thái bàn",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };

  const handleCompleteOrder = async (orderId) => {
    const paymentMethod =
      prompt("Phương thức thanh toán (cash/card/vnpay/transfer):") || "cash";
    try {
      await axios.patch(`api/table/orders/${orderId}/complete`, {
        paymentMethod,
      });

      setAlert({
        open: true,
        message: "Hoàn thành order thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      fetchTableOrders();
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi hoàn thành order:", error);
      setAlert({
        open: true,
        message: "Lỗi khi hoàn thành order",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Lý do hủy order:");
    if (!reason) return;
    try {
      await axios.patch(`api/table/orders/${orderId}/cancel`, {
        reason,
      });

      setAlert({
        open: true,
        message: "Hủy order thành công!",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
      });
      fetchTableOrders();
      fetchTables();
    } catch (error) {
      console.error("Lỗi khi hủy order:", error);
      setAlert({
        open: true,
        message: "Lỗi khi hủy order",
        type: "error",
        origin: { vertical: "bottom", horizontal: "center" },
      });
    }
  };

  const openEditModal = (table) => {
    setSelectedTable(table);
    setTableForm({
      tableNumber: table.tableNumber,
      tableName: table.tableName,
      capacity: table.capacity.toString(),
      area: table.area,
      pricePerHour: table.pricePerHour?.toString() || "",
      amenities: table.amenities?.join(", ") || "",
      description: table.description || "",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setTableForm({
      tableNumber: "",
      tableName: "",
      capacity: "",
      area: "indoor",
      pricePerHour: "",
      amenities: "",
      description: "",
    });
    setSelectedTable(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#4CAF50";
      case "occupied":
        return "#F44336";
      case "reserved":
        return "#FF9800";
      case "maintenance":
        return "#9E9E9E";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "occupied":
        return "Đang sử dụng";
      case "reserved":
        return "Đã đặt";
      case "maintenance":
        return "Bảo trì";
      default:
        return "Không xác định";
    }
  };

  const getAreaText = (area) => {
    switch (area) {
      case "indoor":
        return "Trong nhà";
      case "outdoor":
        return "Ngoài trời";
      case "vip":
        return "VIP";
      case "garden":
        return "Sân vườn";
      default:
        return area;
    }
  };
  if (loading) {
    return (
      <DefaultAdminLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h6">Đang tải...</Typography>
        </Box>
      </DefaultAdminLayout>
    );
  }

  return (
    <DefaultAdminLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Bàn & Orders
        </Typography>

        <Paper sx={{ width: "100%", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Quản lý Bàn" value="tables" />
            <Tab label="Orders" value="orders" />
          </Tabs>
        </Paper>

        {activeTab === "tables" && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Danh sách Bàn</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAddModal(true)}
                sx={{ bgcolor: "success.main" }}
              >
                Thêm Bàn Mới
              </Button>
            </Box>

            <Grid container spacing={3}>
              {tables.map((table) => (
                <Grid item xs={12} sm={6} md={4} key={table._id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">{table.tableName}</Typography>
                        <Chip
                          label={table.tableNumber}
                          color="primary"
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Sức chứa:</strong> {table.capacity} người
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Khu vực:</strong> {getAreaText(table.area)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        <strong>Giá:</strong>{" "}
                        {table.pricePerHour?.toLocaleString()}đ/giờ
                      </Typography>

                      <Chip
                        label={getStatusText(table.status)}
                        color={
                          table.status === "available"
                            ? "success"
                            : table.status === "occupied"
                            ? "error"
                            : table.status === "reserved"
                            ? "warning"
                            : "default"
                        }
                        sx={{ mb: 2, width: "100%" }}
                      />

                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={table.status}
                            onChange={(e) =>
                              handleUpdateTableStatus(table._id, e.target.value)
                            }
                          >
                            <MenuItem value="available">Có sẵn</MenuItem>
                            <MenuItem value="occupied">Đang sử dụng</MenuItem>
                            <MenuItem value="reserved">Đã đặt</MenuItem>
                            <MenuItem value="maintenance">Bảo trì</MenuItem>
                          </Select>
                        </FormControl>
                        <IconButton
                          color="primary"
                          onClick={() => openEditModal(table)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTable(table._id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === "orders" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Danh sách Orders
            </Typography>
            <Grid container spacing={2}>
              {tableOrders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          Bàn {order.tableNumber}
                        </Typography>
                        <Chip
                          label={
                            order.orderStatus === "active"
                              ? "Đang hoạt động"
                              : order.orderStatus === "completed"
                              ? "Hoàn thành"
                              : "Đã hủy"
                          }
                          color={
                            order.orderStatus === "active"
                              ? "warning"
                              : order.orderStatus === "completed"
                              ? "success"
                              : "error"
                          }
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2">
                            <strong>Khách hàng:</strong> {order.customerName}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2">
                            <strong>Thời gian:</strong>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="primary">
                            <strong>Tổng tiền:</strong>{" "}
                            {order.totalAmount?.toLocaleString()}đ
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        <strong>Món đã đặt:</strong>
                      </Typography>
                      {order.items.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 0.5,
                          }}
                        >
                          <Typography variant="body2">
                            {item.cuisineName} x{item.quantity}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {item.totalPrice?.toLocaleString()}đ
                          </Typography>
                        </Box>
                      ))}

                      {order.orderStatus === "active" && (
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleCompleteOrder(order._id)}
                            size="small"
                          >
                            Hoàn thành
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelOrder(order._id)}
                            size="small"
                          >
                            Hủy
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Add Table Dialog */}
        <Dialog
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Thêm Bàn Mới</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số bàn"
                  value={tableForm.tableNumber}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      tableNumber: e.target.value,
                    }))
                  }
                  placeholder="T001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên bàn"
                  value={tableForm.tableName}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      tableName: e.target.value,
                    }))
                  }
                  placeholder="Bàn VIP 1"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sức chứa"
                  type="number"
                  value={tableForm.capacity}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                  placeholder="4"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Khu vực</InputLabel>
                  <Select
                    value={tableForm.area}
                    label="Khu vực"
                    onChange={(e) =>
                      setTableForm((prev) => ({
                        ...prev,
                        area: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="indoor">Trong nhà</MenuItem>
                    <MenuItem value="outdoor">Ngoài trời</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="garden">Sân vườn</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giá/giờ (VNĐ)"
                  type="number"
                  value={tableForm.pricePerHour}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      pricePerHour: e.target.value,
                    }))
                  }
                  placeholder="50000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tiện ích"
                  value={tableForm.amenities}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      amenities: e.target.value,
                    }))
                  }
                  placeholder="Wifi, TV, Điều hòa"
                  helperText="Cách nhau bằng dấu phẩy"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={tableForm.description}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Mô tả chi tiết về bàn..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddModal(false)}>Hủy</Button>
            <Button onClick={handleAddTable} variant="contained">
              Thêm Bàn
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Table Dialog */}
        <Dialog
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Sửa Thông Tin Bàn</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số bàn"
                  value={tableForm.tableNumber}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      tableNumber: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên bàn"
                  value={tableForm.tableName}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      tableName: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sức chứa"
                  type="number"
                  value={tableForm.capacity}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Khu vực</InputLabel>
                  <Select
                    value={tableForm.area}
                    label="Khu vực"
                    onChange={(e) =>
                      setTableForm((prev) => ({
                        ...prev,
                        area: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="indoor">Trong nhà</MenuItem>
                    <MenuItem value="outdoor">Ngoài trời</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="garden">Sân vườn</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giá/giờ (VNĐ)"
                  type="number"
                  value={tableForm.pricePerHour}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      pricePerHour: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tiện ích"
                  value={tableForm.amenities}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      amenities: e.target.value,
                    }))
                  }
                  helperText="Cách nhau bằng dấu phẩy"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={3}
                  value={tableForm.description}
                  onChange={(e) =>
                    setTableForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditModal(false)}>Hủy</Button>
            <Button onClick={handleEditTable} variant="contained">
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DefaultAdminLayout>
  );
};

export default TableManagement;
