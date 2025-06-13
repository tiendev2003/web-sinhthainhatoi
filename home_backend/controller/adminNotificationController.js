const adminNotificationModel = require("../models/adminNotificationModel");
const userModel = require("../models/userModel");

const { getIO } = require("../utils/socket");
// Get list of all notification belong to userId
const getListOfNotifications = async (req, res) => {
    try {
        const notifications = await adminNotificationModel.find().sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất đến cũ nhất

        res.status(200).send(notifications);
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).send("Đã xảy ra lỗi trong quá trình truy vấn thông báo.");
    }
};

const getListOfUnreadNotifications = async (req, res) => {
    try {
        const notifications = await adminNotificationModel.find({ isRead: false }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất đến cũ nhất

        res.status(200).send(notifications);
    } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).send("Đã xảy ra lỗi trong quá trình truy vấn thông báo.");
    }
};

const MarkAsRead = async (req, res) => {
    console.log("mark as read");
    const notificationId = req.params.id;
    await adminNotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    const io = getIO(); // Lấy đối tượng io
    io.emit("adminnotification");
    res.send("Đã đánh dấu thông báo là đã đọc!");
};

const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    const io = getIO(); // Lấy đối tượng io
    io.emit("adminnotification");
    await adminNotificationModel.findByIdAndRemove(notificationId);
    res.send("Đã xóa thông báo thành công!");
};

const markAllAsRead = async (req, res) => {
    try {
        const result = await adminNotificationModel.updateMany(
            { isRead: false }, // Truy vấn tất cả các thông báo chưa đọc
            { $set: { isRead: true } } // Đánh dấu chúng là đã đọc
        );

        console.log("Marked all admin notifications as read:", result.nModified, "notifications updated");
    } catch (error) {
        console.error("Error marking notifications as read:", error);
    }

    const io = getIO(); // Lấy đối tượng io
    io.emit("adminnotification");
    res.send("Đã đánh dấu tất cả là đã đọc!");
};

module.exports = {
    getListOfNotifications,
    getListOfUnreadNotifications,
    MarkAsRead,
    deleteNotification,
    markAllAsRead,
};
