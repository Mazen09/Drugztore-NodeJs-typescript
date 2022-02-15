import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";

export function auth(req: any, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}
