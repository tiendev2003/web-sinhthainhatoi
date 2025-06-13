const express = require("express");
const router = express.Router();
const adminNotificationController = require("../controller/adminNotificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
    "/list",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    adminNotificationController.getListOfNotifications
);
router.get(
    "/unread",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    adminNotificationController.getListOfUnreadNotifications
);
router.put(
    "/mark-as-read/:id",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    adminNotificationController.MarkAsRead
);
router.delete(
    "/delete/:id",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    adminNotificationController.deleteNotification
);
router.put(
    "/mark-all-as-read",
    [authMiddleware.isAuthentication, authMiddleware.isAdmin],
    adminNotificationController.markAllAsRead
);
module.exports = router;
