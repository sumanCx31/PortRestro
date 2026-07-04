const authRouter = require("express").Router();
const { USER_ROLES } = require("../../config/constant");
const auth = require("../../middleware/auth.middleware");
const bodyValidator = require("../../middleware/request-validate.middleware");
// const uploader = require("../../middleware/uploader.middleware");
const AuthController = require("./auth.controller");
const { RegisterDTO, ResetPasswordRequestDTO, ResetPasswordDataDTO, ChangePasswordDTO } = require("./auth.validator");

const authCtrl = new AuthController();

authRouter.post("/register",bodyValidator(RegisterDTO),authCtrl.registerUser)
authRouter.post("/activate",authCtrl.activateUser );
authRouter.post("/login", authCtrl.loginUser)
authRouter.get("/me",auth(), authCtrl.loggedInUserProfile)
authRouter.get("/logout",auth(USER_ROLES.ADMIN || USER_ROLES.DRIVER), authCtrl.logoutUser)
authRouter.get("/refresh", authCtrl.refreshToken)
authRouter.post("/forget-password",bodyValidator(ResetPasswordRequestDTO),authCtrl.forgetPasswordRequest)
authRouter.get("/forget-password-verify/:token", authCtrl.forgetPasswordTokenVerify);
authRouter.put("/reset-password",bodyValidator(ResetPasswordDataDTO),authCtrl.resetPassword);
authRouter.put("/change-password",auth(),bodyValidator(ChangePasswordDTO),authCtrl.changePassword);
authRouter.get("/user",authCtrl.getAllUsers);
authRouter.get("/user-detail/:_id",auth(USER_ROLES.ADMIN),authCtrl.getUserDetail)


authRouter.put("/user/:id",authCtrl.updateUserById)
module.exports = authRouter