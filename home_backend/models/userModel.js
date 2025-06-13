const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: String,
    verified: { type: Boolean, default: false },
    socketId: { type: String, default: null },
});

// Compiler
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
