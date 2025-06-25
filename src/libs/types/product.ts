import { ObjectId } from "mongoose";
import {
  ProductCategory,
  ProductStatus,
  ProductType,
} from "../enums/product.enum";

export interface ProductInput {
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productType?: ProductType;
  productDesc?: string;
  productImages?: string[];
  productView?: number;
}
export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productType?: ProductType;
  productDesc?: string;
  productImages: string[];
  productView: number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCategory?: ProductCategory;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productType?: ProductType;
  productDesc?: string;
  productImages?: string[];
  productView?: number;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCategory?: ProductCategory;
  search?: string;
}
