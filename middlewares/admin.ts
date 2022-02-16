import { Request, Response, NextFunction } from "express";

export function admin(req: any, res: Response, next: NextFunction) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied");
  next();
}
