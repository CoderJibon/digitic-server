import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import ProductCategory from "../models/ProductCategory.js";

/**
 * @desc get all product-category data
 * @route api/v1/product-category/all
 * @method Get
 * @access public
 */

export const getAllProductCategory = asyncHandler(async (req, res) => {
  //find all product-category
  const productCategory = await ProductCategory.find().populate([
    {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
        },
      },
    },
    {
      path: "subCategory",
      populate: {
        path: "subCategory",
        populate: {
          path: "subCategory",
        },
      },
    },
  ]);
  //get product-category
  if (productCategory.length > 0) {
    return res.status(200).json(productCategory);
  }
  //response is empty
  res.status(200).json([]);
});

/**
 * @desc create product-category data
 * @route api/v1/product-category
 * @method Post
 * @access protected
 */
export const createProductCategory = asyncHandler(async (req, res) => {
  // get values
  const { name, parentCategory } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "product cat name is required" });
  }
  // email check
  const nameCheck = await ProductCategory.findOne({ name });

  //check is exists
  if (nameCheck) {
    throw new Error("product cat already exists");
  }

  // create new product-category
  const productCategory = await ProductCategory.create({
    name,
    slug: createSlug(name),
    parentCategory: parentCategory ? parentCategory : null,
  });

  // create parent Category

  if (parentCategory) {
    await ProductCategory.findByIdAndUpdate(parentCategory, {
      $push: { subCategory: productCategory._id },
    });
  }
  //response is product-category
  res
    .status(201)
    .json({ productCategory, message: "product cat created successfully" });
});

/**
 * @desc get Single product-category data
 * @route api/v1/product-category/:id
 * @method Get
 * @access public
 */
export const getSingleProductCategory = asyncHandler(async (req, res) => {
  //get the product-category slug
  const { slug } = req.params;
  //find the product-category
  const productCategory = await ProductCategory.findOne({ slug });
  if (!productCategory) {
    throw new Error("No Category found");
  }
  //response the single product-category
  res.status(200).json({ productCategory });
});

/**
 * @desc delete product-category data
 * @route api/v1/product-category/:id
 * @method Delete
 * @access protected
 */
export const deleteProductCategory = asyncHandler(async (req, res) => {
  //get the product-category id
  const { id } = req.params;
  //find the product-category
  const productCategory = await ProductCategory.findByIdAndDelete(id);
  if (!productCategory) {
    throw new Error("product cat Already Delete");
  }
  //response delete the product-category
  res
    .status(200)
    .json({ message: "product cat Delete Successful", productCategory });
});

/**
 * @desc update Permission data
 * @route api/v1/product-category/:id
 * @method Put
 * @access protected
 */
export const updateProductCategory = asyncHandler(async (req, res) => {
  //get the product-category id
  const { id } = req.params;
  // get the form data
  const { name, parentCategory } = req.body;
  // validation
  if (!name) {
    throw new Error("product cat Name Is required");
  }
  //find the product-category
  const productCategory = await ProductCategory.findById(id).exec();
  if (!productCategory) {
    throw new Error("product cat not found");
  }
  //update the product-category
  const updateProductCategoryData = await ProductCategory.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      parentCategory: parentCategory ? parentCategory : null,
    },
    {
      new: true,
    }
  );
  //update the parentCategory
  if (parentCategory) {
    await ProductCategory.findByIdAndUpdate(parentCategory, {
      $push: { subCategory: updateProductCategoryData._id },
    });
  }
  //response the product-category data
  res.json({
    message: `product cat updated successful`,
    productCategory: updateProductCategoryData,
  });
});
