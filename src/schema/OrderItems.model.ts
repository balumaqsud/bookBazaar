import mongoose, { Schema } from "mongoose";

const OrderItemsSchemaModel = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true, collection: "orderItems" }
); //created and updated date

export default mongoose.model("OrderItem", OrderItemsSchemaModel);
