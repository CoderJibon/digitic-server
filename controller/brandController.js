import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import Brand from "../models/Brand.js";

/**
 * @desc get all brand data
 * @route api/v1/brand/all
 * @method Get
 * @access public
 */

export const getAllBrand = asyncHandler(async (req, res) => {
  //find all brand
  const brands = await Brand.find();
  //get brand
  if (brands.length > 0) {
    return res.status(200).json(brands);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create brand data
 * @route api/v1/brand
 * @method Post
 * @access protected
 */
export const createBrand = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "brand name is required" });
  }
  // email check
  const nameCheck = await Brand.findOne({ name });

  if (nameCheck) {
    throw new Error("Brand already exists");
  }

  // create new brand
  const brand = await Brand.create({
    name,
    slug: createSlug(name),
  });
  //response is Brand
  res.status(201).json({ brand, message: "brand created successfully" });
});

/**
 * @desc get Single Brand data
 * @route api/v1/brand/:id
 * @method Get
 * @access public
 */
export const getSingleBrand = asyncHandler(async (req, res) => {
  //get the brand id
  const { id } = req.params;
  //find the brand
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new Error("No brand found");
  }
  //response the single brand
  res.status(200).json({ brand });
});

/**
 * @desc delete brand data
 * @route api/v1/brand/:id
 * @method Delete
 * @access protected
 */
export const deleteBrand = asyncHandler(async (req, res) => {
  //get the brand id
  const { id } = req.params;
  //find the brand
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new Error("Brand Already Delete");
  }
  //response delete the brand
  res.status(200).json({ message: "Brand Delete Successful", brand });
});

/**
 * @desc update Permission data
 * @route api/v1/brand/:id
 * @method Put
 * @access protected
 */
export const updateBrand = asyncHandler(async (req, res) => {
  //get the brand id
  const { id } = req.params;
  // get the form data
  const { name } = req.body;
  // validation
  if (!name) {
    throw new Error("Brand Name Is required");
  }
  //find the brand
  const brand = await Brand.findById(id).exec();
  if (!brand) {
    throw new Error("Brand not found");
  }
  //update the brand
  const updateBrandData = await Brand.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    {
      new: true,
    }
  );
  //response the brand data
  res.json({
    message: `Brand updated successful`,
    brand: updateBrandData,
  });
});
