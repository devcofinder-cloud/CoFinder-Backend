const Notification = require("../../models/notification.model");

const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  data = {},
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    data,
  });

  return notification;
};

const getUserNotifications = async (userId) => {
  return await Notification.find({
    recipient: userId,
  })
    .populate("sender", "name username profileImage")
    .sort({ createdAt: -1 })
    .limit(50);
};

const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    {
      new: true,
    }
  );
};

const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};