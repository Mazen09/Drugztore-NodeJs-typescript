const Joi = require("joi");
import { Model, Schema, model } from "mongoose";
import { isValidOrderStatus, orderStatus } from "../utils/utils";
import { imageSchema } from "./product";

interface IOrder {
  user: any;
  items: any;
  total: number;
  createdDate: Date;
  status: any;
}

interface OrderModel extends Model<IOrder> {
  updateStatus(status: string): any;
}

const itemSchema = new Schema({
  product: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        max: 10000,
      },
      image: {
        type: imageSchema,
      },
    }),
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new Schema<IOrder, OrderModel>({
  user: {
    type: {
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
    },
    required: true,
  },
  items: {
    type: [itemSchema],
    validate: {
      validator: function (i: any) {
        return i && i.length > 0;
      },
    },
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: orderStatus,
    default: orderStatus.Created
  },
});

orderSchema.method("updateStatus", function updateStatus(status: string) {
  this.status = status;
});

export const Order = model<IOrder, OrderModel>("Order", orderSchema);

export function validateOrder(order: any) {
  const schema = Joi.object({
    userId: Joi.ObjectId().required(),
    items: Joi.array()
      .required().min(1)
      .max(50)
      .items(
        Joi.object({
          productId: Joi.ObjectId().required(),
          amount: Joi.number().min(1).required(),
        })
      ),
  });

  return schema.validate(order);
}

export function validateOrderStatus(order: any) {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(orderStatus))
      .required(),
  });

  return schema.validate(order);
}
