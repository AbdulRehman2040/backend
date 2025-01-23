import Notification from '../models/Notification.js';

export const createNotification = async (message, recipientType, recipientId) => {
  const existingNotification = await Notification.findOne({
    message,
    recipientType,
    recipientId,
  });

  if (!existingNotification) {
    await Notification.create({ message, recipientType, recipientId });
  }
};

export const getNotificationsForUser = async (req, res) => {
    try {
      const { userId, recipientType, page = 0, limit = 10 } = req.query;
  
      const notifications = await Notification.find({ recipientId: userId, recipientType })
        .sort({ createdAt: -1 }) // Most recent notifications first
        .limit(parseInt(limit))
        .skip(parseInt(page) * parseInt(limit));
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const markNotificationsAsRead = async (req, res) => {
    try {
      const { notificationIds } = req.body; // Array of notification IDs
  
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { isRead: true } }
      );
  
      res.status(200).json({ message: 'Notifications marked as read.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteNotifications = async (req, res) => {
    try {
      const { notificationIds } = req.body; // Array of notification IDs
  
      await Notification.deleteMany({ _id: { $in: notificationIds } });
  
      res.status(200).json({ message: 'Notifications deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  