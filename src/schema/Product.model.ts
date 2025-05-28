import mongoose, { Schema } from "mongoose";
import {
  ProductType,
  ProductStatus,
  ProductCategory,
} from "../libs/enums/product.enum";

const ProductSchemaModel = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },
    productCategory: {
      type: String,
      enum: ProductCategory,
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
    productType: {
      type: String,
      enum: ProductType,
      default: ProductType.ELECTRONIC,
    },
    productDesc: {
      type: String,
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
ProductSchemaModel.index({ productName: 1, productType: 1 }, { unique: true });

export default mongoose.model("products", ProductSchemaModel);
