const orderCltr = require('./order.controller');
const OrderRouter = require('express').Router();

OrderRouter.post("/",orderCltr.createOrder);
module.exports = OrderRouter;