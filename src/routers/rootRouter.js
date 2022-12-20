import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";
import { publicMiddleware } from "../middlewares.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
