import mongoose, { Schema } from "mongoose";
import {
  ProductSize,
  ProductStatus,
  ProductCollection,
} from "../libs/enums/product.enum";

const ProductSchemaModel = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },
    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productLeftCount: {
      type: Number,
      required: true,
    },
    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.MEDIUM,
    },
    productDesc: {
      type: String,
      required: true,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productView: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
); //created and updated date

//means these should be unique
ProductSchemaModel.index({ productName: 1, productSize: 1 }, { unique: true });

export default mongoose.model("products", ProductSchemaModel);
