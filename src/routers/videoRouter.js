import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  videoDelete,
  watch,
} from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", videoDelete);

export default videoRouter;
