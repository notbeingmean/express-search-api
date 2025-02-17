import express from "express";
import { log } from "./configs/logger";
import cors from "cors";
import { env } from "bun";
import morgan from "morgan";
import router from "./routes";

const app = express();

app.use(log);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.use("/api", router);

export default app;
