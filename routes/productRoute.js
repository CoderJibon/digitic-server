import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteSingleProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/productController.js";

//express init
const productRoute = express.Router();

//create routes
productRoute.route("/all").get(getAllProducts);
productRoute.route("/").post(authMiddleware, isAdmin, createProduct);
productRoute.route("/:slug").get(getSingleProduct);
productRoute.route("/:id").delete(authMiddleware, isAdmin, deleteSingleProduct);
productRoute.route("/:id").patch(authMiddleware, isAdmin, updateProduct);

//export product routes
export default productRoute;