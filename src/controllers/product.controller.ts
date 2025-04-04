import { AdminRequest } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../model/Product.service";
import { Request, Response } from "express";
import { ProductInput, ProductUpdateInput } from "../libs/types/product";

const productSerive = new ProductService();
const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productSerive.getAllProducts();
    res.render("products", { products: data });
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    const data: ProductInput = req.body;
    if (!req.files?.length)
      throw new Errors(HttpCode.BAD_REQUEST, Message.MORE_IMAGE);
    data.productImages = req.files?.map((ele) => {
      return ele.path;
    });
    await productSerive.createNewProduct(data);
    res.redirect("/admin/product/all");
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};

productController.updateTheProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateTheProduct");
    const id = req.params.id;
    const input: ProductUpdateInput = req.body;
    await productSerive.updateTheProduct(id, input);
    res.redirect("/admin/product/all");
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};
export default productController;
