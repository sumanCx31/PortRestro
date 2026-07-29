const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
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

    cafeUserName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

CategorySchema.index({ cafeUserName: 1 });
CategorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", CategorySchema);