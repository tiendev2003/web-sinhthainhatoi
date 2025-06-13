const express = require("express");
const router = express.Router();
const userNotificationController = require("../controller/userNotificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/list", [authMiddleware.isAuthentication], userNotificationController.getListOfNotifications);
router.get("/unread", [authMiddleware.isAuthentication], userNotificationController.getListOfUnreadNotifications);
router.put("/mark-as-read/:id", [authMiddleware.isAuthentication], userNotificationController.MarkAsRead);
router.delete("/delete/:id", [authMiddleware.isAuthentication], userNotificationController.deleteNotification);
router.put("/mark-all-as-read",[authMiddleware.isAuthentication],userNotificationController.markAllAsRead)
module.exports = router;
