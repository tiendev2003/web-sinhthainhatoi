const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        amount: Number,
        txnRef: String,
        targetType: String, // "order" hoặc "booking"
        targetObjectId: mongoose.Schema.Types.ObjectId, // ID của order hoặc booking
    },
    { timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);
module.exports = paymentModel;
