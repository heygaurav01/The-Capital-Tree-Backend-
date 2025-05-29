//const admin = require("../config/firebaseConfig");
const Notification = require("../models/Notification");
const User = require("../models/User"); // Assuming User Model exists

// Send Push Notification
exports.sendNotification = async (req, res) => {
    try {
        const { userId, title, message, deviceToken } = req.body;

        if (!deviceToken) {
            return res.status(400).json({ error: "Device token is required" });
        }

        // Prepare notification payload
        const payload = {
            notification: { title, body: message }
        };

        // Send notification via Firebase
        await admin.messaging().send({
            token: deviceToken,
            ...payload
        });

        // Store notification in the database
        await Notification.create({ userId, title, message, status: "sent" });

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
