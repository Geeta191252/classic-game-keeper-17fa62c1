const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, index: true },
    username: String,
    firstName: String,
    lastName: String,
    sender: { type: String, enum: ["user", "admin"], required: true },
    text: { type: String, required: true },
    adminName: String,
    // read = true means the OTHER side has seen it.
    // For sender=user: unread by admin until admin reads the thread.
    // For sender=admin: unread by user until user opens the modal.
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

supportMessageSchema.index({ telegramId: 1, createdAt: -1 });

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
