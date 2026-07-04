const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    accessToken: {
      type: String,
      required: true,
      select: false,
    },

    refreshToken: {
      type: String,
      required: true,
      select: false,
    },

    maskedAccessToken: {
      type: String,
      required: true,
      unique: true,
    },

    maskedRefreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    deviceName: {
      type: String,
      default: null,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["ANDROID", "IOS", "WEB"],
      default: "WEB",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    isLoggedOut: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

// Automatically delete expired sessions
AuthSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

module.exports = mongoose.model("Auth", AuthSchema);