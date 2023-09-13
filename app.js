import express from "express";
import morgan from "morgan";
import path from "path";
import errorHandler from "./middlewares/errorHandlers.js";
import notFound from "./middlewares/notFound.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";

//express initialization
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());

//static Folder
app.use(express.static(path.join(path.resolve() + "/public")));

//router routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/auth", authRoute);

//error handlers
app.use(errorHandler);

//404 not found
app.use(notFound);

//export app
export default app;
