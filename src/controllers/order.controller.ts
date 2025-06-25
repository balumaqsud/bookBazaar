import { ExtendedRequest } from "../libs/types/member";
import { T } from "../libs/types/common";
import Errors, { HttpCode } from "../libs/Errors";
import { Response } from "express";
import OrderService from "../model/Order.service";
import { OrderStatus } from "../libs/enums/order.enum";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";

const orderController: T = {};
const orderService = new OrderService();

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);
    res.status(HttpCode.OK).json(result);
  } catch (error) {
    console.log("createOrder error", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;
    const inquiry: OrderInquiry = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };
    const result = await orderService.getMyOrders(req.member, inquiry);
    res.status(HttpCode.CREATED).json(result);
  } catch (error) {
    console.log("getMyOrders error", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;

    const result = await orderService.updateOrder(req.member, input);
    res.status(HttpCode.CREATED).json(result);
  } catch (error) {
    console.log("updateOrder error", error);
    if (error instanceof Errors) res.status(error.code).json(error.message);
    else {
      res.status(Errors.standard.code).json(Errors.standard);
    }
  }
};

orderController.getUser = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getUser");
  } catch (e) {
    console.log("getUser error", e);
  }
};

export default orderController;
