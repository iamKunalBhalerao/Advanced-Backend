import jwt from "jsonwebtoken";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(501, "Something went wrong !!!");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong !!!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
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

const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  // check user is in database or not from email
  // then check password is same or not
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(403, "Email or username is required !!!");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User Not Found !!!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user Credentials !!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Your are Logged In"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out !"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorize request !!!");
    }

    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(403, "Invalid refreshToken !!!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(402, "Refresh Token is expired or Used !!!");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newRefreshToken, accessToken } =
      await generateAccessAndRefreshToken(user._id);

    res
      .status(200)
      .cookie("refreshToken", accessToken, options)
      .cookie("accessToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newRefreshToken,
          },
          "Token is Refreshed !"
        )
      );
  } catch (error) {
    throw new ApiError(406, error?.message || "Invalid Refresh Token !!!");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req.user?._id;

  const user = await User.findOne(userId);

  const checkPassword = await user.isPasswordCorrect(oldPassword);

  if (!checkPassword) {
    throw new ApiError(403, "Invalid Old Password !!!");
  }

  // if (newPassword !== confirmPassword) {
  //   throw new ApiError(406, "Your confirm password is Invalid");
  // }

  user.password = newPassword;
  await user.save({
    validateBeforeSave: false,
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Updated Successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Sucessfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(405, "All fields are Required !!!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account Details Updated Successfully!!!")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avtar file is Missing !!!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading an Avatar !!!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated Successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(404, "Cover Image file is Missing !!!");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(403, "Error While Uploading Cover Image !!!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, user.coverImage, "Cover Image Updated Successfully.")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
