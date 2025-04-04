import ProductSchemaModel from "../schema/Product.model";
import { Product } from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";

class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductSchemaModel;
  }

  public async getAllProducts(): Promise<any> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    return result;
  }
}

export default ProductService;
