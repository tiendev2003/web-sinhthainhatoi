const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post(
    "/create",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.createBooking
);
router.get("/list", bookingController.getListBookings);
router.put(
    "/checkout/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    bookingController.checkOutBookings
);
router.put(
    "/cancelled/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.cancelledBooking
);
router.put(
    "/delivery/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.roomDelivery
);
router.get(
    "/user/",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.getUserListBooking
);
router.get(
    "/current/",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.getCurrentBooking
);
router.get(
    "/detail/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    bookingController.getBookingDetail
);

module.exports = router;
