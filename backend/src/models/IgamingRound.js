const mongoose = require("mongoose");

const igamingRoundSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true, unique: true, index: true },
    telegramId: { type: Number, index: true },
    gameUid: String,
    gameName: String,
    gameRound: String,
    currency: String,
    betAmount: { type: Number, default: 0 },
    winAmount: { type: Number, default: 0 },
    creditAmount: { type: Number, default: 0 },
    delta: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IgamingRound", igamingRoundSchema);
