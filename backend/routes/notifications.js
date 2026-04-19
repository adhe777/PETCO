const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification.countDocuments({ userId: req.params.userId, isRead: false });
        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark single notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark all as read for a user
router.patch('/read-all/:userId', async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.params.userId, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete single notification
router.delete('/:id', async (req, res) => {
    try {
        console.log(`[NOTIF] Deleting single notification: ${req.params.id}`);
        const result = await Notification.findByIdAndDelete(req.params.id);
        if (!result) {
            console.log(`[NOTIF] Delete failed: Notification ${req.params.id} not found.`);
            return res.status(404).json({ message: 'Notification not found' });
        }
        console.log(`[NOTIF] Successfully deleted ${req.params.id}`);
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error(`[NOTIF] ERROR deleting ${req.params.id}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete all for a user
router.delete('/all/:userId', async (req, res) => {
    try {
        console.log(`[NOTIF] Clearing all notifications for user: ${req.params.userId}`);
        const result = await Notification.deleteMany({ userId: req.params.userId });
        console.log(`[NOTIF] Successfully cleared ${result.deletedCount} notifications.`);
        res.json({ message: 'All notifications cleared', count: result.deletedCount });
    } catch (err) {
        console.error(`[NOTIF] ERROR clearing notifications for ${req.params.userId}:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
