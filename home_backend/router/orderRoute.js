const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/create", jsonParser, urlencodedParser, [authMiddleware.isAuthentication], orderController.createOrder);
router.get(
    "/list",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    orderController.getListOrder
);
router.get("/user", jsonParser, urlencodedParser, [authMiddleware.isAuthentication], orderController.getUserOrder);
router.put(
    "/accept/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    orderController.acceptOrder
);
router.put(
    "/deny/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    orderController.denyOrder
);
router.put(
    "/deliveried/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    orderController.deliveriedOrder
);
router.put(
    "/cancelled/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    orderController.cancelOrder
);
router.get(
    "/viaBooking/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    orderController.getOrderViaBooking
);
router.get(
    "/detail/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    orderController.getOrderDetail
);

module.exports = router;
