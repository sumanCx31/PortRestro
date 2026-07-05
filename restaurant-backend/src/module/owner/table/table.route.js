const express = require("express");
const tableRouter = express.Router();
const tableController = require("./table.controller");

tableRouter.post("/", tableController.createTable);
tableRouter.post("/bulk", tableController.createBulkTables);
tableRouter.get("/", tableController.getAllTables);
tableRouter.get("/:id", tableController.getTableById);
tableRouter.patch("/:id", tableController.updateTableById);
tableRouter.delete("/:id", tableController.deleteTableById);

module.exports = tableRouter;