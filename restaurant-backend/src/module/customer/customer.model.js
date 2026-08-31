const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [2, "Customer name must be at least 2 characters"],
      maxlength: [100, "Customer name cannot exceed 100 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    cafeUserName: {
      type: String,
      required: [true, "Cafe username is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

// Indexes
customerSchema.index({ phone: 1, cafeUserName: 1 }, { unique: true });
customerSchema.index({ cafeUserName: 1 });

module.exports = mongoose.model("Customer", customerSchema);