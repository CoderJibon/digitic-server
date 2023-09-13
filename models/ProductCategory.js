import mongoose from "mongoose";

// create Product category schema

const productCategorySchema = new mongoose.Schema(
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
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
    },
    subCategory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ProductCategory",
      default: null,
    },
    icon: {
      type: String,
      default: null,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
      trim: true,
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
export default mongoose.models.ProductCategory ||
  mongoose.model("ProductCategory", productCategorySchema);
