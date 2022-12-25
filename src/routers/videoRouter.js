import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  videoDelete,
  watch,
} from "../controllers/videoController.js";
import { protectorMiddleware, videoUpload } from "../middlewares.js";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, videoDelete);

export default videoRouter;
