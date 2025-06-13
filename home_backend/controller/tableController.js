const tableModel = require("../models/tableModel");
const tableOrderModel = require("../models/tableOrderModel");
const cuisineModel = require("../models/cuisineModel");
const userModel = require("../models/userModel");
const adminNotificationModel = require("../models/adminNotificationModel");
const userNotificationModel = require("../models/userNotificationModel");
const { getIO } = require("../utils/socket");
const { default: mongoose } = require("mongoose");

 
const getAllTables = async (req, res) => {
  try {
    const tables = await tableModel
      .find({ isActive: true })
      .populate("currentOrder")
      .sort({ tableNumber: 1 });
    return res.json(tables);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách bàn" });
  }
};

// Tạo bàn mới
const createTable = async (req, res) => {
  try {
    const {
      tableNumber,
      tableName,
      capacity,
      area,
      pricePerHour,
      amenities,
      description,
    } = req.body;

    // Kiểm tra bàn đã tồn tại
    const existingTable = await tableModel.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: "Số bàn đã tồn tại" });
    }

    const newTable = await tableModel.create({
      tableNumber,
      tableName,
      capacity,
      area,
      pricePerHour,
      amenities,
      description,
    });

    return res.status(201).json({
      message: "Tạo bàn thành công",
      table: newTable,
    });
  } catch (error) {
    console.log(error);
   }
};

// Cập nhật thông tin bàn
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTable = await tableModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTable) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    return res.json({
      message: "Cập nhật bàn thành công",
      table: updatedTable,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi cập nhật bàn" });
  }
};

// Xóa bàn (soft delete)
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra bàn có order đang hoạt động không
    const activeOrder = await tableOrderModel.findOne({
      tableId: id,
      orderStatus: "active",
    });

    if (activeOrder) {
      return res.status(400).json({
        message: "Không thể xóa bàn đang có khách",
      });
    }

    await tableModel.findByIdAndUpdate(id, { isActive: false });

    return res.json({ message: "Xóa bàn thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi xóa bàn" });
  }
};

 const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTable = await tableModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    const io = getIO();
    io.emit("tableStatusUpdated", { tableId: id, status });

    return res.json({
      message: "Cập nhật trạng thái bàn thành công",
      table: updatedTable,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái bàn" });
  }
};

 
// Tạo order mới cho bàn với concurrency protection
const createTableOrder = async (req, res) => {
  const session = await mongoose.startSession();
    try {
    await session.startTransaction();
      const { tableId, items, specialRequests } = req.body;

    // Lấy thông tin user từ authentication middleware  
    const user = await userModel.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(401).json({ message: "Người dùng không hợp lệ" });
    }

    // Kiểm tra bàn với atomic operation và lock
    const table = await tableModel.findById(tableId).session(session);
    if (!table) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    // Double-check với session để tránh race condition
    if (table.status !== "available" || table.currentOrder) {
      await session.abortTransaction();
      return res.status(409).json({ 
        message: "Bàn đã được đặt bởi khách hàng khác", 
        code: "TABLE_OCCUPIED",
        currentOrder: table.currentOrder
      });
    }

    // Validate và tính giá các món
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const cuisine = await cuisineModel.findById(item.cuisineId);
      if (!cuisine) {
        await session.abortTransaction();
        return res.status(404).json({
          message: `Không tìm thấy món: ${item.cuisineName}`,
        });
      }

      const itemTotal = cuisine.promotionalPrice * item.quantity;
      orderItems.push({
        cuisineId: item.cuisineId,
        cuisineName: cuisine.title,
        quantity: item.quantity,
        unitPrice: cuisine.promotionalPrice,
        totalPrice: itemTotal,
        specialInstructions: item.specialInstructions || "",
        cover: cuisine.images[0],
      });
      subtotal += itemTotal;
    }    // Tạo order với session và thông tin user từ token
    const newOrder = await tableOrderModel.create([{
      tableId,
      tableNumber: table.tableNumber,
      customerName: user.fullname || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Khách hàng',
      customerPhone: user.phoneNumber || null, // Có thể null nếu user chưa có SĐT
      customerEmail: user.email || null, // Có thể null nếu user chưa có email
      userId: req.userId,
      items: orderItems,
      subtotal,
      totalAmount: subtotal,
      specialRequests: specialRequests || null,
    }], { session });

    // Cập nhật trạng thái bàn với atomic operation
    const updateResult = await tableModel.findByIdAndUpdate(
      tableId,
      {
        status: "occupied",
        currentOrder: newOrder[0]._id,
      },
      { 
        session,
        new: true,
        runValidators: true
      }
    );

    if (!updateResult) {
      await session.abortTransaction();
      return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái bàn" });
    }

    // Commit transaction
    await session.commitTransaction();    // Tạo thông báo admin (sau khi commit)
    adminNotificationModel.create({
      message: `Có order mới cho bàn ${table.tableNumber} từ ${user.fullname || user.firstname + ' ' + user.lastname}`,
      target: "tableOrder",
    });

    const io = getIO();
    io.emit("newTableOrder", newOrder[0]);
    io.emit("tableStatusUpdated", { tableId, status: "occupied" });
    io.emit("adminnotification");

    return res.status(201).json({
      message: "Tạo order thành công",
      order: newOrder[0],
    });

  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi tạo order" });
  } finally {
    session.endSession();
  }
};

// Thêm món vào order đang hoạt động
const addItemToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cuisineId, quantity, specialInstructions } = req.body;

    // Kiểm tra user authentication
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Người dùng không hợp lệ" });
    }

    const order = await tableOrderModel.findById(orderId);
    if (!order || order.orderStatus !== "active") {
      return res
        .status(404)
        .json({ message: "Không tìm thấy order hoặc order đã kết thúc" });
    }

    // Kiểm tra quyền: chỉ user tạo order hoặc admin mới có thể thêm món
    if (order.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ 
        message: "Bạn không có quyền thêm món vào order này" 
      });
    }

    const cuisine = await cuisineModel.findById(cuisineId);
    if (!cuisine) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    const newItem = {
      cuisineId,
      cuisineName: cuisine.title,
      quantity,
      unitPrice: cuisine.promotionalPrice,
      totalPrice: cuisine.promotionalPrice * quantity,
      specialInstructions: specialInstructions || "",
      cover: cuisine.images[0],
    };    order.items.push(newItem);
    order.totalAmount = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await order.save();

    // Tạo notification cho owner của order nếu không phải chính họ thêm món
    if (order.userId.toString() !== req.userId) {
      await userNotificationModel.create({
        userId: order.userId,
        message: `${user.fullname || user.firstname + ' ' + user.lastname} đã thêm ${cuisine.title} vào order bàn ${order.tableNumber} của bạn`,
        target: "tableOrder",
        targetId: order._id
      });
    }

    // Tạo notification cho admin
    await adminNotificationModel.create({
      message: `${user.fullname || user.firstname + ' ' + user.lastname} đã thêm món vào bàn ${order.tableNumber}`,
      target: "tableOrder",
    });

    const io = getIO();
    io.emit("orderUpdated", order);
    io.emit("adminnotification");
    
    // Notify owner nếu khác người thêm món
    if (order.userId.toString() !== req.userId) {
      io.to(order.userId.toString()).emit("usernotification");
    }

    return res.json({
      message: "Thêm món thành công",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi thêm món" });
  }
};

// Lấy danh sách tất cả table orders
const getAllTableOrders = async (req, res) => {
  try {
    const orders = await tableOrderModel
      .find()
      .populate("tableId")
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách orders" });
  }
};

// Lấy chi tiết order
const getTableOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await tableOrderModel
      .findById(id)
      .populate("tableId")
      .populate("userId", "firstName lastName");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy order" });
    }

    return res.json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi lấy chi tiết order" });
  }
};

// Cập nhật trạng thái món ăn
const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await tableOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy order" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    item.status = status;
    await order.save();

    const io = getIO();
    io.emit("itemStatusUpdated", { orderId, itemId, status });

    return res.json({
      message: "Cập nhật trạng thái món ăn thành công",
      order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Lỗi khi cập nhật trạng thái món ăn" });
  }
};

// Hoàn thành order và checkout
const completeTableOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, serviceCharge, discount } = req.body;

    const order = await tableOrderModel.findById(id).populate("tableId");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy order" });
    }

    // Cập nhật order
    order.orderStatus = "completed";
    order.paymentStatus = "paid";
    order.paymentMethod = paymentMethod || "cash";
    order.serviceCharge = serviceCharge || 0;
    order.discount = discount || 0;
    order.endTime = new Date();
    await order.save();

    // Cập nhật order count cho các món ăn
    for (const item of order.items) {
      await cuisineModel.findByIdAndUpdate(item.cuisineId, {
        $inc: { orderCount: item.quantity },
      });
    }

    // Cập nhật trạng thái bàn
    await tableModel.findByIdAndUpdate(order.tableId._id, {
      status: "available",
      currentOrder: null,
    });

    const io = getIO();
    io.emit("orderCompleted", order);
    io.emit("tableStatusUpdated", {
      tableId: order.tableId._id,
      status: "available",
    });

    return res.json({
      message: "Hoàn thành order thành công",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi hoàn thành order" });
  }
};

// Hủy order
const cancelTableOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await tableOrderModel.findById(id).populate("tableId");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy order" });
    }

    order.orderStatus = "cancelled";
    order.waiterNotes = reason || "";
    order.endTime = new Date();
    await order.save();

    // Cập nhật trạng thái bàn
    await tableModel.findByIdAndUpdate(order.tableId._id, {
      status: "available",
      currentOrder: null,
    });

    const io = getIO();
    io.emit("orderCancelled", order);
    io.emit("tableStatusUpdated", {
      tableId: order.tableId._id,
      status: "available",
    });

    return res.json({
      message: "Hủy order thành công",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi hủy order" });
  }
};

// Lấy orders của user
const getUserTableOrders = async (req, res) => {
  try {
    const orders = await tableOrderModel
      .find({ userId: req.userId })
      .populate("tableId")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi khi lấy orders của user" });
  }
};

// ===== TABLE BOOKING MANAGEMENT =====

// Tạo booking mới cho bàn
const createTableBooking = async (req, res) => {
    try {
        const { 
            tableId, 
            numberOfGuests,
            bookingDate,
            bookingTime,
            duration,
            specialRequests 
        } = req.body;

        // Lấy thông tin user từ authentication
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: "Người dùng không hợp lệ" });
        }

        // Kiểm tra bàn có tồn tại và available không
        const table = await tableModel.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: "Không tìm thấy bàn" });
        }

        if (table.status !== 'available') {
            return res.status(400).json({ message: "Bàn đang được sử dụng hoặc đã được đặt" });
        }

        // Tạo booking với thông tin từ user account
        const newBooking = await tableOrderModel.create({
            tableId,
            tableNumber: table.tableNumber,
            customerName: user.fullname || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Khách hàng',
            customerPhone: user.phoneNumber || null,
            customerEmail: user.email || null,
            numberOfGuests,
            bookingDate,
            bookingTime,
            duration,
            userId: req.userId,
            orderType: 'booking', // Đánh dấu đây là booking chứ không phải order
            orderStatus: 'reserved',
            specialRequests: specialRequests || null
        });

        // Cập nhật trạng thái bàn
        await tableModel.findByIdAndUpdate(tableId, {
            status: 'reserved',
            currentBooking: newBooking._id
        });        // Tạo thông báo admin
        adminNotificationModel.create({
            message: `Có đặt bàn mới cho bàn ${table.tableNumber} từ ${user.fullname || user.firstname + ' ' + user.lastname}`,
            target: "tableBooking",
        });

        const io = getIO();
        io.emit("newTableBooking", newBooking);
        io.emit("tableStatusUpdated", { tableId, status: 'reserved' });
        io.emit("adminnotification");

        res.status(201).json({
            message: "Đặt bàn thành công",
            booking: newBooking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi khi đặt bàn" });
    }
};

// Lấy bookings của user
const getUserTableBookings = async (req, res) => {
    try {
        const bookings = await tableOrderModel.find({ 
            userId: req.userId,
            orderType: 'booking'
        })
        .populate('tableId')
        .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách đặt bàn" });
    }
};

module.exports = {
  // Table management
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,

  // Table order management
  createTableOrder,
  addItemToOrder,
  getAllTableOrders,
  getTableOrderDetail,
  updateItemStatus,
  completeTableOrder,
  cancelTableOrder,
  getUserTableOrders,

  // Table booking management
  createTableBooking,
  getUserTableBookings,
};
