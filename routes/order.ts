import express, { Request } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { auth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { validateObjectId } from "../middlewares/validateObjectId";
import mongoose from "mongoose";
import { admin } from "../middlewares/admin";
import { Order, validateOrder, validateOrderStatus } from "../models/order";
import { User } from "../models/user";
import { Product } from "../models/product";
import { orderStatus } from "../utils/utils";

export const router = express.Router();

function getUserFromToken(req: Request) {
  return jwt.verify(
    <string>req.header("x-auth-token"),
    config.get("jwtPrivateKey")
  );
}

router.get("/", auth, async (req, res) => {
  const user: any = getUserFromToken(req);
  let filter = user.isAdmin ? {} : { "user._id": user._id };

  const orders = await Order.find(filter).sort("createdDate");
  res.send(orders);
});

router.get("/:id", auth, validateObjectId, async (req, res) => {
  const user: any = getUserFromToken(req);
  const order = await Order.findById(req.params.id);

  if (!order || (!user.isAdmin && order.user._id != user._id))
    res.status(404).send("The order with given id was not found");
  else res.send(order);
});

router.post("/", auth, validate(validateOrder), async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send("User with given id not found.");

  const items: any[] = [];

  const list = <any[]>req.body.items;
  for (let i = 0; i < list.length; i++) {
    const product = await Product.findById(list[i].productId);
    if (!product)
      return res
        .status(404)
        .send(`Product with id ${list[i].productId} doesn't exist.`);
    else if (product.numberInStock < list[i].amount)
      return res.status(400).send(`No enough ${product.name} in stock`);
    else
      items.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: (<any>product).getImage(),
        },
        amount: list[i].amount,
      });
  }

  const order = new Order({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    items: items,
    status: orderStatus.Created,
    total: getTotal(items),
  });

  const session = await mongoose.startSession();

  const transactionOptions: any = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  session.startTransaction();

  try {
    // decrement stock
    const list = <any[]>order.items;
    for (let i = 0; i < list.length; i++) {
      await Product.findByIdAndUpdate(
        list[i].product._id,
        {
          $inc: { numberInStock: -list[i].amount },
        },
        { session: session }
      );
    }
    // save order
    await order.save({ session: session });

    res.send(order);
    await session.commitTransaction();
    await session.endSession();
  } catch (e) {
    res.status(500).send("something failed");
    await session.abortTransaction();
    await session.endSession();
    throw e;
  }

  // try {
  //   await session.withTransaction(async () => {
  //     // decrement stock
  //     const list = <any[]>order.items;
  //     for (let i = 0; i < list.length; i++) {
  //       await Product.findByIdAndUpdate(
  //         list[i].product._id,
  //         {
  //           $inc: { numberInStock: -list[i].amount },
  //         },
  //         { session: session }
  //       );
  //     }
  //     // save order
  //     await order.save({ session: session });

  //     res.send(order);
  //     session.commitTransaction();
  //     session.endSession();
  //   }, transactionOptions);
  // } catch (e) {
  //   res.status(500).send("something failed");
  //   session.abortTransaction();
  //   throw e;
  // }
});

router.put(
  "/:id",
  auth,
  validateObjectId,
  validate(validateOrderStatus),
  async (req, res) => {
    const user: any = getUserFromToken(req);
    const order = await Order.findById(req.params.id);

    if (!order || (!user.isAdmin && order.user._id != user._id))
      res.status(404).send("The order with given id was not found");
    else {
      (<any>order).updateStatus(req.body.status);
      await order.save();
      res.send(order);
    }
  }
);

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

function getTotal(items: any[]): number {
  let result = 0;
  items.forEach((i) => {
    result += i.amount * i.product.price;
  });
  return result;
}
