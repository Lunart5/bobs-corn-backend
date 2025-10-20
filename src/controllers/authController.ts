import type { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcrypt";
import { userEncode } from "../utils/jwtHelper";
import { findUser } from "./userController";

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error laoding users",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["updatedAt"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const { password: _, ...rest } = user.dataValues;
    const clearUser = rest;

    if (isPasswordValid) {
      res.json({
        success: true,
        data: { token: userEncode(user), user: clearUser },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Wrong credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading users",
    });
  }
};
export const getMe = async (_: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;

    const user = await findUser(userId);

    console.log("🚀 ~ getMe ~ user:", user);


    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not exists",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading user",
    });
  }
};
