import express from "express";
import { validate } from "../middlewares/validate";
import { manufacturer, validateManufacturer } from "../models/manufacturer";
import _ from 'lodash';

export const router = express.Router();
