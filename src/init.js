import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/rootRouter.js";
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";

const PORT = 5000;

const app = express();
const logger = morgan("dev");

app.use(logger);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListenStart = () =>
  console.log(`server start on http://localhost:${PORT}`);

app.listen(PORT, handleListenStart);
