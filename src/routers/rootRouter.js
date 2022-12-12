import express from "express";
import { home } from "../controllers/videoController";

const rootRouter = express.Router();

export const home = (req, res) => {
  return res.send("Please");
};

rootRouter.get("/", home);

export default rootRouter;
