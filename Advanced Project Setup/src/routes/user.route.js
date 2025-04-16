import { Router } from "express";
const UserRouter = Router();

import { upload } from "../middlewares/multer.middleware.js";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

UserRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
UserRouter.route("/login").post(loginUser);

// Secured Routes
UserRouter.route("/logout").post(verifyJWT, logoutUser);
UserRouter.route("/refresh-token").post(refreshAccessToken);

export default UserRouter;
