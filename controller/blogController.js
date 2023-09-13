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
  const blogs = await Blog.find();
  // return all blogs data
  if (blogs.length > 0) {
    return res.status(200).json(blogs);
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
  const blog = await Blog.create({
    title,
    slug: createSlug(title),
    description,
    category,
    author,
  });

  res.status(201).json({ blog, message: "Blog created successfully" });
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
  const blog = await Blog.findOne({ slug });
  // if not found blog data
  if (!blog) {
    throw new Error("Blog not found");
  }
  //blog views update
  await Blog.findByIdAndUpdate(
    blog._id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  // return blog data
  res.status(200).json({ blog });
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
  //find and delete blog
  const blog = await Blog.findByIdAndDelete(id);
  //not available blog
  if (!blog) {
    throw new Error("Blog Already Delete");
  }

  //response
  res.status(200).json({ message: "Blog Delete Successful", blog });
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
  const blog = await Blog.findById(id).exec();
  // is not available a blog data
  if (!blog) {
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
    blog: updateBlogData,
  });
});

/**
 * @desc Blog Is Like
 * @route api/v1/blog/like
 * @Method post
 * @access protected
 */
export const likeBlog = asyncHandler(async (req, res) => {
  //get body data
  const { blogId } = req.body;
  if (!blogId) {
    throw new Error("Invalid Blog ID");
  }
  //find blog
  const blog = await Blog.findById(blogId);
  //login user
  const user = req.me;
  //already dislike blog
  const dislike = blog.dislikes.map(
    (el) => el._id.toString() === user._id.toString()
  );
  //if dislike is available
  if (dislike[0]) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: user._id },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  // if like true
  if (blog.isLiked === true) {
    const unLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: user._id },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    //response
    res.status(200).json({ message: "Blog unLike successful ", blog: unLike });
  } else {
    const likeb = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: user._id },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    //response
    res.status(200).json({ message: "Blog like successful ", blog: likeb });
  }
});

/**
 * @desc Blog Is dislike
 * @route api/v1/blog/dislike
 * @Method post
 * @access protected
 */

export const dislikeBlog = asyncHandler(async (req, res) => {
  //get body data
  const { blogId } = req.body;
  if (!blogId) {
    throw new Error("Invalid Blog ID");
  }
  //find blog
  const blog = await Blog.findById(blogId);
  //login user
  const user = req.me;
  //already like blog
  const like = blog.likes.map(
    (el) => el._id.toString() === user._id.toString()
  );
  //if like is available
  if (like[0]) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: user._id },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  // if dislike true
  if (blog.isDisliked === true) {
    const unDisLike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: user._id },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    //response
    res
      .status(200)
      .json({ message: "Blog unDislike successful ", blog: unDisLike });
  } else {
    const dislike = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: user._id },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    //response
    res
      .status(200)
      .json({ message: "Blog dislike successful ", blog: dislike });
  }
});
