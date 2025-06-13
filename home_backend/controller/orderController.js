const adminNotificationModel = require("../models/adminNotificationModel");
const cuisineModel = require("../models/cuisineModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const userNotificationModel = require("../models/userNotificationModel");
const { getIO } = require("../utils/socket");

const createOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        const cuisine = await cuisineModel.findById(req.body.cuisineId);        const newOrder = await orderModel.create({
            userName: user.lastName + " " + user.firstName,
            phone: user.phone,
            cuisineName: req.body.cuisineName,
            totalPrice: req.body.totalPrice,
            promotionalPrice: req.body.promotionalPrice,
            quantity: req.body.quantity,
            cuisineId: req.body.cuisineId,
            roomNo: req.body.roomNo,
            userId: req.userId,
            isAccept: false,
            isDelivery: false,
            isCancelled: false,
            cover: cuisine.images[0],
            bookingId: req.body.bookingId,
        });
        userNotificationModel.create({
            userId: req.userId,
            message: `Bạn đã gửi yêu cầu đặt ${req.body.cuisineName} thành công!`,
            image: cuisine.images[0],
        });
        adminNotificationModel.create({
            message: `${user.lastName} ${user.firstName} đã yêu cầu đặt ${req.body.cuisineName}.`,
            image: cuisine.images[0],
            target: "order",
        });
        const socketId = user.socketId;        const io = getIO(); // Lấy đối tượng io
        
        // Emit socket events cho real-time updates
        io.to(socketId).emit("notification"); // Thông báo cho user
        io.emit("adminAlert", `${user.lastName} ${user.firstName} đã yêu cầu đặt ${req.body.cuisineName}.`);        io.emit("adminnotification"); // Thông báo cho admin
        io.emit("newOrder", { // Event mới cho admin dashboard
            orderId: newOrder._id,
            customerName: `${user.lastName} ${user.firstName}`,
            cuisineName: req.body.cuisineName,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice,
            roomNo: req.body.roomNo
        });
        io.emit("updateadminorder"); // Sửa lỗi dấu cách thừa
        res.send("order success");
    } catch (error) {
        console.log(error);
    }
};
const getListOrder = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: "desc" });
        res.send(orders);
    } catch (error) {
        console.log(error);
    }
};

const getOrderViaBooking = async (req, res) => {
    try {
        const orders = await orderModel.find({ bookingId: req.params.id }).sort({ createdAt: "desc" });
        res.send(orders);
    } catch (error) {
        console.log(error);
    }
};

const getUserOrder = async (req, res) => {
    const userOrder = await orderModel.find({ userId: req.userId }).sort({ createdAt: "desc" });
    res.send(userOrder);
};

const acceptOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        
        await orderModel.findByIdAndUpdate(orderId, { isAccept: true }, { new: true });
        userNotificationModel.create({
            userId: order.userId,
            message: `Nhân viên đã chấp nhận yêu cầu đặt ${order.cuisineName} của bạn!`,
            image: order.cover,
        });
        const user = await userModel.findById(order.userId);
        const socketId = user.socketId;
        console.log(socketId);        const io = getIO(); // Lấy đối tượng io
        io.to(socketId).emit("acceptOrder", `Nhân viên đã chấp nhận yêu cầu đặt ${order.cuisineName} của bạn!`);
        io.to(socketId).emit("notification");
        io.to(socketId).emit("updateuserorder");
        
        // Emit để admin dashboard cập nhật
        io.emit("orderAccepted", {
            orderId: order._id,
            customerName: order.userName,
            cuisineName: order.cuisineName
        });
        io.emit("updateadminorder");
        res.send("chấp nhận thành công");
    } catch (error) {
        console.log("Lỗi khi chấp nhận đơn hàng:", error);
        res.status(500).send("Lỗi server khi chấp nhận đơn hàng");
    }
};

const denyOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        
        await orderModel.findByIdAndUpdate(orderId, { isDenied: true }, { new: true });
        userNotificationModel.create({
            userId: order.userId,
            message: `Nhân viên đã từ chối yêu cầu đặt ${order.cuisineName} của bạn!`,
            image: order.cover,
        });
        const user = await userModel.findById(order.userId);
        const socketId = user.socketId;
        console.log(socketId);        const io = getIO(); // Lấy đối tượng io
        io.to(socketId).emit("denyOrder", `Nhân viên đã từ chối yêu cầu đặt ${order.cuisineName} của bạn!`);
        io.to(socketId).emit("notification");
        io.to(socketId).emit("updateuserorder");
        
        // Emit để admin dashboard cập nhật
        io.emit("orderDenied", {
            orderId: order._id,
            customerName: order.userName,
            cuisineName: order.cuisineName
        });
        io.emit("updateadminorder");
        res.send("Từ chối order thành công!");
    } catch (error) {
        console.log("Lỗi khi từ chối đơn hàng:", error);
        res.status(500).send("Lỗi server khi từ chối đơn hàng");
    }
};

const deliveriedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).send("Không tìm thấy đơn hàng");
        }
        
        const quantity = Number(order.quantity) || 0;
        const cusineId = order.cuisineId;
        const cuisine = await cuisineModel.findById(cusineId);
        
        if (!cuisine) {
            return res.status(404).send("Không tìm thấy món ăn");
        }
        
        const oldOrderCount = Number(cuisine.orderCount) || 0;
        const newOrderCount = oldOrderCount + quantity;
        
        await cuisineModel.findByIdAndUpdate(cusineId, { orderCount: newOrderCount }, { new: true });
        await orderModel.findByIdAndUpdate(orderId, { isDelivery: true, isPaid: true }, { new: true });
        
        const user = await userModel.findById(order.userId);

        userNotificationModel.create({
            userId: order.userId,
            message: `${order.cuisineName} của bạn đã được giao thành công!`,
            image: order.cover,
        });
        
        const socketId = user.socketId;
        console.log(socketId);        const io = getIO(); // Lấy đối tượng io
        io.to(socketId).emit("deliveryOrder", `${order.cuisineName} của bạn đã được giao thành công!`);
        io.to(socketId).emit("notification");
        io.to(socketId).emit("updateuserorder");
        
        // Emit để admin dashboard cập nhật
        io.emit("orderDelivered", {
            orderId: order._id,
            customerName: order.userName,
            cuisineName: order.cuisineName
        });
        io.emit("updateadminorder");
        res.send("xác nhận đã giao thành công");
    } catch (error) {
        console.log("Lỗi khi giao hàng:", error);
        res.status(500).send("Lỗi server khi xử lý giao hàng");
    }
};
const cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    await orderModel.findByIdAndUpdate(orderId, { isCancelled: true }, { new: true });
    res.send("xác nhận hủy thành công");
    const user = await userModel.findById(order.userId);
    adminNotificationModel.create({
        message: `${user.lastName} ${user.firstName} đã hủy yêu cầu đặt ${order.cuisineName}.`,
        image: order.cover,
        target: "order",
    });    const io = getIO();
    io.emit("adminnotification");
    io.emit("adminAlert", `${user.lastName} ${user.firstName} đã hủy yêu cầu đặt ${order.cuisineName}.`);
    io.emit("orderCancelled", {
        orderId: order._id,
        customerName: `${user.lastName} ${user.firstName}`,
        cuisineName: order.cuisineName
    });
    io.emit("updateadminorder");
};
const getOrderDetail = async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    res.send(order);
};
module.exports = {
    createOrder,
    getListOrder,
    getUserOrder,
    acceptOrder,
    denyOrder,
    deliveriedOrder,
    cancelOrder,
    getOrderViaBooking,
    getOrderDetail,
};
