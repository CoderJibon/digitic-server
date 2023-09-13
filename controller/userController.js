import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import createSlug from "../utils/createSlug.js";

/**
 * @DESC Get all users
 * @ROUTE /api/v1/user/all
 * @METHOD GET
 * @ACCESS public
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users
  const users = await User.find();
  //if get all users
  if (users.length > 0) {
    return res.status(200).json({ users });
  }
  //response
  res.status(404).json([]);
});

/**
 * @DESC Get Single User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //response
  res.status(200).json({ user });
});

/**
 * @DESC Delete Single User
 * @ROUTE api/v1/user/:id
 * @METHOD Delete
 * @ACCESS public
 */
export const deleteSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //delate user
  const userId = await User.findByIdAndDelete(id);
  //response
  res.status(200).json({ user: userId, message: "User delete successfully" });
});

/**
 * @DESC Update Single User
 * @ROUTE api/v1/user/:id
 * @METHOD Delate
 * @ACCESS public
 */
export const updateSingleUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //get body data
  const { firstName, lastName, mobile, gender } = req.body;
  // is empty
  if (!firstName || !lastName) {
    throw new Error("all fields are required");
  }
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }

  //update user
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      mobile,
      gender,
      slug: await createSlug(firstName + "-" + lastName),
    },
    {
      new: true,
    }
  );
  //response
  res
    .status(200)
    .json({ user: updateUser, message: "User Update successfully" });
});

/**
 * @DESC block User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const blockUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //update block user
  const blockUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  //response
  res.status(200).json({ message: "user is Block!" });
});

/**
 * @DESC unblock User
 * @ROUTE api/v1/user/:id
 * @METHOD Get
 * @ACCESS public
 */
export const unblockUser = asyncHandler(async (req, res) => {
  //get params
  const { id } = req.params;
  //find user
  const user = await User.findById(id);
  //if user not available
  if (!user) {
    throw new Error("User Not Found");
  }
  //update unblock user
  const unblockUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  //response
  res.status(200).json({ message: "user is unblock!" });
});

/**
 * @DESC Logout user
 * @ROUTE api/v1/user/logout
 * @METHOD get
 * @ACCESS public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful" });
});
