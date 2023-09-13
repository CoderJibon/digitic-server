import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import createSlug from "../utils/createSlug.js";

/**
 * @desc get all Blog data
 * @route api/v1/blog/all
 * @Method Get
 * @access PUBLIC
 */

export const getAllBlog = asyncHandler(async (req, res) => {
  //Find all blogs data
  const Blogs = await Blog.find();
  // return all blogs data
  if (Blogs.length > 0) {
    return res.status(200).json(Blogs);
  }
  // if not found blogs data
  res.status(200).json([]);
});

/**
 * @desc Create a new blog
 * @route api/v1/blog
 * @Method Post
 * @access protected
 */
export const createBlog = asyncHandler(async (req, res) => {
  // get body data
  const { title, description, category, author } = req.body;

  // validations
  if (!title) {
    throw new Error("Title is required");
  }
  // email check
  const titleCheck = await Blog.findOne({ title });

  if (titleCheck) {
    throw new Error("Blog already exists");
  }

  // create new Blog
  const Blog = await Blog.create({
    title,
    slug: createSlug(title),
    description,
    category,
    author,
  });

  res.status(201).json({ Blog, message: "Blog created successfully" });
});

/**
 * @desc get single blog
 * @route api/v1/blog/:slug
 * @Method get
 * @access public
 */
export const getSingleBlog = asyncHandler(async (req, res) => {
  // get params slug
  const { slug } = req.params;
  //find bold data
  const Blog = await Blog.findOne({ slug });
  // if not found blog data
  if (!Blog) {
    throw new Error("Blog not found");
  }
  //blog views update
  await Blog.findByIdAndUpdate(Blog._id, {
    numViews: { $inc: 1 },
  });
  // return blog data
  res.status(200).json({ Blog });
});

/**
 * @desc Delete single blog
 * @route api/v1/blog/:id
 * @Method delete
 * @access protected
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  //get params id
  const { id } = req.params;
  //not available blog
  if (!Blog) {
    throw new Error("Blog Already Delete");
  }
  //find and delete blog
  const Blog = await Blog.findByIdAndDelete(id);
  //response
  res.status(200).json({ message: "Blog Delete Successful", Blog });
});

/**
 * @desc Update single blog
 * @route api/v1/blog/:id
 * @Method put
 * @access protected
 */

export const updateBlog = asyncHandler(async (req, res) => {
  //get params id
  const { id } = req.params;
  // get body data
  const { title, description, category, author } = req.body;

  // validation
  if (!title) {
    throw new Error("Blog title Is required");
  }
  //is available blog data
  const Blog = await Blog.findById(id).exec();
  // is not available a blog data
  if (!Blog) {
    throw new Error("Blog not found");
  }
  //update blog data
  const updateBlogData = await Blog.findByIdAndUpdate(
    id,
    {
      title,
      slug: createSlug(title),
      description,
      category,
      author,
    },
    {
      new: true,
    }
  );
  //response blog update
  res.status(200).json({
    message: `Blog updated successful`,
    Blog: updateBlogData,
  });
});
