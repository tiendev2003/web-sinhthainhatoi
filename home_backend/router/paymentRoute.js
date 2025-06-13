const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const PaymentController = require("../controller/vnpayController");
const paymentModel = require("../models/paymentModel");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/create_payment_url", jsonParser, urlencodedParser, PaymentController.createPaymentUrl);
router.get("/vnpay_ipn", jsonParser, urlencodedParser, PaymentController.paymentIPN);

// Endpoint để lấy thông tin payment
router.get("/info/:txnRef", async (req, res) => {
    try {
        const payment = await paymentModel.findOne({ txnRef: req.params.txnRef });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching payment info" });
    }
});

module.exports = router;
