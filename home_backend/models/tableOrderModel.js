const mongoose = require("mongoose");

// Schema cho từng món trong order
const orderItemSchema = new mongoose.Schema({
  cuisineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cuisine",
    required: true,
  },
  cuisineName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  specialInstructions: String,
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "served"],
    default: "pending",
  },
  cover: String,
});

// Schema chính cho table order
const tableOrderSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "table",
      required: true,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: false, // Không bắt buộc vì user có thể chưa có SĐT trong profile
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceCharge: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "vnpay", "transfer"],
      default: "cash",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    specialRequests: String,
    waiterNotes: String,

    // Thông tin booking (chỉ dùng khi orderType = 'booking')
    orderType: {
      type: String,
      enum: ["order", "booking"],
      default: "order",
    },
    numberOfGuests: Number,
    bookingDate: Date,
    bookingTime: String,
    duration: Number, // số giờ
    customerEmail: String,
  },
  {
    timestamps: true,
  }
);

// Middleware để tính tổng tiền trước khi save
tableOrderSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotal + this.serviceCharge - this.discount;
  next();
});

const tableOrderModel = mongoose.model("tableOrder", tableOrderSchema);
module.exports = tableOrderModel;
