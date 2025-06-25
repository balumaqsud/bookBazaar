import ProductSchemaModel from "../schema/Product.model";
import ViewService from "./View.service";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import { convertToMongoDbId } from "../libs/config";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductSchemaModel;
    this.viewService = new ViewService();
  }

  //spa
  public async getProduct(
    memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    const productId: ObjectId = convertToMongoDbId(id);

    let result = await this.productModel
      .findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    //TO DO:

    if (memberId) {
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);
      console.log("view:", existView);
      if (!existView) {
        //insert one view
        console.log("planning to insert a view");
        await this.viewService.insertMemberView(input);
        //increase counts
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productView: +1 } },
            { new: true }
          )
          .exec();
      }
    }

    return result?.toJSON() as Product;
  }

  public async getAllProducts(): Promise<any> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    return result;
  }

  public async getProducts(inquiry: ProductInquiry): Promise<any> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    if (inquiry.productCategory) {
      match.productCollection = inquiry.productCategory;
    }
    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }
    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //72
        { $limit: inquiry.limit * 1 }, //73+
      ])
      .exec();
    console.log(result);
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return result.toObject() as Product;
    } catch (error) {
      console.log("error in createProduct:service: ", error);
      throw error instanceof Errors ? error.message : Message.CREATE_FAILED;
    }
  }

  public async updateTheProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    try {
      const result = await this.productModel
        .findOneAndUpdate({ _id: id }, input, { new: true })
        .exec();
      return result?.toObject() as Product;
    } catch (error) {
      console.log("error in Update:service: ", error);
      throw error instanceof Errors ? error.message : Message.UPDATE_FAILED;
    }
  }
}

export default ProductService;
