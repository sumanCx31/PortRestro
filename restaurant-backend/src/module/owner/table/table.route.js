const express = require("express");
const tableRouter = express.Router();
const tableController = require("./table.controller");

tableRouter.post("/", tableController.createTable);
tableRouter.post("/bulk", tableController.createBulkTables);
tableRouter.get("/:_cafeUserName", tableController.getAllTablesByCafeUserName);
tableRouter.get("/getTable/:id", tableController.getTableById);
tableRouter.put("/:id", tableController.updateTableStatusById);
tableRouter.patch("/:id", tableController.updateTableById);
tableRouter.delete("/:id", tableController.deleteTableById);

module.exports = tableRouter;