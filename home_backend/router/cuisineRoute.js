const express = require("express");
const router = express.Router();
const cuisineController = require("../controller/cuisineController");

const multer = require("multer");

const DIR = "upload/cuisine/";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = "cuisines" + "_" + Date.now().toString() + "_" + file.originalname.toLowerCase().split(" ");
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
    cuisineController.createCuisine
);
router.get("/list", cuisineController.getListCusines);
router.get("/food", cuisineController.getListFood);
router.get("/drink", cuisineController.getListDrink);

router.get("/detail/:id", cuisineController.getCuisineDetail);
upload.array("images", 16),
    router.put(
        "/update/:id",
        jsonParser,
        urlencodedParser,
        [authMiddleware.isAuthentication, authMiddleware.isAdmin],
        upload.array("images", 16),
        cuisineController.updateCuisine
    );
router.delete(
    "/delete/:id",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    cuisineController.deleteCuisine
);

module.exports = router;
