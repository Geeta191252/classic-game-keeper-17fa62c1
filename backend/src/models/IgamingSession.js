const mongoose = require("mongoose");

const igamingSessionSchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: true, index: true },
    providerUserId: { type: Number, index: true },
    currency: { type: String, enum: ["dollar", "rupee"], default: "rupee" },
    currencyCode: { type: String, default: "INR" },
    gameUid: String,
    gameName: String,
    startBalance: { type: Number, default: 0 },
    lastBalance: { type: Number, default: 0 },
    totalBet: { type: Number, default: 0 },
    totalWin: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IgamingSession", igamingSessionSchema);
