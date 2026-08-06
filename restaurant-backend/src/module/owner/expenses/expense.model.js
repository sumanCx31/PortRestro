const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            trim: true
        },
        addedBy: {
            type: String,
            required: true,
            trim: true
        },
        cafeUserName: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);