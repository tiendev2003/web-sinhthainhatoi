const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", jsonParser, urlencodedParser, searchController.getSearch);
module.exports = router;
