const mongoose = require("mongoose");
const gallerySchema = new mongoose.Schema({
    images: [String],
});
const galleryModel = new mongoose.model("gallery", gallerySchema);
module.exports = galleryModel;
