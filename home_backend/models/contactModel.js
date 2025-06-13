const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        message: String,
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);
const contactModel = new mongoose.model("contact", contactSchema);
module.exports = contactModel;
