const TableModel = require("./table.model");

class TableController {

  createTable = async (req, res, next) => {
    try {

      let { name, capacity, cafeUserName } = req.body;

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
        cafeUserName,
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

      const { totalTables, capacity, cafeUserName } = req.body;

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
          cafeUserName: cafeUserName || "",
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
  getAllTablesByCafeUserName = async (req, res, next) => {
    try {

      const { _cafeUserName } = req.params;
      console.log(_cafeUserName);
      

       const tables = await TableModel.find();

      res.status(200).json({
        success: true,
        message: "Tables fetched successfully.",
        data: tables,
      });

    } catch (error) {
      next(error);
    }
  };

  updateTableStatusById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const table = await TableModel.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Table status updated successfully.",
        data: table,
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