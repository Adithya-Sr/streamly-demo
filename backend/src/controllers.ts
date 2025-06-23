import { Request, Response } from "express";
import { UserModel, VideoModel } from "./database_schemas";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config from "./config";
import { getVideosPaginationSchema } from "./input_validation_schemas";
import { z } from "zod";
export const healthCheckhandler = (req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
};

export const signupHandler = async (req: Request, res: Response) => {
  console.log(req.body);
  //parse request body
  const { name, email, password } = req.body;
  try {
    //store user data in db
    const data = await UserModel.create({ name, email, password });
    res
      .status(200)
      .json({ message: { userId: data.id, userEmail: data.email } });
  } catch (e: any) {
    if (e.code === 11000 && e.keyPattern?.email) {
      console.log(e);
      res.status(400).json({ error: "Email is already registered" });
      return;
    }
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  //parse request body
  const { email, password } = req.body;
  try {
    //verify email present
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(403).json({ error: "User not found" });
      return;
    }

    //verify password matches
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(403).json({ error: "Incorrect password" });
      return;
    }
    //create access token and refresh token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.HMACSecretKey,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.HMACSecretKey,
      {
        expiresIn: "7d",
      }
    );
    //set them in http-cookies
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + ONE_DAY),
      path: "/",
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + SEVEN_DAYS),
      path: "/",
    });
    res.status(200).json({ message: "ok" });
  } catch (e: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfileHandler = (req: Request, res: Response) => {
  //parse user from request
  const user = req.user;
  if (!user) {
    res.status(403).json({ error: "Invalid User" });
    return;
  }
  res.status(200).json({ message: user });
};

export const uploadVideoHandler = async (req: Request, res: Response) => {
  //parse user from request
  const user = req.user;
  if (!user) {
    res.status(403).json({ error: "Invalid User" });
    return;
  }
  //parse request body
  const { title, description, url, visibility } = req.body;
  try {
    //save video data
    const data = await VideoModel.create({
      title,
      description,
      url,
      visibility,
      userId: user.id,
    });
    res.status(200).json({ message: { videoId: data.id, videoUrl: data.url } });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getVideosHandler = async (req: Request, res: Response) => {
  //parse user from request
  const user = req.user;
  if (!user) {
    res.status(403).json({ error: "Invalid User" });
    return;
  }

  try {
    const { page, limit } = getVideosPaginationSchema.parse(req.query);
    const skip = (page - 1) * limit;
    const data = await VideoModel.find({
      userId: user.id,
      visibility: "public",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (data.length === 0) {
      res.status(200).json({ message: data });
      return;
    }
    const videoData = data.map((video) => {
      return {
        videoId: video.id,
        videoTitle: video.title,
        videoUrl: video.url,
        userId: video.userId,
        uploadedAt: video.createdAt,
      };
    });
    res.status(200).json({ message: videoData });
  } catch (e: any) {
    console.log(e);
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.errors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
