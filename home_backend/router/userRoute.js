const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/user", [authMiddleware.isAuthentication], userController.getListUsers);

router.delete(
    "/user/delete/:userId",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    userController.deleteUser
);

router.put(
    "/user/update/:userId",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    userController.updateUser
);
router.put(
    "/user/update",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    userController.userUpdateInfo
);
router.put(
    "/user/passwordchange",
    jsonParser,
    urlencodedParser,
    [authMiddleware.isAuthentication],
    userController.userChangePassword
);

module.exports = router;
