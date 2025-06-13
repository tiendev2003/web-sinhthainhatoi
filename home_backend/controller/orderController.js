const adminNotificationModel = require("../models/adminNotificationModel");
const cuisineModel = require("../models/cuisineModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const userNotificationModel = require("../models/userNotificationModel");
const { getIO } = require("../utils/socket");

const createOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        const cuisine = await cuisineModel.findById(req.body.cuisineId);
        orderModel.create({
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
        const socketId = user.socketId;

        const io = getIO(); // Lấy đối tượng io
        io.to(socketId).emit("notification");
        io.emit("adminAlert", `${user.lastName} ${user.firstName} đã yêu cầu đặt ${req.body.cuisineName}.`);
        io.emit("adminnotification");
        io.emit("updateadminorder ");
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
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    await orderModel.findByIdAndUpdate(orderId, { isAccept: true }, { new: true });
    userNotificationModel.create({
        userId: order.userId,
        message: `Nhân viên đã chấp nhận yêu cầu đặt ${order.cuisineName} của bạn!`,
        image: order.cover,
    });
    const user = await userModel.findById(order.userId);
    const socketId = user.socketId;
    console.log(socketId);
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("acceptOrder", `Nhân viên đã chấp nhận yêu cầu đặt ${order.cuisineName} của bạn!`);
    io.to(socketId).emit("notification");
    io.to(socketId).emit("updateuserorder");
    res.send("chấp nhận thành công");
};

const denyOrder = async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    await orderModel.findByIdAndUpdate(orderId, { isDenied: true }, { new: true });
    userNotificationModel.create({
        userId: order.userId,
        message: `Nhân viên đã từ chối yêu cầu đặt ${order.cuisineName} của bạn!`,
        image: order.cover,
    });
    const user = await userModel.findById(order.userId);
    const socketId = user.socketId;
    console.log(socketId);
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("denyOrder", `Nhân viên đã từ chối yêu cầu đặt ${order.cuisineName} của bạn!`);
    io.to(socketId).emit("notification");
    io.to(socketId).emit("updateuserorder");
    res.send("Từ chối order thành công!");
};

const deliveriedOrder = async (req, res) => {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    const quantity = order.quantity;
    const cusineId = order.cuisineId;
    const cuisine = await cuisineModel.findById(cusineId);
    const oldOrderCount = cuisine.orderCount;
    const newOrderCount = oldOrderCount + quantity;
    await cuisineModel.findByIdAndUpdate(cusineId, { orderCount: newOrderCount }, { new: true });
    await orderModel.findByIdAndUpdate(orderId, { isDelivery: true }, { isPaid: true }, { new: true });
    const user = await userModel.findById(order.userId);

    userNotificationModel.create({
        userId: order.userId,
        message: `${order.cuisineName} của bạn đã được giao thành công!`,
        image: order.cover,
    });
    const socketId = user.socketId;
    console.log(socketId);
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("deliveryOrder", `${order.cuisineName} của bạn đã được giao thành công!`);
    io.to(socketId).emit("notification");
    io.to(socketId).emit("updateuserorder");
    res.send("xác nhận đã giao thành công");
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
    });
    const io = getIO();
    io.emit("adminnotification");
    io.emit("adminAlert", `${user.lastName} ${user.firstName} đã hủy yêu cầu đặt ${order.cuisineName}.`);
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
