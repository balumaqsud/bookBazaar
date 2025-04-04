import ProductSchemaModel from "../schema/Product.model";
import { Product, ProductInput } from "../libs/types/product";
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

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return result.toObject() as Product;
    } catch (error) {
      console.log("error in createProduct:service: ", error);
      throw error instanceof Errors ? error.message : Message.CREATE_FAILED;
    }
  }
}

export default ProductService;
