import type { Request, Response, NextFunction } from "express";
import { tokenDecode } from "../utils/jwtHelper";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../models";

const getToken = (req: Request) =>
  req.headers.authorization && req.headers.authorization.split(" ")[1];

const setLoggedUser = (user: User, res: Response) => (res.locals.user = user);

const checkToken =
  (callback: (token: User, req: Response) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getToken(req);
      if (!token) throw new Error("Token not provided");

      const decodedToken = tokenDecode(token) as User;
      callback(decodedToken, res);

      return next();
    } catch (error) {
      const isExpired = error instanceof TokenExpiredError;
      res.status(401).json({
        success: false,
        error: isExpired ? "Token Expired" : "Token not Valid or not provided",
      });
    }
  };

export const logged = () => checkToken(setLoggedUser);
