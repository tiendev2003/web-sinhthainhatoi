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
const tableRoute = require("./router/tableRoute");
const connectDb = require("./services/connectDBService");
const cors = require("cors");
// morrgan
const morgan = require("morgan");

const app = express();

require("dotenv").config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log requests to the console
// connect to DB
connectDb();

//cors
app.use(cors({
    origin: ["http://localhost:3000", process.env.BASE_URL, "*"].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

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
app.use("/api/table", tableRoute);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
 
const httpServer = require("http").createServer(app);
const io = socketSetup.init(httpServer);

httpServer.listen(process.env.PORT,'0.0.0.0', () => {
    console.log(`Server đã khởi động trên cổng ${process.env.PORT}`);
});
