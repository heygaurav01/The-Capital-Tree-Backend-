const express = require("express");
const { sendNotification, getNotifications } = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/send", authMiddleware, sendNotification);
router.get("/", authMiddleware, getNotifications);

module.exports = router;
