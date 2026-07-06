const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu name is required"],
      trim: true,
      minlength: [2, "Menu name must be at least 2 characters"],
      maxlength: [100, "Menu name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: [true, "Category is required"],
      default: null,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
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

    preparationTime: {
      type: Number,
      default: 10, // minutes
    },

    isVeg: {
      type: Boolean,
      default: false,
    },

    isSpicy: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cafeUserName:{
        type: String,
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

// Indexes
MenuSchema.index({ name: "text" });
MenuSchema.index({ category: 1 });
MenuSchema.index({ isAvailable: 1 });
MenuSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Menu", MenuSchema);