const { USER_ROLES } = require("../../../config/constant");
const auth = require("../../../middleware/auth.middleware");
const bodyValidator = require("../../../middleware/request-validate.middleware");
const registerCltr = require("./register.controller");
const { staffDTO } = require("./register.validator");
const staffRegistrationRouter = require("express").Router();

staffRegistrationRouter.post("/register",bodyValidator(staffDTO),registerCltr.createStaffRegistration);
staffRegistrationRouter.get("/get-all",registerCltr.getAllStaffRegistration);
staffRegistrationRouter.get("/get/:id",registerCltr.getSingleStaffRegistration);
staffRegistrationRouter.patch("/update/:id",registerCltr.updateStaffRegistration);
staffRegistrationRouter.delete("/delete/:id",registerCltr.deleteStaffRegistration);

module.exports = staffRegistrationRouter;