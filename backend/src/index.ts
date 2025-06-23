import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import routes from "./routes";
import { connectDB } from "./helpers";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimiter } from "./middlewares";
const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(rateLimiter);

app.listen(config.port, async () => {
  try {
    console.log(`server listening at localhost:${config.port}`);
    await connectDB();
    console.log("database connected");
    routes(app);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
