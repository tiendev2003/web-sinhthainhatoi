const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
    {
        fullname: String,
        phone: String,
        receiveDate: Date,
        checkoutDate: Date,
        roomQuantity: Number,
        roomNo: [String],
        roomPrice: Number,
        roomCoverImage: String,
        summaryPrice: Number,
        roomTitle: String,
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        isCheckedOut: Boolean,
        isCancelled: Boolean,
        isReceived: Boolean,
        isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);
const bookingModel = new mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
