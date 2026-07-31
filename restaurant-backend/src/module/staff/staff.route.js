// staff.routes.js
const express = require("express");
const staffRouter = express.Router();
// const staffController = require("./staff.controller"); // Update path as needed
const staffCltr = require("./staff.controller");
const auth = require("../../middleware/auth.middleware");
const { USER_ROLES } = require("../../config/constant");


// Routes
staffRouter.post("/",auth([USER_ROLES.OWNER]), staffCltr.create);                             // Create staff (Owner only)
staffRouter.get("/", staffCltr.getAllStaff);                         // Get all staff system-wide
staffRouter.get("/cafe/:cafeUserName", staffCltr.getAllByCafeUserName); // Get all staff by cafe user name
staffRouter.get("/:id", staffCltr.getByCafeUserName);                  // Get single staff by ID
staffRouter.put("/:id", staffCltr.update);                             // Update staff by ID
staffRouter.delete("/:id", staffCltr.deleteById);                      // Delete staff by ID
staffRouter.delete("/cafe/:cafeUserName", staffCltr.deleteByCafeUserName); // Delete all staff by cafe user name

module.exports = staffRouter;