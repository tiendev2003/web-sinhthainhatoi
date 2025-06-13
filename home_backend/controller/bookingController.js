const bookingModel = require("../models/bookingModel");
const roomModel = require("../models/roomModel");
const userModel = require("../models/userModel");
const userNotificationModel = require("../models/userNotificationModel");
const moment = require("moment-timezone");
const { getIO } = require("../utils/socket");
const adminNotificationModel = require("../models/adminNotificationModel");

function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
        dates.push(moment(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

const createBooking = async (req, res) => {
    const roomId = req.body.roomId;
    room = await roomModel.findById(roomId);

    try {
        const newBooking = await bookingModel.create({
            fullname: req.body.fullname,
            phone: req.body.phone,
            receiveDate: req.body.receiveDate,
            checkoutDate: req.body.checkoutDate,
            roomNo: req.body.roomNo,
            roomPrice: req.body.roomPrice,
            roomCoverImage: room.cover,
            summaryPrice: req.body.summaryPrice,
            roomId: roomId,
            roomTitle: room.title,
            userId: req.userId,
            isCheckedOut: false,
            isCancelled: false,
            isReceived: false,
        });

        const oldRoom = await roomModel.findById(roomId);

        let oldRoomStatus = oldRoom.roomStatus;
        const index = oldRoomStatus.findIndex((x) => x._id === req.body.roomNo[0]);
        oldRoomStatus[index].bookedDate = oldRoomStatus[index].bookedDate.concat(
            getDatesInRange(new Date(req.body.receiveDate.toString()), new Date(req.body.checkoutDate.toString()))
        );

        await roomModel.findByIdAndUpdate(roomId, { roomStatus: oldRoomStatus }, { new: true });

        userNotificationModel.create({
            userId: req.userId,
            message: `Bạn đã gửi yêu cầu đặt ${room.title} số ${req.body.roomNo.toString()} thành công!`,
            image: room.cover,
        });

        const user = await userModel.findOne({ _id: req.userId });

        adminNotificationModel.create({
            message: `${user.lastName} ${user.firstName} đã gửi yêu cầu đặt ${
                room.title
            } số ${req.body.roomNo.toString()}!`,
            image: room.cover,
            target: "booking",
        });

        const socketId = user.socketId;
        const io = getIO(); // Lấy đối tượng io
        io.to(socketId).emit("notification");
        io.emit("adminnotification");
        io.emit(
            "adminAlert",
            `${user.lastName} ${user.firstName} đã gửi yêu cầu đặt ${room.title} số ${req.body.roomNo.toString()}!`
        );
        io.emit("updatedeatail");
        return res.status(200).send("booking successfully!");
    } catch (error) {
        console.log(error);
    }
};

const getListBookings = async (req, res) => {
    try {
        const response = await bookingModel.find().sort({ createdAt: -1 });
        res.send(response);
    } catch (error) {
        console.log(error);
    }
};
const checkOutBookings = async (req, res) => {
    const bookingId = req.params.id;
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        return res.status(404).send("Booking not found");
    }

    await bookingModel.findByIdAndUpdate(bookingId, { isCheckedOut: true }, { isPaid: true }, { new: true });

    const roomId = booking.roomId;
    const roomNo = booking.roomNo;

    const room = await roomModel.findById(roomId);
    const roomStatus = room.roomStatus;

    const receiveDate = booking.receiveDate;
    const checkoutDate = booking.checkoutDate;
    const bookedDates = getDatesInRange(new Date(receiveDate), new Date(checkoutDate));

    const updatedRoomStatus = roomStatus.map((status) => {
        if (status.roomNo && status.bookedDate && roomNo.includes(status.roomNo)) {
            const newBookedDate = status.bookedDate.filter((date) => !bookedDates.includes(date));
            return {
                roomNo: status.roomNo,
                bookedDate: newBookedDate,
                _id: status.roomNo,
            };
        } else {
            return status;
        }
    });

    const bookingCount = room.bookingCount;
    const newBookingCount = bookingCount + roomNo.length;

    await roomModel.findByIdAndUpdate(
        roomId,
        { roomStatus: updatedRoomStatus, bookingCount: newBookingCount },
        { new: true }
    );
    userNotificationModel.create({
        userId: booking.userId,
        image: room.cover,
        message: `Bạn đã trả ${room.title} số ${booking.roomNo.toString()} thành công!`,
    });
    const user = await userModel.findOne({ _id: booking.userId });
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit(
        "checkoutSuccessfully",
        `Bạn đã trả ${room.title} số ${booking.roomNo.toString()} thành công!`
    );
    io.to(socketId).emit("notification");

    res.send("Trả phòng thành công!");
};

const getUserListBooking = async (req, res) => {
    const userId = req.userId;
    const userBooking = await bookingModel.find({ userId: userId }).sort({ createdAt: -1 });
    res.send(userBooking);
};
const cancelledBooking = async (req, res) => {
    const bookingId = req.params.id;
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        return res.status(404).send("Booking not found");
    }

    await bookingModel.findByIdAndUpdate(bookingId, { isCancelled: true });

    const roomId = booking.roomId;
    const receiveDate = booking.receiveDate;
    const checkoutDate = booking.checkoutDate;

    // Get an array of booked dates between receiveDate and checkoutDate
    const bookedDates = getDatesInRange(new Date(receiveDate), new Date(checkoutDate));

    const room = await roomModel.findById(roomId);
    const roomStatus = room.roomStatus;

    const updatedRoomStatus = roomStatus.map((status) => {
        if (status.roomNo && status.bookedDate && booking.roomNo.includes(status.roomNo)) {
            const newBookedDate = status.bookedDate.filter((date) => !bookedDates.includes(date));
            return {
                roomNo: status.roomNo,
                bookedDate: newBookedDate,
                _id: status.roomNo,
            };
        } else {
            return status;
        }
    });
    const user = await userModel.findById(booking.userId);
    await roomModel.findByIdAndUpdate(roomId, { roomStatus: updatedRoomStatus }, { new: true });
    userNotificationModel.create({
        userId: booking.userId,
        image: room.cover,
        message: `Bạn đã hủy yêu cầu đặt ${room.title} số ${booking.roomNo.toString()} thành công!`,
    });
    adminNotificationModel.create({
        message: `${user.lastName} ${user.firstName} đã hủy yêu cầu đặt ${room.title} số ${booking.roomNo.toString()}!`,
        image: room.cover,
        target: "booking",
    });
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.emit(
        "adminAlert",
        `${user.lastName} ${user.firstName} đã hủy yêu cầu đặt ${room.title} số ${booking.roomNo.toString()}!`
    );
    io.to(socketId).emit(
        "cancelSuccessfully",
        `Bạn đã hủy yêu cầu đặt ${room.title} số ${booking.roomNo.toString()} thành công!`
    );
    io.to(socketId).emit("notification");
    io.emit("adminnotification");

    io.to(socketId).emit("updateuserbooking");
    io.emit("updatedeatail");
    res.send("Hủy đặt phòng thành công!");
};

const roomDelivery = async (req, res) => {
    const bookingId = req.params.id;
    const booking = await bookingModel.findById(bookingId);
    const room = await roomModel.findById(booking.roomId);
    await bookingModel.findByIdAndUpdate(bookingId, { isReceived: true });
    userNotificationModel.create({
        userId: booking.userId,
        image: room.cover,
        message: `Bạn đã nhận ${room.title} số ${booking.roomNo.toString()} thành công!`,
    });
    const user = await userModel.findOne({ _id: booking.userId });
    const socketId = user.socketId;
    const io = getIO(); // Lấy đối tượng io
    io.to(socketId).emit(
        "deliverySuccessfully",
        `Bạn đã nhận ${room.title} số ${booking.roomNo.toString()} thành công!`
    );
    io.to(socketId).emit("notification");
    io.emit("updateuserbooking");
    res.send("Giao phòng thành công!");
};
const getBookingDetail = async (req, res) => {
    const id = req.params.id;
    const response = await bookingModel.findById(id);
    res.send(response);
};

const getCurrentBooking = async (req, res) => {
    const currentBooking = await bookingModel.find({ isReceived: true, isCheckedOut: false });
    res.send(currentBooking);
};

module.exports = {
    createBooking,
    getListBookings,
    checkOutBookings,
    getListBookings,
    getUserListBooking,
    cancelledBooking,
    roomDelivery,
    getBookingDetail,
    getCurrentBooking,
};
