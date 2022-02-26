import mongoose from "mongoose";
import { orderStatus } from "../utils/utils";

export const seed_users = [
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a0"),
    name: "user1",
    email: "a@a.com",
    password: "1234567890",
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a1"),
    name: "user2",
    email: "b@a.com",
    password: "1234567890",
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a2"),
    name: "user3",
    email: "c@a.com",
    password: "1234567890",
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a3"),
    name: "user4",
    email: "d@a.com",
    password: "1234567890",
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a4"),
    name: "user5",
    email: "e@a.com",
    password: "1234567890",
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a5"),
    name: "user6",
    email: "a@b.com",
    password: "1234567890",
    isAdmin: false,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a6"),
    name: "user7",
    email: "b@b.com",
    password: "1234567890",
    isAdmin: false,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a7"),
    name: "user8",
    email: "c@b.com",
    password: "1234567890",
    isAdmin: false,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a8"),
    name: "user9",
    email: "d@b.com",
    password: "1234567890",
    isAdmin: false,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7a9"),
    name: "user10",
    email: "e@b.com",
    password: "1234567890",
    isAdmin: false,
  },
];

export const seed_categories = [
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b0"),
    name: "category1",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b1"),
    name: "category2",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b2"),
    name: "category3",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b3"),
    name: "category4",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b4"),
    name: "category5",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b5"),
    name: "category6",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b6"),
    name: "category7",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b7"),
    name: "category8",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b8"),
    name: "category9",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7b9"),
    name: "category10",
  },
];

export const seed_manufactureres = [
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c0"),
    name: "manufacturer1",
    email: "a@a.com",
    address: "address1",
    mobile: "1234567890",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c1"),
    name: "manufacturer2",
    email: "b@a.com",
    address: "address2",
    mobile: "1234567891",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c2"),
    name: "manufacturer3",
    email: "c@a.com",
    address: "address3",
    mobile: "1234567892",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c3"),
    name: "manufacturer4",
    email: "d@a.com",
    address: "address4",
    mobile: "1234567893",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c4"),
    name: "manufacturer5",
    email: "e@a.com",
    address: "address5",
    mobile: "1234567894",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c5"),
    name: "manufacturer6",
    email: "f@a.com",
    address: "address6",
    mobile: "1234567895",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c6"),
    name: "manufacturer7",
    email: "g@a.com",
    address: "address7",
    mobile: "1234567896",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c7"),
    name: "manufacturer8",
    email: "h@a.com",
    address: "address8",
    mobile: "1234567897",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c8"),
    name: "manufacturer9",
    email: "i@a.com",
    address: "address9",
    mobile: "1234567898",
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7c9"),
    name: "manufacturer10",
    email: "j@a.com",
    address: "address10",
    mobile: "1234567899",
  },
];

export const seed_products = [
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d0"),
    name: "product1",
    manufacturer: {
      _id: seed_manufactureres[0]._id,
      name: seed_manufactureres[0].name,
      email: seed_manufactureres[0].email,
    },
    category: seed_categories[0],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d1"),
    name: "product2",
    manufacturer: {
      _id: seed_manufactureres[1]._id,
      name: seed_manufactureres[1].name,
      email: seed_manufactureres[1].email,
    },
    category: seed_categories[1],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d2"),
    name: "product3",
    manufacturer: {
      _id: seed_manufactureres[2]._id,
      name: seed_manufactureres[2].name,
      email: seed_manufactureres[2].email,
    },
    category: seed_categories[2],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d3"),
    name: "product4",
    manufacturer: {
      _id: seed_manufactureres[3]._id,
      name: seed_manufactureres[3].name,
      email: seed_manufactureres[3].email,
    },
    category: seed_categories[3],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d4"),
    name: "product5",
    manufacturer: {
      _id: seed_manufactureres[4]._id,
      name: seed_manufactureres[4].name,
      email: seed_manufactureres[4].email,
    },
    category: seed_categories[4],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d5"),
    name: "product6",
    manufacturer: {
      _id: seed_manufactureres[5]._id,
      name: seed_manufactureres[5].name,
      email: seed_manufactureres[5].email,
    },
    category: seed_categories[5],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d6"),
    name: "product7",
    manufacturer: {
      _id: seed_manufactureres[6]._id,
      name: seed_manufactureres[6].name,
      email: seed_manufactureres[6].email,
    },
    category: seed_categories[6],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d7"),
    name: "product8",
    manufacturer: {
      _id: seed_manufactureres[7]._id,
      name: seed_manufactureres[7].name,
      email: seed_manufactureres[7].email,
    },
    category: seed_categories[7],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d8"),
    name: "product9",
    manufacturer: {
      _id: seed_manufactureres[8]._id,
      name: seed_manufactureres[8].name,
      email: seed_manufactureres[8].email,
    },
    category: seed_categories[8],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7d9"),
    name: "product10",
    manufacturer: {
      _id: seed_manufactureres[9]._id,
      name: seed_manufactureres[9].name,
      email: seed_manufactureres[9].email,
    },
    category: seed_categories[9],
    numberInStock: 100,
    price: 15,
    description: new Array(100).join("a"),
    activeIngredients: ["aaaaa", "bbbbb"],
    rate: 3,
  },
];

export const seed_orders = [
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e0"),
    user: {
      _id: seed_users[0]._id,
      name: seed_users[0].name,
      email: seed_users[0].email,
    },
    items: [
      {
        product: {
          _id: seed_products[0]._id,
          name: seed_products[0].name,
          price: seed_products[0].price,
        },
        amount: 1,
      },
      {
        product: {
          _id: seed_products[0]._id,
          name: seed_products[1].name,
          price: seed_products[1].price,
        },
        amount: 2,
      },
    ],
    total: 45,
    status: orderStatus.Created,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e1"),
    user: {
      _id: seed_users[1]._id,
      name: seed_users[1].name,
      email: seed_users[1].email,
    },
    items: [
      {
        product: {
          _id: seed_products[2]._id,
          name: seed_products[2].name,
          price: seed_products[2].price,
        },
        amount: 1,
      },
      {
        product: {
          _id: seed_products[1]._id,
          name: seed_products[1].name,
          price: seed_products[1].price,
        },
        amount: 2,
      },
    ],
    total: 45,
    status: orderStatus.Created,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e2"),
    user: {
      _id: seed_users[5]._id,
      name: seed_users[5].name,
      email: seed_users[5].email,
    },
    items: [
      {
        product: {
          _id: seed_products[3]._id,
          name: seed_products[3].name,
          price: seed_products[3].price,
        },
        amount: 1,
      },
      {
        product: {
          _id: seed_products[4]._id,
          name: seed_products[4].name,
          price: seed_products[4].price,
        },
        amount: 3,
      },
    ],
    total: 60,
    status: orderStatus.Created,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e3"),
    user: {
      _id: seed_users[6]._id,
      name: seed_users[6].name,
      email: seed_users[6].email,
    },
    items: [
      {
        product: {
          _id: seed_products[4]._id,
          name: seed_products[4].name,
          price: seed_products[4].price,
        },
        amount: 1,
      },
      {
        product: {
          _id: seed_products[6]._id,
          name: seed_products[6].name,
          price: seed_products[6].price,
        },
        amount: 5,
      },
    ],
    total: 90,
    status: orderStatus.Created,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e4"),
    user: {
      _id: seed_users[8]._id,
      name: seed_users[8].name,
      email: seed_users[8].email,
    },
    items: [
      {
        product: {
          _id: seed_products[8]._id,
          name: seed_products[8].name,
          price: seed_products[8].price,
        },
        amount: 8,
      },
    ],
    total: 120,
    status: orderStatus.Created,
  },
  {
    _id: new mongoose.Types.ObjectId("6219f2a08484c473189df7e5"),
    user: {
      _id: seed_users[9]._id,
      name: seed_users[9].name,
      email: seed_users[9].email,
    },
    items: [
      {
        product: {
          _id: seed_products[0]._id,
          name: seed_products[0].name,
          price: seed_products[0].price,
        },
        amount: 1,
      },
      {
        product: {
          _id: seed_products[1]._id,
          name: seed_products[1].name,
          price: seed_products[1].price,
        },
        amount: 2,
      },
      {
        product: {
          _id: seed_products[2]._id,
          name: seed_products[2].name,
          price: seed_products[2].price,
        },
        amount: 3,
      },
    ],
    total: 90,
    status: orderStatus.Created,
  },
];
