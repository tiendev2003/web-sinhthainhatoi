const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const tableController = require("../controller/tableController");

const router = express.Router();

// ===== TABLE MANAGEMENT ROUTES =====
// Public routes
router.get("/tables", tableController.getAllTables);

// Admin routes (cần authentication)
router.post("/tables",    [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.createTable);
router.put("/tables/:id", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.updateTable);
router.delete("/tables/:id", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.deleteTable);
router.patch("/tables/:id/status", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.updateTableStatus);

// ===== TABLE ORDER ROUTES =====
// User routes
router.post("/orders", [authMiddleware.isAuthentication], tableController.createTableOrder);
router.post("/orders/:orderId/items", [authMiddleware.isAuthentication], tableController.addItemToOrder);
router.get("/user/orders", [authMiddleware.isAuthentication], tableController.getUserTableOrders);

// ===== TABLE BOOKING ROUTES =====
router.post("/bookings", [authMiddleware.isAuthentication], tableController.createTableBooking);
router.get("/bookings", [authMiddleware.isAuthentication], tableController.getUserTableBookings);

// Admin routes
router.get("/orders", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.getAllTableOrders);
router.get("/orders/:id", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.getTableOrderDetail);
router.patch("/orders/:orderId/items/:itemId/status", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.updateItemStatus);
router.patch("/orders/:id/complete", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.completeTableOrder);
router.patch("/orders/:id/cancel", [authMiddleware.isAuthentication, authMiddleware.isAdmin], tableController.cancelTableOrder);

module.exports = router;
