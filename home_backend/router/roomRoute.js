const express = require("express");
const router = express.Router();
const roomController = require("../controller/roomController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const DIR = "upload/room/";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = "rooms" + "_" + Date.now().toString() + "_" + file.originalname.toLowerCase().split(" ");
        cb(null, fileName);
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/webp"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg .webp format allowed!"));
        }
    },
});

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post(
    "/create",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    upload.array("images", 16),
    roomController.createRoom
);

router.get("/list", roomController.getRoomList);
router.get("/single", roomController.getRoomSingle);
router.get("/double", roomController.getRoomDouble);
router.get("/vip", roomController.getRoomVip);

router.get("/:id", roomController.getRoomDetail);
router.put(
    "/edit/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    upload.array("images", 16),
    roomController.editRoom
);
router.delete(
    "/delete/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    roomController.deleteRoom
);

module.exports = router;
