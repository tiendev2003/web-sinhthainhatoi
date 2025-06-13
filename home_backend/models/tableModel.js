const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    tableNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tableName: { 
        type: String, 
        required: true 
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    area: {
        type: String,
        enum: ['indoor', 'outdoor', 'vip', 'garden'],
        default: 'indoor'
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available'
    },
    currentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tableOrder',        default: null
    },
    currentBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tableOrder',
        default: null
    },
    description: String,
    pricePerHour: {
        type: Number,
        default: 0
    },
    amenities: [String], // Wifi, TV, View, etc.
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

const tableModel = mongoose.model("table", tableSchema);
module.exports = tableModel;
