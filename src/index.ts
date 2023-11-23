import express from "express";
import router from "@routes/index";
import helmet from "helmet";
import {
  RateLimitingMiddleware,
  ErrorMiddleware,
  NotFoundMiddleware,
} from "@middleware/index.middleware";
import {
  logger,
  connectToDatabase,
  connectToRedis,
} from "@config/index.config";
import morgan from "morgan";
import { stream } from "@config/logger.config";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

connectToDatabase();

connectToRedis();

const app = express();

app.use(morgan("dev", { stream }));

app.use(compression());

app.use(cors({ origin: "*", credentials: true }));

app.use(helmet());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(RateLimitingMiddleware);

app.use("/api", router);

app.use(NotFoundMiddleware);

app.use(ErrorMiddleware);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`App started at http://localhost:${port}`);
});
