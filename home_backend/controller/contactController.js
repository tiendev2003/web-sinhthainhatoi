const contactModel = require("../models/contactModel");
const { getIO } = require("../utils/socket");

const createContact = (req, res) => {
    const io = getIO();
    try {
        contactModel.create({
            fullname: req.body.fullName,
            email: req.body.email,
            message: req.body.message,
        });
        res.send("Gửi thông tin liên hệ thành công!");
        io.emit("admincontact");
        io.emit("adminAlert", `${req.body.fullName} đã gửi một lời nhắn!`);
    } catch (error) {
        console.log(error);
    }
};
const getListContact = async (req, res) => {
    try {
        const contacts = await contactModel.find();
        res.send(contacts);
    } catch (error) {
        console.log(error);
    }
};
const getListUnread = async (req, res) => {
    try {
        const contacts = await contactModel.find({ isRead: false });
        res.send(contacts);
    } catch (error) {
        console.log(error);
    }
};
const markAllAsRead = async (req, res) => {
    const io = getIO();
    try {
        const result = await contactModel.updateMany({ isRead: false }, { $set: { isRead: true } });
        console.log("Đánh dấu tất cả các thông báo là đã đọc:", result.nModified, "thông báo đã được cập nhật");
        res.send("Đã đánh dấu tất cả là đã đọc!");
        io.emit("admincontact");
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
        res.status(500).send("Đã xảy ra lỗi khi đánh dấu thông báo là đã đọc");
    }
};
module.exports = { createContact, getListContact, getListUnread, markAllAsRead };
