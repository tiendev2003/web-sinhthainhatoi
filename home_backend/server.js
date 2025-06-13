const express = require("express");
const socketSetup = require("./utils/socket");
const userRoute = require("./router/userRoute");
const roomRoute = require("./router/roomRoute");
const authRoute = require("./router/authRoute");
const cuisineRoute = require("./router/cuisineRoute");
const searchRoute = require("./router/searchRoute");
const bookingRoute = require("./router/bookingRoute");
const orderRoute = require("./router/orderRoute");
const contactRoute = require("./router/contactRoute");
const galleryRoute = require("./router/galleryRoute");
const dashboardRoute = require("./router/dashboardRoute");
const userNotificationRoute = require("./router/userNotificationRoute");
const adminNotificationRoute = require("./router/adminNotificationRoute");
const paymentRoute = require("./router/paymentRoute");
const connectDb = require("./services/connectDBService");
const cors = require("cors");

const app = express();

require("dotenv").config();

// connect to DB
connectDb();

//cors
app.use(cors());

app.use("/upload", express.static("upload"));

app.use("/auth/admin", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);
app.use("/api/cuisine", cuisineRoute);
app.use("/search", searchRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/order", orderRoute);
app.use("/api/contact", contactRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/userNotification", userNotificationRoute);
app.use("/api/adminNotification", adminNotificationRoute);
app.use("/api/payment", paymentRoute);

const httpServer = require("http").createServer(app);
const io = socketSetup.init(httpServer);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server đã khởi động trên cổng ${process.env.PORT}`);
});
