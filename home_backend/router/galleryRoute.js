const express = require("express");
const router = express.Router();
const galleryController = require("../controller/galleryController");

const multer = require("multer");

const DIR = "upload/gallery/";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = "image" + "_" + Date.now().toString() + "_" + file.originalname.toLowerCase().split(" ");
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

const authMiddleware = require("../middleware/authMiddleware");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post(
    "/create",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    upload.array("images", 16),
    galleryController.createGallery
);
router.get("/list", galleryController.getListImages);
router.put(
    "/delete",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    galleryController.deleteImages
);
module.exports = router;
