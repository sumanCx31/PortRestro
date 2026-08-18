const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerName: String,
    customerPhone: String,
    cafeUserName: String,

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table"
    },

    takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            menu: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu"
            },
            quantity: Number,
            price: Number,
            subtotal: Number
        }
    ],

    totalPrice: Number,

    paymentMethod: {
        type: String,
        enum: ["CASH", "CARD", "ESEWA", "KHALTI"]
    },

    orderStatus: {
        type: String,
        enum: ["PENDING", "PREPARING", "READY", "SERVED", "COMPLETED"],
        default: "PENDING"
    },
    orderBy: {
        type: String,
        default: "admin"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);