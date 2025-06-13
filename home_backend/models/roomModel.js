const mongoose = require("mongoose");

const roomStatusSchema = new mongoose.Schema({
    roomNo: { type: "String", unique: true },
    bookedDate: [String],
    _id: { type: "String", unique: true },
});

const roomSchema = new mongoose.Schema({
    roomStatus: [roomStatusSchema],
    title: { type: "String", unique: true },
    roomType: String,
    services: [String],
    adults: Number,
    children: Number,
    area: Number,
    price: Number,
    cover: String,
    images: [String],
    description: String,
    bookingCount: Number,
});

const roomModel = mongoose.model("room", roomSchema);
module.exports = roomModel;
