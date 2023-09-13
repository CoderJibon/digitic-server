import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategory,
  getSingleProductCategory,
  updateProductCategory,
} from "../controller/productCategoryController.js";

//express init
const productCatRoute = express.Router();

// routing
productCatRoute.route("/all").get(getAllProductCategory);
productCatRoute.route("/").post(authMiddleware, isAdmin, createProductCategory);
productCatRoute.route("/:slug").get(getSingleProductCategory);
productCatRoute
  .route("/:id")
  .delete(authMiddleware, isAdmin, deleteProductCategory);
productCatRoute
  .route("/:id")
  .put(authMiddleware, isAdmin, updateProductCategory);

//export product category routes
export default productCatRoute;
