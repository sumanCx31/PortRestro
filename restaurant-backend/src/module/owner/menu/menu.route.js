const express = require("express");
const MenuRouter = express.Router();
const menuController = require("./menu.controller");
const { USER_ROLES } = require("../../../config/constant");
const auth = require("../../../middleware/auth.middleware");
const uploader = require("../../../middleware/uploader.middleware");

// Create Menu
MenuRouter.post(
  "/",
  uploader().single("image"),
  menuController.createMenu
);

// Get All Menus
MenuRouter.get(
  "/",
  menuController.getAllMenus
);

MenuRouter.get(
  "/cafe/:cafeUserName",
  menuController.getAllMenusByCafeUserName
);

// Get Single Menu
MenuRouter.get(
  "/:id",
  menuController.getMenuById
);


// Update Menu
MenuRouter.put(
  "/:id",
  auth([USER_ROLES.OWNER, USER_ROLES.MANAGER]),
  // upload.single("image"),
  menuController.updateMenu
);


MenuRouter.get("/get-all-menus/:categoryId/:cafeUserName",menuController.getAllMenuByCategory)

// Delete Menu
MenuRouter.delete(
  "/delete/:_id",
  menuController.deleteMenu
);

// Toggle Availability
MenuRouter.patch(
  "/:id/availability",
  auth([USER_ROLES.OWNER, USER_ROLES.MANAGER]),
  menuController.toggleAvailability
);

module.exports = MenuRouter;