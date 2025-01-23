import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    recipientType: { type: String, enum: ['Buyer', 'Seller'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'recipientType' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
