const expenseCltr = require('./expense.controller');
const expenseRouter = require('express').Router();

expenseRouter.post("/", expenseCltr.create);
expenseRouter.get("/cafe/:cafeUserName", expenseCltr.getAllByCafeUserName);
expenseRouter.delete("/delete-all", expenseCltr.deleteAll);
expenseRouter.delete("/:id", expenseCltr.deleteById);



module.exports = expenseRouter;