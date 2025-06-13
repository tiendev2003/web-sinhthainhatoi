import styled from "@emotion/styled";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import axios from "axios";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { HotelState } from "../../components/MyContext/MyContext";

const TagItem = styled("li")({
  display: "inline-block",
  listStyleType: "none",
});
const StyledSpan = styled("span")({
  display: "inline-block",
  borderLeft: "3px solid #c40025",
  backgroundColor: "#e2e2e2",
  color: "#323c42",
  padding: "4px 9px",
  margin: "5px",
  fontSize: "1.6rem",
  position: "relative",
  "&::before": {
    left: "0",
    top: "10px",
    border: "solid transparent",
    content: '" "',
    height: "0",
    width: "0",
    position: "absolute",
    pointerEvent: "none",
    borderColor: "rgba(136, 183, 213, 0)",
    borderLeftColor: "#c40025",
    borderWidth: "4px",
  },
});
const StyledTextField = styled("input")`
  height: 45px;
  padding: 0 20px;
  color: #333;
  line-height: 45px;
  border: 1px solid #e1e1e1 !important;
  box-shadow: none;
  background: #fff;

  width: 100px;
  outline: none;
  border: initial;
  font-size: 1.4rem;
`;
function CuisineDetailPage() {
  const navigate = useNavigate();
  const isLogined = useSelector((state) => state.auth.isLogined);
  const user = useSelector((state) => state.auth.user); // Lấy thông tin user
  const params = useParams();
  const cuisineId = params.id;
  const { setAlert } = HotelState();
  const [cuisineType, setCuisineType] = useState("");
  const [bookingId, setbookingId] = useState("");
  const [currentBooking, setCurrentBooking] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedRoomNo, setSelectedRoomNo] = useState("");  const [selectedTableId, setSelectedTableId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [detail, setDetail] = useState();
  const [orderType, setOrderType] = useState("room"); // "room" hoặc "table"
  const getAvailableTables = async () => {
    try {
      const response = await axios.get("api/table/tables");
      console.log("All tables:", response.data);
      
      // Lọc lấy bàn available (để tạo order mới) và occupied (để thêm món)
      const tablesForOrder = response.data.filter((table) => {
        const canOrder = table.status === "available" || 
                        (table.status === "occupied" && table.currentOrder);
        
        console.log(`Table ${table.tableNumber}:`, {
          status: table.status,
          currentOrder: table.currentOrder,
          canOrder: canOrder
        });
        
        return canOrder;
      });
      
      console.log("Tables available for ordering:", tablesForOrder);
      setAvailableTables(tablesForOrder);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setAvailableTables([]);
    }
  };

  // Socket.IO real-time updates
  useEffect(() => {
    const { getSocketInstance } = require('../../socket');
    const socket = getSocketInstance();

    // Listen for table status updates
    socket.on('tableStatusUpdated', (data) => {
      console.log('Table status updated:', data);
      getAvailableTables(); // Refresh table list
    });

    socket.on('newTableOrder', (order) => {
      console.log('New table order:', order);
      getAvailableTables(); // Refresh table list
      
      // Show notification if the selected table was taken
      if (selectedTableId === order.tableId) {
        setAlert({
          open: true,
          message: `Bàn ${order.tableNumber} vừa được đặt bởi khách khác!`,
          type: "warning",
          origin: { vertical: "bottom", horizontal: "center" },
        });
        setSelectedTableId(""); // Clear selection
      }
    });

    // Cleanup
    return () => {
      socket.off('tableStatusUpdated');
      socket.off('newTableOrder');
    };
  }, [selectedTableId]);

  useEffect(() => {
    async function getDetail() {
      try {
        const response = await axios.get(`api/cuisine/detail/${cuisineId}`);
        const detailData = response.data;

        setDetail(detailData);
        setCuisineType(detailData.type);
      } catch (error) {
        console.error("Error fetching cuisine detail:", error);
      }
    }

    async function getCurrentBooking() {
      try {
        const response = await axios.get("api/booking/current");
        const data = response.data;

        // Đảm bảo data là mảng
        if (Array.isArray(data) && data.length > 0) {
          const cur = data.map((item) => ({
            roomNo: item.roomNo,
            bookingId: item._id,
          }));
          setCurrentBooking(cur);
        } else {
          setCurrentBooking([]); // Nếu không có dữ liệu, set mảng rỗng
        }
      } catch (error) {
        console.error("Error fetching current booking:", error);
        setCurrentBooking([]); // fallback khi lỗi
      }
    }

    getCurrentBooking();
    getAvailableTables();
    getDetail();
  }, [cuisineId]);

  const handleChange = (event) => {
    const roomNo = event.target.value;
    console.log(roomNo);
    // Tìm đối tượng có roomNo tương ứng trong currentBooking
    const selectedBooking = currentBooking.find((item) =>
      item.roomNo.includes(roomNo)
    );
    console.log(selectedBooking, currentBooking);
    if (selectedBooking) {
      const bookingId = selectedBooking.bookingId;
      // Sử dụng bookingId theo nhu cầu của bạn
      setbookingId(bookingId);
    }
    setSelectedRoomNo(roomNo);
  };

  const handleTableChange = (event) => {
    setSelectedTableId(event.target.value);
  };

  const caroselItem =
    detail &&
    detail.images.map((item, index) => {
      return (
        <div key={index}>
          <img
            src={`${process.env.REACT_APP_HOST_URL}${item}`}
            alt=""
            style={{ width: "100%", userSelect: "none" }}
          />
        </div>
      );
    });

  useEffect(() => {
    async function getSimilarCuisine() {
      if (cuisineType !== "") {
        const response = await axios.get(`api/cuisine/${cuisineType}`);
        setSimlarCuisine(response.data);
      }
    }
    getSimilarCuisine();
  }, [cuisineType]);
  const [simlarCuisine, setSimlarCuisine] = useState([]);
  const similarCuisineArr = simlarCuisine.filter((item) => {
    return item._id !== cuisineId;
  });

  const items = similarCuisineArr.map((item, index) => {
    return (
      <Card
        key={index}
        sx={{
          margin: "5px",
          "& .MuiCardContent-root:last-child": {
            paddingBottom: "16px",
          },
        }}
      >
        <CardMedia
          sx={{ height: "225px", cursor: "pointer" }}
          image={`${process.env.REACT_APP_HOST_URL}${item.images[0]}`}
          onClick={() => {
            navigate(`/cuisine/${item._id}`);
            window.scrollTo(0, 0);
            window.scrollTo(0, 0);
          }}
        />
        <CardContent>
          <Typography
            fontSize="1.4rem"
            sx={{
              width: "100%",
              textTransform: "uppercase",

              fontWeight: "600",
              cursor: "pointer",
              "&:hover": {
                color: "var(--primary-color)",
              },
            }}
            onClick={() => {
              navigate(`/cuisine/${item._id}`);
              window.scrollTo(0, 0);
              window.scrollTo(0, 0);
            }}
          >
            {item.title}
          </Typography>
          <div style={{ marginTop: "6px" }}>
            <span
              style={{
                color: "var(--primary-color)",
                fontWeight: "600",
                fontSize: "1.8rem",
              }}
            >
              {item.promotionalPrice.toLocaleString()}₫
            </span>
            <span
              style={{
                fontSize: "1.6rem",
                marginLeft: "6px",
                textDecoration: "line-through",
                color: "#acacac",
              }}
            >
              {item.listedPrice && item.listedPrice.toLocaleString() + "₫"}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  });

  // Cập nhật handleOrder để support cả room và table orders
  const handleOrder = async () => {
    if (isLogined) {
      if (orderType === "room") {
        // Logic cũ cho room
        const confirmOrder = window.confirm("Xác nhận đặt đồ ăn cho phòng?");
        if (confirmOrder) {
          const response = await axios.post("/api/order/create", {
            cuisineName: detail.title,
            promotionalPrice: detail.promotionalPrice,
            totalPrice: Number(quantity * detail.promotionalPrice),
            quantity: quantity,
            cuisineId: cuisineId,
            roomNo: selectedRoomNo,
            bookingId: bookingId,
          });
          if (response.status === 200) {
            setAlert({
              open: true,
              message: "Đã đặt đồ ăn thành công!",
              type: "success",
              origin: { vertical: "bottom", horizontal: "center" },
            });
          }
          navigate("/order");
          window.scrollTo(0, 0);
        }      } else if (orderType === "table") {
        // Logic cho table - support cả tạo mới và thêm món
        if (!selectedTableId) {
          setAlert({
            open: true,
            message: "Vui lòng chọn bàn!",
            type: "error",
            origin: { vertical: "bottom", horizontal: "center" },
          });
          return;
        }

        // Tìm bàn được chọn để kiểm tra trạng thái
        const selectedTable = availableTables.find(table => 
          table._id === selectedTableId || 
          (table.currentOrder && 
           (typeof table.currentOrder === 'object' ? table.currentOrder._id : table.currentOrder) === selectedTableId)
        );

        if (!selectedTable) {
          setAlert({
            open: true,
            message: "Không tìm thấy bàn đã chọn!",
            type: "error",
            origin: { vertical: "bottom", horizontal: "center" },
          });
          return;
        }

        const isNewOrder = selectedTable.status === 'available';
        const confirmMessage = isNewOrder ? 
          "Xác nhận tạo order mới cho bàn?" : 
          "Xác nhận thêm món vào order hiện tại?";

        const confirmOrder = window.confirm(confirmMessage);
        if (confirmOrder) {
          try {
            let response;            if (isNewOrder) {
              // Tạo order mới cho bàn available - với retry mechanism
              let retryCount = 0;
              const maxRetries = 3;
              
              while (retryCount < maxRetries) {
                try {                  // Backend sẽ tự động lấy thông tin từ token
                  response = await axios.post('/api/table/orders', {
                    tableId: selectedTable._id,
                    items: [{
                      cuisineId: cuisineId,
                      quantity: quantity,
                      specialInstructions: ""
                    }]
                  });
                  break; // Thành công, thoát khỏi retry loop
                  
                } catch (error) {
                  if (error.response?.status === 409 && error.response?.data?.code === 'TABLE_OCCUPIED') {
                    // Bàn đã được đặt bởi người khác, retry với logic thêm món
                    console.log(`Table occupied, retrying... (${retryCount + 1}/${maxRetries})`);
                    
                    // Refresh table data để lấy current order
                    await getAvailableTables();
                    const updatedTable = availableTables.find(t => t._id === selectedTable._id);
                    
                    if (updatedTable && updatedTable.currentOrder) {
                      // Chuyển sang logic thêm món
                      const orderId = typeof updatedTable.currentOrder === 'object' ? 
                                     updatedTable.currentOrder._id : updatedTable.currentOrder;
                      
                      response = await axios.post(`/api/table/orders/${orderId}/items`, {
                        cuisineId: cuisineId,
                        quantity: quantity,
                        specialInstructions: ""
                      });
                      
                      setAlert({
                        open: true,
                        message: "Bàn đã có order, đã thêm món vào order hiện tại!",
                        type: "info",
                        origin: { vertical: "bottom", horizontal: "center" },
                      });
                      break;
                    }
                    
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
                  } else {
                    throw error; // Re-throw other errors
                  }
                }
              }
              
              if (retryCount >= maxRetries) {
                throw new Error("Không thể tạo order sau nhiều lần thử. Vui lòng thử lại.");
              }
                if (response && (response.status === 200 || response.status === 201)) {                setAlert({
                  open: true,
                  message: "Đã tạo order mới cho bàn thành công!",
                  type: "success",
                  origin: { vertical: "bottom", horizontal: "center" },
                });
              }
            } else {
              // Thêm món vào order existing
              response = await axios.post(`/api/table/orders/${selectedTableId}/items`, {
                cuisineId: cuisineId,
                quantity: quantity,
                specialInstructions: ""
              });
              
              if (response.status === 200) {
                setAlert({
                  open: true,
                  message: "Đã thêm món vào order thành công!",
                  type: "success",
                  origin: { vertical: "bottom", horizontal: "center" },
                });
              }
            }
            
            // Refresh available tables để cập nhật trạng thái
            getAvailableTables();
            
          } catch (error) {
            setAlert({
              open: true,
              message:
                error.response?.data?.message || "Lỗi khi đặt món cho bàn",
              type: "error",
              origin: { vertical: "bottom", horizontal: "center" },
            });
          }
        }
      }
    } else {
      if (
        window.confirm(
          "Bạn cần đăng nhập để gọi đồ ăn! Quay về trang đăng nhập?"
        )
      ) {
        navigate("/login");
        window.scrollTo(0, 0);
      }
    }
  };
  return (
    detail && (
      <ContainerComponent>
        <Grid
          container
          sx={{
            padding: "12px 0",
            width: "100%",
          }}
          spacing={2}
        >
          <Grid item lg={6} md={12} xs={12}>
            <Carousel>{caroselItem}</Carousel>
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <Typography variant="h2">{detail && detail.title}</Typography>
            <div style={{ marginTop: "20px", paddingLeft: "10px" }}>
              <span
                style={{
                  fontSize: "2.4rem",
                  fontWeight: "600",
                  color: "var(--primary-color)",
                }}
              >
                {detail && detail.promotionalPrice.toLocaleString() + "₫"}
              </span>
              {detail && detail.listedPrice && (
                <span
                  style={{
                    fontSize: "1.6rem",
                    marginLeft: "6px",
                    textDecoration: "line-through",
                    color: "#acacac",
                  }}
                >
                  {detail && detail.listedPrice.toLocaleString() + "₫"}
                </span>
              )}
            </div>
            <Divider
              sx={{ margin: "20px 0" }}
              variant="fullWidth"
              orientation="horizontal"
            />
            <p
              style={{
                margin: "12px 0",
                fontSize: "1.8rem",
                textAlign: "justify",
              }}
            >
              {detail && detail.summary}
            </p>
            <Divider
              sx={{ margin: "20px 0" }}
              variant="fullWidth"
              orientation="horizontal"
            />{" "}
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: "18px" }}
                variant="body2"
                color="initial"
              >
                Loại đặt hàng:
              </Typography>
              <Select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="room">Đặt cho phòng</MenuItem>
                <MenuItem value="table">Đặt cho bàn ăn</MenuItem>
              </Select>
            </div>
            {orderType === "room" && (
              <div
                style={{
                  margin: "20px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ fontSize: "18px" }}
                  variant="body2"
                  color="initial"
                >
                  Chọn nơi nhận: Phòng số
                </Typography>
                <Select
                  labelId="room-No"
                  id="room-No"
                  value={selectedRoomNo}
                  onChange={handleChange}
                >
                  {currentBooking.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.roomNo.toString()}>
                        {" "}
                        {/* Sử dụng item.roomNo.toString() */}
                        {item.roomNo.toString()}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            )}            {orderType === "table" && (
              <>
                <div
                  style={{
                    margin: "20px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "18px" }}
                    variant="body2"
                    color="initial"
                  >
                    Chọn bàn:
                  </Typography>
                  <Select
                    value={selectedTableId}
                    onChange={handleTableChange}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="" disabled>
                      Chọn bàn
                    </MenuItem>
                    {availableTables.map((table) => (
                      <MenuItem 
                        key={table._id} 
                        value={table.status === 'available' ? table._id : 
                               (typeof table.currentOrder === 'object' ? table.currentOrder._id : table.currentOrder)}
                      >
                        Bàn {table.tableNumber} - {table.tableName}
                        {table.status === 'available' ? (
                          <span style={{ fontSize: '12px', color: '#4CAF50' }}>
                            {' '}(Trống - {table.capacity} người)
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#FF9800' }}>
                            {' '}(Đang dùng - thêm món)
                            {table.currentOrder && typeof table.currentOrder === 'object' && 
                              ` - ${table.currentOrder.customerName}`}
                          </span>
                        )}
                      </MenuItem>
                    ))}                  </Select>
                </div>
              </>
            )}
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  margin: "20px 0",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <StyledTextField
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(event) => {
                    setQuantity(event.target.value);
                  }}
                />
                <Button
                  onClick={handleOrder}
                  variant="contained"
                  color="error"
                  size="large"
                  sx={{ marginLeft: "20px" }}
                >
                  đặt hàng
                </Button>
              </div>
              {quantity > 0 && (
                <div>
                  <span style={{ fontSize: "2rem" }}>Tổng tiền: </span>
                  <span
                    style={{ fontSize: "2rem", color: "var(--primary-color)" }}
                  >
                    {Number(
                      quantity * detail.promotionalPrice
                    ).toLocaleString()}
                    đ
                  </span>
                </div>
              )}
            </div>
            <Divider />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>Tags:</span>
              <ul
                style={{
                  listStyle: "none",
                  marginBottom: "0",
                  marginLeft: "0",
                }}
              >
                {detail &&
                  detail.tags.map((item) => {
                    return (
                      <TagItem key={item}>
                        <StyledSpan>{item}</StyledSpan>
                      </TagItem>
                    );
                  })}
              </ul>
            </div>
          </Grid>

          <Grid item lg={12} md={12} xs={12}>
            <div
              style={{
                color: "white",
                backgroundColor: "var(--primary-color)",
                marginLeft: "10px",
                fontSize: "1.8rem",
                borderRadius: "10px 10px 0px 0px",
                display: "inline-block",
                height: "40px",
                lineHeight: "40px",
                padding: "0 15px",
              }}
            >
              Mô tả sản phẩm
            </div>
            <div
              style={{
                border: "1px solid #0e6828",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  fontSize: "1.8rem",
                  textAlign: "justify",
                }}
                className="ql-editor"
                datagramm="false"
              >
                {detail && parse(detail.description)}
              </div>
            </div>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <div
              onClick={() => {
                navigate(`/${cuisineType}`);
                window.scrollTo(0, 0);
              }}
              style={{
                color: "white",
                backgroundColor: "var(--primary-color)",
                marginLeft: "10px",
                fontSize: "1.8rem",
                borderRadius: "10px 10px 0px 0px",
                display: "inline-block",
                height: "40px",
                lineHeight: "40px",
                padding: "0 15px",
                cursor: "pointer",
              }}
            >
              Sản phẩm tương tự
            </div>
            <div
              style={{
                border: "1px solid #0e6828",
                padding: "5px 10px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                }}
              >
                <AliceCarousel
                  mouseTracking
                  infinite
                  autoPlayInterval={2000}
                  animationDuration={2500}
                  items={items}
                  disableDotsControls
                  autoPlay
                  disableButtonsControls
                  responsive={{
                    0: {
                      items: 1,
                    },
                    393: {
                      items: 1,
                    },
                    767: {
                      items: 2,
                    },

                    992: {
                      items: 4,
                    },
                    1025: { items: 4 },
                    1199: { items: 4 },
                    1536: { items: 4 },
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </ContainerComponent>
    )
  );
}

export default CuisineDetailPage;
