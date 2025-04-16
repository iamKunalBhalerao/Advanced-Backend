import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // Validation - non empty
  // check if user alredy exists : username, email
  // check for image, check for avatar
  // upload them to cloudinary
  // create user object - create entry in Database
  // remove password and refreshtoken field from response
  // return response

  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(403, "All Fields are Required !!!");
  }

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (findUser) {
    throw new ApiError(403, "User Alredy Exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImgLocalPath = req.files?.coverImage[0]?.path;
  // OR if user can't send a cover image then entry should be empty string
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(406, "Avatar is Required !!!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(406, "Avatar is Required !!!");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user !!!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "Congrsts, Your are Registerd"));
});
