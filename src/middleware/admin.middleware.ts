import type { Request, Response, NextFunction } from "express";
import { tokenDecode } from "../utils/jwtHelper";

import { findUser } from "../controllers/userController";
import { User } from "../models";

const getToken = (req: Request) =>
  req.headers.authorization && req.headers.authorization.split(" ")[1];

export const checkUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  hasToBeAdmin: boolean = false,
) => {
  try {
    const token = getToken(req);
    if (!token) throw new Error("Token not provided");
    const decodedToken = tokenDecode(token) as User;
    const user = await findUser(decodedToken.id.toString());

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User does not exists",
      });
    }

    if (hasToBeAdmin && user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to access this resource",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "User does not exists",
    });
  }
};
