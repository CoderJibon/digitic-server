const mongoose = require("mongoose");

// create Blog category schema

const blogCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// export

module.exports =
  mongoose.models.BlogCategory ||
  mongoose.model("BlogCategory", blogCategorySchema);
