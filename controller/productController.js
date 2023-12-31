import asyncHandler from "express-async-handler";
import createSlug from "../utils/createSlug.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * @DESC get all products from
 * @ROUTE /api/v1/products
 * @METHOD GET
 * @ACCESS public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };

  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/gi, (m) => `$${m}`);
  //query for products
  let query = Product.find(JSON.parse(queryStr)).populate("ratings");

  // Sorting
  const sort = req.query.sort || "";
  if (sort) {
    const sortBy = sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // limiting the fields
  const fields = req.query.fields || null;

  if (fields) {
    const field = fields.split(",").join(" ");
    query = query.select(field);
  } else {
    query = query.select("-__v");
  }

  // pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (page) {
    const productCount = await Product.countDocuments();
    if (skip >= productCount) throw new Error("This Page does not exists");
  }

  // Get all products
  const products = await query;
  //if get all products
  if (products.length > 0) {
    return res.status(200).json({ products });
  }
  //response
  res.status(404).json([]);
});

/**
 * @DESC Create a new Product
 * @ROUTE /api/v1/product
 * @METHOD POST
 * @ACCESS protected
 */
export const createProduct = asyncHandler(async (req, res) => {
  // get body data
  const {
    title,
    shortDesc,
    longDesc,
    price,
    category,
    brand,
    tag,
    quantity,
    color,
    size,
  } = req.body;

  // is empty
  if (!title || !price || !quantity) {
    throw new Error("all fields are required");
  }

  // find product title
  const product = await Product.findOne({ title });

  //if product title is already exists
  if (product) {
    throw new Error("Product Title already exists");
  }

  //create a new product
  const newProduct = await Product.create({
    title,
    slug: createSlug(title),
    price,
    shortDesc,
    longDesc,
    quantity,
    color,
    size,
    category,
    brand,
    tag,
    sort: req.body.sort,
  });

  // response
  res
    .status(201)
    .json({ product: newProduct, message: "Product Created successfully" });
});

/**
 * @DESC Get a single Product
 * @ROUTE /api/v1/product/:slug
 * @METHOD GET
 * @ACCESS public
 */
export const getSingleProduct = asyncHandler(async (req, res) => {
  // get params slug
  const { slug } = req.params;
  //find product
  const product = await Product.findOne({ slug });
  //if product not available
  if (!product) {
    throw new Error("product Not Found");
  }
  //response
  res.status(200).json({ product });
});

/**
 * @DESC Delete a single Product
 * @ROUTE /api/v1/product/:id
 * @METHOD DELETE
 * @ACCESS protected
 */
export const deleteSingleProduct = asyncHandler(async (req, res) => {
  // get params id
  const { id } = req.params;
  //find product
  const product = await Product.findById(id);
  //if product not available
  if (!product) {
    throw new Error("product Not Found");
  }
  //delate product
  const productID = await Product.findByIdAndDelete(id);
  //response
  res
    .status(200)
    .json({ product: productID, message: "product delete successfully" });
});

/**
 * @DESC update a Product
 * @ROUTE /api/v1/product/:id
 * @METHOD PATCH
 * @ACCESS protected
 */
export const updateProduct = asyncHandler(async (req, res) => {
  // get params id
  const { id } = req.params;

  // get body data
  const {
    title,
    shortDesc,
    longDesc,
    price,
    category,
    brand,
    tag,
    quantity,
    color,
    size,
  } = req.body;

  // is empty
  if (!title || !price || !quantity) {
    throw new Error("all fields are required");
  }

  // find product
  const product = await Product.findById(id);

  //if does not available product
  if (!product) {
    throw new Error("Product Not Found!");
  }

  //update product
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    {
      title,
      slug: createSlug(title),
      price,
      shortDesc,
      longDesc,
      quantity,
      color,
      size,
      category,
      brand,
      tag,
    },
    {
      new: true,
    }
  );
  console.log(updateProduct);
  //response;
  res
    .status(200)
    .json({ product: updateProduct, message: "Product Update successfully" });
});

/**
 * @desc add to wishlist
 * @route api/v1/product/wishlist
 * @method put
 * @access protected
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  // get product id form body
  const { productId } = req.body;
  if (!productId) {
    throw new Error("Product ID MUST be provided");
  }
  //is login user
  const { email } = req.me;
  //find user
  const user = await User.findOne({ email });
  //if user is not valid
  if (!user) {
    throw new Error("invalid user");
  }
  try {
    // if user already wishlist added
    const alreadyAdd = user.wishlist.find((el) => el.toString() === productId);
    // if wishlist
    if (alreadyAdd) {
      const removeWishlist = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            wishlist: productId,
          },
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .json({ wishlist: removeWishlist, message: "Remove wishlist Item" });
    } else {
      const addWishlist = await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            wishlist: productId,
          },
        },
        {
          new: true,
        }
      );
      res
        .status(200)
        .json({ wishlist: addWishlist, message: "Add wishlist Item" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

/**
 * @desc Product Ratings Update
 * @route api/v1/product/rating
 * @method put
 * @access protected
 */
export const rating = asyncHandler(async (req, res) => {
  // get product id form body
  const { productId, comment, star } = req.body;
  if ((!productId, !star)) {
    throw new Error("All Fields are required");
  }
  //is login user
  const { email, _id } = req.me;
  //find user
  const user = await User.find({ email });
  //if user is not valid
  if (!user) {
    throw new Error("invalid user");
  }
  //get a product
  const product = await Product.findById(productId);

  //if already have a review
  const alreadyReview = product.ratings?.some(
    (userID) => userID.postedBy.toString() === _id.toString()
  );
  try {
    if (alreadyReview) {
      //update a review
      await Product.findOneAndUpdate(
        {
          _id: productId,
          "ratings.postedBy": _id,
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        },
        {
          new: true,
        }
      );
    } else {
      //Create a new review
      await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    //get the
    let totalRating = product.ratings.length;
    //rating cal
    let ratingSum = product.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    //total rating
    let actualRating = Math.round(ratingSum / totalRating);
    // final product rating
    let finalProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    ).populate({
      path: "ratings",
      populate: {
        path: "postedBy",
      },
    });
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});
