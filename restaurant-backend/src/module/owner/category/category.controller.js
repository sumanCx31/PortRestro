const CategoryModel = require("./category.model");
const cloudinarySvc = require("../../../services/cloudinary.service");

class CategoryController {
  createCategory = async (req, res, next) => {
    try {
      const { name, description, cafeUserName } = req.body;

      const exists = await CategoryModel.findOne({
        name,
        cafeUserName,
        isDeleted: false,
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Category already exists.",
        });
      }

      let image = {
        publicId: "",
        secureUrl: "",
        optimizedUrl: "",
      };

      if (req.file) {
        image = await cloudinarySvc.fileUpload(
          req.file.path,
          "/category/"
        );
      }

      const category = await CategoryModel.create({
        name,
        description,
        cafeUserName,
        image,
      });

      return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req, res, next) => {
    try {
      const { cafeUserName } = req.params;

      const categories = await CategoryModel.find({
        cafeUserName,
        isDeleted: false,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category || category.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category || category.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      if (req.body.name) {
        category.name = req.body.name;
      }

      if (req.body.description) {
        category.description = req.body.description;
      }

      if (req.file) {
        const image = await cloudinarySvc.fileUpload(
          req.file.path,
          "/category/"
        );

        category.image = image;
      }

      await category.save();

      return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category || category.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      category.isDeleted = true;

      await category.save();

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CategoryController();