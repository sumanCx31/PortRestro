const staffModel = require("./staff.model");

class StaffService {
  getStaffPublicProfile(staff) {
    return {
      name: staff.name,
      email: staff.email,
      role: staff.role,
      userName: staff.userName,
      phone: staff.phone,
      gender: staff.gender,
      image: staff.image,
      _id: staff._id,
      cafeUserName: staff.cafeUserName,
      createdBy: staff.createdBy,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
      updatedBy: staff.updatedBy,
    };
  }
  async createStaff(data) {
    try {
      const staff = new staffModel(data)
      return await staff.save()
    } catch (exception) {
      throw exception
    }
  }

  getSingleUserByFilter = async (filter) => {
    try {
      const userData = await staffModel.findOne(filter);
      return userData;
    } catch (exception) {
      throw exception;
    }
  };
  getRoleByFilter = async (filter) => {
    try {
      const userData = await staffModel.find({_id:filter});
      // console.log(userData);
      
      const role = userData[0].role;
      // console.log("role=",role);
      
      return role;
    } catch (exception) {
      throw exception;
    }
  };
  async updateSingleUserByFilter (filter, data) {
    try {
        const userData = await staffModel.findOneAndUpdate(filter, {$set: data}, {new:true})
        return userData;
    } catch (exception) {
        throw exception;
    }
  }
}

const staffSvc = new StaffService();
module.exports = staffSvc;
