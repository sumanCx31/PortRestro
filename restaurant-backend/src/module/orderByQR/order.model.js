const { default: mongoose } = require("mongoose");

const OrderQrSchema = new mongoose.Schema({
    customerName: String,
    customerPhone: String,
    cafeUserName: String,

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true
    },

    items: [
        {
            menu: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },
            quantity: Number,
        }
    ],

    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 1800 // Automatically deletes after 30 minutes (1800 seconds) if unaccepted
    }
}, { timestamps: true });

module.exports = mongoose.model("OrderQr", OrderQrSchema);