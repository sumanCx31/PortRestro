const CategoryRouter = require("express").Router();

const categoryCltr = require("./category.controller");
const uploader = require("../../../middleware/uploader.middleware");

// Create
CategoryRouter.post(
  "/create",
  uploader().single("image"),
  categoryCltr.createCategory
);

// Get All
CategoryRouter.get(
  "/all/:cafeUserName",
  categoryCltr.getAllCategories
);

// Get Single
CategoryRouter.get(
  "/:id",
  categoryCltr.getCategoryById
);

// Update
CategoryRouter.patch(
  "/update/:id",
  uploader().single("image"),
  categoryCltr.updateCategory
);

// Delete
CategoryRouter.delete(
  "/delete/:id",
  categoryCltr.deleteCategory
);

module.exports = CategoryRouter;