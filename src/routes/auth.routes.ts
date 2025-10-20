import { Router } from "express";
import { getMe, loginUser } from "../controllers/authController";
import { logged } from "../middleware/auth";
import { createUser } from "../controllers/userController";

const router = Router();

router.post("/me", logged(), getMe);
router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
