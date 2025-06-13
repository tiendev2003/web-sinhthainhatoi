const userModel = require("../models/userModel");
const userNotificationModel = require("../models/userNotificationModel");
const { getIO } = require("../utils/socket");
// Get list of all notification belong to userId
const getListOfNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await userNotificationModel.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).send(notifications);
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).send("Đã xảy ra lỗi trong quá trình truy vấn thông báo.");
    }
};

const getListOfUnreadNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await userNotificationModel
            .find({ userId: userId, isRead: false })
            .sort({ createdAt: -1 });
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send("Đã xảy ra lỗi trong quá trình truy vấn thông báo.");
    }
};

const MarkAsRead = async (req, res) => {
    const notificationId = req.params.id;
    const notification = await userNotificationModel.findById(notificationId);
    const userId = notification.userId;
    const user = await userModel.findById(userId);
    await userNotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("notification");
    res.send("Đã đánh dấu thông báo là đã đọc!");
};

const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    const notification = await userNotificationModel.findById(notificationId);
    const userId = notification.userId;
    const user = await userModel.findById(userId);
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("notification");
    await userNotificationModel.findByIdAndRemove(notificationId);
    res.send("Đã xóa thông báo thành công!");
};

const markAllAsRead = async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    try {
        const result = await userNotificationModel.updateMany({ userId: userId }, { $set: { isRead: true } });
        console.log("Marked all notifications as read:", result.nModified, "notifications updated");
    } catch (error) {
        console.error("Error marking notifications as read:", error);
    }
    const user = await userModel.findById(userId);
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit("notification");
    res.send("Đã đánh dấu tất cả là đã đọc! ");
};

module.exports = {
    getListOfNotifications,
    getListOfUnreadNotifications,
    MarkAsRead,
    deleteNotification,
    markAllAsRead,
};
