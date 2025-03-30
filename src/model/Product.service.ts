import ProductSchemaModel from "../schema/Product.model";
class ProductService {
  private readonly productModel;

  constructor() {
    this.productModel = ProductSchemaModel;
  }
}

export default ProductService;
