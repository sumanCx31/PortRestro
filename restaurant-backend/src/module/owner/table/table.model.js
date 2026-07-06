const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    capacity: {
      type: Number,
      default: 4,
      min: 1,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    cafeUserName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);