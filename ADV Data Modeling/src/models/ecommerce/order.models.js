import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const orderItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productQuantity: {
    type: Number,
    default: 1,
    required: true,
  },
});

const OrderSchema = new Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    custmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: {
      type: [orderItemSchema],
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);
