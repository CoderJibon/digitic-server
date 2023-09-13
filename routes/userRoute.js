import express from "express";
import {
  blockUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  logoutUser,
  unblockUser,
  updateSingleUser,
} from "../controller/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

//express init
const userRoute = express.Router();

// auth middleware

userRoute.use(authMiddleware);

//create routes
userRoute.route("/all").get(getAllUsers);
userRoute.route("/:id").get(getSingleUser);
userRoute.route("/:id").delete(deleteSingleUser);
userRoute.route("/:id").put(updateSingleUser);
userRoute.route("/block/:id").get(isAdmin, blockUser);
userRoute.route("/unblock/:id").get(isAdmin, unblockUser);
userRoute.route("/logout").post(logoutUser);

//export user routes
export default userRoute;
