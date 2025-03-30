import { loginRequest } from "../libs/types/member";
import Errors from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../model/Product.service";
import { Request, Response } from "express";

const productSerive = new ProductService();
const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    res.render("products");
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};

productController.createNewProduct = async (req: Request, res: Response) => {
  try {
    console.log("createNewProduct");
    res.send("product created successfully");
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
    res.send("update products");
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};
export default productController;
