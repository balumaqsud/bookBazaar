import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { Member } from "../libs/types/member";
import OrderModel from "../schema/Order.model";
import OrderItemsModel from "../schema/OrderItems.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { convertToMongoDbId } from "../libs/config";
import { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import memberService from "../model/Member.service";

class OrderService {
  private readonly orderModel;
  private readonly orderItemsModel;
  private readonly memberService;
  constructor() {
    this.orderItemsModel = OrderItemsModel;
    this.orderModel = OrderModel;
    this.memberService = new memberService();
  }

  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    const memberId = convertToMongoDbId(member._id);
    const amount = input.reduce((total: number, item: OrderItemInput) => {
      return total + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount <= 100 ? 5 : 0;

    try {
      const newOrder = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });
      const orderId = convertToMongoDbId(newOrder._id);
      await this.recordOrderItems(orderId, input);
      return newOrder.toJSON() as Order;
    } catch (error) {
      console.log("orderCreation error:", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
  private async recordOrderItems(
    orderId: ObjectId,
    input: OrderItemInput[]
  ): Promise<void> {
    const list = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = convertToMongoDbId(item.productId);
      await this.orderItemsModel.create(item);
      return "inserted";
    });

    const orderItemsState = await Promise.all(list);
    console.log("promised list:", orderItemsState);
  }

  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<any> {
    const memberId = convertToMongoDbId(member._id);
    const matches = {
      memberId: memberId,
      orderStatus: inquiry.orderStatus,
    };
    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updateAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId", //123
            foreignField: "_id", //123
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> {
    const memberId = convertToMongoDbId(member._id);
    const orderId = convertToMongoDbId(input.orderId);
    const orderStatus = input.orderStatus;
    const result = await this.orderModel
      .findOneAndUpdate(
        { memberId: memberId, _id: orderId },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(member);
    }
    return result.toJSON() as Order;
  }
}

export default OrderService;
