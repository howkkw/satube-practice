import "dotenv/config";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";

import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";
import apiRouter from "./routers/apiRouter.js";
import { localsMiddleware } from "./middlewares.js";

const app = express();

const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", "src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SERCET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
