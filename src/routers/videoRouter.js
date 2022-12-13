import express from "express";
import { edit } from "../controllers/userController.js";
import {
  getUpload,
  postUpload,
  videoDelete,
  watch,
} from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/delete", videoDelete);

export default videoRouter;
