const MenuModel = require("./menu.model");
const cloudinarySvc = require("../../../services/cloudinary.service");

class MenuController {
  // Create Menu
  createMenu = async (req, res, next) => {
    try {
      const {
        name,
        description,
        // category=null,
        price,
        cafeUserName,
        category,
        isAvailable = true,
      } = req.body;

      const exists = await MenuModel.findOne({
        name,
        isDeleted: false,
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Menu already exists.",
        });
      }

      let image = {};

      if (req.file) {
        image = await cloudinarySvc.fileUpload(req.file.path, "/menu");
      }

      const menu = await MenuModel.create({
        name,
        description,
        category,
        price,
        isAvailable,
        image,
        cafeUserName,
        // createdBy: req.loggedInUser._id
      });

      return res.status(201).json({
        success: true,
        message: "Menu created successfully.",
        data: menu,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get All Menus
  getAllMenus = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {
        isDeleted: false,
      };

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.search) {
        filter.name = {
          $regex: req.query.search,
          $options: "i",
        };
      }

      const [menus, total] = await Promise.all([
        MenuModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        MenuModel.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: menus,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getAllMenusByCafeUserName = async (req, res, next) => {
  try{
    const { cafeUserName } = req.params;
    const menus = await MenuModel.find({ cafeUserName, isDeleted: false });

    if (!menus || menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No menus found for the specified cafe.",
      });
    }

    return res.status(200).json({
      success: true,
      data: menus,
    });

  }catch(exception){
    throw exception;
  }
  }

  // Get Single Menu
  getMenuById = async (req, res, next) => {
    try {
      const menu = await MenuModel.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: menu,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update Menu
  updateMenu = async (req, res, next) => {
    try {
      const menu = await MenuModel.findById(req.params.id);

      if (!menu || menu.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Menu not found.",
        });
      }

      if (req.file) {
        if (menu.image?.publicId) {
          await cloudinarySvc.fileDelete(menu.image.publicId);
        }

        req.body.image = await cloudinarySvc.fileUpload(
          req.file.path,
          "/menu"
        );
      }

      req.body.updatedBy = req.loggedInUser._id;

      const updated = await MenuModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Menu updated successfully.",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete Menu (Soft Delete)
deleteMenu = async (req, res, next) => {
    try {
      const { _id } = req.params;

      const menu = await MenuModel.findById({_id:_id});
      console.log("i am here:",menu);
      
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found",
        });
      }

      menu.isDeleted = true;
      await menu.save();

      return res.status(200).json({
        success: true,
        message: "Menu deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Toggle Availability
  toggleAvailability = async (req, res, next) => {
    try {
      const menu = await MenuModel.findById(req.params.id);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found.",
        });
      }

      menu.isAvailable = !menu.isAvailable;
      menu.updatedBy = req.loggedInUser._id;

      await menu.save();

      return res.status(200).json({
        success: true,
        message: `Menu ${
          menu.isAvailable ? "available" : "unavailable"
        } successfully.`,
        data: menu,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new MenuController();