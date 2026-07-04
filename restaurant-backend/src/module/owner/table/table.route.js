const express = require("express");

const tableRouter = express.Router();

const tableController = require("../controllers/tableController");

// Create One Table
tableRouter.post("/", tableController.createTable);

// Create Bulk Tables
tableRouter.post("/bulk", tableController.createBulkTables);

// Get All Tables
tableRouter.get("/", tableController.getAllTables);

// Get Single Table
tableRouter.get("/:id", tableController.getTableById);

// Update Table
tableRouter.patch("/:id", tableController.updateTableById);

// Delete Table
tableRouter.delete("/:id", tableController.deleteTableById);

module.exports = tableRouter;