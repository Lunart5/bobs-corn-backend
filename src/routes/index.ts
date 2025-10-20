import { Router } from "express";
import userRoutes from "./user.routes";
import purchasesRoutes from "./purchase.routes";
import authRoutes from "./auth.routes";
import { logged } from "../middleware/auth";
import { checkUserAdmin } from "../middleware/admin.middleware";

const router = Router();

router.use(
  "/users",
  logged(),
  (...rest) => checkUserAdmin(...rest, true),
  userRoutes,
);
router.use("/purchases", logged(), purchasesRoutes);

router.use("/auth", authRoutes);

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "ACTIVE",
    timestamp: new Date().toISOString(),
  });
});

export default router;
