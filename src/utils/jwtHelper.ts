import jwt from "jsonwebtoken";
import { User } from "../models";

const expiresIn = "2h";
const auth = { secret: process.env.JWT_SECRET || "private_key" };

export const tokenDecode = (token: string) => jwt.verify(token, auth.secret);

const dataEncode = (data: Object) => jwt.sign(data, auth.secret, { expiresIn });

export const userEncode = (userData: User) => {
  const { email, createdAt, id, updatedAt, role } = userData;

  const tokenData = {
    id,
    email,
    role,
    createdAt,
    updatedAt,
  };
  return dataEncode(tokenData);
};
