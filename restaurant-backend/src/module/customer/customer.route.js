const CustomerRouter = require('express').Router();
const Customercltr = require('./customer.controller');

CustomerRouter.post("/", Customercltr.createCustomer);
CustomerRouter.get("/:cafeUserName", Customercltr.getAllCustomers);

module.exports = CustomerRouter;