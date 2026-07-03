const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock Database
let tables = [
    { id: 'T-01', status: 'Available' },
    { id: 'T-02', status: 'Available' },
    { id: 'T-03', status: 'Occupied' }
];

// 1. GET Tables
app.get('/tables', (req, res) => {
    res.json(tables);
});

// 2. POST Order
app.post('/order', (req, res) => {
    const { tableId, customer, orderItems } = req.body;

    // Server-side calculation to prevent frontend manipulation
    const totalAmount = orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Logic to update table status
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.status = 'Occupied';
    }

    // In a real app, you would save the order to a Database here
    const newOrder = {
        orderId: Date.now(),
        tableId,
        customer,
        orderItems,
        totalAmount,
        timestamp: new Date()
    };

    console.log('Order Received:', newOrder);

    res.status(201).json({
        message: 'Order placed successfully',
        totalAmount: totalAmount
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));