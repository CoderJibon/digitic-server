import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
} from "../controller/blogController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
//express init
const blogRoute = express.Router();

//blog routes
blogRoute.route("/all").get(getAllBlog);
blogRoute.route("/").post(authMiddleware, isAdmin, createBlog);
blogRoute.route("/:slug").get(getSingleBlog);
blogRoute.route("/:id").delete(authMiddleware, isAdmin, deleteBlog);
blogRoute.route("/:id").put(authMiddleware, isAdmin, updateBlog);

//export blog routes
export default blogRoute;
