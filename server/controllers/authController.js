import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import {sendToken} from "../utils/sendToken.js"

// API for registering new user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });

  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const registerationAttemptsByUser = await User.find({
    email,
    accountVerified: false,
  });

  if (registerationAttemptsByUser.length >= 5) {
    return next(
      new ErrorHandler(
        "You have exceeded the number of registration attempts, please contact support.",
        400,
      ),
    );
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationCode = await user.generateVerificationCode();
  await user.save();

  //  Construct a proper HTML message string for your utility function
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to the Library Management System!</h2>
      <p>Thank you for signing up. Your 5-digit verification code is:</p>
      <h1 style="color: #4A90E2; letter-spacing: 5px;">${verificationCode}</h1>
      <p style="color: #666; font-size: 12px;">This code will expire in 5 minutes.</p>
    </div>
  `;

  //  Pass the object configuration structure that utils/sendEmail.js expects
  await sendEmail({
    email: user.email,
    subject: "Library Management System - Account Verification",
    message: htmlMessage,
  });

  //  Send the final success response back to Postman here!
  return res.status(200).json({
    success: true,
    message: `Verification code successfully sent to ${user.email}`,
  });
});

// API for OTP verification
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP is missing", 400));
  }

  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("User not found", 404));
    }

    let user;

    if (userAllEntries.length > 0) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const currentTime = Date.now();

    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > verificationCodeExpire){
      return next(new ErrorHandler("OTP expired", 400))
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire= null;
    await user.save({validateModifiedOnly: true});

    sendToken(user, 200, "AccountVerified", res);

  } catch (error) {
    return next(new ErrorHandler("Internal Server Error.", 500));
  }
});
