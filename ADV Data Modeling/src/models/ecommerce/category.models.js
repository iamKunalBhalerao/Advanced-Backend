import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.mode;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Category = mode("Category", CategorySchema);
