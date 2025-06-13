const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userName: String,
        phone: String,
        cuisineName: String,
        promotionalPrice: Number,
        roomNo: String,
        quantity: Number,
        totalPrice: Number,
        cuisineId: { type: mongoose.Schema.Types.ObjectId, ref: "cuisine" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
        isAccept: { type: Boolean, default: false },
        isDenied: { type: Boolean, default: false },
        isDelivery: { type: Boolean, default: false },
        isCancelled: { type: Boolean, default: false },
        cover: String,
        isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);
const orderModel = new mongoose.model("order", orderSchema);
module.exports = orderModel;
