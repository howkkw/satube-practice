import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  startLoginGithub,
  finishLoginGithub,
  getChangePassword,
  postChangePassword,
  myProfile,
} from "../controllers/userController.js";

import {
  protectorMiddleware,
  publicMiddleware,
  avatarUpload,
} from "../middlewares.js";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter.get("/github/start", publicMiddleware, startLoginGithub);
userRouter.get("/github/finish", publicMiddleware, finishLoginGithub);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id", myProfile);

export default userRouter;
