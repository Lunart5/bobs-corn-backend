import type { Request, Response } from "express";
import { Sale, User } from "../models";

const sales_limit = process.env.SALES_LIMIT || 1;

export const getAllSales = async (_: Request, res: Response) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
      ],
      attributes: { exclude: ["updatedAt", "userId"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading sales",
    });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading purchases",
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;

  try {
    const { amount = 1 } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: "User or amount not valid",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (amount <= 0 || amount > sales_limit) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount to buy",
      });
    }

    const sale = await Sale.create({
      userId,
      amount,
    });

    const saleWithUser = await Sale.findByPk(sale.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: saleWithUser,
      message: "Purchase made successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating sale",
    });
  }
};

export const getSalesByUser = async (req: Request, res: Response) => {
  try {
    const loggedUserId = res.locals.user.id;
    const { userId = loggedUserId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const sales = await Sale.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading user purchases",
    });
  }
};
