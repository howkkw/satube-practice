import express from "express";
import {
  getEdit,
  logout,
  postEdit,
  startLoginGithub,
  finishLoginGithub,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startLoginGithub);
userRouter.get("/github/finish", finishLoginGithub);
userRouter.get("/logout", logout);

export default userRouter;
