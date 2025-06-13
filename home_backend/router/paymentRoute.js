const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const PaymentController = require("../controller/vnpayController");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/create_payment_url", jsonParser, urlencodedParser, PaymentController.createPaymentUrl);
router.get("/vnpay_ipn", jsonParser, urlencodedParser, PaymentController.paymentIPN);
module.exports = router;
