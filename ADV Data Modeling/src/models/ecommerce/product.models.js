import mongoose from "mongoose";
import { Category } from "./category.models";

const Schema = mongoose.Schema;
const model = mongoose.model;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
