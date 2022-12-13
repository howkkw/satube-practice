import express from "express";
import { edit, logout } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);

export default userRouter;
