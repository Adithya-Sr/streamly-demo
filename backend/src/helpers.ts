import mongoose from "mongoose";
import config from "./config";
import { Request, Response } from "express";
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbConnectionString);
  } catch (e) {
    throw e;
  }
};

//deletes auth tokens and resets user session
export const clearState = (req: Request, res: Response) => {
  let accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];
  if (accessToken) {
    res.clearCookie("access-token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  }
  if (refreshToken) {
    res.clearCookie("refresh-token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  }
  if (req.user) {
    req.user = undefined;
  }
};
