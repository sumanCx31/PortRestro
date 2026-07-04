const TableModel = require("../models/TableModel");

class TableController {

  // Create Single Table
  createTable = async (req, res, next) => {
    try {

      let { name, capacity } = req.body;

      if (!name) {
        const count = await TableModel.countDocuments();
        name = `Table ${count + 1}`;
      }

      if (!capacity) {
        capacity = 4;
      }

      const table = await TableModel.create({
        name,
        capacity,
      });

      res.status(201).json({
        success: true,
        message: "Table created successfully.",
        data: table,
      });

    } catch (error) {
      next(error);
    }
  };



  // Create Multiple Tables
  createBulkTables = async (req, res, next) => {
    try {

      const { totalTables, capacity } = req.body;

      if (!totalTables || totalTables <= 0) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid number of tables.",
        });
      }

      const existingTables = await TableModel.countDocuments();

      const tables = [];

      for (let i = 1; i <= totalTables; i++) {
        tables.push({
          name: `Table ${existingTables + i}`,
          capacity: capacity || 4,
        });
      }

      const createdTables = await TableModel.insertMany(tables);

      res.status(201).json({
        success: true,
        message: `${createdTables.length} tables created successfully.`,
        data: createdTables,
      });

    } catch (error) {
      next(error);
    }
  };



  // Get All Tables
  getAllTables = async (req, res, next) => {
    try {

      const tables = await TableModel.find().sort({ name: 1 });

      res.status(200).json({
        success: true,
        message: "Tables fetched successfully.",
        data: tables,
      });

    } catch (error) {
      next(error);
    }
  };



  // Get Single Table
  getTableById = async (req, res, next) => {
    try {

      const { id } = req.params;

      const table = await TableModel.findById(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: table,
      });

    } catch (error) {
      next(error);
    }
  };



  // Update Table
  updateTableById = async (req, res, next) => {
    try {

      const { id } = req.params;

      const table = await TableModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Table updated successfully.",
        data: table,
      });

    } catch (error) {
      next(error);
    }
  };



  // Delete Table
  deleteTableById = async (req, res, next) => {
    try {

      const { id } = req.params;

      const table = await TableModel.findByIdAndDelete(id);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Table deleted successfully.",
      });

    } catch (error) {
      next(error);
    }
  };

}

module.exports = new TableController();