import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes";
import { startServer } from "./config";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (_: Request, res: Response) => {
  res.json({
    message: "Node.js w/ Express, Sequelize and PostgreSQL",
    version: "1.0.0",
  });
});

app.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Rute not found",
  });
});

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Server error",
  });
});

startServer(app);

export default app;
