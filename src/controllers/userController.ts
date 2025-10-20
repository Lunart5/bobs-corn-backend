import type { Request, Response } from "express";
import { User } from "../models";

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt", "role", "address"],
      order: [
        ["role", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading users",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = findUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    const user = await User.create({ name, email, password, address });
    const { password: _pass, ...rest } = user.dataValues;

    res.status(201).json({
      success: true,
      data: rest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error creating user: ${error}`,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, address } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    await user.update({ name, email, role, address });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error removing user",
    });
  }
};

export const findUser = async (id: string) => {
  const user = await User.findByPk(id, {
    attributes: ["id", "name", "email", "address", "createdAt", "role"],
  });
  return user;
};
