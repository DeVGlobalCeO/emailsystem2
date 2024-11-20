import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  folder: {
    type: String,
    required: true,
    enum: ['inbox', 'sent', 'drafts', 'trash', 'spam']
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subject: String,
  body: String,
  date: {
    type: Date,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  starred: {
    type: Boolean,
    default: false
  },
  labels: [String],
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    path: String
  }]
});

// Index for faster queries
emailSchema.index({ userId: 1, folder: 1, date: -1 });
emailSchema.index({ userId: 1, starred: 1 });
emailSchema.index({ messageId: 1 });

export default mongoose.model('Email', emailSchema);