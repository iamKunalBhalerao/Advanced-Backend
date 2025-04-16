import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "UnAuthorized Request !!!");
    }

    const decodedInfo = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedInfo?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Acces Token !!!");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(403, error.message || "Invalid Access Token !!!");
  }
});
