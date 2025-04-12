import { Router } from "express";
const JokesRouter = Router();

import jokesController from "../controllers/jokes.controller.js";

JokesRouter.get("/jokes", jokesController);

export default JokesRouter;
