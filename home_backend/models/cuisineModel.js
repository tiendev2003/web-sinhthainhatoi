const mongoose = require("mongoose");

const cuisineSchema = new mongoose.Schema({
    type: String,
    title: String,
    images: [String],
    listedPrice: Number,
    promotionalPrice: Number,
    description: String,
    summary: String,
    tags: [String],
    orderCount: Number,
});
const cuisineModel = new mongoose.model("cuisine", cuisineSchema);
module.exports = cuisineModel;
