import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../model/Product.service";
import { Request, Response } from "express";
import {
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import { ProductCategory } from "../libs/enums/product.enum";

const productService = new ProductService();
const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();
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
    await productService.createNewProduct(data);
    res.send(
      `<script>alert("Created successfully");  window.location.reload(); window.location.replace('/admin/product/all')</script>`
    ); //sends this after image uploaded successfully
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
    const result = await productService.updateTheProduct(id, input);
    res.status(HttpCode.OK).json({ data: result });
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard.message);
    }
  }
};

// for SPA
productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params,
      memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, id);
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

productController.getProducts = async (req: Request, res: Response) => {
  try {
    const { order, page, limit, productCategory, search } = req.query;
    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCategory) {
      inquiry.productCategory = productCategory as ProductCategory;
    }
    if (search) {
      inquiry.search = String(search);
    }
    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (error) {
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(500).json(Errors.standard);
    }
  }
};

export default productController;
