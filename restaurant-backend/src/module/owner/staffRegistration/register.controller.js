const StaffModel = require("../../staff/staff.model");
const staffSvc = require("../../staff/staff.service");

class staffRegistrationController {
  async createStaffRegistration(req, res) {
    try {
      const { name, email, phone, userName, password, cafeUserName } = req.body;
      if (!name || !email || !phone || !userName || !password || !cafeUserName) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const existingStaff = await StaffModel.findOne({
        $or: [{ email }, { userName }],
      });
      if (existingStaff) {
        return res.status(400).json({
          success: false,
          message: "Staff with the same email or username already exists.",
        });
      }

      const newStaff = await staffSvc.createStaff({
        name,
        email,
        phone,
        userName,
        password,
        cafeUserName,
      })

      return res.status(201).json({
        success: true,
        message: "Staff registered successfully.",
        data: newStaff,
      });
    } catch (exception) {
      throw exception;
    }
  }

  async getAllStaffRegistration(req, res) {
    try {
      const AllStaff = await StaffModel.find();
      return res.status(200).json({
        success: true,
        message: "All staff retrieved successfully.",
        data: AllStaff,
      });
    } catch (exception) {
      throw exception;
    }
  }

  getSingleStaffRegistration(req, res) {
    try {
      const userName = req.params.userName;
      const getStaff = StaffModel.findOne({ userName: userName });
      if (!getStaff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Staff retrieved successfully.",
        data: getStaff,
      });
    } catch (exception) {
      throw exception;
    }
  }

  updateStaffRegistration(req, res) {
    try {
      const userName = req.params.userName;
      const updateData = req.body;
      const updatedStaff = StaffModel.findOneAndUpdate(
        { userName: userName },
        updateData,
        { new: true },
      );
      if (!updatedStaff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Staff updated successfully.",
        data: updatedStaff,
      });
    } catch (exception) {
      throw exception;
    }
  }

  deleteStaffRegistration(req, res) {
    try {
      const userName = req.params.userName;
      const deletedStaff = StaffModel.findOneAndDelete({ userName: userName });
      if (!deletedStaff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Staff deleted successfully.",
        data: deletedStaff,
      });
    } catch (exception) {
      throw exception;
    }
  }
}

const registerCltr = new staffRegistrationController();

module.exports = registerCltr;
