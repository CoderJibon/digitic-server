import express from "express";
import {
  adminLogin,
  forgotPasswordToken,
  registerUser,
  resetPassword,
  updatePassword,
  userLogin,
} from "../controller/authController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
//express init
const authRoute = express.Router();

//create routes
authRoute.route("/register").post(registerUser);
authRoute.route("/login").post(userLogin);
authRoute.route("/admin").post(adminLogin);
authRoute.route("/user/password-update").post(authMiddleware, updatePassword);
authRoute.route("/user/forget-password").post(forgotPasswordToken);
authRoute.route("/user/reset-password/:token").post(resetPassword);

//export auth routes
export default authRoute;
