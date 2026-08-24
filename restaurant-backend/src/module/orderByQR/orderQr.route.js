const express = require('express');
const OrderByQrouter = express.Router();
const qrOrderController = require('./order.controller'); // Update path to your controller file if needed

// 1. [Customer Side] Submit a new QR order into the staging model
OrderByQrouter.post('/submit', qrOrderController.createQrOrder);

// 2. [Admin Side] Fetch all pending QR orders for a specific cafe
OrderByQrouter.get('/pending/:cafeUserName', qrOrderController.getPendingQrOrders);

// 3. [Admin Side] Accept a QR order (moves it to your main Order model and deletes from staging)
OrderByQrouter.post('/accept/:qrOrderId', qrOrderController.acceptQrOrder);

// 4. [Admin Side] Reject a QR order (deletes it from the staging model)
OrderByQrouter.delete('/reject/:qrOrderId', qrOrderController.rejectQrOrder);

module.exports = OrderByQrouter;