const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardController");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/revenue", jsonParser, urlencodedParser, dashboardController.getRevenue);
module.exports = router;
