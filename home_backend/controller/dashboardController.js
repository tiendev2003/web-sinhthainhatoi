const bookingModel = require("../models/bookingModel");
const orderModel = require("../models/orderModel");

const getRevenue = async (req, res) => {
    try {
        const [bookings, orders] = await Promise.all([
            bookingModel.find({ isCheckedOut: true }),
            orderModel.find({ isDelivery: true }),
        ]);

        const bookingRevenue = bookings.reduce((total, booking) => total + booking.summaryPrice, 0);
        const orderRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);
        const totalRevenue = bookingRevenue + orderRevenue;

        const today = new Date().toLocaleDateString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });

        const todayOrder = orders.filter(order => order.updatedAt.toLocaleDateString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }) === today);
        const todayBooking = bookings.filter(booking => booking.updatedAt.toLocaleDateString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }) === today);
        
        const todayBookingRevenue = todayBooking.reduce((total, booking) => total + booking.summaryPrice, 0);
        const todayOrderRevenue = todayOrder.reduce((total, order) => total + order.totalPrice, 0);
        
        const todayOrderCount = todayOrder.length;
        const todayBookingCount = todayBooking.length;
        const totalBookingCount = bookings.length;
        const totalOrderCount = orders.length;
        const todayRevenue = todayOrderRevenue + todayBookingRevenue;

        const response = {
            orderRevenue,
            bookingRevenue,
            totalRevenue,
            todayOrderCount,
            todayBookingCount,
            todayBookingRevenue,
            todayOrderRevenue,
            totalBookingCount,
            totalOrderCount,
            todayRevenue,
        };

        res.status(200).send(response);
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getRevenue };
