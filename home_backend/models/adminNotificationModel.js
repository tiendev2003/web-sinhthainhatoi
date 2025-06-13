const mongoose = require("mongoose");
const adminNotificationSchema = new mongoose.Schema(
    {
        message: String,
        isRead: { type: Boolean, default: false },
        image: String,
        target: String,
    },
    { timestamps: true }
);
const adminNotificationModel = new mongoose.model("adminNotification", adminNotificationSchema);
module.exports = adminNotificationModel;
