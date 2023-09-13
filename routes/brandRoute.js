import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
} from "../controller/brandController.js";

//express init
const brandRoute = express.Router();

// routing
brandRoute.route("/all").get(getAllBrand);
brandRoute.route("/").post(authMiddleware, isAdmin, createBrand);
brandRoute.route("/:id").get(getSingleBrand);
brandRoute.route("/:id").delete(authMiddleware, isAdmin, deleteBrand);
brandRoute.route("/:id").put(authMiddleware, isAdmin, updateBrand);

//export brand routes
export default brandRoute;
