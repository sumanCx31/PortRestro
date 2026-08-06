// staff.controller.js
const Staff = require("./staff.model");
const bcrypt = require("bcrypt");

class StaffController {
    // 1. Create Staff
    create = async (req, res) => {
        try {
            const { name, email, phone, gender, userName, password,cafeUserName } = req.body;

            const existingStaff = await Staff.findOne({
                $or: [{ email }, { userName }, { phone }]
            });

            if (existingStaff) {
                return res.status(400).json({
                    status: "Error",
                    message: "Staff with this email, username, or phone already exists.",
                    data: null
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newStaff = await Staff.create({
                name,
                email,
                phone,
                gender,
                userName,
                cafeUserName,
                password: hashedPassword,
                // cafeUserName: req.user.cafeUserName
            });

            const staffResponse = newStaff.toObject();
            delete staffResponse.password;

            return res.status(201).json({
                status: "Success",
                message: "Staff member created successfully",
                data: staffResponse
            });

        } catch (error) {
            console.error("Error creating staff:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // 2. Get All Staff (System-wide or filtered by query)
    getAllStaff = async (req, res) => {
        try {
            const staffList = await Staff.find().select("-password");

            return res.status(200).json({
                status: "Success",
                message: "All staff fetched successfully",
                count: staffList.length,
                data: staffList
            });
        } catch (error) {
            console.error("Error fetching all staff:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // 3. Get Single Staff By ID (or custom parameter if needed)
    getByCafeUserName = async (req, res) => {
        try {
            const { id } = req.params;
            const staff = await Staff.findById(id).select("-password");

            if (!staff) {
                return res.status(404).json({
                    status: "Error",
                    message: "Staff member not found",
                    data: null
                });
            }

            return res.status(200).json({
                status: "Success",
                message: "Staff member fetched successfully",
                data: staff
            });
        } catch (error) {
            console.error("Error fetching staff by ID:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // 4. Get All Staff By Cafe User Name
    getAllByCafeUserName = async (req, res) => {
        try {
            // Can extract from params, query, or the authenticated owner's context
            const cafeUserName = req.params.cafeUserName || req.user?.cafeUserName;

            if (!cafeUserName) {
                return res.status(400).json({
                    status: "Error",
                    message: "Cafe user name is required",
                    data: null
                });
            }

            const staffList = await Staff.find({ cafeUserName }).select("-password");

            return res.status(200).json({
                status: "Success",
                message: "Staff list fetched successfully for the cafe",
                count: staffList.length,
                data: staffList
            });
        } catch (error) {
            console.error("Error fetching staff by cafeUserName:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // 5. Delete Staff By ID
    deleteById = async (req, res) => {
        try {
            const { id } = req.params;

            const deletedStaff = await Staff.findByIdAndDelete(id).select("-password");

            if (!deletedStaff) {
                return res.status(404).json({
                    status: "Error",
                    message: "Staff member not found",
                    data: null
                });
            }

            return res.status(200).json({
                status: "Success",
                message: "Staff member deleted successfully",
                data: deletedStaff
            });
        } catch (error) {
            console.error("Error deleting staff by ID:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // 6. Delete All Staff By Cafe User Name
    deleteByCafeUserName = async (req, res) => {
        try {
            const { cafeUserName } = req.params;

            if (!cafeUserName) {
                return res.status(400).json({
                    status: "Error",
                    message: "Cafe user name is required",
                    data: null
                });
            }

            const result = await Staff.deleteMany({ cafeUserName });

            return res.status(200).json({
                status: "Success",
                message: `Deleted all staff associated with cafe: ${cafeUserName}`,
                deletedCount: result.deletedCount
            });
        } catch (error) {
            console.error("Error deleting staff by cafeUserName:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    login = async (req, res) => {
        try{
            const {userName,password} = req.body;
            const staff = await Staff.findOne({userName});
            if(!staff){
                return res.status(404).json({
                    status: "Error",
                    message: "Staff member not found",
                    data: null
                });
            }
            const isPasswordValid = await bcrypt.compare(password, staff.password);
            if(!isPasswordValid){
                return res.status(401).json({
                    status: "Error",
                    message: "Invalid password",
                    data: null
                });
            }
            console.log("Staff login successful:", staff);
            return res.status(200).json({
                status: "Success",
                message: "Staff login successful",
                data: {
                    id: staff._id,
                    name: staff.name,
                    email: staff.email,
                    userName: staff.userName,
                    cafeUserName: staff.cafeUserName,
                    phone: staff.phone,
                    gender: staff.gender
                }
            });
        }catch(exception){
            throw exception;
        }
    }

    // 7. Update Staff By ID
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Prevent updating password insecurely through raw payload without hashing
            if (updateData.password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(updateData.password, saltRounds);
            }

            // Prevent changing cafeUserName improperly if needed, or allow it
            const updatedStaff = await Staff.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select("-password");

            if (!updatedStaff) {
                return res.status(404).json({
                    status: "Error",
                    message: "Staff member not found",
                    data: null
                });
            }

            return res.status(200).json({
                status: "Success",
                message: "Staff member updated successfully",
                data: updatedStaff
            });
        } catch (error) {
            console.error("Error updating staff:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };
}

const staffCltr = new StaffController();
module.exports = staffCltr;