import express from "express";
import { watch } from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);

export default videoRouter;
