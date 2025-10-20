import { Router } from "express";
import {
  getAllSales,
  getSaleById,
  createSale,
  getSalesByUser,
} from "../controllers/saleController";
import { salesRateLimiter } from "../middleware/rateLimit";
import { checkUserAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/", (...rest) => checkUserAdmin(...rest, true), getAllSales);
router.get("/me", (...rest) => checkUserAdmin(...rest, false), getSalesByUser);
router.get("/:id", (...rest) => checkUserAdmin(...rest, true), getSaleById);
router.get(
  "/user/:userId",
  (...rest) => checkUserAdmin(...rest, true),
  getSalesByUser,
);

router.post("/", salesRateLimiter, createSale);

export default router;
