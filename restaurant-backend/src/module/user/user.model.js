const mongoose = require("mongoose");
const { USER_ROLES, Status, GENDER } = require("../../config/constant");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.OWNER,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: null,
    },

    cafeName: {
      type: String,
      required: [true, "Cafe name is required"],
      trim: true,
      minlength: [2, "Cafe name must be at least 2 characters"],
      maxlength: [100, "Cafe name cannot exceed 100 characters"],
    },

    cafeUserName: {
      type: String,
      required: [true, "Cafe username is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },

    dob: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    activationToken: {
      type: String,
      default: null,
    },

    otp: {
      type: String,
      default: null,
    },

    forgetPasswordToken: {
      type: String,
      default: null,
    },

    expiryTime: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    image: {
      publicId: {
        type: String,
        default: "",
      },
      secureUrl: {
        type: String,
        default: "",
      },
      optimizedUrl: {
        type: String,
        default: "",
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

// Additional indexes
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("User", UserSchema);