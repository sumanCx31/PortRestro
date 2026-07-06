const mongoose = require("mongoose");
const { USER_ROLES, Status, GENDER } = require("../../config/constant");

const StaffSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    cafeUserName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  },
);

StaffSchema.index({ phone: 1 });
StaffSchema.index({ userName: 1 });
StaffSchema.index({ cafeUserName: 1 });

module.exports = mongoose.model("Staff", StaffSchema);
