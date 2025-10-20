import { connectRedis } from "../redis/client";
import { PORT } from "../utils";
import sequelize from "./database";
import { type Application } from "express";

export const startServer = async (app: Application) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    const redisConnected = await connectRedis();
    if (redisConnected) {
      console.log("✅ Connected to Redis");
    } else {
      console.warn("⚠️ Redis not available - using local memory");
    }

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log("✅ Models updated successfully");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error running server:", error);
    process.exit(1);
  }
};
