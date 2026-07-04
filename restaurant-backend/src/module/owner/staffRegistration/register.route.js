const staffRegistrationRouter = require("express").Router();

staffRegistrationRouter.post("/register",registerCltr.createStafeRegistration);
staffRegistrationRouter.get("/get-all",registerCltr.getAllStaffRegistration);
staffRegistrationRouter.get("/get/:id",registerCltr.getSingleStaffRegistration);
staffRegistrationRouter.patch("/update/:id",registerCltr.updateStaffRegistration);
staffRegistrationRouter.delete("/delete/:id",registerCltr.deleteStaffRegistration);

module.exports = staffRegistrationRouter;