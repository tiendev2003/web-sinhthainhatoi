const mongoose = require("mongoose");
const userNotificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        message: String,
        isRead: { type: Boolean, default: false },
        image: String,
    },
    { timestamps: true }
);
const userNotificationModel = new mongoose.model("userNotification", userNotificationSchema);
module.exports = userNotificationModel;
