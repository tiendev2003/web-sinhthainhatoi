const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/create", jsonParser, urlencodedParser, contactController.createContact);
router.put("/mark-all-as-read", jsonParser, urlencodedParser, contactController.markAllAsRead);
router.get("/list", jsonParser, urlencodedParser, contactController.getListContact);
router.get("/unread", jsonParser, urlencodedParser, contactController.getListUnread);
module.exports = router;
