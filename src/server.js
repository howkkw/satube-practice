import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/rootRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();
app.set("view engine", "pug");
app.set("views", "src/views");
const logger = morgan("dev");

app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
