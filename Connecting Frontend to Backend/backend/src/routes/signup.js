import { Router } from "express";
const SignupRouter = Router();

import signup from "../controllers/Signup.controller.js";

SignupRouter.get("/api/signup", signup);

export default SignupRouter;
